<?php
    //consigo el rol, token y password
    require_once 'db.php';
    $data = json_decode(file_get_contents('php://input'),true);
    $rol = $data['rol'];
    $hashToken = hash("sha256",$data['token']);
    $newPassword = $data['newPassword'];

    //evito SQL injection
    $rolesValidos = ["manager", "revisor", "autor"];
    if(!in_array($rol, $rolesValidos)){
        http_response_code(400);
        echo json_encode(["status"=>"error"]);
        exit;
    }

    //actualizo la bdd
    q("UPDATE $rol rol join tokens t ON rol.correo = t.correo SET rol.contra = ? WHERE hashToken = ?" , "ss",[$newPassword,$hashToken]);        

    echo json_encode(["status" => "ok"]);

    //elimino el token para invalidarlo
    q("DELETE FROM tokens WHERE hashToken = ?","s",[$hashToken]);
?>