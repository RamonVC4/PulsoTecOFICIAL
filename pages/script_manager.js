
(function () {
    const MAX_REVIEWERS = 3;
    const PAGE_SIZE = 4;
    const locale = 'es-MX';
    const longDate = { day: '2-digit', month: 'long', year: 'numeric' };
    const shortDate = { day: '2-digit', month: 'short', year: 'numeric' };
    const shortDateTime = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };

    // Variable global para los revisores
    let reviewers = [];

    async function fetchReviewers() {
        try {
            const response = await fetch('../php/manager_getRevisores.php');
            const data = await response.json();
            if (data.success) {
                reviewers = data.revisores;
                console.log("Revisores cargados:", reviewers);
            }
        } catch (error) {
            console.error("Error cargando revisores:", error);
        }
    }

    // Variable global para guardar los proyectos cargados
    let projects = [];

    async function fetchProjects() {
        try {
            // Llamada al backend
            const response = await fetch('../php/manager_getProyectos.php'); 
            const data = await response.json();

            if (data.success) {
                // Transformamos los datos 
                projects = data.proyectos.map(p => {
                    let stageName = p.stage;
                    return {
                        id: p.id, 
                        title: p.title, 
                        author: p.author || 'Autor pendiente', 
                        area: p.area || 'General', 
                        submitted: p.submitted, 
                        due: '2025-12-01', 
                        stage: stageName, 
                        rubric: { status: stageName, score: '—', updated: null },
                        assignedCountReal: p.conteo_revisores,
                        slots: [null, null, null], 
                        entregas: p.entregas,
                        locked: stageName === "Aceptado",
                        timeline: [], 
                        reviews: {}   
                    };
                });

                console.log("Proyectos cargados:", projects);
                
                // 1. Primero dibujamos la lista
                renderAll(); 

                // ejecutamos 'setActiveProject' para que traiga sus detalles de la BD.
                if (projects.length > 0) {
                    // El 'await' asegura que termine de cargar antes de dejarte interactuar
                    await setActiveProject(projects[0].id);
                }


            } else {
                console.error('El servidor respondió con error:', data.message);
            }
        } catch (error) {
            console.error('Error conectando con el backend:', error);
        }
    }

    let activeProjectId = null;
    let projectQuery = '';
    let projectFilter = 'all';
    let openSlotIndex = null;
    let projectPage = 0;
    let filteredProjects = [];

    const elements = {
        projectsList: document.getElementById('projects-list'),
        projectsEmpty: document.getElementById('projects-empty'),
        projectsPagination: document.getElementById('projects-pagination'),
        projectsPrev: document.getElementById('projects-prev'),
        projectsNext: document.getElementById('projects-next'),
        projectsPageIndicator: document.getElementById('projects-page-indicator'),
        projectSearch: document.getElementById('project-search'),
        projectFilter: document.getElementById('project-filter'),
        assignmentTitle: document.getElementById('assignment-title'),
        assignmentSubtitle: document.getElementById('assignment-subtitle'),
        assignmentStatus: document.getElementById('assignment-status'),
        assignmentPlaceholder: document.getElementById('assignment-placeholder'),
        assignmentContent: document.getElementById('assignment-content'),
        projectSummary: document.getElementById('project-summary'),
        summaryAuthor: document.getElementById('summary-author'),
        summaryArea: document.getElementById('summary-area'),
        summarySubmitted: document.getElementById('summary-submitted'),
        summaryDue: document.getElementById('summary-due'),
        slotsSection: document.getElementById('slots-section'),
        slotsGrid: document.getElementById('slots-grid'),
        assignmentNote: document.getElementById('assignment-note'),
        rubricSection: document.getElementById('rubric-section'),
        rubricGrid: document.getElementById('rubric-grid'),
        submissionsSection: document.getElementById('submissions-section'),
        submissionsGrid: document.getElementById('submissions-grid'),
        approvalSection: document.getElementById('approval-section'),
        approvalNote: document.getElementById('approval-note'),
        approveBtn: document.getElementById('approve-btn'),
        timelineSection: document.getElementById('timeline-section'),
        timelineList: document.getElementById('timeline-list'),
    };

    function formatDate(value, options = shortDate) {
        if (!value) return '—';
        return new Date(value + (value.includes('T') ? '' : 'T00:00:00')).toLocaleDateString(locale, options);
    }

    function updatePagination(totalPages, totalItems) {
        if (!elements.projectsPagination) return;
        if (!totalItems || totalPages <= 1) {
            elements.projectsPagination.hidden = true;
            return;
        }
        elements.projectsPagination.hidden = false;
        if (elements.projectsPageIndicator) {
            elements.projectsPageIndicator.textContent = `Página ${projectPage + 1} de ${totalPages}`;
        }
        if (elements.projectsPrev) {
            elements.projectsPrev.disabled = projectPage === 0;
        }
        if (elements.projectsNext) {
            elements.projectsNext.disabled = projectPage >= totalPages - 1;
        }
    }

    function formatDateTime(value) {
        if (!value) return '—';
        return new Date(value).toLocaleDateString(locale, shortDateTime);
    }

    function getProject(id) {
        return projects.find(project => project.id === id);
    }

    function getReviewer(id) {
        // Usamos == (doble igual) para que el numero 1 sea igual al texto "1"
        return reviewers.find(reviewer => reviewer.id == id); 
    }

    function statusClass(stage) {
        if (!stage) return '';
        const normalized = stage.toLowerCase();
        if (normalized.includes('prioridad') || normalized.includes('pendiente')) return 'is-critical';
        if (normalized.includes('sin revisar')) return 'is-warning';
        if (normalized.includes('revisión')) return 'is-info';
        if (normalized.includes('finalizado') || normalized.includes('aceptado') || normalized.includes('cerrado')) return 'is-success';
        return 'is-neutral';
    }

        // Variable global para guardar revisores temporales (para que se vean los nombres)
        // Variable global auxiliar
    if (typeof tempReviewers === 'undefined') var tempReviewers = {}; 

    async function setActiveProject(id) {
        activeProjectId = id;
        
        const localProject = filteredProjects.find(p => p.id === id);
        
        // Paginación
        const indexOnList = filteredProjects.findIndex(project => project.id === id);
        if (indexOnList !== -1) {
            projectPage = Math.floor(indexOnList / PAGE_SIZE);
        }
        
        // PEDIR DATOS A PHP
        try {
            const response = await fetch(`../php/manager_getDetalles.php?id=${id}`);
            const data = await response.json();

            if (data.success) {
                // Limpiamos slots
                localProject.slots = [null, null, null]; 
                localProject.reviews = {}; 

                // Llenamos slots
                data.interacciones.forEach((interaccion, index) => {
                    if (index < 3) {
                        localProject.slots[index] = interaccion.revisor_id;

                        localProject.reviews[interaccion.revisor_id] = {
                            iterations: [{
                                submission: 1, 
                                status: interaccion.terminado ? 'Terminado' : 'En progreso', 
                                score: '—', 
                                updated: interaccion.fecha_limite, 
                                summary: 'Revisor asignado.'
                            }]
                        };
                        
                        // Registramos el nombre para que el HTML lo encuentre
                        addTempReviewer(interaccion);
                    }
                });
            }
        } catch (error) {
            console.error("Error cargando detalles:", error);
        }

        openSlotIndex = null;
        renderProjects();   
        renderAssignment(); 
    }

    // ESTA FUNCIÓN DEBE ESTAR AFUERA, DISPONIBLE GLOBALMENTE
    // Función auxiliar para registrar revisores que vienen de la BD
    function addTempReviewer(data) {
        if (typeof reviewers === 'undefined') reviewers = [];

        const existing = reviewers.find(r => r.id == data.revisor_id);
        
        if (!existing) {
            // Truco visual: Si no tenemos nombre real, inventamos uno basado en el correo
            // Ejemplo: "andrea.molina@..." -> "Andrea Molina"
            let displayName = data.revisor_email;
            if (data.revisor_email.includes('@')) {
                const parts = data.revisor_email.split('@')[0].split('.');
                // Capitalizamos la primera letra de cada parte
                displayName = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
            }

            reviewers.push({
                id: data.revisor_id, 
                name: displayName, // Ahora mostrará "Andrea Molina" en vez del correo
                email: data.revisor_email,
                expertise: ['General'] 
            });
        }
    }

    function renderProjects() {
        filteredProjects = projects
            .filter(project => {
                //const assignedCount = getAssigned(project).length; <--Viejo
                // (Si le diste clic y editaste, usamos getAssigned, si no, usamos el de PHP)
                const assignedCount = project.slots.filter(s => s).length || project.assignedCountReal || 0;
                const hayQuery = project.title.toLowerCase().includes(projectQuery) ||
                    project.author.toLowerCase().includes(projectQuery) ||
                    project.area.toLowerCase().includes(projectQuery);
                if (!hayQuery) return false;

                if (projectFilter === 'open') return assignedCount < MAX_REVIEWERS;
                if (projectFilter === 'full') return assignedCount >= MAX_REVIEWERS;
                if (projectFilter === 'review') return project.stage.toLowerCase().includes('revisión');
                if (projectFilter === 'completed') return project.rubric.status.toLowerCase().includes('aceptado') || project.stage.toLowerCase().includes('final');
                return true;
            })
            .sort((a, b) => new Date(a.due) - new Date(b.due));

        const totalItems = filteredProjects.length;
        const totalPages = totalItems ? Math.ceil(totalItems / PAGE_SIZE) : 1;

        if (totalItems === 0) {
            projectPage = 0;
        } else {
            projectPage = Math.min(projectPage, totalPages - 1);
            projectPage = Math.max(projectPage, 0);
        }

        const start = projectPage * PAGE_SIZE;
        const pageItems = filteredProjects.slice(start, start + PAGE_SIZE);

        elements.projectsList.innerHTML = '';

        pageItems.forEach(project => {
            const assignedCount = getAssigned(project).length;
            const item = document.createElement('li');
            item.className = `project-card ${statusClass(project.stage)}` + (project.id === activeProjectId ? ' is-active' : '');
            item.dataset.id = project.id;
            item.innerHTML = `
                <header>
                    <h3>${project.title}</h3>
                    <span class="stage-pill">${project.stage}</span>
                </header>
                <p class="project-meta">
                    <span>${project.author}</span>
                    <span>Área: ${project.area}</span>
                </p>
                <div class="project-footer">
                    <div class="project-dates">
                        <span>Recibido: ${formatDate(project.submitted)}</span>
                        <span>Límite: ${formatDate(project.due)}</span>
                    </div>
                    <div class="project-assignments">
                        <span>${assignedCount}/${MAX_REVIEWERS} revisores</span>
                        <span>${project.rubric.status}</span>
                    </div>
                </div>
            `;
            item.addEventListener('click', () => setActiveProject(project.id));
            elements.projectsList.appendChild(item);
        });

        elements.projectsEmpty.hidden = totalItems > 0;
        updatePagination(totalPages, totalItems);

        if (totalItems === 0) {
            activeProjectId = null;
            renderAssignment(true);
        }
    }

    function renderAssignment(showPlaceholderOnly = false) {
        if (!activeProjectId || showPlaceholderOnly) {
            elements.assignmentTitle.textContent = 'Selecciona un proyecto';
            elements.assignmentSubtitle.textContent = 'Aquí podrás revisar sus detalles, asignar o reemplazar revisores y consultar la rúbrica.';
            elements.assignmentStatus.textContent = '—';
            elements.assignmentStatus.className = 'status-pill';
            elements.assignmentPlaceholder.hidden = false;
            if (elements.assignmentContent) {
                elements.assignmentContent.hidden = true;
            }
            elements.projectSummary.hidden = true;
            elements.slotsSection.hidden = true;
            elements.rubricSection.hidden = true;
            elements.submissionsSection.hidden = true;
            elements.approvalSection.hidden = true;
            elements.timelineSection.hidden = true;
            openSlotIndex = null;
            return;
        }

        const project = getProject(activeProjectId);
        elements.assignmentPlaceholder.hidden = true;
        if (elements.assignmentContent) {
            elements.assignmentContent.hidden = false;
        }

        elements.assignmentTitle.textContent = project.title;
        elements.assignmentSubtitle.textContent = `Autor: ${project.author} · Área: ${project.area}`;
        elements.assignmentStatus.textContent = project.stage;
        elements.assignmentStatus.className = `status-pill ${statusClass(project.stage)}`;

        elements.projectSummary.hidden = false;
        elements.summaryAuthor.textContent = project.author;
        elements.summaryArea.textContent = project.area;
        elements.summarySubmitted.textContent = formatDate(project.submitted, longDate);
        elements.summaryDue.textContent = formatDate(project.due, longDate);

        openSlotIndex = null;
        renderSlots(project);
        renderRubricSummary(project);
        renderSubmissions(project);
        renderApproval(project);
        renderTimeline(project);
    }

    function getSlots(project) {
        if (!Array.isArray(project.slots)) {
            project.slots = Array.from({ length: MAX_REVIEWERS }, () => null);
        } else {
            project.slots = Array.from({ length: MAX_REVIEWERS }, (_, index) => project.slots[index] || null);
        }
        return project.slots;
    }

    function getAssigned(project) {
        return getSlots(project).filter(Boolean);
    }

    function ensureReviewEntry(project, reviewerId) {
        if (!project.reviews) {
            project.reviews = {};
        }
        if (!project.reviews[reviewerId]) {
            project.reviews[reviewerId] = {
                iterations: [
                    { submission: project.submissions?.length || 1, status: 'Asignado', score: '—', updated: new Date().toISOString().slice(0, 10), summary: 'Asignado recientemente.' }
                ]
            };
        }
    }

    function renderSlots(project) {
        const slots = getSlots(project);
        const locked = !!project.locked;
        const assignedIds = getAssigned(project);
        
        // Convertimos todo a String para asegurar que "1" sea igual a 1
        const availableReviewers = reviewers.filter(reviewer => {
            const estaOcupado = assignedIds.some(occupiedId => String(occupiedId) === String(reviewer.id));
            return !estaOcupado; 
        });

        elements.slotsSection.hidden = false;
        elements.slotsGrid.innerHTML = '';

        slots.forEach((reviewerId, index) => {
            const reviewer = reviewerId ? getReviewer(reviewerId) : null;
            const isOpen = !locked && !reviewerId && openSlotIndex === index;
            const card = document.createElement('div');
            card.className = 'slot-card' + (reviewerId ? ' is-filled' : ' is-empty');
            if (locked) {
                card.classList.add('is-disabled');
            }

            if (reviewer) {
                const rubricEntry = (project.reviews?.[reviewerId]?.iterations || [])
                    .slice()
                    .sort((a, b) => new Date(b.updated || 0) - new Date(a.updated || 0))[0];
                const statusText = rubricEntry?.status || project.rubric?.status || 'Sin avances';
                const badgeClass = statusVariant(statusText);
                const lastUpdated = rubricEntry?.updated || project.rubric?.updated;
                const score = rubricEntry?.score && rubricEntry.score !== '—' ? rubricEntry.score : (project.rubric?.score || '—');

                card.innerHTML = `
                    <header>
                        <div class="slot-header-info">
                            <span class="slot-label">Revisor ${index + 1}</span>
                            <strong>${reviewer.name}</strong>
                        </div>
                        ${locked ? '' : `<button type="button" class="slot-remove" data-slot="${index}" aria-label="Liberar a ${reviewer.name}">×</button>`}
                    </header>
                    <div class="slot-meta">
                        <span>${reviewer.email}</span>
                        <span>${reviewer.expertise.join(' · ')}</span>
                    </div>
                    <div class="slot-progress">
                        <span class="submission-status ${badgeClass}">${statusText}</span>
                        <span class="muted tiny">${lastUpdated ? `Actualizado: ${formatDate(lastUpdated, shortDate)}` : 'Sin actualización'}</span>
                        <span class="muted tiny">${score && score !== '—' ? `Puntaje: ${score}` : 'Sin puntaje'}</span>
                    </div>
                    <div class="slot-actions">
                        <button type="button" class="btn-link slot-rubric" data-project="${project.id}" data-reviewer="${reviewerId}">Ver rúbrica</button>
                    </div>
                `;
            } else {

                const suggestionsMarkup = isOpen
                    ? `
                        <div class="slot-suggestions">
                            <p class="muted tiny">${availableReviewers.length ? 'Selecciona un revisor disponible:' : 'No hay revisores disponibles.'}</p>
                            
                            <div style="margin-bottom: 8px;">
                                <input type="text" class="reviewer-search-input" data-slot="${index}" placeholder="Buscar por nombre..." style="width: 100%; padding: 6px; border-radius: 6px; border: 1px solid #ccc; font-size: 13px;">
                            </div>

                            <ul class="reviewer-list-${index}">
                                ${availableReviewers.map(reviewer => `
                                    <li class="slot-suggestion" data-name="${reviewer.name.toLowerCase()}" data-email="${reviewer.email.toLowerCase()}">
                                        <div>
                                            <strong>${reviewer.name}</strong>
                                            <span class="muted tiny">${reviewer.email}</span>
                                            <span class="muted tiny">${reviewer.expertise.join(' · ')}</span>
                                        </div>
                                        <button type="button" class="btn-secondary slot-assign-btn" data-id="${reviewer.id}" data-slot="${index}">Asignar</button>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : '';

                card.innerHTML = locked
                    ? `
                        <header>
                            <div class="slot-header-info">
                                <span class="slot-label">Revisor ${index + 1}</span>
                                <strong>Proyecto aprobado</strong>
                            </div>
                        </header>
                        <p class="muted small">No se pueden hacer nuevas asignaciones.</p>
                    `
                    : `
                        <header>
                            <div class="slot-header-info">
                                <span class="slot-label">Revisor ${index + 1}</span>
                                <strong>Espacio disponible</strong>
                            </div>
                        </header>
                        <button type="button" class="slot-assign" data-slot="${index}">BUSCAR REVISOR</button>
                        ${suggestionsMarkup}
                    `;
            }

            elements.slotsGrid.appendChild(card);
        });

        const note = elements.assignmentNote;
        if (note && note.dataset.flash !== 'true') {
            if (locked) {
                note.textContent = 'Proyecto aprobado. La asignación está bloqueada.';
                note.classList.remove('is-warning');
            } else {
                const remaining = MAX_REVIEWERS - assignedIds.length;
                note.textContent = remaining > 0
                    ? `Quedan ${remaining} espacio(s) disponible(s) para asignar revisores.`
                    : 'Asignación completa.';
                note.classList.remove('is-warning');
            }
        }
        if (note) note.dataset.flash = 'false';

        if (locked) {
            return;
        }

        elements.slotsGrid.querySelectorAll('.slot-assign').forEach(button => {
            button.addEventListener('click', () => {
                const slotIdx = Number(button.dataset.slot);
                openSlotIndex = openSlotIndex === slotIdx ? null : slotIdx;
                renderSlots(project);
            });
        });

        elements.slotsGrid.querySelectorAll('.slot-assign-btn').forEach(button => {
            button.addEventListener('click', async () => { 
                const reviewerId = button.dataset.id;
                const slotIdx = Number(button.dataset.slot);
                
                button.disabled = true;
                button.textContent = "...";

                const payload = {
                    idProyecto: project.id,
                    idRevisor: reviewerId,
                    fechaLimite: '2025-12-31' 
                };

                try {
                    const res = await fetch('../php/manager_asignarRevisor.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    const data = await res.json();

                    if (data.success) {
                        alert("Asignado correctamente");
                        openSlotIndex = null;
                        setActiveProject(project.id); 
                    } else {
                        alert("Error: " + data.message);
                        button.disabled = false;
                        button.textContent = "Asignar";
                    }
                } catch (error) {
                    console.error(error);
                    alert("Error de conexión");
                    button.disabled = false;
                    button.textContent = "Asignar";
                }
            });
        });

        elements.slotsGrid.querySelectorAll('.slot-remove').forEach(button => {
            button.addEventListener('click', () => {
                removeReviewer(project.id, Number(button.dataset.slot));
            });
        });

        elements.slotsGrid.querySelectorAll('.slot-rubric').forEach(button => {
            button.addEventListener('click', () => {
                const projectId = button.dataset.project;
                const reviewerId = button.dataset.reviewer;
                window.location.href = `./manager-verRubrica.html?doc=${projectId}&reviewer=${reviewerId}`;
            });
        });

        // Busqueda por nombre para revisores
        elements.slotsGrid.querySelectorAll('.reviewer-search-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                const slotIndex = e.target.dataset.slot;
                const list = document.querySelector(`.reviewer-list-${slotIndex}`);
                
                // Buscamos todos los elementos de la lista (li)
                const items = list.querySelectorAll('.slot-suggestion');

                items.forEach(item => {
                    const name = item.dataset.name;   // El nombre que guardamos en el data-attribute
                    const email = item.dataset.email; // El email
                    
                    if (name.includes(term) || email.includes(term)) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
            input.addEventListener('click', (e) => e.stopPropagation());
        });
    }

    function latestUpdatedFromReviews(project) {
        if (!project.reviews) return null;
        const timestamps = [];
        Object.values(project.reviews).forEach(entry => {
            entry?.iterations?.forEach(iter => {
                if (iter.updated) timestamps.push(iter.updated);
            });
        });
        if (!timestamps.length) return null;
        return timestamps.sort((a, b) => new Date(b) - new Date(a))[0];
    }

    function statusVariant(statusText = '') {
        const normalized = statusText.toLowerCase();
        if (normalized.includes('acept') || normalized.includes('aprob')) return 'is-success';
        if (normalized.includes('pend') || normalized.includes('progreso')) return 'is-warning';
        if (normalized.includes('observ') || normalized.includes('rechaz') || normalized.includes('error')) return 'is-critical';
        return '';
    }

    function renderRubricSummary(project) {
        const slots = getSlots(project);
        if (!elements.rubricSection || !elements.rubricGrid) {
            return;
        }
        elements.rubricSection.hidden = false;
        elements.rubricGrid.innerHTML = '';

        slots.forEach((reviewerId, index) => {
            const card = document.createElement('article');
            card.className = 'rubric-card';
            const slotLabel = `Revisor ${index + 1}`;

            if (!reviewerId) {
                card.classList.add('is-empty');
                card.innerHTML = `
                    <header>
                        <div>
                            <span class="rubric-slot">${slotLabel}</span>
                            <strong>Espacio disponible</strong>
                        </div>
                    </header>
                    <p class="muted small">Asigna un revisor para habilitar su rúbrica individual.</p>
                `;
            } else {
                const reviewer = getReviewer(reviewerId);
                const iterations = (project.reviews?.[reviewerId]?.iterations || [])
                    .slice()
                    .sort((a, b) => (a.submission || 0) - (b.submission || 0));
                const latest = iterations
                    .slice()
                    .sort((a, b) => new Date(b.updated || 0) - new Date(a.updated || 0))[0];
                const statusText = latest?.status || project.rubric?.status || 'Sin avances';
                const badgeClass = statusVariant(statusText);
                const lastUpdated = latest?.updated || project.rubric?.updated;
                const score = latest?.score && latest.score !== '—' ? latest.score : (project.rubric?.score || '—');

                card.innerHTML = `
                    <header>
                        <div>
                            <span class="rubric-slot">${slotLabel}</span>
                            <strong>${reviewer?.name || 'Revisor'}</strong>
                            <span class="muted tiny">${reviewer?.email || ''}</span>
                        </div>
                        <span class="submission-status ${badgeClass}">${statusText}</span>
                    </header>
                    <div class="rubric-body">
                        <p class="muted tiny">${(reviewer?.expertise || []).join(' · ')}</p>
                        <dl>
                            <div>
                                <dt>Última actualización</dt>
                                <dd>${lastUpdated ? formatDate(lastUpdated, longDate) : '—'}</dd>
                            </div>
                            <div>
                                <dt>Puntaje</dt>
                                <dd>${score || '—'}</dd>
                            </div>
                        </dl>
                        <div class="rubric-iterations">
                            ${iterations.length ? iterations.map(iter => `
                                <div class="rubric-iteration">
                                    <span>${iter.submission ? `Envío ${iter.submission}` : 'Envío'}</span>
                                    <span>${iter.score && iter.score !== '—' ? `Puntaje: ${iter.score}` : ''}</span>
                                    <span>${iter.updated ? formatDate(iter.updated, shortDate) : ''}</span>
                                </div>
                                <p class="muted tiny">${iter.summary || 'Sin comentarios.'}</p>
                            `).join('') : '<p class="muted tiny">Sin rúbrica registrada.</p>'}
                        </div>
                    </div>
                    <div class="rubric-actions">
                        <button type="button" class="btn-link rubric-open" data-project="${project.id}" data-reviewer="${reviewerId}">Ver rúbrica</button>
                    </div>
                `;
            }

            elements.rubricGrid.appendChild(card);
        });

        elements.rubricGrid.querySelectorAll('.rubric-open').forEach(button => {
            button.addEventListener('click', () => {
                const projectId = button.dataset.project;
                const reviewerId = button.dataset.reviewer;
                window.location.href = `./manager-verRubrica.html?doc=${projectId}&reviewer=${reviewerId}`;
            });
        });
    }

    function renderSubmissions(project) {
        // Damos prioridad a 'entregas'
        const dataList = (project.entregas && project.entregas.length > 0) 
            ? project.entregas 
            : (project.submissions || []);

        if (!dataList.length) {
            elements.submissionsSection.hidden = true;
            return;
        }

        elements.submissionsSection.hidden = false;
        elements.submissionsGrid.innerHTML = '';

        // Recorremos la lista de entregas
        dataList.forEach((item, index) => {
            const card = document.createElement('article');
            card.className = 'submission-card';
            const label = item.numeroEntrega ? `Entrega ${item.numeroEntrega}` : `Entrega ${index + 1}`;
            
            // Formateamos la fecha (si existe)
            const dateVal = item.fechaEntrega || item.submitted;
            const dateStr = dateVal ? formatDate(dateVal, longDate) : '—';
            
            // Obtenemos el path del PDF
            const pdfUrl = item.pdfPath;

            let statusText = "Pendiente";
            let badgeClass = "";


            if (item.aceptado == 1) {
                statusText = "Aceptado";
                badgeClass = "is-success";
            } else if (item.aceptado == 0 && item.entregado == 1) { 
                statusText = "Revisión"; 
                badgeClass = "is-warning"; 
            } else if (item.entregado == 1) {
                statusText = "Recibido";
                badgeClass = "is-info";
            } else if (item.status) {
                statusText = item.status;
                badgeClass = statusVariant(item.status);
            }

            card.innerHTML = `
                <header>
                    <strong>${label}</strong>
                    <span class="submission-status ${badgeClass}">${statusText}</span>
                </header>
                <div class="submission-meta">
                    <span>Registrado: ${dateStr}</span>
                    
                    ${ pdfUrl 
                        ? `<a href="${pdfUrl}" target="_blank" class="btn-link" style="display:flex; align-items:center; gap:4px; margin-top:6px;">
                            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path><path d="M14 2v6h6"></path><path d="M16 13H8"></path><path d="M16 17H8"></path><path d="M10 9H8"></path></svg>
                            Ver documento
                        </a>`
                        : '<span class="muted small">Sin archivo adjunto</span>'
                    }
                </div>
            `;
            elements.submissionsGrid.appendChild(card);
        });
    }

    function renderApproval(project) {
        if (!elements.approvalSection) return;
        elements.approvalSection.hidden = false;
        const locked = !!project.locked;
        if (locked) {
            elements.approvalNote.textContent = 'Proyecto aprobado y cerrado. No se permiten más cambios.';
            elements.approveBtn.disabled = true;
        } else {
            const pending = getAssigned(project).length < MAX_REVIEWERS;
            elements.approvalNote.textContent = pending
                ? 'Completa la asignación y rúbricas antes de aprobar.'
                : 'Cuando todo esté en orden puedes aprobar para cerrar el proyecto.';
            elements.approveBtn.disabled = false;
        }
        elements.approveBtn.onclick = () => approveProject(project.id);
    }

    async function approveProject(projectId) {
        const project = getProject(projectId);
        if (!project || project.locked) return;

        // Confirmación de seguridad
        if (!confirm("¿Estás seguro de aprobar este proyecto? Esta acción cerrará el proceso.")) {
            return;
        }

        const btn = document.getElementById('approve-btn');
        if(btn) {
            btn.textContent = "Proyecto aprobado";
            btn.disabled = true;
        }

        try {
            // Enviamos la orden al backend
            const response = await fetch('../php/manager_aprobarProyecto.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idProyecto: projectId })
            });

            const data = await response.json();

            if (data.success) {
                alert("¡Proyecto aprobado exitosamente!");
                
                // Actualizamos la lista
                await fetchProjects(); 
                setActiveProject(projectId); 
            } else {
                alert("Error: " + data.message);
                if(btn) {
                    btn.textContent = "Aprobar proyecto";
                    btn.disabled = false;
                }
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("No se pudo conectar con el servidor.");
            if(btn) {
                btn.textContent = "Aprobar proyecto";
                btn.disabled = false;
            }
        }
    }

    function renderTimeline(project) {
        elements.timelineSection.hidden = false;
        elements.timelineList.innerHTML = '';
        project.timeline
            .slice()
            .sort((a, b) => new Date(b.at) - new Date(a.at))
            .forEach(entry => {
                const li = document.createElement('li');
                li.className = `timeline-item timeline-${entry.type}`;
                li.innerHTML = `
                    <span class="timeline-meta">${formatDateTime(entry.at)}</span>
                    <p>${entry.message}</p>
                `;
                elements.timelineList.appendChild(li);
            });

        if (!project.timeline.length) {
            elements.timelineList.innerHTML = '<li class="timeline-item">Sin registros todavía.</li>';
        }
    }

    function showAssignmentNote(message, isWarning = false) {
        const note = elements.assignmentNote;
        if (!note) return;
        note.dataset.flash = 'true';
        note.textContent = message;
        note.classList.toggle('is-warning', !!isWarning);
        if (message) {
            setTimeout(() => {
                note.dataset.flash = 'false';
                note.classList.remove('is-warning');
                const project = getProject(activeProjectId);
                if (project) {
                    renderSlots(project);
                }
            }, 4000);
        }
    }


    async function removeReviewer(projectId, slotIndex) {
        // 1. Obtenemos el ID del revisor que está en ese espacio (slot)
        const project = getProject(projectId);
        const slots = getSlots(project);
        const reviewerId = slots[slotIndex];

        if (!reviewerId) return; // Si no hay nadie, no hacemos nada

        // 2. Preguntamos confirmación (Opcional, pero recomendado)
        if (!confirm("¿Estás seguro de que deseas eliminar a este revisor? Se perderán sus avances.")) {
            return;
        }

        // 3. Enviamos la orden de borrar al Backend
        try {
            const payload = {
                idProyecto: projectId,
                idRevisor: reviewerId
            };

            const response = await fetch('../php/manager_eliminarRevisor.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success) {
                // ÉXITO: Limpiamos visualmente y recargamos
                
                // Borramos del array local inmediatamente para que se sienta rápido
                project.slots[slotIndex] = null;
                delete project.reviews[reviewerId];
                
                // Agregamos al historial (timeline) visual
                project.timeline.unshift({
                    type: 'manager',
                    message: 'Se eliminó un revisor del proyecto',
                    at: new Date().toISOString()
                });

                // Recargamos los datos reales de la BD para asegurar que todo esté sincrinizado
                setActiveProject(projectId);
                
                alert("Revisor eliminado correctamente.");
            } else {
                alert("Error al eliminar: " + data.message);
            }

        } catch (error) {
            console.error("Error de red:", error);
            alert("No se pudo conectar con el servidor.");
        }
    }

    // function renderHistory() {
    //     elements.historyTable.innerHTML = '';
    //     projects
    //         .slice()
    //         .sort((a, b) => new Date(b.submitted) - new Date(a.submitted))
    //         .forEach(project => {
    //             const row = document.createElement('tr');
    //             const reviewerNames = getAssigned(project).map(id => getReviewer(id)?.name || '—').join(', ') || 'Sin asignar';
    //             row.innerHTML = `
    //                 <td><code>${project.id}</code></td>
    //                 <td>
    //                     <div class="history-project">
    //                         <strong>${project.title}</strong>
    //                         <span class="muted small">${project.author}</span>
    //                     </div>
    //                 </td>
    //                 <td><span class="status-pill ${statusClass(project.stage)}">${project.stage}</span></td>
    //                 <td>${project.rubric.status}${project.rubric.score && project.rubric.score !== '—' ? ` · ${project.rubric.score}` : ''}</td>
    //                 <td>${reviewerNames}</td>
    //                 <td>${project.rubric.updated ? formatDate(project.rubric.updated, shortDate) : formatDate(project.submitted, shortDate)}</td>
    //             `;
    //             elements.historyTable.appendChild(row);
    //         });
    // }

    function updateMetrics() {
        const total = projects.length;
        const open = projects.filter(project => getAssigned(project).length < MAX_REVIEWERS).length;
        const review = projects.filter(project => project.stage.toLowerCase().includes('revisión')).length;
        const completed = projects.filter(project => project.rubric.status.toLowerCase().includes('aceptado') || project.stage.toLowerCase().includes('final')).length;

        elements.metrics.total.textContent = total;
        elements.metrics.updated.textContent = `Actualización: ${formatDate(new Date().toISOString().slice(0, 10), longDate)}`;
        elements.metrics.open.textContent = open;
        elements.metrics.review.textContent = review;
        elements.metrics.completed.textContent = completed;
        if (elements.metrics.completedInfo) {
            elements.metrics.completedInfo.textContent = completed
                ? `Última rúbrica: ${formatDate(projects.slice().sort((a, b) => new Date(b.rubric.updated || 0) - new Date(a.rubric.updated || 0))[0].rubric.updated || new Date().toISOString().slice(0, 10), shortDate)}`
                : 'Sin rúbricas finalizadas aún';
        }
    }

    function renderAll() {
        renderProjects();
        renderAssignment();
    }

    elements.projectFilter.addEventListener('change', event => {
        projectFilter = event.target.value;
        projectPage = 0;
        renderProjects();
    });

    if (elements.projectsPrev) {
        elements.projectsPrev.addEventListener('click', () => {
            if (projectPage > 0) {
                projectPage -= 1;
                const startIndex = projectPage * PAGE_SIZE;
                const nextProject = filteredProjects[startIndex];
                if (nextProject) {
                    setActiveProject(nextProject.id);
                } else {
                    renderProjects();
                }
            }
        });
    }

    if (elements.projectsNext) {
        elements.projectsNext.addEventListener('click', () => {
            const totalPages = filteredProjects.length ? Math.ceil(filteredProjects.length / PAGE_SIZE) : 1;
            if (projectPage < totalPages - 1) {
                projectPage += 1;
                const startIndex = projectPage * PAGE_SIZE;
                const nextProject = filteredProjects[startIndex];
                if (nextProject) {
                    setActiveProject(nextProject.id);
                } else {
                    renderProjects();
                }
            }
        });
    }

    elements.projectSearch.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            projectQuery = event.target.value.trim().toLowerCase();
            projectPage = 0;
            renderProjects();
        }
    });

    elements.projectSearch.addEventListener('change', event => {
        projectQuery = event.target.value.trim().toLowerCase();
        projectPage = 0;
        renderProjects();
    });


    async function initManager() {
    console.log("Iniciando sistema...");
    await fetchReviewers(); // 1. Primero revisores
    await fetchProjects();  // 2. Luego proyectos
}
initManager();
})();

    const hideButton = document.querySelector('.hide-button');

    function toggleProjects() {
        const projectsList = document.querySelector('.projects-list');
        projectsList.style.display = projectsList.style.display === 'none' ? 'block' : 'none';
        hideButton.textContent = projectsCard.style.display === 'none' ? 'Mostrar' : 'Ocultar';
    }

