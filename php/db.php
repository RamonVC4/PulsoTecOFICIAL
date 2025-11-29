<?php
// Datos conexión
$host = "localhost";
$user = "root";
$pass = "root";
$port = "8889";
$db = "pulsotec";

$conn = new mysqli($host, $user, $pass,$db, $port);
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "DB error"]);
    exit;
}
?>