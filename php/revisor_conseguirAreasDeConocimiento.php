<?php
    require_once 'db.php';
    session_start();

    $idRevisor = $_SESSION['user_id'];

    $areasDesdeSQL = q(
    "SELECT idAreaDeConocimiento, nombre 
     FROM revisor_areaDeConocimiento 
     JOIN areaDeConocimiento 
     ON areaDeConocimiento.id = revisor_areaDeConocimiento.idAreaDeConocimiento 
     WHERE idRevisor = ?",
    "i",
    [$idRevisor]
);

$areas = [];

while ($row = $areasDesdeSQL->fetch_assoc()) {
    $areas[] = $row;
}

echo json_encode([
    "areas" => $areas
]);
?>
