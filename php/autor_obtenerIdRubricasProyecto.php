<?php
require_once 'db.php';
session_start();
header('Content-Type: application/json');

// Obtener el id del proyecto desde POST
$data = json_decode(file_get_contents("php://input"), true);
$idProyecto = isset($data['idProyecto']) ? intval($data['idProyecto']) : 0;

if ($idProyecto === 0) {
    echo json_encode(['success' => false, 'message' => 'ID de proyecto inválido']);
    exit;
}

// Obtener los idEntrega asociados al proyecto desde revisor_veredicto
$stmtRubricas = $conn->prepare("SELECT DISTINCT idEntrega FROM revisor_veredicto WHERE idProyecto = ?");
$stmtRubricas->bind_param("i", $idProyecto);
$stmtRubricas->execute();
$result = $stmtRubricas->get_result();
$rubricas = [];

while ($row = $result->fetch_assoc()) {
    $rubricas[] = $row['idEntrega'];
}

echo json_encode(['success' => true, 'rubricas' => $rubricas]);