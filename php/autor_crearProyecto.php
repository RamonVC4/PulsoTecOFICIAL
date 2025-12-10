<?php
session_start();
require_once 'db.php';
require_once 'drive_config.php';
require_once 'drive_upload.php';
header('Content-Type: application/json');

//valido que no tenga el proyecto un nombre que el usuario ya usó
$stmtAutorProyecto = $conn->prepare("SELECT ap.idProyecto FROM autor_proyecto ap JOIN proyecto p ON ap.idProyecto = p.id WHERE ap.idAutor = ? AND p.nombre = ?");
$stmtAutorProyecto->bind_param("is", $_SESSION['user_id'], $_POST['titulo']);
$stmtAutorProyecto->execute();

$result = $stmtAutorProyecto->get_result(); 
if ($row = $result->fetch_assoc()) {
    echo json_encode(['success' => false, 'message' => 'Ya tienes un proyecto con ese nombre.']);
    exit;
}

//leo los datos
$pdf = $_FILES['archivo'];
$projectTitle = $_POST['titulo'];
$autoresIds = json_decode($_POST['autores'], true);
$autorCorrespId = $_POST['autorCorrespondenciaId'];
$areaDeConocimiento = $_POST['areaDeConocimiento'];

// Validar que el archivo se subió correctamente
if (!isset($pdf) || $pdf['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'message' => 'Error al subir el archivo.']);
    exit;
}

$filename = basename($pdf['name']);
$tempPath = $pdf['tmp_name'];

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

//inserto el proyecto en la base de datos
//inserto un proyecto con id y nombre
$stmtCrearProyecto = $conn->prepare("INSERT INTO proyecto (nombre, areaDeConocimiento) VALUES (?,?)");
$stmtCrearProyecto->bind_param("si", $projectTitle,$areaDeConocimiento);
$stmtCrearProyecto->execute();

//si hubo error en el execute, regreso
if ($stmtCrearProyecto->affected_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Error al crear el proyecto: ' . $stmtCrearProyecto->error]);
    exit;
}

//obtengo el id del proyecto recien creado
$projectId = $stmtCrearProyecto->insert_id;

//creo la relacion autor-proyecto
$stmtAutorProyecto = $conn->prepare("INSERT INTO autor_proyecto (idAutor, idProyecto) VALUES (?, ?)");
$stmtAutorProyecto->bind_param("ii", $_SESSION['user_id'], $projectId);
$stmtAutorProyecto->execute();

//pongo los demas autores en la relacion
if (!empty($autoresIds)) {
    foreach ($autoresIds as $currId) {
        $stmtAutorProyecto = $conn->prepare("INSERT INTO autor_proyecto (idAutor, idProyecto) VALUES (?, ?)");
        $stmtAutorProyecto->bind_param("ii",$currId, $projectId);
        $stmtAutorProyecto->execute();
    }   
}









//si hubo error regreso
if ($stmtAutorProyecto->affected_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Error al asociar autor y proyecto: ' . $stmtAutorProyecto->error]);
    exit;
}


//por ultimo, creo la entrega con la URL de Drive
$numeroEntrega = 1;
$stmtEntrega = $conn->prepare("INSERT INTO entrega (idProyecto, numeroEntrega, pdfPath, entregado) VALUES (?, ?, ?, 1)");
$stmtEntrega->bind_param("sis", $projectId, $numeroEntrega, $driveUrl);
$stmtEntrega->execute();


//si hubo error regreso
if ($stmtEntrega->affected_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Error al crear la entrega: ' . $stmtEntrega->error]);
    exit;
}

//todo bien, regreso exito
echo json_encode(['success' => true, 'message' => 'Proyecto creado exitosamente.']);
?>