<?php
require_once __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function enviarCorreo($cuerpo,$destinatario){
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'soporte.pulsotec.sirec@gmail.com';
        $mail->Password = 'gmqj ucde dzez ifas';
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        $mail->setFrom('soporte.pulsotec.sirec@gmail.com', 'SIREC');
        $mail->addAddress($destinatario);

        $mail->Subject = 'Recuperacion de cuenta';

        $mail->Body = $cuerpo;

        $mail->send();
    } catch (Exception $e) {
        error_log('Error enviando correo: ' . $e->getMessage());
    }
}
?>
