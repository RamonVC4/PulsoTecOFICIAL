<?php
// Datos conexión
$host = "localhost";
$user = "root";
$pass = "";
$db = "pulsotec";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "DB error"]);
    exit;
}
?>