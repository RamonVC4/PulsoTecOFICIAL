<?php
require_once 'upload.php';
require_once 'download.php';


$filePath = '../uploads/testword.docx';
subirArchivo($filePath);
descargarArchivo();

?>