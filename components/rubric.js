// Este js crea la rúbrica de evaluación de articulos de PulsoTec.
// Hacerlo componente nos borra miles de lineas de código duplicado


/**
 * @param {string} urlPanel - URL del panel desde el que se regresa
 * @returns {string} - Elemento HTML del header interno
 */

export function createInnerSessionHead(urlPanel, showToggleRubricButton = true, showDownloadButton = true) {

    const toggleButton = showToggleRubricButton ? `<button type="button" class="btn-primary" id="toggle-rubric">Abrir rúbrica</button>` : '';
    const downloadButton = showDownloadButton ? `<button type="button" class="btn-secondary" id="download-btn">Descargar PDF</button>` : '';

    return `
        <div class="session-context">
            <a class="back-link" href="${urlPanel}">← Regresar al panel</a>
            <h2 id="doc-title">Documento sin título</h2>
        </div>
        <div class="session-actions">
            ${downloadButton}
            ${toggleButton}
        </div>
    `;
}




/**
 * @returns {string} - Elemento HTML de la rúbrica
 */

export function createRubric(role = 'author', showCloseButton = true) {

    return `
        <form id="rubric-form" class="rubric-form" method="post" novalidate>
            <input type="hidden" name="documentId" id="rubric-doc-id" value="">

            <!-- CABECERA -->
            <div class="rubric-head">
                <h3>Evaluación de Artículo de Revista PulsoTec</h3>
                ${showCloseButton ? `<button type="button" class="btn-close" id="close-rubric" aria-label="Cerrar rúbrica">×</button>` : ''}    
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
                <h4>II. Según la revisión que hizo del documento, conteste los siguientes criterios</h4>
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
                            ${tableRow(1, 'Originalidad del trabajo')}
                            ${tableRow(2, 'Originalidad en el tratamiento de la temática')}
                            ${tableRow(3, 'Redacción y claridad del texto')}
                            ${tableRow(4, 'Congruencia entre título, contenido y conclusiones')}
                            ${tableRow(5, 'Calidad técnica y científica')}
                            ${tableRow(6, 'Relevancia y actualidad del tema')}
                            ${tableRow(7, 'Importancia dentro del área')}
                            ${tableRow(8, 'Facilidad para leer y entender')}
                            ${tableRow(9, 'Potencial del trabajo para ser citado')}
                            ${tableRow(10, 'Conveniencia para la revista')}
                            ${tableRow(11, 'Pertinencia de las tablas')}
                            ${tableRow(12, 'Pertinencia de las figuras')}
                            ${tableRow(13, 'Calidad de las figuras')}
                            ${tableRow(14, 'Uso actualizado de fuentes bibliográficas')}
                            ${tableRow(15, 'Congruencia entre aparato crítico y extensión del trabajo')}
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

        </form>
    `;
}




/**
 * @param {number} index - Índice del aspecto
 * @param {string} aspecto - Nombre del aspecto
 * @returns {string} - Elemento HTML de la fila de la tabla
 */

function tableRow(index, aspecto) {
    return `
        <tr>
            <th scope="row"><span class="rubric-index">${index}</span> ${aspecto}</th>
            <td><label class="radio-pill"><input type="radio" name="aspecto${(index < 10) ? '0' : ''}${index}" value="excelente"><span>Excelente</span></label></td>
            <td><label class="radio-pill"><input type="radio" name="aspecto${(index < 10) ? '0' : ''}${index}" value="bueno"><span>Bueno</span></label></td>
            <td><label class="radio-pill"><input type="radio" name="aspecto${(index < 10) ? '0' : ''}${index}" value="regular"><span>Regular</span></label></td>
            <td><label class="radio-pill"><input type="radio" name="aspecto${(index < 10) ? '0' : ''}${index}" value="deficiente"><span>Deficiente</span></label></td>
        </tr>
    `;
}


