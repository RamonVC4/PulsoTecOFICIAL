<?php
    require_once 'db.php';
    session_start();
    
    $idRevisor = $_SESSION['user_id'];

    $areasDesdeSQL = q("SELECT idAreaDeConocimiento, nombre from revisor_areaDeConocimiento join areaDeConocimiento on areaDeConocimiento.id = revisor_areaDeConocimiento.idAreaDeConocimiento where idRevisor = ?","i",$idRevisor);
    echo json_encode(['areas' => $areasDesdeSQL])
?>