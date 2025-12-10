<?php
/**
 * Configuración de Google Drive con OAuth
 * 
 * Los archivos se subirán a la carpeta "PULSOTEC" usando OAuth con tu cuenta:
 * alu.23130568@correo.itlalaguna.edu.mx
 */

// ID de la carpeta "PULSOTEC" en Google Drive
define('DRIVE_FOLDER_ID', '1zwIPD1kZc5SyXuhRgsGgSupHi9E2GO_Y');

// Ruta al archivo de credenciales OAuth (se creará después de autenticarse)
define('DRIVE_TOKEN_PATH', __DIR__ . '/../drive_token.json');

// Ruta al archivo de credenciales OAuth de la aplicación
// Necesitas crear esto en Google Cloud Console > APIs & Services > Credentials
// Tipo: OAuth 2.0 Client ID (aplicación web)
define('DRIVE_CREDENTIALS_PATH', __DIR__ . '/../drive_credentials.json');

?>
