<?php
require_once 'db.php';
session_start();

//busco todos los autores en la bdd y regreso su id, nombre y correo

try {
    $stmt = $conn->prepare("SELECT id, nombre, primerApellido, segundoApellido, correo FROM autor");
    $stmt->execute();
    $autores = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    echo json_encode(['success' => true, 'autores' => $autores]);
} catch (Exception $e) {
    echo json_encode(['error' => 'Error al buscar autores: ' . $e->getMessage()]);
}

?>