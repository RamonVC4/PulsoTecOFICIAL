    // Este js carga la vista de autor (panel principal) de PulsoTec.

    console.log("script_author.js cargado");


    import {select} from '../js/utils/dom.js';
    import {createHeaderTop, createHeaderNav} from '../components/header.js';


    // =============================================
    //               CARGAR EL HEADER
    // =============================================

    const urls = {
        'INICIO': '../Index.html',
        'MIS PROYECTOS': './',
    }
    const cerrar_sesion_link = './login.html';

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
                    console.log(input.dataset);
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

    export function makeEntrega(entrega, titulo, isInitial) {
        const section = el("section", {
            class: `version ${isInitial ? "version-initial" : "version-revised"} ${entrega.entregado ? "is-ready" : "is-await"}`
        });

        const header = el("header", {
            children: [
                el("h4", { text: titulo }),
                el("span", {
                    class: `chip ${entrega.entregado ? "chip-success" : "chip-pending"}`,
                    text: entrega.entregado ? (entrega.aceptado ? "Aceptada" : "Recibida") : "Pendiente"
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

        if (entrega.pdfPath) {
            section.appendChild(
                el("a", {
                    class: "link",
                    text: "Descargar PDF",
                    attrs: { href: entrega.pdfPath, target: "_blank" }
                })
            );
        }

        //meto para ver la rubrica 
        if (entrega.aceptado != null) {
            console.log("entro a ver rubrica");
            section.appendChild(
                el("a", {
                    class: "link",
                    text: "Ver rubrica",
                    attrs: { href: `./author-verRubrica.html?title=${titulo}&id=${entrega.id}` }
                })
            );
        }

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

        console.log(projects);
        projects.forEach(proj => {
            const card = el("article", {
                class: "card project-card",
                attrs: {
                    "data-title": proj.nombre,
                }
            });

            const e = proj.entregas[0];

            const header = el("header", { class: "project-card__header" });

            const headerInfo = el("div", {
                children: [
                    el("h3", { class: "project-title", text: proj.nombre }),
                    el("p", { class: "project-description", text: `Proyecto cargado el ${e.fechaEntrega}` })
                ]
            });

            const status = el("span", {
                class: `project-status ${e.aceptado ? 'chip-success' : ""}`,
                text: e.aceptado ? "Aceptado" : "En revisión"
            });

            header.append(headerInfo, status);

            const grid = el("div", { class: "version-grid" });
            grid.appendChild(makeEntrega(e, proj.nombre, true));

            // Usa la segunda entrega como fecha si existe
            if (proj.entregas.length > 1) {
                //le pongo la date
                card.dataset.date = proj.entregas[1].fechaEntrega;

                const status = el("span", {
                    class: `project-status ${proj.entregas[0].aceptado ? 'chip-success' : ""}`,
                    text: proj.entregas[0].aceptado ? "Aceptado" : "En revisión"
                });

                header.append(headerInfo, status);

                // creo la carta de la otra entrega
                grid.appendChild(makeEntrega(proj.entregas[1], proj.nombre, false));

            }

            card.append(header, grid);
            document.querySelector('.project-list').appendChild(card); // o donde vayan tus cards
    });

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
        //const searchInput = document.getElementById('project-search');
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

            emptyState.hidden = (total > 0); //|| !searchInput.value.trim());
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
        try {
            const res = await fetch("../php/autor_getProyectos.php", { credentials: "same-origin" });
            const data = await res.json();
            if (!data.success) {
                console.error(data.message);
                return;
            }
            console.log(data);
            renderProjects(data.proyectos);
        } catch (error) {
            console.error("Error al cargar proyectos:", error);
        }
    }


    // =============================================
    //               BUSCAR AUTORES EN LA BD
    // =============================================

    export async function buscarAutores(query) {
        if (!query || query.length < 1) {
            return [];
        }

        try {
            const res = await fetch(`../php/buscarAutores.php`, {
                credentials: "same-origin"
            });
            const data = await res.json();                

            console.log(data);

            // Filtrar por nombre o correo
            const queryLower = query.toLowerCase();
            return data.autores.filter(autor => 
                autor.nombre.toLowerCase().includes(queryLower) ||
                autor.correo.toLowerCase().includes(queryLower) ||
                autor.primerApellido.toLowerCase().includes(queryLower) ||
                autor.segundoApellido.toLowerCase().includes(queryLower)

            );
        } catch (error) {
            console.error('Error al buscar autores:', error);
            return [];
        }
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

        console.log("VALORS")
        console.log(idAutores);
        console.log(id);
        console.log(autorCorrespondenciaId);
        console.log(idAutores.includes(autorCorrespondenciaId));
        if (!(idAutores.includes(autorCorrespondenciaId) || id == autorCorrespondenciaId)) {
            alert ("El autor de correspondencia debe ser un autor del proyecto.");
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

        const res = await fetch("../php/autor_crearProyecto.php", {
            method: "POST",
            body: formData,
            credentials: "same-origin" // para enviar cookies de la sesion
        });

        const data = await res.json();

        if (!data.success) {
            alert(data.message);
            return;
        }else{
            loadProjects(); // recarga los proyectos para mostrar el nuevo
            alert("Proyecto creado con éxito.");
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

    console.log("funciones disponibles:", window.agregarAutor);


    

