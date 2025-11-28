<?php
require_once 'db.php';
session_start();

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'];

$_SESSION['idProyecto'] = $id;

echo json_encode(['success' => true]);
?>