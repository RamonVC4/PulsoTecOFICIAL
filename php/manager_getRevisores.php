<?php
require_once 'db.php';
header('Content-Type: application/json');

// Seleccionamos id y correo de todos los revisores
$sql = "SELECT id, correo FROM revisor";
$result = $conn->query($sql);

$revisores = [];
while ($row = $result->fetch_assoc()) {
    $revisores[] = [
        'id' => $row['id'],
        'name' => $row['correo'], // Usamos el correo como nombre
        'email' => $row['correo'],
        'expertise' => ['General'] // Dato dummy pq no está en la BD
    ];
}

echo json_encode(['success' => true, 'revisores' => $revisores]);
?>