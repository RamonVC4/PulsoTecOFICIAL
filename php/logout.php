<?php
/**
 * Cierra la sesión del usuario y redirige al login
 */
session_start();
session_destroy();
header('Location: ../webpages/login.php');
exit;
?>

