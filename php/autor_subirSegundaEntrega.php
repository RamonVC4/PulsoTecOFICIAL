<?php
session_start();
require_once 'db.php';
require_once 'drive_config.php';
require_once 'drive_upload.php';
header('Content-Type: application/json');

// Validar que el usuario esté autenticado
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

// Validar que se recibió el idEntrega
if (!isset($_POST['idEntrega'])) {
    echo json_encode(['success' => false, 'message' => 'Falta el ID de la entrega']);
    exit;
}

$idEntrega = intval($_POST['idEntrega']);

// Validar que se recibió el archivo
if (!isset($_FILES['archivo']) || $_FILES['archivo']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'message' => 'Error al subir el archivo']);
    exit;
}

// Obtener información de la entrega
$stmtEntrega = $conn->prepare("SELECT e.id, e.idProyecto, e.numeroEntrega, e.entregado FROM entrega e WHERE e.id = ?");
$stmtEntrega->bind_param("i", $idEntrega);
$stmtEntrega->execute();
$resultEntrega = $stmtEntrega->get_result();

if ($resultEntrega->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Entrega no encontrada']);
    exit;
}

$entrega = $resultEntrega->fetch_assoc();

// Verificar que el autor tiene acceso a este proyecto
$stmtAutor = $conn->prepare("SELECT ap.idAutor FROM autor_proyecto ap WHERE ap.idProyecto = ? AND ap.idAutor = ?");
$stmtAutor->bind_param("ii", $entrega['idProyecto'], $_SESSION['user_id']);
$stmtAutor->execute();
$resultAutor = $stmtAutor->get_result();

if ($resultAutor->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'No tienes permiso para subir archivos a este proyecto']);
    exit;
}

// Verificar que es la segunda entrega y no está entregada
if ($entrega['numeroEntrega'] != 2) {
    echo json_encode(['success' => false, 'message' => 'Solo se puede subir la segunda entrega']);
    exit;
}

if ($entrega['entregado'] == 1) {
    echo json_encode(['success' => false, 'message' => 'Esta entrega ya fue subida']);
    exit;
}

// // Verificar que la primera entrega fue revisada y no rechazada definitivamente
// $stmtPrimera = $conn->prepare("SELECT e.aceptado FROM entrega e WHERE e.idProyecto = ? AND e.numeroEntrega = 1");
// $stmtPrimera->bind_param("i", $entrega['idProyecto']);
// $stmtPrimera->execute();
// $resultPrimera = $stmtPrimera->get_result();

// if ($resultPrimera->num_rows === 0) {
//     echo json_encode(['success' => false, 'message' => 'No se encontró la primera entrega']);
//     exit;
// }

// $primeraEntrega = $resultPrimera->fetch_assoc();

// // Verificar que la primera entrega fue revisada (aceptado no es NULL) y no fue rechazada definitivamente (aceptado != 0)
// if ($primeraEntrega['aceptado'] === null) {
//     echo json_encode(['success' => false, 'message' => 'La primera entrega aún no ha sido revisada']);
//     exit;
// }

// if ($primeraEntrega['aceptado'] == 0) {
//     echo json_encode(['success' => false, 'message' => 'La primera entrega fue rechazada definitivamente']);
//     exit;
// }

// Subir el archivo a Google Drive
$archivo = $_FILES['archivo'];
$filename = basename($archivo['name']);
$tempPath = $archivo['tmp_name'];

// ID de la carpeta en Google Drive (se usa el de drive_config.php si está definido)
$driveFolderId = defined('DRIVE_FOLDER_ID') ? DRIVE_FOLDER_ID : null;

// Subir a Google Drive
$driveResult = uploadToDrive($tempPath, $filename, $driveFolderId);

if (!$driveResult['success']) {
    echo json_encode(['success' => false, 'message' => 'Error al subir el archivo a Drive: ' . $driveResult['error']]);
    exit;
}

// Obtener la URL de visualización (para iframe)
$driveUrl = $driveResult['viewUrl'];

// Actualizar la entrega en la base de datos con la URL de Drive
$stmtUpdate = $conn->prepare("UPDATE entrega SET pdfPath = ?, entregado = 1 WHERE id = ?");
$stmtUpdate->bind_param("si", $driveUrl, $idEntrega);
$stmtUpdate->execute();

if ($stmtUpdate->affected_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Error al actualizar la base de datos']);
    exit;
}

// checo la entrega de que proyecto es
$resultDeQueProyecto = q("SELECT p.id FROM entrega e JOIN proyecto p ON e.idProyecto = p.id WHERE e.id = ?","i",[$idEntrega]);
$entregaDeQueProyecto = $resultDeQueProyecto->fetch_assoc();
// ahora tengo la id
$idProyecto = $entregaDeQueProyecto['id'];


// debug
// echo "idRevisor: $idRevisor<br>";
// echo "idProyecto: $idProyecto<br>";
// echo "idEntrega: $idEntrega<br>";
// echo "--------------------------------<br>";



// a los revisores que no han dado veredicto final, le pongo segunda version de revisor veredicto
$resultadoLosQueFaltan = q("SELECT idRevisor FROM revisor_veredicto WHERE idProyecto = ? AND idEntrega = ?", "ii", [$idProyecto, $idEntrega]);
while ($row = $resultadoLosQueFaltan->fetch_assoc()) {
    q("INSERT INTO revisor_veredicto (idRevisor, idProyecto, idEntrega) VALUES (?,?,(select id from entrega where idProyecto = ? order by id desc limit 1))", "iii", [$row['idRevisor'], $idProyecto, $idProyecto]);
}

echo json_encode(['success' => true, 'message' => 'Segunda entrega subida exitosamente']);
?>

