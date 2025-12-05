<?php
// manager_asignarRevisor.php
require_once 'db.php'; 
header('Content-Type: application/json');

// Activar reporte de errores pero NO mostrarlos en pantalla para no romper el JSON
ini_set('display_errors', 0);
error_reporting(E_ALL);

$data = json_decode(file_get_contents("php://input"), true);

// Validamos datos obligatorios
if (!isset($data['idProyecto']) || !isset($data['idRevisor'])) {
    echo json_encode(['success' => false, 'message' => 'Faltan datos']);
    exit;
}

$idProyecto = $data['idProyecto'];
$idRevisor = $data['idRevisor'];
$fechaLimite = isset($data['fechaLimite']) ? $data['fechaLimite'] : date('Y-m-d', strtotime('+7 days'));

// 1. Verificar si ya existe esa asignación
$check = $conn->prepare("SELECT * FROM revisor_proyecto WHERE idRevisor = ? AND idProyecto = ?");
$check->bind_param("ii", $idRevisor, $idProyecto);
$check->execute();
if ($check->get_result()->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Este revisor ya está asignado.']);
    exit;
}

// 2. Insertar asignación en revisor_proyecto
// NOTA: Aquí insertamos JSON vacío '{}' en 'datos' y 0 en 'terminado'
$stmt = $conn->prepare("INSERT INTO revisor_proyecto (idRevisor, idProyecto, fechaLimite, datos, terminado) VALUES (?, ?, ?, '{}', 0)");
$stmt->bind_param("iis", $idRevisor, $idProyecto, $fechaLimite);

if (!$stmt->execute()) {
    echo json_encode(['success' => false, 'message' => 'Error al asignar proyecto: ' . $conn->error]);
    exit;
}

// 3. Crear registro en revisor_veredicto
// CORRECCIÓN: Quitamos idEntrega porque no existe en la tabla revisor_veredicto del SQL
$stmtVeredicto = $conn->prepare("INSERT INTO revisor_veredicto (idRevisor, idProyecto, status) VALUES (?, ?, NULL)");
$stmtVeredicto->bind_param("ii", $idRevisor, $idProyecto);

if ($stmtVeredicto->execute()) {
    echo json_encode(['success' => true, 'message' => 'Revisor asignado correctamente.']);
} else {
    // Si falla el veredicto, idealmente deberíamos borrar la asignación anterior, 
    // pero por ahora solo avisamos del error.
    echo json_encode(['success' => false, 'message' => 'Error al crear veredicto: ' . $conn->error]);
}
?>