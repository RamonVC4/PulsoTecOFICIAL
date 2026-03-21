<?php
require_once 'db.php';
$data = json_decode(file_get_contents('php://input'),true);

$rol = $data['rol'];
//consigo los correos de la bdd
$result = q("SELECT id FROM $rol WHERE correo = ? ", "s", [$data['correo']]);

$res = ['ok' => True, 'registrado' => False];
if ($result->num_rows != 0){
    $res['registrado'] = True;
}

echo json_encode($res);
?>