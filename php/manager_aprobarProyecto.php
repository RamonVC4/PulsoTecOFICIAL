<?php
require_once 'db.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
$idProyecto = $data['idProyecto'];

if (!isset($idProyecto)) {
    echo json_encode(['success' => false, 'message' => 'Falta ID del proyecto']);
    exit;
}

//Buscamos cual es la ultima entrega de este proyecto (para aprobar la más reciente)
$stmtBuscar = $conn->prepare("SELECT MAX(numeroEntrega) as ultima FROM entrega WHERE idProyecto = ?");
$stmtBuscar->bind_param("i", $idProyecto);
$stmtBuscar->execute();
$result = $stmtBuscar->get_result();
$row = $result->fetch_assoc();
$ultimaEntrega = $row['ultima'];

if (!$ultimaEntrega) {
    echo json_encode(['success' => false, 'message' => 'No hay entregas para aprobar']);
    exit;
}

//Actualizamos esa entrega a 'aceptado = 1'
$stmtUpdate = $conn->prepare("UPDATE entrega SET aceptado = 1 WHERE idProyecto = ? AND numeroEntrega = ?");
$stmtUpdate->bind_param("ii", $idProyecto, $ultimaEntrega);

if ($stmtUpdate->execute()) {
    echo json_encode(['success' => true, 'message' => 'Proyecto aprobado exitosamente']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al actualizar BD']);
}
?>