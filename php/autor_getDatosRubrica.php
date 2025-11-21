<?php
require_once 'db.php';
session_start();

//leo el pdfPath 
$data = json_decode(file_get_contents("php://input"), true);
$idEntrega = intval($data['idEntrega']);

//consigo los datos de la rubrica
$stmtRevisorRubrica = $conn->prepare("SELECT rp.datos from revisor_proyecto rp WHERE rp.idEntrega = ?");
$stmtRevisorRubrica->bind_param("i", $idEntrega);
$stmtRevisorRubrica->execute();
$result = $stmtRevisorRubrica->get_result();
$row = $result->fetch_assoc();

//checo si salió bien
if (!$result) {
    echo json_encode(['success' => false]);
    exit;
}

//regreso solo los datos como json
echo json_encode(['success' => true, 'datosRubrica' => $row['datos'], 'terminado' => 1]);

?>