<?php
require '../PHPMailer-master/src/PHPMailer.php';
require '../PHPMailer-master/src/SMTP.php';
require '../PHPMailer-master/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
function enviarCorreo($cuerpo,$destinatario){
    $mail = new PHPMailer(true);

        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'soporte.pulsotec.sirec@gmail.com';
        $mail->Password = 'gmqj ucde dzez ifas';
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;
        //$mail->SMTPDebug = 2;
        //$mail->Debugoutput = 'echo';

        $mail->setFrom('soporte.pulsotec.sirec@gmail.com', 'SIREC');
        $mail->addAddress($destinatario);

        $mail->Subject = 'Recuperacion de cuenta';

        $mail->Body = $cuerpo;

        $mail->send();
}
?>