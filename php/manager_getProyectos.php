<?php
require_once 'db.php';
session_start();
header('Content-Type: application/json');

// CAMBIO AQUÍ: Agregamos JOINs para traer el correo del autor
$sql = "SELECT p.id, p.nombre, a.correo 
        FROM proyecto p 
        JOIN autor_proyecto ap ON p.id = ap.idProyecto 
        JOIN autor a ON ap.idAutor = a.id";

$stmtProyectos = $conn->prepare($sql);
$stmtProyectos->execute();
$result = $stmtProyectos->get_result();
$proyectos = [];

while ($row = $result->fetch_assoc()) {
    // Busca las entregas (esto se queda igual)
    $stmtEnt = $conn->prepare("SELECT e.id, e.numeroEntrega, e.pdfPath, e.entregado, e.aceptado, e.fechaLimite FROM entrega e WHERE e.idProyecto = ? ORDER BY numeroEntrega ASC");
    $stmtEnt->bind_param("i", $row['id']);
    $stmtEnt->execute();
    $resEnt = $stmtEnt->get_result();
    
    $entregas = [];
    $ultimoEstado = "Pendiente";

    while ($ent = $resEnt->fetch_assoc()) {
        $entregas[] = [
            'id' => $ent['id'],
            'pdfPath' => $ent['pdfPath'],
            'entregado' => $ent['entregado'],
            'aceptado' => $ent['aceptado'],
            'fechaEntrega' => $ent['fechaLimite']
        ];
        // Tu lógica de estado...
        if ($ent['entregado'] == 1) {
            if ($ent['aceptado'] === 1) $ultimoEstado = "Aceptado";
            else if ($ent['aceptado'] === 0) $ultimoEstado = "Con Observaciones";
            else $ultimoEstado = "En Revisión";
        }
    }

    $proyectos[] = [
        'id' => $row['id'],
        'title' => $row['nombre'],
        'author' => $row['correo'], // <--- AQUÍ YA USAMOS EL DATO REAL
        'area' => 'Sistemas',
        'stage' => $ultimoEstado,
        'entregas' => $entregas
    ];
}

echo json_encode(['success' => true, 'proyectos' => $proyectos]);
?>