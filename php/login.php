<?php
require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$correo = $data['correo'];
$password = $data['password'];
$role = $data['role'];

//elijo la tabla basado en el role
switch ($role) {
    case 'autor':
        $table = 'autor';
        break;
    case 'manager':
        $table = 'manager';
        break;
    case 'revisor':
        $table = 'revisor';
        break;
    default:
        echo json_encode(["success" => false]);
        exit;
}

$stmt = $conn->prepare("SELECT * FROM $table WHERE correo=? LIMIT 1");
$stmt->bind_param("s", $correo);
$stmt->execute();

$result = $stmt->get_result();
$row = $result->fetch_assoc();
//if (!$row || !password_verify($password, $row['contra'])) {
if (!$row || $password != $row['contra']) {
    echo json_encode(["success" => false]);
    exit;
}

//si pasó, entonces inicio la sesion
session_start();

$_SESSION['user_id'] = $row['id'];
$_SESSION['user_role'] = $role;

$routes = [
    "autor" => "../webpages/author.php"."?id=" . $row['id'],
    "manager" => "../webpages/manager.php"."?id=" . $row['id'],
    "revisor" => "../webpages/revisor.php"."?id=" . $row['id']
];

echo json_encode([
    "success" => true,
    "redirect" => $routes[$role]
]);

?>