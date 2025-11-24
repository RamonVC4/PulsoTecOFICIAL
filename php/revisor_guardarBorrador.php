<?php
require_once 'db.php';
session_start();

//obtengo el JSON con las respuestas de la rubrica
$data = json_decode(file_get_contents("php://input"), true);
$respuestas = json_encode($data['formObj']);

//consigo la id del proyecto
$idProyecto = $_SESSION['idProyecto'];

//actualizo las respuestas en la base de datos
$stmtRevisorProyecto = $conn->prepare("UPDATE revisor_proyecto SET datos = ? WHERE idRevisor = ? AND idProyecto = ?");
$stmtRevisorProyecto->bind_param("sii", $respuestas, $_SESSION['user_id'], $idProyecto);
$stmtRevisorProyecto->execute();

echo json_encode(['success' => true]);
?>