
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
    
    // Función para convertir URL de Drive a URL de preview (para iframe)
    function convertToDrivePreviewUrl(url) {
        if (!url) return '';
        
        // Si ya es una URL de preview de Drive, retornarla tal cual
        if (url.includes('drive.google.com/file/d/') && url.includes('/preview')) {
            return url;
        }
        
        // Si es una URL de Drive pero no es preview, convertirla
        const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (match) {
            return `https://drive.google.com/file/d/${match[1]}/preview`;
        }
        
        // Si es una URL local (uploads), intentar convertirla o retornarla tal cual
        // Para archivos locales, podrías usar un visor de PDF local
        return url;
    }
    
    visualizador.src = convertToDrivePreviewUrl(pdfPath);
});

    // Función para mostrar modal de CURP
    function mostrarModalCURP() {
        return new Promise((resolve, reject) => {
            // Crear modal
            const modal = document.createElement('div');
            modal.className = 'curp-modal-overlay';
            modal.innerHTML = `
                <div class="curp-modal">
                    <div class="curp-modal-header">
                        <h3>Firmar con CURP</h3>
                        <button type="button" class="curp-modal-close" aria-label="Cerrar">×</button>
                    </div>
                    <div class="curp-modal-body">
                        <p class="curp-modal-text">Para entregar la revisión, ingresa tu CURP para firmar:</p>
                        <div class="curp-modal-field">
                            <label for="curp-input">CURP</label>
                            <input type="text" id="curp-input" name="curp" placeholder="Ingresa tu CURP" maxlength="18" required>
                            <div id="curp-error" class="curp-error" style="display: none;"></div>
                        </div>
                    </div>
                    <div class="curp-modal-footer">
                        <button type="button" class="btn-secondary curp-modal-cancel">Cancelar</button>
                        <button type="button" class="btn-primary curp-modal-submit">Firmar y enviar</button>
                    </div>
                </div>
            `;


            document.body.appendChild(modal);
            
            const curpInput = modal.querySelector('#curp-input');
            const errorDiv = modal.querySelector('#curp-error');
            const submitBtn = modal.querySelector('.curp-modal-submit');
            const cancelBtn = modal.querySelector('.curp-modal-cancel');
            const closeBtn = modal.querySelector('.curp-modal-close');
            
            const cerrarModal = () => {
                document.body.removeChild(modal);
                reject(new Error('Cancelado por el usuario'));
            };
            


            const validarYEnviar = async () => {
                
                console.log("pasó validarYEnviar");
                
                const curp = curpInput.value.trim().toUpperCase();
                console.log("curp: ",curp);
                
                if (!curp) {
                    errorDiv.textContent = 'Por favor ingresa tu CURP';
                    errorDiv.style.display = 'block';
                    return;
                }
                
                // if (curp.length !== 18) {
                //     errorDiv.textContent = 'El CURP debe tener 18 caracteres';
                //     errorDiv.style.display = 'block';
                //     return;
                // }
                
                // Validar CURP con el servidor
                console.log("voy a andar a llamar validarCURP");

                try {
                    const response = await fetch('../php/revisor_validarCURP.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'same-origin',
                        body: JSON.stringify({ curp: curp })
                    });
                    console.log("pasó response");
                    const result = await response.json();
                    console.log("pasó result");
                    if (result.success) {
                        console.log("pasó success");
                        document.body.removeChild(modal);
                        resolve(curp);
                    } else {
                        errorDiv.textContent = result.message || 'CURP no válido. Verifica que sea correcto.';
                        errorDiv.style.display = 'block';
                    }
                } catch (error) {
                    errorDiv.textContent = 'Error al validar el CURP. Por favor intenta de nuevo.';
                    errorDiv.style.display = 'block';
                }
            };
            console.log("pasó validarYEnviar");
            
            submitBtn.addEventListener('click', validarYEnviar);
            cancelBtn.addEventListener('click', cerrarModal);
            closeBtn.addEventListener('click', cerrarModal);
            
            // Cerrar al hacer click fuera del modal
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    cerrarModal();
                }
            });
            
            // Enter para enviar
            curpInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    validarYEnviar();
                }
            });
            
            // Focus en el input
            setTimeout(() => curpInput.focus(), 100);
        });
    }

    async function terminarRevision(terminado) {
        if (terminado && !tablaLlena){
            alert('Por favor, complete todos los campos obligatorios antes de enviar el dictamen.');
            return;
        }

        //leo el veredicto para saber si no es definitivo
        const seleccionado = document.querySelector('input[name="dictamen"]:checked');
        if (seleccionado) {
            if (!(seleccionado.value === 'no_recomendar' || seleccionado.value === 'aceptar_sin_cambios')) {
                //mando a llamar a php para ver si no es la segunda revisión
                const response = await fetch('../php/revisor_verSiEsSegundaEntrega.php', {
                        method: 'POST',
                        body: JSON.stringify({}),
                });
                
                const result = await response.json();
                if(result.esSegundaEntrega){
                    alert('El veredicto debe ser definitivo en la segunda entrega.');
                    return;
                }
            }
        }

        // Si es para terminar (no borrador), pedir CURP
        if (terminado) {
            try {
                await mostrarModalCURP();
            } catch (error) {
                // Usuario canceló
                return;
            }
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
        console.log("voy a andar a llamar terminarrevision");
        const response = await fetch(terminado ? '../php/revisor_terminarRevision.php' : '../php/revisor_guardarBorrador.php', {
            method: 'POST',
            body: JSON.stringify({formObj,pdfPath}),
        });

        const result = await response.json();
        if (result.success) {
            if (terminado) {
                alert('Dictamen enviado con éxito.');
            }
            window.location.href = './revisor.php'; //TODO
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
        const params = new URLSearchParams(window.location.search);
        const pdfPath = params.get('doc');
        
        if (!pdfPath) {
            alert('No hay documento disponible para descargar.');
            return;
        }
        
        // Función para obtener URL de descarga de Drive
        function getDownloadUrl(url) {
            if (!url) return url;
            
            // Si es una URL de Drive, convertir a URL de descarga
            const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
            if (match) {
                return `https://drive.google.com/uc?export=download&id=${match[1]}`;
            }
            
            return url;
        }
        
        // Abrir en nueva pestaña para descargar
        window.open(getDownloadUrl(pdfPath), '_blank');
    });

    // Iniciar con rúbrica oculta para dispositivos grandes
    showRubric(false);
})();
