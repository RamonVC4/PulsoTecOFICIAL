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
// Hacer JOIN con la tabla revisor para obtener los datos del revisor
$stmtRevisorRubrica = $conn->prepare("
    SELECT 
        rv.idRevisor,
        rv.datos,
        rv.terminado,
        r.nombre,
        r.primerApellido,
        r.segundoApellido,
        r.correo
    FROM revisor_veredicto rv
    JOIN revisor r ON rv.idRevisor = r.id
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

// Construir array con todos los revisores y sus datos
$revisores = [];
while ($row = $result->fetch_assoc()) {
    $nombreCompleto = trim(($row['nombre'] ?? '') . ' ' . ($row['primerApellido'] ?? '') . ' ' . ($row['segundoApellido'] ?? ''));
    $revisores[] = [
        'idRevisor' => $row['idRevisor'],
        'correo' => $row['correo'] ?? '',
        'nombre' => $nombreCompleto ?: ($row['correo'] ?? 'Revisor sin nombre'),
        'datosRubrica' => $row['datos'] ?? '{}',
        'terminado' => $row['terminado'] ?? 0
    ];
}

// Regreso todos los revisores con sus datos
echo json_encode(['success' => true, 'revisores' => $revisores]);

?>