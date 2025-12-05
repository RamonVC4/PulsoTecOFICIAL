<?php
// Datos conexión
// $host = "localhost";
// $user = "root";
// $pass = "root";
// $port = "8889";
// $db = "pulsotec";

$host = "sql203.infinityfree.com";
$user = "if0_40606412";
$pass = "echephph";
$port = "3306";
$db = "if0_40606412_pulsotec";

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