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

    $interacciones[] = [
        'revisor_id' => $row['revisor_id'],
        'revisor_email' => $row['revisor_correo'],
        'terminado' => $row['terminado'] == 1, // Convertimos a booleano real
        'fecha_limite' => $row['fechaLimite'],
        'feedback' => $feedback
    ];
}

echo json_encode(['success' => true, 'interacciones' => $interacciones]);
?>