<?php
require_once 'db.php';
session_start();
header('Content-Type: application/json');

// Leo el idEntrega
$data = json_decode(file_get_contents("php://input"), true);
$idEntrega = isset($data['idEntrega']) ? intval($data['idEntrega']) : 0;

if ($idEntrega === 0) {
    echo json_encode(['success' => false, 'message' => 'ID de entrega inválido']);
    exit;
}

// Obtener los datos de la rúbrica de todas las que haya para esta entrega
// NO incluir información personal del revisor (nombre, correo) para mantener anonimato
$stmtRevisorRubrica = $conn->prepare("
    SELECT 
        rv.idRevisor,
        rv.datos,
        rv.terminado
    FROM revisor_veredicto rv
    WHERE rv.idEntrega = ?
");
$stmtRevisorRubrica->bind_param("i", $idEntrega);
$stmtRevisorRubrica->execute();
$result = $stmtRevisorRubrica->get_result();

// Checo si salió bien
if (!$result) {
    echo json_encode(['success' => false, 'message' => 'Error al obtener datos']);
    exit;
}

// Construir array con todos los revisores y sus datos (sin información personal)
$revisores = [];
$indice = 1;
while ($row = $result->fetch_assoc()) {
    $revisores[] = [
        'idRevisor' => $row['idRevisor'],
        'nombre' => 'Revisor ' . $indice, // Nombre genérico, no el real
        'datosRubrica' => $row['datos'] ?? '{}',
        'terminado' => $row['terminado'] ?? 0
    ];
    $indice++;
}

// Regreso todos los revisores con sus datos
echo json_encode(['success' => true, 'revisores' => $revisores]);

?>