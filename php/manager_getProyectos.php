<?php
require_once 'db.php';
session_start();

//voy a mandar exactamente el mismo JSON que mandé en autor_getProyectos.php
//obtengo los proyectos
$stmtProyectos = $conn->prepare("SELECT p.id, p.nombre FROM proyecto p");
$stmtProyectos->bind_param("i", $_SESSION['user_id']);
$stmtProyectos->execute();
$result = $stmtProyectos->get_result();
$proyectos = [];

while ($row = $result->fetch_assoc()) {
    //consigo los datos especificos de las entregas de cada proyecto
    $stmtProyectosEntrega = $conn->prepare("SELECT e.id, e.numeroEntrega, e.pdfPath, e.entregado, e.aceptado FROM entrega e WHERE e.idProyecto = ?");
    $stmtProyectosEntrega->bind_param("i", $row['id']);
    $stmtProyectosEntrega->execute();
    $entregaResult = $stmtProyectosEntrega->get_result();
    $entregas = [];

    while ($entregaRow = $entregaResult->fetch_assoc()) {
        $entregas[] = [
            'pdfPath' => $entregaRow['pdfPath'],
            'entregado' => $entregaRow['entregado'],
            'aceptado' => $entregaRow['aceptado']
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