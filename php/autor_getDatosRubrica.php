<?php
require_once 'db.php';
session_start();

//leo el pdfPath 
$data = json_decode(file_get_contents("php://input"), true);
$idEntrega = intval($data['idEntrega']);

//consigo los datos de todas las rubricas de los revisores para esta entrega
$stmtRevisorRubrica = $conn->prepare("SELECT rp.idRevisor, rp.datos, rp.terminado, r.correo, r.nombre, r.primerApellido, r.segundoApellido 
                                      FROM revisor_proyecto rp 
                                      JOIN revisor r ON rp.idRevisor = r.id 
                                      WHERE rp.idEntrega = ? 
                                      ORDER BY rp.idRevisor");
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