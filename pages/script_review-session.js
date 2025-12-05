

    async function cargarTabla() {
        const dataDeBDD = await fetch('../php/revisor_getDatosRubrica.php', {
            method: 'POST',
            credentials: 'same-origin',
            body: JSON.stringify({
                pdfPath: (new URLSearchParams(window.location.search)).get('doc')
            }),
        });
        const jsonStr = await dataDeBDD.text();

        //si no tenia guardado nada, salir
        if (!jsonStr) return;

        console.log(jsonStr);   
        const datosEnJSON = JSON.parse(jsonStr);
        if (!datosEnJSON.datosRubrica) return;
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

        //desactivo la rubrica si ya esta terminada
        if (datosEnJSON.terminado) {
            const form = document.getElementById('rubric-form');
            const botonEnviar = form.querySelector('button.btn-primary');
            const botonBorrador = form.querySelector('button#save-draft');
            Array.from(form.elements).forEach(el => el.disabled = true);
            botonEnviar.disabled = true;
            botonBorrador.disabled = true;
        }
    }

//esta funcion se ejecuta al cargar la pagina
document.addEventListener('DOMContentLoaded', () => {
    cargarTabla(); // llama a la función que obtiene los proyectos y los renderiza<script>
    const formFueraDeLaFunc = document.getElementById('rubric-form');
    // Función para validar el formulario
    const validarForm = () => {

        const allRadios = formFueraDeLaFunc.querySelectorAll('input[type="radio"]');

        // Validar que se haya elegido un dictamen
        dictamenSeleccionado = Array.from(allRadios)
            .some(r => r.name === 'dictamen' && r.checked);

        //Validar que se hayan escrito comentarios
        comentariosEscritos = document.getElementById('comentarios-autores').value.trim() !== '';

        // guardar el estado de la verificacion
        tablaLlena = (dictamenSeleccionado && comentariosEscritos );
    };

    // Escuchar cambios en el formulario
    formFueraDeLaFunc.addEventListener('change', validarForm);
    formFueraDeLaFunc.addEventListener('input', validarForm);

    // Ejecutar al cargar por si hay datos prellenados
    validarForm();


    //APARTE DE ESTO, VAMOS A PONER EN EL VISUALIZADOR AL PDF
    const visualizador = document.querySelector('#visorPDF');
    const params = new URLSearchParams(window.location.search);
    pdfPath = params.get('doc');
    visualizador.src = pdfPath;
});

    async function terminarRevision(terminado) {
        if (terminado && !tablaLlena){
            alert('Por favor, complete todos los campos obligatorios antes de enviar el dictamen.');
            return;
        }
        //guardamos la form como json
        const form = document.getElementById('rubric-form');
        const data = new FormData(form);
        // Convert FormData to plain object
        const formObj = {};
        for (const [key, value] of data.entries()) {
            if (formObj[key]) {
                // handle multiple values (checkboxes, multi-select)
                formObj[key] = [].concat(formObj[key], value);
            } else {
                formObj[key] = value;
            }
        }

        const params = new URLSearchParams(window.location.search);
        pdfPath = params.get('doc');
        // mandar con fetch
        const response = await fetch(terminado ? '../php/revisor_terminarRevision.php' : '../php/revisor_guardarBorrador.php', {
            method: 'POST',
            body: JSON.stringify({formObj,pdfPath}),
        });

        const result = await response.json();
        if (result.success) {
            alert('Dictamen enviado con éxito.');
            window.location.href = './revisor.html'; //TODO
        } else {
            alert('Error al enviar el dictamen: ' + result.message);
        }
    }

(function () {
    const $ = (sel, root = document) => root.querySelector(sel);
    const params = new URLSearchParams(window.location.search);
    const docId = params.get('doc') || 'doc-sin-id';
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
