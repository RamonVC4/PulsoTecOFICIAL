<?php
    require_once 'db.php';
    session_start();
    
    $nuevaAreaRecibida = json_decode(file_get_contents('php://input'),true);
    $idRevisor = $_SESSION['user_id'];

    $idArea = $nuevaAreaRecibida['idArea'];

    q("INSERT INTO revisor_areaDeConocimiento (idRevisor,idAreaDeConocimiento) VALUES (?,?);", "ii", [$idRevisor,$idArea]);
?>