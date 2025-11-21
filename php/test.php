<?php
// Conexión a la base de datos
$host = "localhost";
$user = "root";
$pass = ""; // tu contraseña de MySQL
$db   = "pulsoTec";

$conn = new mysqli($host, $user, $pass, $db);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Datos a insertar
$usuario = "revisor";
$correo = "$usuario@example.com";
$contra = "123456";

// Hashear la contraseña antes de guardarla
$hashContra = password_hash($contra, PASSWORD_DEFAULT);

// Preparar la consulta
$stmt = $conn->prepare("INSERT INTO $usuario (correo, contra) VALUES (?, ?)");
$stmt->bind_param("ss", $correo, $hashContra);

// Ejecutar
if ($stmt->execute()) {
    echo "Registro insertado correctamente.";
} else {
    echo "Error al insertar: " . $stmt->error;
}

// Cerrar statement y conexión
$stmt->close();
$conn->close();
?>