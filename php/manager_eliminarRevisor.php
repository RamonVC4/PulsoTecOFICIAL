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

// Borramos la relación en la base de datos
$stmt = $conn->prepare("DELETE FROM revisor_proyecto WHERE idProyecto = ? AND idRevisor = ?");
$stmt->bind_param("ii", $idProyecto, $idRevisor);

//aqui voy a poner tambien lo de eliminar veredicto
$stmtVeredicto = $conn->prepare("DELETE FROM revisor_veredicto WHERE idProyecto = ? AND idRevisor = ?");
$stmtVeredicto->bind_param("ii", $idProyecto, $idRevisor);

if ($stmtVeredicto->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al eliminar: ' . $conn->error]);
}

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al eliminar: ' . $conn->error]);
}
?>