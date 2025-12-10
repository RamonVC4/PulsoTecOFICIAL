<?php require_once '../php/protect_author.php'; ?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Autor - Panel principal</title>
    <link rel="stylesheet" href="../styles/styles_general.css">
    <link rel="stylesheet" href="../styles/styles_author.css">
</head>





<body>
    <header class="site-header">
        <!-- HEADER CON JS -->
    </header>


    <main class="container author-main">
        <!-- MIS PROYECTOS TITULO -->
        <section class="author-intro">
            <h2>Mis proyectos</h2>
            <p class="muted">Organiza tus entregas en proyectos. Cada proyecto resguarda la versión original del documento y la versión revisada después de recibir comentarios.</p>
        </section>


        <!-- GRID DE PROYECTOS -->
        <section class="author-grid">

            <!-- INICIAR NUEVO PROYECTO -->
            <article class="card new-project-card" aria-labelledby="new-project-title">
                <header class="card-head">
                    <h2 id="new-project-title">Iniciar nuevo proyecto</h2>
                    <p class="muted">Genera un espacio de trabajo y sube la primera versión de tu documento. Podrás adjuntar la revisión cuando recibas retroalimentación.</p>
                </header>

                <form id="new-project-form" class="stack" action="" method="post" enctype="multipart/form-data" novalidate>
                    <div class="field">
                        <label for="project-title">Nombre del proyecto</label>
                        <input id="project-title" name="project_title" type="text" required placeholder="Ej. Evaluación de impacto tecnológico">
                    </div>
                    
                    <div class="authors-container">
                        <div class="field">
                            <label for="add-authors">Autores extra del proyecto (tu ya estas incluido)</label><br>
                        </div>

                        <button type="button" id="add-author-button" class="btn-secondary" onclick="agregarAutor()">+</button>
                    </div>

                    <div class="authors-container">
                        <div class="author-item">
                            <div class="author-autocomplete">
                                <div class="field">
                                    <label for="author-correspondencia">Autor de correspondencia</label>
                                    <input id="author-correspondencia" name="author-name" type="text" required placeholder="Ej. Juan Pérez" autocomplete="off" data-author-input>
                                    <div class="author-autocomplete-dropdown" data-autocomplete-dropdown></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="field">
                        <label for="knowledge-area">Área de conocimiento</label>

            
                        <select id="area-conocimiento" name="knowledge_area" required>

                            <!-- CARGAR LAS OPCIONES DEL SELECT DESDE EL JS DE CONFIG -->
                            <script type="module">
                                import {areasDeConocimiento} from '../config/config.js';
                                import {select, create} from '../js/utils/dom.js';

                                const areaConocimientoSelect = select('#area-conocimiento');
                                
                                Object.entries(areasDeConocimiento).forEach(([id, value]) => {
                                    const option = create('option');
                                    option.setAttribute('value', id);
                                    option.textContent = value;
                                    areaConocimientoSelect.appendChild(option);
                                });
                            </script>
                        </select>
                    </div>

                    <div class="field">
                        <label for="project-file">Entrega inicial (DOCX)</label>
                        <div class="dropzone" data-dropzone>
                            <input id="project-file" name="initial_file" type="file" accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document" hidden required>
                            <div class="dz-inner">
                                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 5 17 10"></polyline>
                                    <line x1="12" y1="5" x2="12" y2="16"></line>
                                </svg>
                                <p><strong>Arrastra tu DOCX</strong> o</p>
                                <button type="button" class="btn-secondary" data-dropzone-trigger>Seleccionar archivo</button>
                                <div class="file-info" data-dropzone-info aria-live="polite"></div>
                            </div>
                        </div>
                    </div>

                    <div class="actions">
                        <button type="button" class="btn-primary" onclick="crearProyecto()">Crear proyecto</button>
                        <p class="muted small">El proyecto se crea con la versión inicial y queda listo para seguimiento y revisiones.</p>
                    </div>
                </form>
            </article>


            <!-- LISTADO DE PROYECTOS DEL AUTOR -->
            <div class="project-board" aria-live="polite">
                <div class="project-board-tools">
                </div>

                <div class="project-list" data-page-size="5">


                </div>

                <div id="project-empty-search" class="project-empty-search" hidden>
                    <p>No encontramos artículos que coincidan con tu búsqueda.</p>
                </div>
                
                <div id="project-empty" class="project-empty">
                    <p>Ups! Parece que aún no has subido ningún artículo</p>
                </div>

                <div class="project-pagination" id="project-pagination">
                    <button type="button" class="btn-secondary project-page-btn" id="project-prev" aria-label="Proyectos anteriores">Anterior</button>
                    <span class="project-page-indicator" id="project-page-indicator">1 / 1</span>
                    <button type="button" class="btn-secondary project-page-btn" id="project-next" aria-label="Proyectos siguientes">Siguiente</button>
                </div>
            </div>
        </section>
    </main>


    <!-- SCRIPT DE LA PÁGINA DE AUTOR -->
    <script type="module" src="../pages/script_author.js"></script>
</body>
</html>