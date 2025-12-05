<?php
// manager_eliminarRevisor.php
require_once 'db.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['idProyecto']) || !isset($data['idRevisor'])) {
    echo json_encode(['success' => false, 'message' => 'Faltan datos']);
    exit;
}

$idProyecto = $data['idProyecto'];
$idRevisor = $data['idRevisor'];

// 1. Eliminar veredicto primero (para mantener integridad si fuera clave foránea)
$stmtVeredicto = $conn->prepare("DELETE FROM revisor_veredicto WHERE idProyecto = ? AND idRevisor = ?");
$stmtVeredicto->bind_param("ii", $idProyecto, $idRevisor);
$veredictoBorrado = $stmtVeredicto->execute();

// 2. Eliminar la asignación
$stmt = $conn->prepare("DELETE FROM revisor_proyecto WHERE idProyecto = ? AND idRevisor = ?");
$stmt->bind_param("ii", $idProyecto, $idRevisor);
$asignacionBorrada = $stmt->execute();

// 3. RESPUESTA ÚNICA
if ($veredictoBorrado && $asignacionBorrada) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al eliminar: ' . $conn->error]);
}
?>