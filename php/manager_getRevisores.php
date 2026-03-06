<?php
require_once 'db.php';
header('Content-Type: application/json');

// Seleccionamos id y correo de todos los revisores
$sql = "SELECT id, correo FROM revisor";
$result = $conn->query($sql);

$revisores = [];
while ($row = $result->fetch_assoc()) {
    //conseguimos las ids de las areas que tiene registradas el revisor
    //TODO: esto es ineficiente, deberia ser un solo join que traiga las areas al mismo tiempo
    $idAreasResult = q("SELECT idAreaDeConocimiento from revisor_areaDeConocimiento ra JOIN revisor r on r.id = ra.idRevisor where r.id = ?", "i", [$row['id']]);

    $areas = [];
    while ($area = $idAreasResult->fetch_assoc()) {
        $areas[] = $area['idAreaDeConocimiento'];
    }

    $revisores[] = [
        'id' => $row['id'],
        'name' => $row['correo'], // Usamos el correo como nombre
        'email' => $row['correo'],
        'expertise' => ['General'], // Dato dummy pq no está en la BD
        'areas' => $areas
    ];
}

echo json_encode(['success' => true, 'revisores' => $revisores]);
?>