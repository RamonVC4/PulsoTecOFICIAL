<?php
require_once 'db.php';
session_start();

//obtengo los proyectos asignados al revisor
$stmtProyectos = $conn->prepare("SELECT p.id, p.nombre, rp.fechaLimite, p.aceptado FROM proyecto p JOIN revisor_proyecto rp ON p.id = rp.idProyecto WHERE rp.idRevisor = ?");
$stmtProyectos->bind_param("i", $_SESSION['user_id']);
$stmtProyectos->execute();
$result = $stmtProyectos->get_result();
$proyectos = [];

while ($row = $result->fetch_assoc()) {
    //checo si currProy no fue aceptado ya
    if ($row['aceptado'] == 1 || $row['aceptado'] == 0) {
        continue;
    }

    //si ya lo revisé, no lo muestro 
    $stmtRevisorVeredicto = $conn->prepare("SELECT status FROM revisor_veredicto WHERE idRevisor = ? AND idProyecto = ?");
    $stmtRevisorVeredicto->bind_param("ii", $_SESSION['user_id'], $row['id']);
    $stmtRevisorVeredicto->execute();
    $veredictoResult = $stmtRevisorVeredicto->get_result();
    $veredictoRow = $veredictoResult->fetch_assoc();

    if ($veredictoRow['status'] == 1 || $veredictoRow['status'] == 0) {
        continue;
    }

    //consigo los datos especificos de las entregas de cada proyecto
    $stmtProyectosEntrega = $conn->prepare("SELECT e.id, e.numeroEntrega, e.pdfPath, e.entregado, e.aceptado, e.fechaLimite FROM entrega e WHERE e.idProyecto = ?");
    $stmtProyectosEntrega->bind_param("i", $row['id']);
    $stmtProyectosEntrega->execute();
    $entregaResult = $stmtProyectosEntrega->get_result();
    $entregas = [];

    while ($entregaRow = $entregaResult->fetch_assoc()) {
        $entregas[] = [
            'pdfPath' => $entregaRow['pdfPath'],
            'entregado' => $entregaRow['entregado'],
            'aceptado' => $entregaRow['aceptado'],
            'fechaEntrega' => $entregaRow['fechaLimite']
        ];
    }

    $proyectos[] = [
        'id' => $row['id'],
        'nombre' => $row['nombre'],
        'entregas' => $entregas,
        'fechaLimite' => $row['fechaLimite']
    ];
}

//estoy regresando casi el mismo json que en autor
echo json_encode(['success' => true, 'proyectos' => $proyectos]);
?>