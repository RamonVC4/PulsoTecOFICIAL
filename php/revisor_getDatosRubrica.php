<?php
require_once 'db.php';
session_start();

//leo el pdfPath 
$data = json_decode(file_get_contents("php://input"), true);
$pdfPath = $data['pdfPath'];

//consigo la id del proyecto
$stmtProyecto = $conn->prepare("SELECT idProyecto FROM entrega WHERE pdfPath = ?");
$stmtProyecto->bind_param("s", $pdfPath);
$stmtProyecto->execute();
$resultProyecto = $stmtProyecto->get_result();
$rowProyecto = $resultProyecto->fetch_assoc();
$idProyecto = $rowProyecto['idProyecto'];

//guardo la id del proyecto porque la voy a usar bastante
$_SESSION['idProyecto'] = $idProyecto;

//consigo los datos de la rubrica
$stmt = $conn->prepare("SELECT p.id, p.nombre, rp.datos, rp.terminado FROM proyecto p JOIN revisor_proyecto rp ON p.id = rp.idProyecto WHERE rp.idRevisor = ? AND rp.idProyecto = ?");
$stmt->bind_param("ii", $_SESSION['user_id'], $idProyecto);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

//checo si salió bien
if (!$result) {
    echo json_encode(['success' => false]);
    exit;
}

//regreso solo los datos como json
echo json_encode(['success' => true, 'datosRubrica' => $row['datos'], 'terminado' => $row['terminado']]);

?>