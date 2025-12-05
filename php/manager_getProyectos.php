<?php
// Configuración para devolver JSON limpio
error_reporting(E_ALL);
ini_set('display_errors', 0);
header('Content-Type: application/json; charset=utf-8');

register_shutdown_function(function() {
    $error = error_get_last();
    if ($error !== NULL && $error['type'] === E_ERROR) {
        if (ob_get_length()) ob_clean();
        echo json_encode(['success' => false, 'error' => 'Error Fatal: ' . $error['message']]);
        exit;
    }
});

try {
    if (!file_exists('db.php')) throw new Exception("Falta db.php");
    require_once 'db.php';
    session_start();

    if ($conn->connect_error) throw new Exception("Error BD: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");

    // 1. DICCIONARIO DE ÁREAS (Copiado del JS a PHP)
    // Esto permite traducir el número al nombre antes de enviarlo
    $diccionarioAreas = [
        1 => "Ingeniería Química y Bioquímica",
        2 => "Ingeniería Industrial",
        3 => "Sistemas Computacionales y TI",
        4 => "Ingeniería en Gestión Empresarial",
        5 => "Ingeniería Eléctrica y Electrónica",
        6 => "Ingeniería Mecánica y Mecatrónica",
        7 => "Ingeniería en Energías Renovables",
        8 => "Ingeniería en Semiconductores",
        9 => "Administración",
        10 => "Investigación Educativa"
    ];

    // 2. Consulta simplificada
    $sql = "SELECT p.id, p.nombre, p.areaDeConocimiento,
                   GROUP_CONCAT(a.correo SEPARATOR ', ') AS correos
            FROM proyecto p
            JOIN autor_proyecto ap ON p.id = ap.idProyecto
            JOIN autor a ON ap.idAutor = a.id
            GROUP BY p.id, p.nombre, p.areaDeConocimiento"; 

    $stmt = $conn->prepare($sql);
    if (!$stmt) throw new Exception("Error SQL: " . $conn->error);
    if (!$stmt->execute()) throw new Exception("Error Ejecución: " . $stmt->error);
    
    $result = $stmt->get_result();
    $proyectos = [];

    while ($row = $result->fetch_assoc()) {
        
        // --- Subconsultas (Revisores y Entregas) ---
        $numRevisores = 0;
        $sqlCount = "SELECT COUNT(*) as total FROM revisor_proyecto WHERE idProyecto = ?";
        if ($stmtCount = $conn->prepare($sqlCount)) {
            $stmtCount->bind_param("i", $row['id']);
            $stmtCount->execute();
            if ($d = $stmtCount->get_result()->fetch_assoc()) $numRevisores = $d['total'];
            $stmtCount->close();
        }

        $entregas = [];
        $ultimoEstado = "Pendiente";
        $sqlEnt = "SELECT id, numeroEntrega, pdfPath, entregado, aceptado, fechaLimite FROM entrega WHERE idProyecto = ? ORDER BY numeroEntrega ASC";
        if ($stmtEnt = $conn->prepare($sqlEnt)) {
            $stmtEnt->bind_param("i", $row['id']);
            $stmtEnt->execute();
            $resEnt = $stmtEnt->get_result();
            while ($ent = $resEnt->fetch_assoc()) {
                $entregas[] = [
                    'id' => $ent['id'],
                    'pdfPath' => $ent['pdfPath'],
                    'entregado' => $ent['entregado'],
                    'fechaEntrega' => $ent['fechaLimite']
                ];
                if ($ent['entregado'] == 1) {
                    if ($ent['aceptado'] === 1) $ultimoEstado = "Aceptado";
                    else if ($ent['aceptado'] === 0) $ultimoEstado = "Con Observaciones";
                    else $ultimoEstado = "En Revisión";
                }
            }
            $stmtEnt->close();
        }

        // --- TRADUCCIÓN DEL ÁREA ---
        // Obtenemos el ID del área (ej. 1, 3, 5)
        $idArea = intval($row['areaDeConocimiento']);
        
        // Buscamos en el diccionario. Si existe, usamos el nombre.
        // Si no existe (es 0 o null), ponemos "Sin Especificar".
        if (isset($diccionarioAreas[$idArea])) {
            $nombreArea = $diccionarioAreas[$idArea];
        } else {
            $nombreArea = "Sin Especificar";
        }

        $proyectos[] = [
            'id' => $row['id'],
            'title' => $row['nombre'],
            'author' => $row['correos'], 
            'area' => $nombreArea,  // <--- ¡Aquí va el nombre real!
            'stage' => $ultimoEstado,
            'entregas' => $entregas,
            'conteo_revisores' => $numRevisores
        ];
    }

    echo json_encode(['success' => true, 'proyectos' => $proyectos]);

} catch (Throwable $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>