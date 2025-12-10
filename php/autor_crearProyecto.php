<?php
session_start();
require_once 'db.php';
require_once 'drive_config.php';
require_once 'drive_upload.php';
header('Content-Type: application/json');

// VALIDAR NOMBRE DE PROYECTO DUPLICADO
$stmtAutorProyecto = $conn->prepare("
    SELECT ap.idProyecto 
    FROM autor_proyecto ap 
    JOIN proyecto p ON ap.idProyecto = p.id 
    WHERE ap.idAutor = ? AND p.nombre = ?
");
$stmtAutorProyecto->bind_param("is", $_SESSION['user_id'], $_POST['titulo']);
$stmtAutorProyecto->execute();

$result = $stmtAutorProyecto->get_result();
if ($row = $result->fetch_assoc()) {
    echo json_encode(['success' => false, 'message' => 'Ya tienes un proyecto con ese nombre.']);
    exit;
}


// LEER DATOS Y VALIDAR ARCHIVO
$pdf = $_FILES['archivo'];
$projectTitle = $_POST['titulo'];
$autoresIds = json_decode($_POST['autores'], true);
$autorCorrespId = $_POST['autorCorrespondenciaId'];
$areaDeConocimiento = $_POST['areaDeConocimiento'];

if (!isset($pdf) || $pdf['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'message' => 'Error al subir el archivo.']);
    exit;
}

$filename = basename($pdf['name']);
$tempPath = $pdf['tmp_name'];
$driveFolderId = defined('DRIVE_FOLDER_ID') ? DRIVE_FOLDER_ID : null;

// SUBIR A GOOGLE DRIVE (IDEALMENTE ES SOLO SI SALE BIEN, PERO MAS COMODO ASI)
$driveResult = uploadToDrive($tempPath, $filename, $driveFolderId);

if (!$driveResult['success']) {
    echo json_encode(['success' => false, 'message' => 'Error al subir el archivo a Drive: ' . $driveResult['error']]);
    exit;
}

$driveUrl = $driveResult['viewUrl'];

// -------------------------------------------
//    INICIA TRANSACCIÓN
// -------------------------------------------
$conn->begin_transaction();

try {

    // INSERT PROYECTO
    $stmtCrearProyecto = $conn->prepare("
        INSERT INTO proyecto (nombre, areaDeConocimiento)
        VALUES (?,?)
    ");
    $stmtCrearProyecto->bind_param("si", $projectTitle, $areaDeConocimiento);
    
    if (!$stmtCrearProyecto->execute()) {
        throw new Exception("Error al crear proyecto: " . $stmtCrearProyecto->error);
    }

    $projectId = $stmtCrearProyecto->insert_id;

    // INSERT AUTOR -> PROYECTO (AUTOR PRINCIPAL)
    $stmtAutorProyecto = $conn->prepare("
        INSERT INTO autor_proyecto (idAutor, idProyecto)
        VALUES (?, ?)
    ");
    $stmtAutorProyecto->bind_param("ii", $_SESSION['user_id'], $projectId);

    if (!$stmtAutorProyecto->execute()) {
        throw new Exception("Error al asociar autor y proyecto: " . $stmtAutorProyecto->error);
    }

    // INSERTAR DEMÁS AUTORES
    if (!empty($autoresIds)) {
        foreach ($autoresIds as $currId) {
            $stmtAutorProyecto->bind_param("ii", $currId, $projectId);
            if (!$stmtAutorProyecto->execute()) {
                throw new Exception("Error al asociar coautor: " . $stmtAutorProyecto->error);
            }
        }
    }

    // INSERT ENTREGA INICIAL
    $numeroEntrega = 1;
    $resultadoEntrega = q("INSERT INTO entrega (idProyecto, numeroEntrega, pdfPath, entregado, fechaLimite) VALUES (?, ?, ?, 1, NOW())", 
        "sis", array($projectId, $numeroEntrega, $driveUrl));

    // TODO OK: CONFIRMAR
    $conn->commit();

    echo json_encode(['success' => true, 'message' => 'Proyecto creado exitosamente.']);
    exit;

} catch (Exception $e) {

    // CUALQUIER ERROR REVERSIÓN TOTAL PORQUE SINO LLENAMOS LA BD DE BASURA
    $conn->rollback();

    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    exit;
}
?>
