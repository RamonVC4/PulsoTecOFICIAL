<?php
require_once 'db.php';

//leo del json que me mandan
$data = json_decode(file_get_contents("php://input"), true);
$cuerpo = $data;
$tabla = $data['role'];

//hago el insert porque se supone que ya verifiqué todo 
if($tabla == 'revisor'){
    $stmt = $conn->prepare("INSERT INTO revisor (nombre, correo, contra, primerApellido, segundoApellido, CURP, areaDeConocimiento) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssssssss", $cuerpo['name'], $cuerpo['email'], password_hash($cuerpo['password'], PASSWORD_DEFAULT), $cuerpo['apellidoPaterno'], $cuerpo['apellidoMaterno'], $cuerpo['curp'], $cuerpo['areaDeConocimiento']);
}
else{
    $stmt = $conn->prepare("INSERT INTO autor (nombre, correo, contra, primerApellido, segundoApellido, institucion, ORCID, estado, ciudad, calle, numeroDeCalle, colonia) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssssssss", $cuerpo['name'], $cuerpo['email'], password_hash($cuerpo['password'], PASSWORD_DEFAULT), $cuerpo['apellidoPaterno'], $cuerpo['apellidoMaterno'], $cuerpo['institucion'], $cuerpo['orcid'], $cuerpo['estado'], $cuerpo['ciudad'], $cuerpo['calle'], $cuerpo['numCalle'], $cuerpo['colonia']);
}
    
$stmt->execute();
?>