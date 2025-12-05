<?php
// Datos conexión
$host = "pulsotec-pulsotec.g.aivencloud.com";
$user = "avnadmin";
$pass = $_ENV['AIVEN_PASS'];
$port = "24265";
$db = "pulsotec";


$conn = new mysqli($host, $user, $pass,$db, $port, null);
mysqli_ssl_set(
    $conn,
    null,        // client key
    null,        // client cert
    "ca.pem",    // CA cert
    null,        // cipher
    null
);

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