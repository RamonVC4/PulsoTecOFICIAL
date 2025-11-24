<?php
require_once 'db.php';
session_start();


//consigo la id del proyecto
$idProyecto = $_SESSION['idProyecto'];
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
echo json_encode(['success' => true, 'datosRubrica' => $row['datos'] ?? null, 'terminado' => $row['terminado'] ?? null]);

?>