<?php
/**
 * Función para subir archivos a Google Drive usando OAuth
 * Retorna la URL pública del archivo para visualización en PDF
 */

require_once __DIR__ . '/../vendor/autoload.php';

use Google\Client;
use Google\Service\Drive;
use Google\Service\Drive\DriveFile;
use Google\Service\Drive\Permission;

function getDriveClient() {
    $client = new Client();
    
    // Cargar credenciales OAuth de la aplicación
    $credentialsPath = defined('DRIVE_CREDENTIALS_PATH') ? DRIVE_CREDENTIALS_PATH : __DIR__ . '/../drive_credentials.json';
    
    if (!file_exists($credentialsPath)) {
        return [
            'success' => false,
            'error' => 'Archivo de credenciales OAuth no encontrado. Necesitas crear drive_credentials.json. Ver CONFIGURACION_OAUTH.md'
        ];
    }
    
    $client->setAuthConfig($credentialsPath);
    $client->addScope(Drive::DRIVE);
    $client->setAccessType('offline');
    $client->setPrompt('select_account consent');
    
    // Cargar token si existe
    $tokenPath = defined('DRIVE_TOKEN_PATH') ? DRIVE_TOKEN_PATH : __DIR__ . '/../drive_token.json';
    
    if (file_exists($tokenPath)) {
        $accessToken = json_decode(file_get_contents($tokenPath), true);
        $client->setAccessToken($accessToken);
    }
    
    // Si el token expiró, refrescarlo
    if ($client->isAccessTokenExpired()) {
        if ($client->getRefreshToken()) {
            $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
            // Guardar el nuevo token
            if (!file_exists(dirname($tokenPath))) {
                mkdir(dirname($tokenPath), 0700, true);
            }
            file_put_contents($tokenPath, json_encode($client->getAccessToken()));
        } else {
            return [
                'success' => false,
                'error' => 'Token expirado. Necesitas autenticarte nuevamente. Visita: php/drive_auth.php'
            ];
        }
    }
    
    return ['success' => true, 'client' => $client];
}

function uploadToDrive($filePath, $fileName, $folderId = null) {
    // Si no se especifica folderId, intentar usar el de la configuración
    if ($folderId === null && defined('DRIVE_FOLDER_ID') && DRIVE_FOLDER_ID !== null) {
        $folderId = DRIVE_FOLDER_ID;
    }
    
    // Validar que tenemos un folderId
    if (!$folderId) {
        return [
            'success' => false,
            'error' => 'No se ha configurado el ID de la carpeta PULSOTEC. Por favor, configura DRIVE_FOLDER_ID en drive_config.php'
        ];
    }
    
    try {
        // Obtener cliente OAuth
        $clientResult = getDriveClient();
        if (!$clientResult['success']) {
            return $clientResult;
        }
        
        $client = $clientResult['client'];
        
        // Crear servicio de Drive
        $service = new Drive($client);
        
        // Verificar que la carpeta existe y tenemos acceso
        try {
            $folder = $service->files->get($folderId, [
                'fields' => 'id, name, mimeType',
                'supportsAllDrives' => true
            ]);
            if ($folder->getMimeType() !== 'application/vnd.google-apps.folder') {
                return [
                    'success' => false,
                    'error' => 'El ID proporcionado no corresponde a una carpeta'
                ];
            }
        } catch (Exception $e) {
            $errorMsg = $e->getMessage();
            
            // Detectar errores específicos de autenticación
            if (strpos($errorMsg, 'invalid_grant') !== false || strpos($errorMsg, 'Token has been expired') !== false) {
                return [
                    'success' => false,
                    'error' => 'Token de acceso expirado. Visita php/drive_auth.php para autenticarte nuevamente.'
                ];
            }
            
            if (strpos($errorMsg, 'storageQuotaExceeded') !== false || strpos($errorMsg, 'storage quota') !== false) {
                return [
                    'success' => false,
                    'error' => 'Error de cuota de almacenamiento. Verifica que tu cuenta de Google Drive tenga espacio disponible.'
                ];
            }
            
            return [
                'success' => false,
                'error' => 'No se pudo acceder a la carpeta PULSOTEC: ' . $errorMsg . '. Verifica que: 1) El ID de la carpeta sea correcto, 2) Estés autenticado correctamente (visita php/drive_auth.php)'
            ];
        }
        
        // Leer el archivo
        $fileContent = file_get_contents($filePath);
        
        if ($fileContent === false) {
            return [
                'success' => false,
                'error' => 'No se pudo leer el archivo'
            ];
        }
        
        // Determinar el tipo MIME
        $mimeType = mime_content_type($filePath);
        if (!$mimeType) {
            // Fallback según extensión
            $extension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
            $mimeTypes = [
                'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'doc' => 'application/msword',
                'pdf' => 'application/pdf'
            ];
            $mimeType = $mimeTypes[$extension] ?? 'application/octet-stream';
        }
        
        // Crear metadata del archivo
        $fileMetadata = new DriveFile([
            'name' => $fileName,
            'parents' => [$folderId] // Subir directamente a la carpeta PULSOTEC
        ]);
        
        // Subir el archivo a la carpeta compartida
        // Usar supportsAllDrives para trabajar con carpetas compartidas
        $file = $service->files->create($fileMetadata, [
            'data' => $fileContent,
            'mimeType' => $mimeType,
            'uploadType' => 'multipart',
            'fields' => 'id, webViewLink, webContentLink, name',
            'supportsAllDrives' => true
        ]);
        
        // Hacer el archivo público (cualquiera con el link puede verlo)
        $permission = new Permission([
            'type' => 'anyone',
            'role' => 'reader'
        ]);
        
        $service->permissions->create($file->getId(), $permission, [
            'supportsAllDrives' => true
        ]);
        
        // Obtener la URL pública para visualización como PDF
        // Google Drive puede mostrar DOCX como PDF usando el visor
        $fileId = $file->getId();
        
        // URL para visualización en iframe (convierte automáticamente a PDF)
        $viewUrl = "https://drive.google.com/file/d/{$fileId}/preview";
        
        // URL de descarga directa
        $downloadUrl = $file->getWebContentLink();
        
        return [
            'success' => true,
            'fileId' => $fileId,
            'viewUrl' => $viewUrl,  // URL para iframe (muestra como PDF)
            'downloadUrl' => $downloadUrl,  // URL de descarga
            'webViewLink' => $file->getWebViewLink()  // URL para abrir en Drive
        ];
        
    } catch (Exception $e) {
        return [
            'success' => false,
            'error' => $e->getMessage()
        ];
    }
}

/**
 * Función auxiliar para obtener el ID de un archivo desde su URL de Drive
 */
function getFileIdFromUrl($url) {
    // Si es una URL de preview: https://drive.google.com/file/d/FILE_ID/preview
    if (preg_match('/\/file\/d\/([a-zA-Z0-9_-]+)/', $url, $matches)) {
        return $matches[1];
    }
    // Si es una URL de webViewLink: https://drive.google.com/file/d/FILE_ID/view
    if (preg_match('/\/file\/d\/([a-zA-Z0-9_-]+)/', $url, $matches)) {
        return $matches[1];
    }
    return null;
}

/**
 * Convierte cualquier URL de Drive a URL de preview (para iframe)
 */
function convertToPreviewUrl($url) {
    $fileId = getFileIdFromUrl($url);
    if ($fileId) {
        return "https://drive.google.com/file/d/{$fileId}/preview";
    }
    return $url; // Si no se puede convertir, retorna la URL original
}

?>
