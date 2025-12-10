// Variables globales
let entregasData = [];
let revisoresData = [];
let entregaActual = null;
let revisorActual = null;

// Función para convertir URL de Drive a URL de preview
function convertToDrivePreviewUrl(url) {
    if (!url) return '';
    
    if (url.includes('drive.google.com/file/d/') && url.includes('/preview')) {
        return url;
    }
    
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    
    return url;
}

// Función para obtener URL de descarga
function getDownloadUrl(url) {
    if (!url) return url;
    
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
        return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
    
    return url;
}

// Cargar entregas del proyecto
async function cargarEntregas() {
    const params = new URLSearchParams(window.location.search);
    const idProyecto = params.get('doc');
    const docTitle = params.get('title') || 'Documento sin título';
    
    if (!idProyecto) {
        alert('No se proporcionó el ID del proyecto');
        return;
    }
    
    document.getElementById('doc-title').textContent = docTitle;
    
    try {
        const response = await fetch(`../php/manager_getEntregasRubricas.php?idProyecto=${idProyecto}`);
        const data = await response.json();
        
        if (!data.success) {
            alert('Error al cargar las entregas: ' + (data.message || 'Error desconocido'));
            return;
        }
        
        entregasData = data.entregas;
        
        // Llenar selector de versiones
        const versionSelect = document.getElementById('version-select');
        versionSelect.innerHTML = '<option value="">Seleccionar versión...</option>';
        
        entregasData.forEach((entrega, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `Versión ${entrega.numeroEntrega}${entrega.entregado ? ' (Entregada)' : ' (Pendiente)'}`;
            versionSelect.appendChild(option);
        });
        
        // Si hay entregas, seleccionar la primera por defecto
        if (entregasData.length > 0) {
            versionSelect.value = '0';
            seleccionarVersion(0);
        }
        
    } catch (error) {
        console.error('Error al cargar entregas:', error);
        alert('Error al cargar las entregas del proyecto');
    }
}

// Seleccionar versión
function seleccionarVersion(index) {
    if (index < 0 || index >= entregasData.length) return;
    
    entregaActual = entregasData[index];
    
    // Cargar documento
    const visualizador = document.querySelector('#visorPDF');
    if (entregaActual.pdfPath) {
        visualizador.src = convertToDrivePreviewUrl(entregaActual.pdfPath);
    } else {
        visualizador.src = '';
    }
    
    // Cargar revisores de esta entrega
    revisoresData = entregaActual.rubricas || [];
    
    // Llenar selector de revisores
    const revisorSelect = document.getElementById('revisor-select');
    if (revisoresData.length > 0) {
        revisorSelect.style.display = 'block';
        revisorSelect.innerHTML = '<option value="">Seleccionar revisor...</option>';
        
        revisoresData.forEach((revisor, idx) => {
            const option = document.createElement('option');
            option.value = idx;
            option.textContent = `${revisor.nombre} ${revisor.terminado ? '✓' : '(En progreso)'}`;
            revisorSelect.appendChild(option);
        });
        
        // Seleccionar el primer revisor por defecto
        revisorSelect.value = '0';
        seleccionarRevisor(0);
    } else {
        revisorSelect.style.display = 'none';
        revisorSelect.innerHTML = '<option value="">No hay revisores para esta versión</option>';
        // Limpiar rúbrica
        limpiarRubrica();
    }
}

// Seleccionar revisor
function seleccionarRevisor(index) {
    if (index < 0 || index >= revisoresData.length) return;
    
    revisorActual = revisoresData[index];
    cargarRubrica();
}

