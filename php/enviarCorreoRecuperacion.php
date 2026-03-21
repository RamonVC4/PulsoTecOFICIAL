<?php
require_once 'db.php';
require_once 'utils.php';

    //consigo los datos del json
    session_start();
    $data = json_decode(file_get_contents('php://input'),true);
    $rol = $data['rol'];
    $rolesValidos = ["manager", "revisor", "autor"];

    //evito SQL injection
    if(!in_array($rol, $rolesValidos)){
        http_response_code(400);
        echo json_encode(["status"=>"error"]);
        exit;
    }

    //me fijo si existe el correo registrado en la BDD
    $resultado = q("SELECT id FROM $rol WHERE correo = ?;","s",[$data['correo']]);
    
    //si si existe
    if($resultado->num_rows != 0){
        //elimino cualquier token ya existente
        q("DELETE FROM tokens WHERE rol = ? AND correo = ?","ss", [$rol,$data['correo']]);
        //meto nuevo token
        $token = bin2hex(random_bytes(32));
        q(
            "INSERT INTO tokens (rol,correo,hashtoken,expira) VALUES (?,?,?,NOW() + INTERVAL 15 MINUTE)",
            "sss",
            [$rol,$data['correo'],hash('sha256',$token)]);
        //envio correo de recuperacion        
        enviarCorreo("Una solicitud de cambio de contraseña se recibió para su correo, puede hacerlo siguiendo el siguiente link\n sirec.itlalaguna.edu.mx/webpages/cambiarContra.php?token=$token&rol=$rol \n\n si no fue usted, ignore este correo",
                    $data['correo']);
    }
    //si no existe
    else{
        //envio correo de que oye, trataron de meterse a tu 
        //  cuenta pero no estas registrado    
        enviarCorreo("Una solicitud de cambiar contraseña se hizo con su correo, pero usted no esta registrado como $rol \n si no fué usted, ignore este correo",
            $data['correo']);   
    }

    echo json_encode(["status" => "ok"]);
?>