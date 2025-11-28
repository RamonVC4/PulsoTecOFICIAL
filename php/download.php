<?php
require '../vendor/autoload.php';

function descargarArchivo() {
    $files = $service->files->listFiles([
        'q' => "'17ICY9PdAoHDVAF_JT8lSLJO-BdLyjAFO' in parents",
        'fields' => 'files(id, name)',
        'pageSize' => 50
    ]);

    foreach ($files->getFiles() as $file) {
        echo $file->name . " — ID: " . $file->id . "<br>";
    }
    //$fileId = 'ID_DEL_ARCHIVO'; // ID del archivo a descargar

    //$content = $service->files->get($fileId, ['alt' => 'media']);
    //file_put_contents('descargado.pdf', $content->getBody()->getContents());

    //echo "Archivo descargado como descargado.pdf";
}
?>