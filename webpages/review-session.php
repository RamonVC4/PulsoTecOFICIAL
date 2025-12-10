<?php require_once '../php/protect_revisor.php'; ?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Revisión de documento</title>
    <link rel="stylesheet" href="../styles/styles_general.css">
    <link rel="stylesheet" href="../styles/styles_revisor.css">
    <link rel="stylesheet" href="../styles/styles_review_session.css">


</head>
<body>
    <!-- HEADER PRINCIPAL -->
    <header class="site-header">
        <div class="header-top">
            <div class="container">
                <div class="logo-text">PT</div>
                <h1 class="title">PULSO<span class="gold">TEC</span></h1>
            </div>
        </div>
        <nav class="nav-bar">
            <div class="container">
                <ul class="nav-list">
                    <li><a href="../Index.html">INICIO</a></li>
                    <li><a href="./revisor.php">BANDEJA</a></li>
                    <!-- <li><a href="#">AYUDA</a></li> -->
                    <li class="login"><a href="./login.html">CERRAR SESIÓN</a></li>
                </ul>
            </div>
        </nav>
    </header>

<!-- <div class="pruebaVisor">
</div> -->



    <!-- HEADER SECUNDARIO -->
    <main class="container container-review review-session-main">
        <header class="session-head">
            <div class="session-context">
                <a class="back-link" href="./revisor.php">← Regresar al panel</a>
                <h2 id="doc-title">Documento sin título</h2>
            </div>
            <div class="session-actions">
                <button type="button" class="btn-secondary" id="download-btn">Descargar PDF</button>
                <button type="button" class="btn-primary" id="toggle-rubric">Abrir rúbrica</button>
            </div>
        </header>

        <div class="session-layout" id="session-layout">
            
            <section class="document-viewer" aria-label="Visualización del documento">
                <iframe
                    id="visorPDF"
                    src=""
                    width="100%"
                    height="800"
                    frameborder="0"
                    allow="autoplay">
                </iframe>
            </section>

            

            <aside class="rubric-panel" id="rubric-panel" aria-label="Rúbrica de evaluación">

                <!-- FORMULARIO DE RÚBRICA -->
                <form id="rubric-form" class="rubric-form" method="post" novalidate>
                    <input type="hidden" name="documentId" id="rubric-doc-id" value="">

                    <!-- CABECERA -->
                    <div class="rubric-head">
                        <h3>Evaluación de Artículo de Revista PulsoTec</h3>
                        <button type="button" class="btn-close" id="close-rubric" aria-label="Cerrar rúbrica">×</button>
                    </div>
                    

                    <!-- RÚBRICA -->
                    <!-- RECOMENDACIONES INICIALES -->
                    <section class="rubric-section">
                        <h4>I. Criterios Iniciales</h4>
                        <fieldset class="recommendations">
                            <legend>Seleccione aquellas que apliquen al documento</legend>
                            <label class="check-pill"><input type="checkbox" name="observaciones[]" value="extension"><span>No cumple con la extensión (12 a 20 cuartillas)</span></label>
                            <label class="check-pill"><input type="checkbox" name="observaciones[]" value="formato_revista"><span>No cumple con el formato y estructura de la revista</span></label>
                            <label class="check-pill"><input type="checkbox" name="observaciones[]" value="errores_tipograficos"><span>Abundantes errores tipográficos, de ortografía y gramaticales</span></label>
                            <label class="check-pill"><input type="checkbox" name="observaciones[]" value="referencias"><span>No cumple con el formato de las referencias</span></label>
                        </fieldset>
                    </section>

                    <!-- ASPECTOS A EVALUAR -->
                    <section class="rubric-section">
                        <h4>I. Según la revisión que hizo del documento, conteste los siguientes criterios</h4>
                        <p class="muted small">Marque con una opción por criterio. Los criterios no evaluados se ponderarán con una calificación de cero.</p>
                        <div class="table-wrapper">
                            <table class="rubric-table">
                                <thead>
                                    <tr>
                                        <th scope="col">Aspectos a evaluar</th>
                                        <th scope="col">Excelente</th>
                                        <th scope="col">Bueno</th>
                                        <th scope="col">Regular</th>
                                        <th scope="col">Deficiente</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row"><span class="rubric-index">1</span> Originalidad del trabajo</th>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto01" value="excelente"><span>Excelente</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto01" value="bueno"><span>Bueno</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto01" value="regular"><span>Regular</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto01" value="deficiente"><span>Deficiente</span></label></td>
                                    </tr>
                                    <tr>
                                        <th scope="row"><span class="rubric-index">2</span> Originalidad en el tratamiento de la temática</th>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto02" value="excelente"><span>Excelente</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto02" value="bueno"><span>Bueno</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto02" value="regular"><span>Regular</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto02" value="deficiente"><span>Deficiente</span></label></td>
                                    </tr>
                                    <tr>
                                        <th scope="row"><span class="rubric-index">3</span> Redacción y claridad del texto</th>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto03" value="excelente"><span>Excelente</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto03" value="bueno"><span>Bueno</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto03" value="regular"><span>Regular</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto03" value="deficiente"><span>Deficiente</span></label></td>
                                    </tr>
                                    <tr>
                                        <th scope="row"><span class="rubric-index">4</span> Congruencia entre título, contenido y conclusiones</th>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto04" value="excelente"><span>Excelente</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto04" value="bueno"><span>Bueno</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto04" value="regular"><span>Regular</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto04" value="deficiente"><span>Deficiente</span></label></td>
                                    </tr>
                                    <tr>
                                        <th scope="row"><span class="rubric-index">5</span> Calidad técnica y científica</th>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto05" value="excelente"><span>Excelente</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto05" value="bueno"><span>Bueno</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto05" value="regular"><span>Regular</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto05" value="deficiente"><span>Deficiente</span></label></td>
                                    </tr>
                                    <tr>
                                        <th scope="row"><span class="rubric-index">6</span> Relevancia y actualidad del tema</th>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto06" value="excelente"><span>Excelente</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto06" value="bueno"><span>Bueno</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto06" value="regular"><span>Regular</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto06" value="deficiente"><span>Deficiente</span></label></td>
                                    </tr>
                                    <tr>
                                        <th scope="row"><span class="rubric-index">7</span> Importancia dentro del área</th>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto07" value="excelente"><span>Excelente</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto07" value="bueno"><span>Bueno</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto07" value="regular"><span>Regular</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto07" value="deficiente"><span>Deficiente</span></label></td>
                                    </tr>
                                    <tr>
                                        <th scope="row"><span class="rubric-index">8</span> Facilidad para leer y entender</th>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto08" value="excelente"><span>Excelente</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto08" value="bueno"><span>Bueno</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto08" value="regular"><span>Regular</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto08" value="deficiente"><span>Deficiente</span></label></td>
                                    </tr>
                                    <tr>
                                        <th scope="row"><span class="rubric-index">9</span> Potencial del trabajo para ser citado</th>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto09" value="excelente"><span>Excelente</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto09" value="bueno"><span>Bueno</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto09" value="regular"><span>Regular</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto09" value="deficiente"><span>Deficiente</span></label></td>
                                    </tr>
                                    <tr>
                                        <th scope="row"><span class="rubric-index">10</span> Conveniencia para la revista</th>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto10" value="excelente"><span>Excelente</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto10" value="bueno"><span>Bueno</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto10" value="regular"><span>Regular</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto10" value="deficiente"><span>Deficiente</span></label></td>
                                    </tr>
                                    <tr>
                                        <th scope="row"><span class="rubric-index">11</span> Pertinencia de las tablas</th>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto11" value="excelente"><span>Excelente</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto11" value="bueno"><span>Bueno</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto11" value="regular"><span>Regular</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto11" value="deficiente"><span>Deficiente</span></label></td>
                                    </tr>
                                    <tr>
                                        <th scope="row"><span class="rubric-index">12</span> Pertinencia de las figuras</th>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto12" value="excelente"><span>Excelente</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto12" value="bueno"><span>Bueno</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto12" value="regular"><span>Regular</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto12" value="deficiente"><span>Deficiente</span></label></td>
                                    </tr>
                                    <tr>
                                        <th scope="row"><span class="rubric-index">13</span> Calidad de las figuras</th>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto13" value="excelente"><span>Excelente</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto13" value="bueno"><span>Bueno</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto13" value="regular"><span>Regular</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto13" value="deficiente"><span>Deficiente</span></label></td>
                                    </tr>
                                    <tr>
                                        <th scope="row"><span class="rubric-index">14</span> Uso actualizado de fuentes bibliográficas</th>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto14" value="excelente"><span>Excelente</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto14" value="bueno"><span>Bueno</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto14" value="regular"><span>Regular</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto14" value="deficiente"><span>Deficiente</span></label></td>
                                    </tr>
                                    <tr>
                                        <th scope="row"><span class="rubric-index">15</span> Congruencia entre aparato crítico y extensión del trabajo</th>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto15" value="excelente"><span>Excelente</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto15" value="bueno"><span>Bueno</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto15" value="regular"><span>Regular</span></label></td>
                                        <td><label class="radio-pill"><input type="radio" name="aspecto15" value="deficiente"><span>Deficiente</span></label></td>
                                    </tr>
                                    <tr>
                                        <th scope="row"><span class="rubric-index">16</span> Calificación global en la escala del 1 al 10</th>
                                        <td colspan="4">
                                            <div class="global-score">
                                                <label for="global-score-input">Puntaje</label>
                                                <input id="global-score-input" name="calificacion_global" type="number" min="1" max="10" step="0.1" placeholder="Ej. 8.5">
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <!-- DICTAMEN -->
                    <section class="rubric-section">
                        <h4>II. Según su dictamen, el trabajo debería ser</h4>
                        <div class="recommendations-grid">
                            <fieldset class="recommendations">
                                <legend>Recomendaciones del árbitro</legend>
                                <label class="check-pill"><input type="radio" name="dictamen" value="aceptar_sin_cambios"><span>Aceptar en su condición actual</span></label>
                                <label class="check-pill"><input type="radio" name="dictamen" value="aceptar_cambios_menores"><span>Aceptar con cambios menores (indicarlos)</span></label>
                                <label class="check-pill"><input type="radio" name="dictamen" value="aceptar_sujeto_correcciones"><span>Aceptar sujeto a correcciones (según observaciones)</span></label>
                                <label class="check-pill"><input type="radio" name="dictamen" value="no_recomendar"><span>No se recomienda publicar (justificar debidamente)</span></label>
                            </fieldset>
                        </div>
                    </section>

                    <!-- JUSTIFICACIÓN -->
                    <section class="rubric-section">
                        <h4>III. Justifique su decisión</h4>
                        <div class="comments-area">
                            <label for="comentarios-autores">Comentarios para los autores (Con el fin de mejorar la calidad del manuscrito)</label>
                            <textarea id="comentarios-autores" name="comentarios_autores" rows="5" placeholder="Escriba observaciones, sugerencias y recomendaciones puntuales."></textarea>
                        </div>
                    </section>

                    <!-- BOTONES -->
                    <div class="rubric-actions">
                        <button type="button" id="save-draft" onclick="terminarRevision(false)" class="btn-secondary">Guardar borrador</button>
                        <button type="button" onclick="terminarRevision(true)" class="btn-primary">Enviar dictamen</button>
                    </div>
                </form>
            </aside>
        </div>
    </main>

    <!-- SCRIPT PARA CARGAR LA RÚBRICA -->
    <script src="../pages/script_review-session.js"></script>
</body>
</html>

