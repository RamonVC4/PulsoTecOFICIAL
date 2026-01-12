<?php
// Datos conexión
$host = getenv('DB_HOST') ?: 'localhost';
$user = getenv('DB_USER') ?: 'root';
$pass = getenv('DB_PASS') ?: '';
$port = getenv('DB_PORT') ?: '3306';
$db   = getenv('DB_NAME') ?: 'pulsotec';

$conn = new mysqli($host, $user, $pass,$db, $port);
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "DB error"]);
    exit;
}

/*FUNCIONES*/
//conseguir datos de la bdd
 function q($sqlstmt, $paramTypes, $paramValues) {
    global $conn;

    // 1. PREPARE
    $preparedStmt = $conn->prepare($sqlstmt);
    if (!$preparedStmt) {
        echo "❌ Error al preparar la consulta: " . $conn->error;
        return false;
    }

    // 2. BIND PARAMS
    if (!$preparedStmt->bind_param($paramTypes, ...$paramValues)) {
        echo "❌ Error en bind_param: " . $preparedStmt->error;
        return false;
    }

    // 3. EXECUTE
    if (!$preparedStmt->execute()) {
        echo "❌ Error al ejecutar la consulta: " . $preparedStmt->error;
        return false;
    }

    // 4. GET RESULT
    $result = $preparedStmt->get_result();
    if ($preparedStmt->error) {
        echo "❌ Error al obtener resultados: " . $preparedStmt->error;
        return false;
    }

    return $result;
}

?>
