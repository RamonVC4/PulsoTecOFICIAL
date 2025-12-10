<?php
// Desactivar reporte de errores HTML
error_reporting(E_ALL);
ini_set('display_errors', 0);

require_once 'db.php';
header('Content-Type: application/json');

// Verificar conexión a la base de datos
$dbError = isset($GLOBALS['db_connection_error']) ? $GLOBALS['db_connection_error'] : null;
if (!$conn || $conn->connect_error || $dbError) {
    $errorMsg = $dbError ? $dbError : ($conn && $conn->connect_error ? $conn->connect_error : 'No se pudo crear la conexión');
    echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos: ' . $errorMsg]);
    exit;
}


//leo del json que me mandan
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['role'])) {
    echo json_encode(['success' => false, 'message' => 'Datos inválidos']);
    exit;
}

$cuerpo = $data;
$tabla = $data['role'];
$contrarParaMeter = $cuerpo['password'];//password_hash($cuerpo['password'], PASSWORD_DEFAULT); TODO descomentar

//hago el insert porque se supone que ya verifiqué todo 
if($tabla == 'revisor'){
    $stmt = $conn->prepare("INSERT INTO revisor (nombre, correo, contra, primerApellido, segundoApellido, CURP, areaDeConocimiento) VALUES (?, ?, ?, ?, ?, ?, ?);");
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Error al preparar consulta: ' . $conn->error]);
        exit;
    }
    $stmt->bind_param("sssssss", $cuerpo['nombre'], $cuerpo['correo'], $contrarParaMeter, $cuerpo['apellidoPaterno'], $cuerpo['apellidoMaterno'], $cuerpo['curp'], $cuerpo['areaDeConocimiento']);
}  
else{
    $stmt = $conn->prepare("INSERT INTO autor (nombre, correo, contra, primerApellido, segundoApellido, institucion, ORCID, estado, ciudad, calle, numeroDeCalle, colonia) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);");
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Error al preparar consulta: ' . $conn->error]);
        exit;
    }
    $stmt->bind_param("ssssssssssss", $cuerpo['nombre'], $cuerpo['correo'], $contrarParaMeter, $cuerpo['apellidoPaterno'], $cuerpo['apellidoMaterno'], $cuerpo['institucion'], $cuerpo['orcid'], $cuerpo['estado'], $cuerpo['ciudad'], $cuerpo['calle'], $cuerpo['numeroDeCalle'], $cuerpo['colonia']);
}
    
if (!$stmt->execute()) {
    echo json_encode(['success' => false, 'message' => 'Error al registrar: ' . $stmt->error]);
    exit;
}

echo json_encode(['success' => true]);
?>