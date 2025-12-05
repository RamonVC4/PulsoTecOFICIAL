<?php
session_start();
require_once 'db.php';

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

//guardo el PDF aqui
$uploadsDir = '../uploads/'; 
$filename = basename($pdf['name']);
$targetPath = $uploadsDir . uniqid() . '-' . $filename; //le pongo una uniqid para evitar sobreescrituras

if (!move_uploaded_file($pdf['tmp_name'], $targetPath)){
    echo json_encode(['success' => false, 'message' => 'Error al subir el archivo.']);
    exit;
}

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

//por ultimo, creo la entrega
$numeroEntrega = 1;
$stmtEntrega = $conn->prepare("INSERT INTO entrega (idProyecto, numeroEntrega, pdfPath, entregado) VALUES (?, ?, ?, 1)");
$stmtEntrega->bind_param("sis", $projectId, $numeroEntrega, $targetPath);
$stmtEntrega->execute();

//si hubo error regreso
if ($stmtEntrega->affected_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Error al crear la entrega: ' . $stmtEntrega->error]);
    exit;
}

//todo bien, regreso exito
echo json_encode(['success' => true, 'message' => 'Proyecto creado exitosamente.']);
?>