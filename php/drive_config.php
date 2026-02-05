<?php
/**
 * Configuración de Google Drive con OAuth
 */

// ID de la carpeta "PULSOTEC" en Google Drive
define('DRIVE_FOLDER_ID', '1KCsuyqyn6G6YQdnhRRKeJUuFcPbrSCv6');

// Ruta al archivo de credenciales OAuth (se creará después de autenticarse)
define('DRIVE_TOKEN_PATH', __DIR__ . '/../drive_token.json');

// Ruta al archivo de credenciales OAuth de la aplicación
// Necesitas crear esto en Google Cloud Console > APIs & Services > Credentials
// Tipo: OAuth 2.0 Client ID (aplicación web)
define('DRIVE_CREDENTIALS_PATH', __DIR__ . '/../drive_credentials.json');

?>
