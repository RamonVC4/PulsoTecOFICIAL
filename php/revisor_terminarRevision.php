<?php
require_once 'db.php';
session_start();

//obtengo el JSON con las respuestas de la rubrica
$data = json_decode(file_get_contents("php://input"), true);
$respuestas = $data['formObj'];
$respuestasComoJSONString = json_encode($respuestas);

//consigo la id del proyecto
$idProyecto = $_SESSION['idProyecto'];

//actualizo las respuestas en la base de datos
$stmtRevisorProyecto = $conn->prepare("UPDATE revisor_proyecto SET terminado = 1, datos = ? WHERE idRevisor = ? AND idProyecto = ?");//TODO CAMBIAR TERMINADO A 1
$stmtRevisorProyecto->bind_param("sii", $respuestasComoJSONString, $_SESSION['user_id'], $idProyecto);
$stmtRevisorProyecto->execute();

//ahora tengo que crear una entrega para la revision SOLO EN CASO DE QUE NO FUERA ACEPTADA
if ($respuestas['dictamen'] !== "aceptar_sin_cambios"){
    //checo si es la primera entrega
    $stmtEntrega = $conn->prepare("SELECT COUNT(*) as entregaCount FROM entrega WHERE idProyecto = ?");
    $stmtEntrega->bind_param("i", $idProyecto);
    $stmtEntrega->execute();
    $resultEntrega = $stmtEntrega->get_result();
    $rowEntrega = $resultEntrega->fetch_assoc();

    //var_dump($rowEntrega);
    if($rowEntrega['entregaCount'] == 1){
        //creo la segunda entrega
        $stmtProyecto = $conn->prepare("INSERT INTO entrega (idProyecto, numeroEntrega, pdfPath, entregado, aceptado, fechaLimite) VALUES (?, 2, NULL, 0, NULL, DATE_ADD(CURDATE(), INTERVAL 7 DAY))");//TODO tengo que poner la fecha limite bien
        $stmtProyecto->bind_param("i", $idProyecto);
        $stmtProyecto->execute();
        
        //checo que si se haya creado bien
        if($stmtProyecto->affected_rows == 0){
            echo json_encode(['success' => false, 'message' => 'Error al crear la segunda entrega.']);
            exit;
        }

        $rowDeProyecto = $resultEntrega->fetch_assoc();
    }else{
        //si esta es la segunda entrega, actualizo los estados en NO ACEPTADO
        $stmtProyecto = $conn->prepare("UPDATE entrega SET aceptado = 0 WHERE idProyecto = ? AND aceptado IS NULL");//si es la segunda entrega, solo habra uno con NULL
        $stmtProyecto->bind_param("i", $idProyecto);
        $stmtProyecto->execute();

        //checo que si se haya creado bien
        if($stmtProyecto->affected_rows == 0){
            echo json_encode(['success' => false, 'message' => 'Error al crear la segunda entrega.']);
            exit;
        }
    }
}else{
    //guardo en el proyecto que ya fue aceptado
    $stmtProyecto = $conn->prepare("UPDATE entrega SET aceptado = 1 WHERE idProyecto = ? AND aceptado is NULL");//si es la primera entrega, solo habra uno y tendra NULL, si no es, habra dos, pero solo la segunda todavia tendrá NULL
    $stmtProyecto->bind_param("i", $idProyecto);
    $stmtProyecto->execute();
}

echo json_encode(['success' => true]);
?>