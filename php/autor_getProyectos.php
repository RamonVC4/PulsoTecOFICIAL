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
    $stmtProyectosEntrega = $conn->prepare("SELECT e.id, e.numeroEntrega, e.pdfPath, e.entregado, e.aceptado, e.fechaLimite FROM entrega e WHERE e.idProyecto = ?");
    $stmtProyectosEntrega->bind_param("i", $row['id']);
    $stmtProyectosEntrega->execute();
    $entregaResult = $stmtProyectosEntrega->get_result();
    $entregas = [];

    while ($entregaRow = $entregaResult->fetch_assoc()) {
        //var_dump($entregaRow);
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
        'entregas' => $entregas
    ];
}

echo json_encode(['success' => true, 'proyectos' => $proyectos]);
?>