<?php
require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data['correo'], $data['password'], $data['role'])) {
    echo json_encode(["success" => false]);
    exit;
}

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

if (!$row) {
    echo json_encode(["success" => false]);
    exit;
}

// Compatibilidad: acepta contraseñas hash nuevas y texto plano legado.
$isValidPassword = password_verify($password, $row['contra']) || hash_equals((string)$row['contra'], (string)$password);
if (!$isValidPassword) {
    echo json_encode(["success" => false]);
    exit;
}

// Migra automáticamente cuentas legadas (texto plano) a hash al iniciar sesión.
if (!password_get_info($row['contra'])['algo']) {
    $newHash = password_hash($password, PASSWORD_DEFAULT);
    $update = $conn->prepare("UPDATE $table SET contra = ? WHERE id = ?");
    if ($update) {
        $update->bind_param("si", $newHash, $row['id']);
        $update->execute();
    }
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
