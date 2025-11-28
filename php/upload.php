<?php
require '../vendor/autoload.php';

function subirArchivo($filePath){
    // Crear cliente con la cuenta de servicio
    $client = new Google_Client();
    $client->setAuthConfig('../js/service-account.json');
    $client->addScope(Google_Service_Drive::DRIVE);

    $service = new Google_Service_Drive($client);

    // Archivo a subir
    $filePath = "documento.pdf";

    // Metadatos del archivo
    $fileMetadata = new Google_Service_Drive_DriveFile([
        'name' => 'test.docx',             // Nombre en Drive
        'parents' => ['17ICY9PdAoHDVAF_JT8lSLJO-BdLyjAFO']         // Carpeta donde se sube
    ]);

    // Subir el archivo
    $file = $service->files->create(
        $fileMetadata,
        [
            'data' => file_get_contents($filePath),
            'mimeType' => mime_content_type($filePath),
            'uploadType' => 'multipart'
        ]
    );
}
echo "Archivo subido con ID: " . $file->id;
?>