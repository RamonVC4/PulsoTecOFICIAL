// Este js carga la vista de autor (revisión de su articulo) de PulsoTec.

import {createHeaderTop, createHeaderNav} from '../components/header.js';
import {select} from '../js/utils/dom.js';
import {createRubric, createInnerSessionHead} from '../components/rubric.js';


// =============================================
//               CARGAR EL HEADER
// =============================================

const urls = {
    'INICIO': '../Index.html',
    'BANDEJA': './author.html',
}
const cerrar_sesion_link = './login.html';

const header = select('.site-header');
header.appendChild(createHeaderTop());
header.appendChild(createHeaderNav(urls, null, cerrar_sesion_link));


// =============================================
//            CARGAR EL HEADER INTERNO
// =============================================
const innerSessionHead = select('.session-head');
innerSessionHead.innerHTML = createInnerSessionHead('./author.html');

// Agregar selector de revisores después del header interno
const sessionContext = innerSessionHead.querySelector('.session-context');
if (sessionContext) {
    const revisorSelector = document.createElement('div');
    revisorSelector.className = 'revisor-selector';
    revisorSelector.id = 'revisor-selector-container';
    revisorSelector.innerHTML = `
        <label for="revisor-select">Ver rúbrica de:</label>
        <select id="revisor-select" class="revisor-select">
            <option value="">Cargando revisores...</option>
        </select>
    `;
    sessionContext.appendChild(revisorSelector);
}



// =============================================
//               CARGAR LA RÚBRICA
// =============================================

const rubric = select('.rubric-panel');
rubric.innerHTML = createRubric();






// =============================================
//     CARGAR LA TABLA DESDE LA BASE DE DATOS
// =============================================

let revisoresData = [];
let revisorActual = null;

//esta funcion se ejecuta al cargar la pagina
document.addEventListener('DOMContentLoaded', () => {
    cargarRevisores(); 
});

async function cargarRevisores() {
    const idEntrega = (new URLSearchParams(window.location.search)).get('id');
    const dataDeBDD = await fetch('../php/autor_getDatosRubrica.php', {
        method: 'POST',
        body: JSON.stringify({
            idEntrega: idEntrega
        }),
    });
    const jsonStr = await dataDeBDD.text();

    //si no hay datos, salir
    if (!jsonStr) return;

    const datosEnJSON = JSON.parse(jsonStr);
    
    if (!datosEnJSON.success || !datosEnJSON.revisores || datosEnJSON.revisores.length === 0) {
        const selector = document.getElementById('revisor-select');
        if (selector) {
            selector.innerHTML = '<option value="">No hay revisores disponibles</option>';
        }
        return;
    }

    revisoresData = datosEnJSON.revisores;
    
    // Llenar el selector de revisores
    const selector = document.getElementById('revisor-select');
    if (selector) {
        selector.innerHTML = revisoresData.map((revisor, index) => 
            `<option value="${index}">${revisor.nombre} ${revisor.terminado ? '✓' : '(En progreso)'}</option>`
        ).join('');
        
        // Cargar la primera rúbrica por defecto
        if (revisoresData.length > 0) {
            selector.value = '0';
            cargarRubricaRevisor(0);
        }
        
        // Agregar listener para cambiar de revisor
        selector.addEventListener('change', (e) => {
            const index = parseInt(e.target.value);
            if (!isNaN(index) && index >= 0 && index < revisoresData.length) {
                cargarRubricaRevisor(index);
            }
        });
    }
}

function cargarRubricaRevisor(index) {
    if (index < 0 || index >= revisoresData.length) return;
    
    revisorActual = revisoresData[index];
    
    // Manejar datos de rúbrica vacíos o inválidos
    let formObj = {};
    if (revisorActual.datosRubrica && revisorActual.datosRubrica.trim() !== '' && revisorActual.datosRubrica !== '{}') {
        try {
            formObj = JSON.parse(revisorActual.datosRubrica);
        } catch (e) {
            console.error('Error al parsear datos de rúbrica:', e);
            formObj = {};
        }
    }
    
    const form = document.getElementById('rubric-form');
    if (!form) return;
    
    // Limpiar el formulario primero
    Array.from(form.elements).forEach(el => {
        if (el.type === 'checkbox' || el.type === 'radio') {
            el.checked = false;
        } else if (el.type !== 'button' && el.type !== 'submit' && el.id !== 'rubric-doc-id') {
            el.value = '';
        }
    });
    
    // Llenar con los datos del revisor
    for (const [key, value] of Object.entries(formObj)) {
        const field = form.elements[key];
        if (!field) continue;

        // SI ES NODELIST, esto llena checkboxes o radios con mismo name
        if (field instanceof RadioNodeList || field.length > 1) {
            Array.from(field).forEach(el => {
                if (el.type === 'checkbox' || el.type === 'radio') {
                    if (Array.isArray(value)) {
                        el.checked = value.includes(el.value);
                    } else {
                        el.checked = el.value === value;
                    }
                }
            });
        } else {
            //SI SOLO ES UN ELEMENTO, esto llena el resto, dehecho principalmente inputs de texto
            if (field.type === 'checkbox' || field.type === 'radio') {
                field.checked = Array.isArray(value) ? value.includes(field.value) : field.value === value;
            } else {
                field.value = value;
            }
        }
    }

    //desactivo la rubrica
    Array.from(form.elements).forEach(el => el.disabled = true);
}






// =============================================
//               CARGAR LA RÚBRICA
// =============================================
// ESTA FUNCIÓN ES PARA ALTERNAR ENTRE MOSTRAR Y OCULTAR LA RÚBRICA

(function () {
const $ = (sel, root = document) => root.querySelector(sel);
const params = new URLSearchParams(window.location.search);
const docId = params.get('id') || 'doc-sin-id';
const docTitle = params.get('title') || 'Documento sin título';
const docData = {
    title: docTitle,
};

$('#doc-title').textContent = docData.title;
$('#rubric-doc-id').value = docId;

const layout = $('#session-layout');
const rubricPanel = $('#rubric-panel');
const toggleBtn = $('#toggle-rubric');
const closeBtn = $('#close-rubric');



let rubricVisible = false;
const showRubric = (show) => {
    rubricVisible = typeof show === 'boolean' ? show : !rubricVisible;
    if (rubricVisible) {
        rubricPanel.hidden = false;
        layout.classList.add('is-rubric-open');
        toggleBtn.textContent = 'Cerrar rúbrica';
    } else {
        layout.classList.remove('is-rubric-open');
        toggleBtn.textContent = 'Abrir rúbrica';
        window.setTimeout(() => {
            if (!layout.classList.contains('is-rubric-open')) {
                rubricPanel.hidden = true;
            }
        }, 260);
    }
};

toggleBtn.addEventListener('click', () => showRubric());
closeBtn.addEventListener('click', () => showRubric(false));

$('#save-draft').addEventListener('click', () => {
    const form = $('#rubric-form');
    const data = new FormData(form);
    const payload = {};
    for (const [key, value] of data.entries()) {
        if (payload[key]) {
            if (Array.isArray(payload[key])) {
                payload[key].push(value);
            } else {
                payload[key] = [payload[key], value];
            }
        } else {
            payload[key] = value;
        }
    }
    localStorage.setItem('rubricDraft:' + docId, JSON.stringify(payload));
    alert('Borrador guardado localmente. Recuerda enviarlo antes de la fecha límite.');
});

$('#download-btn').addEventListener('click', () => {
    alert('Descarga simulada. Conecta este botón con el PDF del manuscrito.');
});

// Iniciar con rúbrica visible por defecto (solo en author-verRubrica)
showRubric(true);
})();