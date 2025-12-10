    // Este js carga la vista de autor (panel principal) de PulsoTec.

    //console.log("script_author.js cargado");  //este es un buen console.log, no lo quiten, solo comentenlo

    import {select} from '../js/utils/dom.js';
    import {createHeaderTop, createHeaderNav} from '../components/header.js';


    // =============================================
    //               CARGAR EL HEADER
    // =============================================

    const urls = {
        'INICIO': '../Index.html',
        'MIS PROYECTOS': './',
    }
    const cerrar_sesion_link = './login.php';

    const header = select('.site-header');
    header.appendChild(createHeaderTop());
    header.appendChild(createHeaderNav(urls, null, cerrar_sesion_link));




    // ===========================================================================
    //                              FUNCIONES DE FRONTEND
    // ==========================================================================

    // =============================================
    //               AGREGAR AUTORES
    // =============================================

    export function agregarAutor() {
        const authorsContainer = document.querySelector('.authors-container');
        const addButton = authorsContainer.querySelector('#add-author-button');

        // Contar solo los author-item, excluyendo el botón de agregar
        const authorItems = authorsContainer.querySelectorAll('.author-item');
        
        if(authorItems.length >= 4) {
            alert("No se pueden agregar más de 5 autores.");
            return;
        }

        const authorItem = document.createElement('div');
        authorItem.className = 'author-item';

        const fieldWrapper = document.createElement('div');
        fieldWrapper.style.display = 'flex';
        fieldWrapper.style.gap = '10px';
        fieldWrapper.style.alignItems = 'flex-end';

        const autocompleteWrapper = document.createElement('div');
        autocompleteWrapper.className = 'author-autocomplete';

        const field = document.createElement('div');
        field.className = 'field';
        field.style.flex = '1';

        const authorIndex = authorItems.length + 1;
        const inputId = `author-name-${authorIndex}`;

        const label = document.createElement('label');
        label.setAttribute('for', inputId);
        label.textContent = 'Nombre del autor';

        const input = document.createElement('input');
        input.id = inputId;
        input.type = 'text';
        input.name = `author-name-${authorIndex}`;
        input.required = true;
        input.placeholder = 'Ej. Juan Pérez';
        input.autocomplete = 'off';
        input.setAttribute('data-author-input', '');
        
        const dropdown = document.createElement('div');
        dropdown.className = 'author-autocomplete-dropdown';
        dropdown.setAttribute('data-autocomplete-dropdown', '');

        field.appendChild(label);
        field.appendChild(input);
        field.appendChild(dropdown);

        autocompleteWrapper.appendChild(field);

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'btn-secondary';
        deleteButton.textContent = '−';
        deleteButton.setAttribute('aria-label', 'Eliminar autor');
        deleteButton.onclick = function() {
            eliminarAutor(authorItem);
        };

        fieldWrapper.appendChild(autocompleteWrapper);
        fieldWrapper.appendChild(deleteButton);

        authorItem.appendChild(fieldWrapper);

        // Insertar antes del botón de agregar autor
        authorsContainer.insertBefore(authorItem, addButton);

        // Inicializar autocomplete en el nuevo input
        inicializarAutocomplete(input);
    }


    // =============================================
    //               ELIMINAR AUTOR
    // =============================================

    export function eliminarAutor(authorItem) {
        if (!authorItem) {
            return;
        }
        
        const authorsContainer = document.querySelector('.authors-container');
        const authorItems = authorsContainer.querySelectorAll('.author-item');
        
        authorItem.remove();
    }


    // =============================================
    //               INICIALIZAR AUTOCOMPLETE
    // =============================================

    export function inicializarAutocomplete(input) {
        const dropdown = input.parentElement.querySelector('[data-autocomplete-dropdown]');
        if (!dropdown) return;

        let selectedIndex = -1;
        let autores = [];
        let timeoutId = null;

        // Función para mostrar el dropdown
        function mostrarDropdown() {
            dropdown.classList.add('is-visible');
        }

        // Función para ocultar el dropdown
        function ocultarDropdown() {
            dropdown.classList.remove('is-visible');
            selectedIndex = -1;
        }

        // Función para renderizar los resultados
        function renderizarResultados(resultados) {
            dropdown.innerHTML = '';
            autores = resultados;

            if (resultados.length === 0) {
                const empty = document.createElement('div');
                empty.className = 'author-autocomplete-empty';
                empty.textContent = 'No se encontraron autores';
                dropdown.appendChild(empty);
                return;
            }

            resultados.forEach((autor, index) => {
                const item = document.createElement('div');
                item.className = 'author-autocomplete-item';
                item.textContent = `${autor.nombre} ${autor.primerApellido} ${autor.segundoApellido}`;
                item.dataset.index = index;
                
                item.addEventListener('click', () => {
                    input.value = `${autor.nombre} ${autor.primerApellido} ${autor.segundoApellido}`;
                    input.dataset.authorId = autor.id;//TODO usar esto mejor para conseguir las ids
                    ocultarDropdown();
                });

                item.addEventListener('mouseenter', () => {
                    selectedIndex = index;
                    actualizarHighlight();
                });

                dropdown.appendChild(item);
            });
        }

        // Función para actualizar el highlight
        function actualizarHighlight() {
            const items = dropdown.querySelectorAll('.author-autocomplete-item');
            items.forEach((item, index) => {
                item.classList.toggle('is-highlighted', index === selectedIndex);
            });
        }

        // Event listener para el input
        input.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            // Limpiar timeout anterior
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            // Si el input está vacío, ocultar dropdown
            if (query.length < 2) {
                ocultarDropdown();
                return;
            }

            // Debounce: esperar 300ms después de que el usuario deje de escribir
            timeoutId = setTimeout(async () => {
                const resultados = await buscarAutores(query);
                renderizarResultados(resultados);
                mostrarDropdown();
            }, 300);
        });

        // Event listener para cuando el input recibe foco
        input.addEventListener('focus', async () => {
            const query = input.value.trim();
            if (query.length >= 2) {
                const resultados = await buscarAutores(query);
                renderizarResultados(resultados);
                mostrarDropdown();
            }
        });

        // Event listener para navegación con teclado
        input.addEventListener('keydown', (e) => {
            const items = dropdown.querySelectorAll('.author-autocomplete-item');
            
            if (!dropdown.classList.contains('is-visible') || items.length === 0) {
                return;
            }

            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
                    actualizarHighlight();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    selectedIndex = Math.max(selectedIndex - 1, -1);
                    actualizarHighlight();
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (selectedIndex >= 0 && autores[selectedIndex]) {
                        input.value = autores[selectedIndex].nombre;
                        input.dataset.authorId = autores[selectedIndex].id;
                        ocultarDropdown();
                    }
                    break;
                case 'Escape':
                    ocultarDropdown();
                    break;
            }
        });

        // Ocultar dropdown al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!input.parentElement.contains(e.target)) {
                ocultarDropdown();
            }
        });
    }

    // Inicializar autocomplete en el input inicial cuando se carga la página
    document.addEventListener('DOMContentLoaded', () => {
        const initialInput = document.getElementById('author-correspondencia');
        if (initialInput) {
            inicializarAutocomplete(initialInput);
        }
    });
    


    // =============================================
    //           CONSTRUIR CARD DE ENTREGA
    // =============================================

    export function makeEntrega(entrega, titulo, isInitial, primeraEntrega = null) {
        const section = el("section", {
            class: `version ${isInitial ? "version-initial" : "version-revised"} ${entrega.entregado ? "is-ready" : "is-await"}`
        });

        //consigo el estado de la entrega
        const status = entrega.aceptado === null ? "chip-pending" : entrega.aceptado === 1 ? "chip-success": "chip-denied";
        const textoStatus = entrega.aceptado === null ? "PENDIENTE" :entrega.aceptado === 1 ? "ACEPTADO" : "DENEGADO";

        // Si es la segunda entrega, no está entregada, y la primera fue revisada y no rechazada definitivamente
        const esSegundaEntregaConFormulario = !isInitial && !entrega.entregado && primeraEntrega && primeraEntrega.aceptado !== 1 && primeraEntrega.aceptado !== 0;
        
        const header = el("header", {
            children: [
                esSegundaEntregaConFormulario 
                    ? el("h4", { text: "Pendiente" })
                    : el("h4", { text: titulo }),
                el("span", {
                    class: `chip ${status}`,
                    text: `${textoStatus}`,
                })
            ]
        });

        const fecha = el("p", {
            class: "muted small",
            text: entrega.entregado
                ? `Subido el ${entrega.fechaEntrega}`
                : "Pendiente de subir."
        });

        section.append(header, fecha);

        // Si es la segunda entrega, no está entregada, y la primera fue revisada y no rechazada definitivamente
        if (esSegundaEntregaConFormulario) {
            // Agregar clase especial para la tarjeta con formulario
            section.classList.add('has-upload-form');
            
            // Mostrar formulario para subir la segunda entrega
            const uploadForm = el("form", {
                class: "upload-second-delivery",
                attrs: {
                    "data-entrega-id": entrega.id,
                    "data-proyecto-id": entrega.idProyecto || ""
                }
            });

            const dropzone = el("div", {
                class: "dropzone dropzone-second-delivery",
                attrs: { "data-dropzone": "" }
            });

            const fileInput = el("input", {
                attrs: {
                    type: "file",
                    id: `file-${entrega.id}`,
                    name: "archivo",
                    accept: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    hidden: true,
                    required: true
                }
            });

            const dzInner = el("div", {
                class: "dz-inner"
            });
            
            const svg = el("svg", {
                attrs: {
                    viewBox: "0 0 24 24",
                    width: "28",
                    height: "28",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "aria-hidden": "true"
                }
            });
            svg.innerHTML = `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 5 17 10"></polyline><line x1="12" y1="5" x2="12" y2="16"></line>`;
            
            const pText = el("p");
            pText.innerHTML = "<strong>Arrastra tu DOCX</strong> o";
            
            const selectBtn = el("button", {
                type: "button",
                class: "btn-secondary",
                text: "Seleccionar archivo",
                attrs: { "data-dropzone-trigger": "" }
            });
            
            const fileInfo = el("div", {
                class: "file-info",
                attrs: { "data-dropzone-info": "", "aria-live": "polite" }
            });
            
            dzInner.appendChild(svg);
            dzInner.appendChild(pText);
            dzInner.appendChild(selectBtn);
            dzInner.appendChild(fileInfo);

            dropzone.appendChild(fileInput);
            dropzone.appendChild(dzInner);

            const submitBtn = el("button", {
                type: "button",
                class: "btn-primary",
                text: "Subir segunda entrega",
                attrs: {
                    "data-upload-btn": "",
                    "data-entrega-id": entrega.id
                }
            });
            
            // Agregar event listener para el botón
            submitBtn.addEventListener('click', () => {
                subirSegundaEntrega(entrega.id);
            });

            uploadForm.appendChild(dropzone);
            uploadForm.appendChild(submitBtn);
            section.appendChild(uploadForm);

            // Inicializar dropzone para esta sección
            setTimeout(() => {
                inicializarDropzone(dropzone, fileInput);
            }, 100);
        }

        if (entrega.pdfPath) {
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
            
            section.appendChild(
                el("a", {
                    class: "link",
                    text: "Descargar DOCX",
                    attrs: { href: getDownloadUrl(entrega.pdfPath), target: "_blank" }
                })
            );
        }

        //meto para ver la rubrica 
        console.log("ESTO ES LA ENTREGA: ", entrega);
        section.appendChild(
            el("a", {
                class: "link",
                text: "Ver rubrica",
                attrs: { href: `./author-verRubrica.php?title=${titulo}&id=${entrega.id}` }
            })
        );

        return section;
    }

    //helper par poder construir elementos como lego
    function el(tag, options = {}) {
        const node = document.createElement(tag);

        if (options.class) node.className = options.class;
        if (options.text) node.textContent = options.text;
        if (options.html) node.innerHTML = options.html; 
        if (options.attrs) {
            for (const [k, v] of Object.entries(options.attrs)) {
                node.setAttribute(k, v);
            }
        }
        if (options.children) {
            options.children.forEach(child => node.appendChild(child));
        }

        return node;
    }


    // =============================================
    //          RENDERIZAR PROYECTOS EN HTML
    // =============================================

    export function renderProjects(projects) {
        const board = document.querySelector('.project-list');
        board.innerHTML = ''; // quita los proyectos placeholder

        projects.forEach(proj => {
            // Validar que el proyecto tenga entregas
            if (!proj.entregas || proj.entregas.length === 0) {
                console.warn(`El proyecto "${proj.nombre}" no tiene entregas disponibles`);
                return; // Saltar este proyecto
            }

            const card = el("article", {
                class: "card project-card",
                attrs: {
                    "data-title": proj.nombre,
                }
            });

            const e = proj.entregas[0];
            console.log("ENTRERGASD ASAAAAAA");
            console.log(proj);
            console.log(e);

            const header = el("header", { class: "project-card__header" });

            const headerInfo = el("div", {
                children: [
                    el("h3", { class: "project-title", text: proj.nombre }),
                    el("p", { class: "project-description", text: `Proyecto cargado el ${e.fechaEntrega}` })
                ]
            });

            // Determinar el estado general del proyecto (PENDIENTE hasta que se cierre)
            // El proyecto está cerrado solo si la última entrega está definitivamente aceptada o rechazada
            const ultimaEntrega = proj.entregas[proj.entregas.length - 1];
            const proyectoCerrado = ultimaEntrega.aceptado !== null && ultimaEntrega.aceptado !== undefined;
            
            const status = el("span", {
                class: `project-status ${proyectoCerrado && ultimaEntrega.aceptado === 1 ? 'chip-success' : ""}`,
                text: proyectoCerrado && ultimaEntrega.aceptado === 1 ? "Aceptado" : "Pendiente"
            });

            header.append(headerInfo, status);

            const grid = el("div", { class: "version-grid" });
            grid.appendChild(makeEntrega(e, proj.nombre, true));

            // Usa la segunda entrega como fecha si existe
            if (proj.entregas.length > 1) {
                //le pongo la date
                card.dataset.date = proj.entregas[1].fechaEntrega;

                // creo la carta de la otra entrega, pasando la primera entrega para verificar estado
                grid.appendChild(makeEntrega(proj.entregas[1], proj.nombre, false, proj.entregas[0]));

            }

            card.append(header, grid);
            document.querySelector('.project-list').appendChild(card); // o donde vayan tus cards
    });

    }


    // =============================================
    //         INICIALIZAR DROPZONE DINÁMICO
    // =============================================

    function inicializarDropzone(zone, input) {
        const trigger = zone.querySelector('[data-dropzone-trigger]');
        const info = zone.querySelector('[data-dropzone-info]');

        if (!input) { return; }

        function setInfo(file) {
            if (!info) { return; }
            if (!file) { info.textContent = ''; return; }
            var sizeInKb = file.size / 1024;
            var formatted = sizeInKb < 1024 ? sizeInKb.toFixed(1) + ' KB' : (sizeInKb / 1024).toFixed(2) + ' MB';
            info.textContent = file.name + ' · ' + formatted;
        }

        ['dragenter', 'dragover'].forEach(function (eventName) {
            zone.addEventListener(eventName, function (event) {
                event.preventDefault();
                event.stopPropagation();
                zone.classList.add('is-dragover');
            });
        });

        ['dragleave', 'drop'].forEach(function (eventName) {
            zone.addEventListener(eventName, function (event) {
                event.preventDefault();
                event.stopPropagation();
                zone.classList.remove('is-dragover');
            });
        });

        zone.addEventListener('drop', function (event) {
            if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
                var file = event.dataTransfer.files[0];
                input.files = event.dataTransfer.files;
                setInfo(file);
            }
        });

        if (trigger) {
            trigger.addEventListener('click', function () {
                input.click();
            });
        }

        input.addEventListener('change', function () {
            setInfo(input.files && input.files[0]);
        });
    }

    // =============================================
    //         SUBIR SEGUNDA ENTREGA
    // =============================================

    export async function subirSegundaEntrega(idEntrega) {
        // Si es el proyecto de ejemplo, solo mostrar mensaje
        if (idEntrega === 'ejemplo-entrega-2' || idEntrega.toString().includes('ejemplo')) {
            alert('Este es un proyecto de ejemplo. En un proyecto real, aquí podrías subir tu segunda entrega después de recibir los comentarios de los revisores.');
            return;
        }

        const form = document.querySelector(`form[data-entrega-id="${idEntrega}"]`);
        if (!form) {
            alert('Error: No se encontró el formulario de subida.');
            return;
        }

        const fileInput = form.querySelector('input[type="file"]');
        if (!fileInput || !fileInput.files || !fileInput.files[0]) {
            alert('Por favor selecciona un archivo DOCX para subir.');
            return;
        }

        const archivo = fileInput.files[0];
        
        // Validar que sea un archivo DOCX
        if (!archivo.name.endsWith('.docx') && !archivo.type.includes('wordprocessingml')) {
            alert('Por favor selecciona un archivo DOCX válido.');
            return;
        }

        const formData = new FormData();
        formData.append('idEntrega', idEntrega);
        formData.append('archivo', archivo);

        const submitBtn = form.querySelector('[data-upload-btn]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Subiendo...';
        }

        try {
            const res = await fetch("../php/autor_subirSegundaEntrega.php", {
                method: "POST",
                body: formData,
                credentials: "same-origin"
            });

            const data = await res.json();

            if (!data.success) {
                alert(data.message || 'Error al subir la segunda entrega.');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Subir segunda entrega';
                }
                return;
            }

            alert('Segunda entrega subida exitosamente.');
            // Recargar los proyectos para mostrar el estado actualizado
            loadProjects();
        } catch (error) {
            console.error('Error al subir la segunda entrega:', error);
            alert('Error al subir la segunda entrega. Por favor intenta de nuevo.');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Subir segunda entrega';
            }
        }
    }

    // =============================================
    //                 DROPZONE
    // =============================================

    (function () {
        const dropzones = document.querySelectorAll('[data-dropzone]');

        dropzones.forEach(function (zone) {
            const input = zone.querySelector('input[type="file"]');
            const trigger = zone.querySelector('[data-dropzone-trigger]');
            const info = zone.querySelector('[data-dropzone-info]');

            if (!input) { return; }

            function setInfo(file) {
                if (!info) { return; }
                if (!file) { info.textContent = ''; return; }
                var sizeInKb = file.size / 1024;
                var formatted = sizeInKb < 1024 ? sizeInKb.toFixed(1) + ' KB' : (sizeInKb / 1024).toFixed(2) + ' MB';
                info.textContent = file.name + ' · ' + formatted;
            }

            ['dragenter', 'dragover'].forEach(function (eventName) {
                zone.addEventListener(eventName, function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    zone.classList.add('is-dragover');
                });
            });

            ['dragleave', 'drop'].forEach(function (eventName) {
                zone.addEventListener(eventName, function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    zone.classList.remove('is-dragover');
                });
            });

            zone.addEventListener('drop', function (event) {
                if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
                    var file = event.dataTransfer.files[0];
                    input.files = event.dataTransfer.files;
                    setInfo(file);
                }
            });

            if (trigger) {
                trigger.addEventListener('click', function () {
                    input.click();
                });
            }

            input.addEventListener('change', function () {
                setInfo(input.files && input.files[0]);
            });
        });
        const board = document.querySelector('.project-list');
        if (!board) { return; }

        const pageSize = Number(board.dataset.pageSize) || 5;
        const allCards = Array.from(board.querySelectorAll('.project-card'));
        const emptySearch = document.getElementById('project-empty-search');
        const emptyState = document.getElementById('project-empty');
        const pagination = document.getElementById('project-pagination');
        const prevBtn = document.getElementById('project-prev');
        const nextBtn = document.getElementById('project-next');
        const pageIndicator = document.getElementById('project-page-indicator');

        let filteredCards = allCards.slice();
        let currentPage = 1;

        function updateVisibility() {
            const total = filteredCards.length;
            const totalPages = Math.max(1, Math.ceil(total / pageSize));
            currentPage = Math.min(currentPage, totalPages);

            const start = (currentPage - 1) * pageSize;
            const end = start + pageSize;
            const visibleSet = new Set(filteredCards.slice(start, end));


            allCards.forEach(card => {
                card.hidden = !visibleSet.has(card);
            });

            emptyState.hidden = !(total > 0); //|| !searchInput.value.trim());
            emptySearch.hidden = !(total > 0);
            pagination.hidden = total <= pageSize;
            pageIndicator.textContent = total ? currentPage + ' / ' + totalPages : '0 / 0';
            prevBtn.disabled = currentPage <= 1;
            nextBtn.disabled = currentPage >= totalPages;
        }

        function applySearch(value) {
            const term = value.trim().toLowerCase();
            if (!term) {
                filteredCards = allCards.slice();
            } else {
                filteredCards = allCards.filter(card => {
                    const title = (card.dataset.title || card.querySelector('.project-title')?.textContent || '').toLowerCase();
                    const author = (card.dataset.author || '').toLowerCase();
                    const date = (card.dataset.date || '').toLowerCase();
                    return title.includes(term) || author.includes(term) || date.includes(term);
                });
            }
            currentPage = 1;
            updateVisibility();
        }

        // if (searchInput) {
        //     searchInput.addEventListener('input', event => {
        //         applySearch(event.target.value);
        //     });
        // }

        prevBtn.addEventListener('click', () => {
            if (currentPage <= 1) { return; }
            currentPage -= 1;
            updateVisibility();
            board.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        nextBtn.addEventListener('click', () => {
            const totalPages = Math.max(1, Math.ceil(filteredCards.length / pageSize));
            if (currentPage >= totalPages) { return; }
            currentPage += 1;
            updateVisibility();
            board.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        updateVisibility();
    })();




    




    // ===========================================================================
    //                              FUNCIONES DE BACKEND
    // ==========================================================================


    // =============================================
    //               CARGAR PROYECTOS
    // =============================================

    document.addEventListener('DOMContentLoaded', () => {
        loadProjects(); 
    });

    //esta funcion obtiene los proyectos del autor
    export async function loadProjects() {
        const res = await fetch("../php/autor_getProyectos.php", { credentials: "same-origin" });
        const data = await res.json();
        if (!data.success) {
            console.error(data.message);
            return;
        }
        renderProjects(data.proyectos);
        // Agregar proyectos de ejemplo
        renderProyectoEjemplo();
        renderProyectoEjemploSinRevisar();
    }

    // =============================================
    //               BUSCAR AUTORES EN LA BD
    // =============================================

    export async function buscarAutores(query) {
        if (!query || query.length < 1) {
            return [];
        }

        const res = await fetch(`../php/buscarAutores.php`, {
            credentials: "same-origin"
        });
        const data = await res.json();                

        // Filtrar por nombre o correo
        const queryLower = query.toLowerCase();
        return data.autores.filter(autor => 
            autor.nombre.toLowerCase().includes(queryLower) ||
            autor.correo.toLowerCase().includes(queryLower) ||
            autor.primerApellido.toLowerCase().includes(queryLower) ||
            autor.segundoApellido.toLowerCase().includes(queryLower)

        );
    }


    // =============================================
    //               CREAR PROYECTO
    // =============================================
    export async function crearProyecto(){
        //consigo los datos
        const titulo = document.getElementById('project-title').value;
        const autorCorrespondencia = document.querySelector('#author-correspondencia');
        const archivo = document.getElementById('project-file').files[0];
        const areaDeConocimiento = document.querySelector('#area-conocimiento').value;
        
        //loopeo por los autores si es que hay autores extra
        const authorsContainer = document.querySelectorAll('.authors-container')[0];
        const inputs = authorsContainer.querySelectorAll('input[data-author-input]');
        const idAutores = [];

        inputs.forEach(input => {
            idAutores.push(input.dataset.authorId);
        });

        //consigo todos los autores de la bdd
        const respuestaAutores = await fetch("../php/buscarAutores.php", { credentials: "same-origin" });
        const autoresBdd = await respuestaAutores.json();
        if (!autoresBdd.success) {
            console.error(autoresBdd.message);
            return;
        }

        let autoresValidos = true;

        if (!autoresValidos) {
            alert("Alguno de los autores ingresados no existen en la base de datos.");
            return;
        }

        /*VALIDACIONES DE*/
        //titulo
        if (!titulo) {
            alert("Por favor ingresa el nombre del proyecto.");
            return;
        }

        //autor de correspondencia
        if (!autorCorrespondencia.value) {
            alert("Por favor selecciona un autor de correspondencia.");
            return;
        }
        let autorCorrespondenciaId = autorCorrespondencia.dataset.authorId;

        if (!autorCorrespondenciaId) {
            alert("Por favor selecciona un autor de correspondencia.");
            return;
        }

        //consigo mi id de los params
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        if (!(idAutores.includes(autorCorrespondenciaId) || id == autorCorrespondenciaId)) {
            alert("El autor de correspondencia debe ser un autor del proyecto.");
            return;
        }

        //archivo
        if (!archivo) {
            alert("Por favor selecciona un archivo DOCX para la entrega inicial.");
            return;
        }

        //area de conocimiento
        if (areaDeConocimiento === '0') {
            alert("Por favor ingrese el area de conocimiento.");
            return;
        }


        //para mandar archivos no puede ser con json, tiene que ser con FormData
        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('archivo', archivo);
        formData.append('autores', JSON.stringify(idAutores));
        formData.append('autorCorrespondenciaId', autorCorrespondenciaId);
        formData.append('areaDeConocimiento', areaDeConocimiento);
        console.log("formData: ", formData)
        try {
            const res = await fetch("../php/autor_crearProyecto.php", {
                method: "POST",
                body: formData,
                credentials: "same-origin" // para enviar cookies de la sesion
            });

            const text = await res.text();
            let data;
            
            try {
                data = JSON.parse(text);
            } catch (parseError) {
                console.error('Error al parsear JSON. Respuesta del servidor:', text);
                alert('Error del servidor. Por favor verifica la consola para más detalles.');
                return;
            }

            if (!data.success) {
                alert(data.message || 'Error al crear el proyecto');
                return;
            } else {
                loadProjects(); // recarga los proyectos para mostrar el nuevo
                alert("Proyecto creado con éxito.");
            }
        } catch (error) {
            console.error('Error al crear proyecto:', error);
            alert('Error al crear el proyecto. Por favor intenta de nuevo.');
        }
    }
    





    // =============================================
    //         AGREGAR TODAS LAS FUNCIONES EXPORT
    // =============================================
    window.agregarAutor = agregarAutor;
    window.eliminarAutor = eliminarAutor;
    window.inicializarAutocomplete = inicializarAutocomplete;
    window.makeEntrega = makeEntrega;
    window.renderProjects = renderProjects;
    window.crearProyecto = crearProyecto;
    window.loadProjects = loadProjects;
    window.buscarAutores = buscarAutores;
    window.subirSegundaEntrega = subirSegundaEntrega;

    console.log("funciones disponibles:", window.agregarAutor);
