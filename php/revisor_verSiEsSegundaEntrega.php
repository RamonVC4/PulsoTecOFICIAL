<?php
require_once 'db.php';
session_start();

//consigo la cantidad de entregas en el proyecto
//consigo la id del proyecto
$idProyecto = $_SESSION['idProyecto'];
$resultado = q("SELECT COUNT(*) as entregas FROM entrega WHERE idProyecto = ?;", "i", [$idProyecto]);

echo json_encode(['success' => true, 'esSegundaEntrega' => ($resultado->fetch_assoc()['entregas'] === 2)]);
?>