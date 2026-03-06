<?php
    require_once 'db.php';
    session_start();

    header("Content-Type: application/json");

    $nuevaAreaRecibida = json_decode(file_get_contents('php://input'),true);

    if (!$nuevaAreaRecibida || !isset($nuevaAreaRecibida['idArea'])) {
        echo json_encode([
            "status" => "error",
            "message" => "idArea not provided"
        ]);
        exit;
    }

    $idRevisor = $_SESSION['user_id'];
    $idArea = $nuevaAreaRecibida['idArea'];

    q("DELETE FROM revisor_areaDeConocimiento where idRevisor = ? and idAreaDeConocimiento = ?", "ii", [$idRevisor, $idArea]);

    echo json_encode([
    "status" => "ok"
]);
?>