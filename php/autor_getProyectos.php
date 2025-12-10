<?php
require_once 'db.php';
session_start();

//obtengo los proyectos del autor
$stmtProyectos = $conn->prepare("SELECT p.id, p.nombre FROM proyecto p JOIN autor_proyecto ap ON p.id = ap.idProyecto WHERE ap.idAutor = ?");
$stmtProyectos->bind_param("i", $_SESSION['user_id']);
$stmtProyectos->execute();
$result = $stmtProyectos->get_result();
$proyectos = [];

while ($row = $result->fetch_assoc()) {
    //consigo los datos especificos de las entregas de cada proyecto
    $stmtProyectosEntrega = $conn->prepare("SELECT e.id, e.numeroEntrega, e.pdfPath, e.entregado, e.aceptado, e.fechaLimite FROM entrega e WHERE e.idProyecto = ? ORDER BY e.numeroEntrega ASC");
    $stmtProyectosEntrega->bind_param("i", $row['id']);
    $stmtProyectosEntrega->execute();
    $entregaResult = $stmtProyectosEntrega->get_result();
    $entregas = [];
    $tieneSegundaEntrega = false;

    // Primero, verificar si hay segunda entrega
    $stmtSegundaEntrega = $conn->prepare("SELECT COUNT(*) as count FROM entrega WHERE idProyecto = ? AND numeroEntrega = 2");
    $stmtSegundaEntrega->bind_param("i", $row['id']);
    $stmtSegundaEntrega->execute();
    $resultSegundaEntrega = $stmtSegundaEntrega->get_result();
    $rowSegundaEntrega = $resultSegundaEntrega->fetch_assoc();
    $tieneSegundaEntrega = ($rowSegundaEntrega && $rowSegundaEntrega['count'] > 0);

    while ($entregaRow = $entregaResult->fetch_assoc()) {
        //var_dump($entregaRow);
        if (!empty($entregaRow['fechaLimite']) && $entregaRow['fechaLimite'] < date('Y-m-d')) {
            continue;
        }

        // Si hay segunda entrega y esta es la primera entrega (numeroEntrega = 1) y aceptado es null,
        // marcar como rechazada (0) para que se muestre correctamente
        $aceptado = $entregaRow['aceptado'];
        if ($tieneSegundaEntrega && $entregaRow['numeroEntrega'] == 1 && $aceptado === null) {
            $aceptado = 0; // Marcar como rechazada porque pasó a segunda entrega
        }

        $entregas[] = [
            'id' => $entregaRow['id'],
            'idProyecto' => $row['id'],
            'pdfPath' => $entregaRow['pdfPath'],
            'entregado' => $entregaRow['entregado'],
            'aceptado' => $aceptado,
            'fechaEntrega' => $entregaRow['fechaLimite']
        ];
    }

    $proyectos[] = [
        'id' => $row['id'],
        'nombre' => $row['nombre'],
        'entregas' => $entregas
    ];
}

echo json_encode(['success' => true, 'proyectos' => $proyectos]);
?>