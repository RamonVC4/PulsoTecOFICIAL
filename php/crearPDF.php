<?php
require __DIR__ . '/../vendor/autoload.php';

use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\Settings;

function crearPDF($tempFile, $outputPDF) {
    try {

        // Registrar el renderer PDF (Dompdf)
        Settings::setPdfRendererName(Settings::PDF_RENDERER_DOMPDF);
        Settings::setPdfRendererPath(__DIR__ . '/../vendor/dompdf/dompdf');

        // Cargar DOCX
        $phpWord = IOFactory::load($tempFile);

        // Crear PDF
        $pdfWriter = IOFactory::createWriter($phpWord, 'PDF');
        $pdfWriter->save($outputPDF);

    } catch (Exception $e) {
        echo "Error: " . $e->getMessage();
    }
}
?>
