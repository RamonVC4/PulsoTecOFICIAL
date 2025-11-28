<?php
require_once 'db.php';
session_start();

//obtengo el JSON con las respuestas de la rubrica
$data = json_decode(file_get_contents("php://input"), true);
$respuestas = $data['formObj'];
$respuestasComoJSONString = json_encode($respuestas);

//consigo la id del proyecto
$idProyecto = $_SESSION['idProyecto'];

//consigo la id de la ultima entrega
$stmtEntrega = $conn->prepare("SELECT id FROM entrega WHERE idProyecto = ? ORDER BY id DESC LIMIT 1");
$stmtEntrega->bind_param("i", $idProyecto);
$stmtEntrega->execute();
$resultEntrega = $stmtEntrega->get_result();
$rowEntrega = $resultEntrega->fetch_assoc();
$idEntrega = $rowEntrega['id'];

//actualizo las respuestas en la base de datos
$stmtRevisorProyecto = $conn->prepare("UPDATE revisor_proyecto SET terminado = 1, datos = ? WHERE idRevisor = ? AND idProyecto = ? AND idEntrega = ?");//TODO CAMBIAR TERMINADO A 1
$stmtRevisorProyecto->bind_param("siii", $respuestasComoJSONString, $_SESSION['user_id'], $idProyecto, $idEntrega);
$stmtRevisorProyecto->execute();

$seLlegoAUnVeredicto = false;

//checo si es la primera entrega
$stmtEntrega = $conn->prepare("SELECT COUNT(*) as entregaCount FROM entrega WHERE idProyecto = ?");
$stmtEntrega->bind_param("i", $idProyecto);
$stmtEntrega->execute();
$resultEntrega = $stmtEntrega->get_result();
$rowEntrega = $resultEntrega->fetch_assoc();

//ahora tengo que crear una entrega para la revision SOLO EN CASO DE QUE NO FUERA ACEPTADA
if ($respuestas['dictamen'] === "no_recomendar"){

    //actualizo revisor_veredicto
    $stmtRevisorVeredicto = $conn->prepare("UPDATE revisor_veredicto SET status = 0 WHERE idRevisor = ? AND idProyecto = ?");
    $stmtRevisorVeredicto->bind_param("ii", $_SESSION['user_id'], $idProyecto);
    $stmtRevisorVeredicto->execute();
    
    $seLlegoAUnVeredicto = true;
}else if ($respuestas['dictamen'] === "aceptar_sin_cambios"){
    //guardo en el proyecto que ya fue aceptado
    $stmtProyecto = $conn->prepare("UPDATE entrega SET aceptado = 1 WHERE idProyecto = ? AND aceptado is NULL");//si es la primera entrega, solo habra uno y tendra NULL, si no es, habra dos, pero solo la segunda todavia tendrá NULL
    $stmtProyecto->bind_param("i", $idProyecto);
    $stmtProyecto->execute();

    //actualizo revisor_veredicto
    $stmtRevisorVeredicto = $conn->prepare("UPDATE revisor_veredicto SET status = 1 WHERE idRevisor = ? AND idProyecto = ?");
    $stmtRevisorVeredicto->bind_param("ii", $_SESSION['user_id'], $idProyecto);
    $stmtRevisorVeredicto->execute();

    $seLlegoAUnVeredicto = true;
}else{
    if($rowEntrega['entregaCount'] == 1){
        //creo la segunda entrega
        // $stmtProyecto = $conn->prepare("INSERT INTO entrega (idProyecto, numeroEntrega, pdfPath, entregado, aceptado, fechaLimite) VALUES (?, 2, NULL, 0, NULL, DATE_ADD(CURDATE(), INTERVAL 7 DAY))");//TODO tengo que poner la fecha limite bien
        // $stmtProyecto->bind_param("i", $idProyecto);
        // $stmtProyecto->execute();
        
        //checo que si se haya creado bien
        // if($stmtProyecto->affected_rows == 0){
        //     echo json_encode(['success' => false, 'message' => 'Error al crear la segunda entrega.']);
        //     exit;
        // }

        // $rowDeProyecto = $resultEntrega->fetch_assoc();
    }else{
        //guardo en revisor_veredicto no aceptado porque ya fue la segunda entrega
        $stmtRevisorVeredicto2daEntrega = $conn->prepare("UPDATE revisor_veredicto SET status = 0 WHERE idRevisor = ? AND idProyecto = ?");
        $stmtRevisorVeredicto2daEntrega->bind_param("ii", $_SESSION['user_id'], $idProyecto);
        $stmtRevisorVeredicto2daEntrega->execute();

        $seLlegoAUnVeredicto = true;
    }
}

//si se llegó a un veredicto tengo que checar si ya hay 2 de tres revisadas para elegir si pasa o no
if($seLlegoAUnVeredicto){
    $stmtRevisorVeredicto = $conn->prepare("SELECT status FROM revisor_veredicto WHERE idProyecto = ? AND status IS NOT NULL");
    $stmtRevisorVeredicto->bind_param("i", $idProyecto);
    $stmtRevisorVeredicto->execute();
    $resultRevisorVeredicto = $stmtRevisorVeredicto->get_result();

    $aFavor = 0;
    $enContra = 0;
    while ($rowRevisorVeredicto = $resultRevisorVeredicto->fetch_assoc()) {
        if ($rowRevisorVeredicto['status'] == 1) {
            $aFavor++;   
        }else if ($rowRevisorVeredicto['status'] == 0) {
            $enContra++;
        }
    }

    if($aFavor >=2){
        $stmtProyecto = $conn->prepare("UPDATE entrega SET aceptado = 1 WHERE idProyecto = ?;");
        $stmtProyecto->bind_param("i", $idProyecto);
        $stmtProyecto->execute();
    }else if ($enContra >= 2){
        $stmtProyecto = $conn->prepare("UPDATE entrega SET aceptado = 0 WHERE idProyecto = ?;");
        $stmtProyecto->bind_param("i", $idProyecto);
        $stmtProyecto->execute();
    }
}

echo json_encode(['success' => true]);
?>