// Cargar rúbrica del revisor seleccionado
function cargarRubrica() {
    // Primero limpiar todos los campos
    limpiarRubrica();
    
    if (!revisorActual || !revisorActual.datosRubrica) {
        return;
    }
    
    try {
        // Verificar que los datos no estén vacíos
        const datosStr = revisorActual.datosRubrica.trim();
        if (!datosStr || datosStr === '' || datosStr === '{}' || datosStr === 'null') {
            return;
        }
        
        const formObj = JSON.parse(datosStr);
        const form = document.getElementById('rubric-form');
        
        if (!form || !formObj || typeof formObj !== 'object') {
            return;
        }
        
        // Llenar el formulario SOLO con los valores que existen en los datos
        for (const [key, value] of Object.entries(formObj)) {
            // Ignorar valores null, undefined, vacíos o que no sean válidos
            if (value === null || value === undefined || value === '' || value === 'null' || value === 'undefined') {
                continue;
            }
            
            const field = form.elements[key];
            if (!field) continue;
            
            if (field instanceof RadioNodeList || field.length > 1) {
                // Para grupos de radio/checkbox
                // Primero desmarcar todos
                Array.from(field).forEach(el => {
                    if (el.type === 'checkbox' || el.type === 'radio') {
                        el.checked = false;
                    }
                });
                
                // Luego marcar solo el que coincide con el valor guardado
                Array.from(field).forEach(el => {
                    if (el.type === 'checkbox' || el.type === 'radio') {
                        if (Array.isArray(value)) {
                            if (value.includes(el.value)) {
                                el.checked = true;
                            }
                        } else {
                            // Comparación estricta de strings
                            if (String(el.value) === String(value)) {
                                el.checked = true;
                            }
                        }
                    }
                });
            } else {
                // Para campos individuales
                if (field.type === 'checkbox' || field.type === 'radio') {
                    // Desmarcar primero
                    field.checked = false;
                    
                    // Solo marcar si el valor coincide exactamente
                    if (Array.isArray(value)) {
                        if (value.includes(field.value)) {
                            field.checked = true;
                        }
                    } else {
                        // Comparación estricta de strings
                        if (String(field.value) === String(value)) {
                            field.checked = true;
                        }
                    }
                } else {
                    // Para inputs de texto, textarea, etc.
                    field.value = value || '';
                }
            }
        }
    } catch (error) {
        console.error('Error al cargar rúbrica:', error);
        limpiarRubrica();
    }
}

// Limpiar rúbrica - Asegurar que todos los campos queden sin marcar
function limpiarRubrica() {
    const form = document.getElementById('rubric-form');
    if (!form) return;
    
    Array.from(form.elements).forEach(el => {
        // Ignorar botones, submits y campos hidden
        if (el.type === 'button' || el.type === 'submit' || el.type === 'hidden') {
            return;
        }
        
        // Para checkboxes y radios, desmarcar
        if (el.type === 'checkbox' || el.type === 'radio') {
            el.checked = false;
        } 
        // Para otros campos (text, textarea, number, etc.), limpiar valor
        else {
            el.value = '';
        }
    });
}

// Deshabilitar todos los campos de edición (solo lectura para manager)
function deshabilitarEdicion() {
    const form = document.getElementById('rubric-form');
    Array.from(form.elements).forEach(el => {
        if (el.type !== 'button' && el.type !== 'submit' && el.type !== 'hidden') {
            el.disabled = true;
            el.readOnly = true;
        }
    });
    
    // Ocultar botones de acción
    const saveDraft = document.getElementById('save-draft');
    if (saveDraft) saveDraft.style.display = 'none';
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Deshabilitar edición inmediatamente
    deshabilitarEdicion();
    
    // Cargar entregas
    cargarEntregas();
    
    // Event listeners
    const versionSelect = document.getElementById('version-select');
    const revisorSelect = document.getElementById('revisor-select');
    const downloadBtn = document.getElementById('download-btn');
    const toggleBtn = document.getElementById('toggle-rubric');
    const closeBtn = document.getElementById('close-rubric');
    
    versionSelect.addEventListener('change', (e) => {
        const index = parseInt(e.target.value);
        if (!isNaN(index)) {
            seleccionarVersion(index);
        }
    });
    
    revisorSelect.addEventListener('change', (e) => {
        const index = parseInt(e.target.value);
        if (!isNaN(index)) {
            seleccionarRevisor(index);
        }
    });
    
    downloadBtn.addEventListener('click', () => {
        if (entregaActual && entregaActual.pdfPath) {
            window.open(getDownloadUrl(entregaActual.pdfPath), '_blank');
        } else {
            alert('No hay documento disponible para descargar');
        }
    });
    
    // Toggle rúbrica
    let rubricVisible = false;
    const layout = document.getElementById('session-layout');
    const rubricPanel = document.getElementById('rubric-panel');
    
    const showRubric = (show) => {
        rubricVisible = typeof show === 'boolean' ? show : !rubricVisible;
        if (rubricVisible) {
            rubricPanel.hidden = false;
            layout.classList.add('is-rubric-open');
            toggleBtn.textContent = 'Cerrar rúbrica';
        } else {
            layout.classList.remove('is-rubric-open');
            toggleBtn.textContent = 'Abrir rúbrica';
            setTimeout(() => {
                if (!layout.classList.contains('is-rubric-open')) {
                    rubricPanel.hidden = true;
                }
            }, 260);
        }
    };
    
    toggleBtn.addEventListener('click', () => showRubric());
    if (closeBtn) {
        closeBtn.addEventListener('click', () => showRubric(false));
    }
    
    // Iniciar con rúbrica oculta
    showRubric(false);
});
