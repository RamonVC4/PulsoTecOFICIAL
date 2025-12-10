<?php
/**
 * Página para autenticarse con Google Drive usando OAuth
 * 
 * Instrucciones:
 * 1. Visita esta página en tu navegador: http://localhost:8888/pulsotec/PulsoTecOFICIAL/php/drive_auth.php
 * 2. Se te pedirá que inicies sesión con tu cuenta de Google
 * 3. Autoriza el acceso a Google Drive
 * 4. El token se guardará automáticamente
 */

require_once __DIR__ . '/drive_config.php';
require_once __DIR__ . '/../vendor/autoload.php';

use Google\Client;
use Google\Service\Drive;

$client = new Client();

// Cargar credenciales OAuth
$credentialsPath = DRIVE_CREDENTIALS_PATH;

if (!file_exists($credentialsPath)) {
    die('Error: No se encontró el archivo de credenciales OAuth. Necesitas crear drive_credentials.json. Ver CONFIGURACION_OAUTH.md');
}

$client->setAuthConfig($credentialsPath);
$client->addScope(Drive::DRIVE);
$client->setAccessType('offline');
$client->setPrompt('select_account consent');

// URL de redirección (debe coincidir con la configurada en Google Cloud Console)
$redirectUri = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . 
               "://" . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . '/drive_auth.php';
$client->setRedirectUri($redirectUri);

// Si recibimos un código de autorización
if (isset($_GET['code'])) {
    $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);
    $client->setAccessToken($token);
    
    // Guardar el token
    if (!file_exists(dirname(DRIVE_TOKEN_PATH))) {
        mkdir(dirname(DRIVE_TOKEN_PATH), 0700, true);
    }
    file_put_contents(DRIVE_TOKEN_PATH, json_encode($token));
    
    echo '<h1>¡Autenticación exitosa!</h1>';
    echo '<p>El token se ha guardado correctamente. Ahora puedes subir archivos a Google Drive.</p>';
    echo '<p><a href="../webpages/author.html">Volver a la aplicación</a></p>';
    exit;
}

// Si hay un error
if (isset($_GET['error'])) {
    die('Error de autorización: ' . htmlspecialchars($_GET['error']));
}

// Si no hay token, redirigir a Google para autenticarse
if (!file_exists(DRIVE_TOKEN_PATH)) {
    $authUrl = $client->createAuthUrl();
    header('Location: ' . filter_var($authUrl, FILTER_SANITIZE_URL));
    exit;
}

// Si ya hay token, verificar que sea válido
$token = json_decode(file_get_contents(DRIVE_TOKEN_PATH), true);
$client->setAccessToken($token);

if ($client->isAccessTokenExpired()) {
    if ($client->getRefreshToken()) {
        $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
        file_put_contents(DRIVE_TOKEN_PATH, json_encode($client->getAccessToken()));
        echo '<h1>Token actualizado</h1>';
        echo '<p>El token se ha refrescado correctamente.</p>';
    } else {
        // Necesita re-autenticarse
        $authUrl = $client->createAuthUrl();
        header('Location: ' . filter_var($authUrl, FILTER_SANITIZE_URL));
        exit;
    }
} else {
    echo '<h1>Ya estás autenticado</h1>';
    echo '<p>El token es válido. Puedes subir archivos a Google Drive.</p>';
}

echo '<p><a href="../webpages/author.html">Volver a la aplicación</a></p>';

?>
