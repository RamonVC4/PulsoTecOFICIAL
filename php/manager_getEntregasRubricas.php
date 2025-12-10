<?php
require_once 'db.php';
session_start();
header('Content-Type: application/json');

// Obtener idProyecto del parámetro
$idProyecto = isset($_GET['idProyecto']) ? intval($_GET['idProyecto']) : 0;

if ($idProyecto === 0) {
    echo json_encode(['success' => false, 'message' => 'ID de proyecto inválido']);
    exit;
}

// Obtener todas las entregas del proyecto
$stmtEntregas = $conn->prepare("SELECT id, numeroEntrega, pdfPath, entregado, aceptado FROM entrega WHERE idProyecto = ? ORDER BY numeroEntrega ASC");
$stmtEntregas->bind_param("i", $idProyecto);
$stmtEntregas->execute();
$resultEntregas = $stmtEntregas->get_result();

$entregas = [];
while ($row = $resultEntregas->fetch_assoc()) {
    $idEntrega = $row['id'];
    
    // Obtener todas las rúbricas de esta entrega
    $stmtRubricas = $conn->prepare("SELECT rv.idRevisor, rv.datos, rv.terminado, r.nombre, r.primerApellido, r.segundoApellido, r.correo 
                                    FROM revisor_veredicto rv 
                                    JOIN revisor r ON rv.idRevisor = r.id 
                                    WHERE rv.idProyecto = ? AND rv.idEntrega = ?");
    $stmtRubricas->bind_param("ii", $idProyecto, $idEntrega);
    $stmtRubricas->execute();
    $resultRubricas = $stmtRubricas->get_result();
    
    $rubricas = [];
    while ($rubricaRow = $resultRubricas->fetch_assoc()) {
        $nombreCompleto = trim($rubricaRow['nombre'] . ' ' . $rubricaRow['primerApellido'] . ' ' . ($rubricaRow['segundoApellido'] ?? ''));
        $rubricas[] = [
            'idRevisor' => $rubricaRow['idRevisor'],
            'nombre' => $nombreCompleto ?: $rubricaRow['correo'],
            'correo' => $rubricaRow['correo'],
            'datosRubrica' => $rubricaRow['datos'],
            'terminado' => $rubricaRow['terminado']
        ];
    }
    
    $entregas[] = [
        'id' => $row['id'],
        'numeroEntrega' => $row['numeroEntrega'],
        'pdfPath' => $row['pdfPath'],
        'entregado' => $row['entregado'],
        'aceptado' => $row['aceptado'],
        'rubricas' => $rubricas
    ];
}

echo json_encode(['success' => true, 'entregas' => $entregas]);
?>

