<?php
    require_once 'db.php';
    session_start();

    $idArea = json_decode(file_get_contents('php://input'), true);
    $idRevisor = $_SESSION['user_id'];

    q("DELETE FROM revisor_areaDeConocimiento where idRevisor = ? and idAreaDeConocimiento = ?", "ii", [$idRevisor, $idArea]);
?>