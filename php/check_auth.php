<?php
require_once 'check_session.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
$requiredRole = $data['role'] ?? '';

if (checkSession($requiredRole)) {
    echo json_encode([
        'authenticated' => true,
        'role' => $_SESSION['user_role'] ?? ''
    ]);
} else {
    echo json_encode([
        'authenticated' => false,
        'role' => ''
    ]);
}
?>