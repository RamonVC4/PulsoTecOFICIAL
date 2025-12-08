<?php
require_once 'db.php';
session_start();

//leo el pdfPath 
$data = json_decode(file_get_contents("php://input"), true);
$idEntrega = intval($data['idEntrega']);

//consigo los datos de la rubrica de todas las que haya para esta entrega
$stmtRevisorRubrica = $conn->prepare("SELECT rp.datos from revisor_veredicto rp WHERE rp.idEntrega = ?");
$stmtRevisorRubrica->bind_param("i", $idEntrega);
$stmtRevisorRubrica->execute();
$result = $stmtRevisorRubrica->get_result();

//checo si salió bien
if (!$result) {
    echo json_encode(['success' => false]);
    exit;
}

// Construir array con todos los revisores y sus datos
$revisores = [];
while ($row = $result->fetch_assoc()) {
    $nombreCompleto = trim($row['nombre'] . ' ' . $row['primerApellido'] . ' ' . ($row['segundoApellido'] ?? ''));
    $revisores[] = [
        'idRevisor' => $row['idRevisor'],
        'correo' => $row['correo'],
        'nombre' => $nombreCompleto ?: $row['correo'],
        'datosRubrica' => $row['datos'],
        'terminado' => $row['terminado']
    ];
}

//regreso todos los revisores con sus datos
echo json_encode(['success' => true, 'revisores' => $revisores]);

?>