<?php
require_once 'db.php';
session_start();
header('Content-Type: application/json');

// Obtener el id del proyecto desde POST
$data = json_decode(file_get_contents("php://input"), true);
$idEntrega = isset($data['idEntrega']) ? intval($data['idEntrega']) : 0;

if ($idEntrega === 0) {
    echo json_encode(['success' => false, 'message' => 'ID de proyecto inválido']);
    exit;
}

// Obtener los idEntrega asociados al proyecto desde revisor_veredicto
$stmtRubricas = $conn->prepare("SELECT id FROM revisor_veredicto WHERE idEntrega = ?");
$stmtRubricas->bind_param("i", $idEntrega);
$stmtRubricas->execute();
$result = $stmtRubricas->get_result();
$rubricas = [];

while ($row = $result->fetch_assoc()) {
    $rubricas[] = $row['id'];
}

echo json_encode(['success' => true, 'rubricas' => $rubricas]);