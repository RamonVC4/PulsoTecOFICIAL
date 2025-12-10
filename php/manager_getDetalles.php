<?php
// manager_getDetalles.php
require_once 'db.php';
header('Content-Type: application/json');

// Recibimos el ID del PROYECTO
$idProyecto = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($idProyecto === 0) {
     echo json_encode(['success' => false, 'message' => 'ID invalido']);
     exit;
}

// Verificar si hay segunda entrega creada (significa que los 3 revisores terminaron la primera)
$stmtSegundaEntrega = $conn->prepare("SELECT COUNT(*) as count FROM entrega WHERE idProyecto = ? AND numeroEntrega = 2");
$stmtSegundaEntrega->bind_param("i", $idProyecto);
$stmtSegundaEntrega->execute();
$resultSegundaEntrega = $stmtSegundaEntrega->get_result();
$rowSegundaEntrega = $resultSegundaEntrega->fetch_assoc();
$tieneSegundaEntrega = ($rowSegundaEntrega && $rowSegundaEntrega['count'] > 0);

// Traemos correo del revisor, el JSON de feedback y si ya terminó
$sql = "SELECT 
            r.id AS revisor_id,
            r.correo AS revisor_correo,
            rp.datos AS feedback_json,
            rp.terminado,
            rp.fechaLimite
        FROM revisor_proyecto rp
        JOIN revisor r ON rp.idRevisor = r.id
        WHERE rp.idProyecto = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $idProyecto);
$stmt->execute();
$result = $stmt->get_result();

$interacciones = [];

while ($row = $result->fetch_assoc()) {
    // Decodificamos el JSON que viene de la BD para enviarlo limpio
    $feedback = json_decode($row['feedback_json']);
    
    // Si el JSON está vacío o es null, mandamos un objeto vacío
    if (json_last_error() !== JSON_ERROR_NONE) {
        $feedback = new stdClass();
    }

    // Si hay segunda entrega, significa que todos los revisores terminaron la primera entrega
    // así que marcamos como terminado
    $terminado = $tieneSegundaEntrega ? true : ($row['terminado'] == 1);

    $interacciones[] = [
        'revisor_id' => $row['revisor_id'],
        'revisor_email' => $row['revisor_correo'],
        'terminado' => $terminado, // Convertimos a booleano real
        'fecha_limite' => $row['fechaLimite'],
        'feedback' => $feedback
    ];
}

echo json_encode(['success' => true, 'interacciones' => $interacciones]);
?>