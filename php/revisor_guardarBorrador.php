<?php
require_once 'db.php';
session_start();

//obtengo el JSON con las respuestas de la rubrica
$data = json_decode(file_get_contents("php://input"), true);
$respuestas = json_encode($data['formObj']);

//consigo la id del proyecto
$idProyecto = $_SESSION['idProyecto'];

//actualizo las respuestas en la base de datos
$stmtRevisorProyecto = $conn->prepare("UPDATE revisor_veredicto SET datos = ? WHERE idRevisor = ? AND idProyecto = ? AND idEntrega = (SELECT MAX(numeroEntrega) FROM entrega WHERE idProyecto = ?)");
$stmtRevisorProyecto->bind_param("siii", $respuestas, $_SESSION['user_id'], $idProyecto, $idProyecto);
var_dump($stmtRevisorProyecto); 
var_dump($_SESSION['user_id'], $idProyecto);
var_dump($respuestas);
$stmtRevisorProyecto->execute();

echo json_encode(['success' => true]);
?>