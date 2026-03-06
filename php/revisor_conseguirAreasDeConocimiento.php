<?php
    require_once 'db.php';
    session_start();

    $idRevisor = $_SESSION['user_id'];

<<<<<<< HEAD
    $areasDesdeSQL = q(
    "SELECT idAreaDeConocimiento, nombre 
     FROM revisor_areaDeConocimiento 
     JOIN areaDeConocimiento 
     ON areaDeConocimiento.id = revisor_areaDeConocimiento.idAreaDeConocimiento 
     WHERE idRevisor = ?",
    "i",
    [$idRevisor]
);

echo json_encode(['areas' => $areasDesdeSQL]);
?>
=======
    $areasDesdeSQL = q("SELECT idAreaDeConocimiento, nombre from revisor_areaDeConocimiento join areaDeConocimiento on areaDeConocimiento.id = revisor_areaDeConocimiento.idAreaDeConocimiento where idRevisor = ?","i",[$idRevisor]);
    echo json_encode(['areas' => $areasDesdeSQL])
?>
>>>>>>> origin
