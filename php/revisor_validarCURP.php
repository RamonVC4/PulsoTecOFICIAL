<?php
require_once 'db.php';
session_start();
header('Content-Type: application/json');

// Validar que el usuario esté autenticado
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

// Leer datos del POST
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['curp']) || empty(trim($data['curp']))) {
    echo json_encode(['success' => false, 'message' => 'CURP requerido']);
    exit;
}

$curp = strtoupper(trim($data['curp']));

// Validar formato básico de CURP (18 caracteres)
if (strlen($curp) !== 18) {
    echo json_encode(['success' => false, 'message' => 'El CURP debe tener 18 caracteres']);
    exit;
}

// Validar que el CURP coincida con el del revisor en sesión
$stmt = $conn->prepare("SELECT id, curp FROM revisor WHERE id = ?");
$stmt->bind_param("i", $_SESSION['user_id']);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Revisor no encontrado']);
    exit;
}

$revisor = $result->fetch_assoc();

// Comparar CURP (case-insensitive)
if (strtoupper($revisor['curp']) !== $curp) {
    echo json_encode(['success' => false, 'message' => 'El CURP no coincide con el registrado']);
    exit;
}

// CURP válido
echo json_encode(['success' => true, 'message' => 'CURP validado correctamente']);
?>

