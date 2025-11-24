<?php
// manager_asignarRevisor.php
require_once 'db.php'; // O 'db.php', verifica tu nombre
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

// Validamos datos obligatorios
if (!isset($data['idProyecto']) || !isset($data['idRevisor'])) {
    echo json_encode(['success' => false, 'message' => 'Faltan datos']);
    exit;
}

$idProyecto = $data['idProyecto'];
$idRevisor = $data['idRevisor'];
// Si no mandan fecha, ponemos la de hoy + 7 días o NULL (según prefieras)
$fechaLimite = isset($data['fechaLimite']) ? $data['fechaLimite'] : date('Y-m-d', strtotime('+7 days'));

// 1. Verificar si ya existe esa asignación
$check = $conn->prepare("SELECT * FROM revisor_proyecto WHERE idRevisor = ? AND idProyecto = ?");
$check->bind_param("ii", $idRevisor, $idProyecto);
$check->execute();
if ($check->get_result()->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Este revisor ya está asignado.']);
    exit;
}

// 2. Insertar asignación
// OJO: 'datos' es NOT NULL en tu BD, así que insertamos un JSON vacío '{}'
$stmt = $conn->prepare("INSERT INTO revisor_proyecto (idRevisor, idProyecto, fechaLimite, datos, terminado) VALUES (?, ?, ?, '{}', 0)");
$stmt->bind_param("iis", $idRevisor, $idProyecto, $fechaLimite);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Revisor asignado correctamente.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $conn->error]);
}
?>