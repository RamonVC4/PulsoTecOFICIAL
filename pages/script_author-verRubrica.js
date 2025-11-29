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



// =============================================
//               CARGAR LA RÚBRICA
// =============================================

const rubric = select('.rubric-panel');
rubric.innerHTML = createRubric();






// =============================================
//     CARGAR LA TABLA DESDE LA BASE DE DATOS
// =============================================

//esta funcion se ejecuta al cargar la pagina
document.addEventListener('DOMContentLoaded', () => {
    cargarTabla(); 
});

async function cargarTabla() {
    const dataDeBDD = await fetch('../php/autor_getDatosRubrica.php', {
        method: 'POST',
        body: JSON.stringify({
            idEntrega: (new URLSearchParams(window.location.search)).get('id')
        }),
    });
    const jsonStr = await dataDeBDD.text();

    //sin no tenia guardado nada, salir
    if (!jsonStr) return;

    const datosEnJSON = JSON.parse(jsonStr);
    const formObj = JSON.parse(datosEnJSON.datosRubrica);

    form = document.getElementById('rubric-form'); 
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

// Iniciar con rúbrica oculta para dispositivos grandes
showRubric(false);
})();