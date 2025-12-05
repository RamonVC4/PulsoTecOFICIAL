
(function () {
    const $ = (sel, root=document) => root.querySelector(sel);
    const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

    // Tabs para la bandeja
    $$('.board-tabs .tab').forEach(tab => {
        tab.addEventListener('click', () => {
            $$('.board-tabs .tab').forEach(t => t.classList.remove('is-active'));
            tab.classList.add('is-active');
            $$('.panel').forEach(panel => panel.classList.remove('is-active'));
            $('#' + tab.dataset.target).classList.add('is-active');
        });
    });

    

    const locale = 'es-MX';
    const dateOptionsLong = { day: '2-digit', month: 'long', year: 'numeric' };
    const dateOptionsShort = { day: '2-digit', month: 'short', year: 'numeric' };

    state = {
        new: [],
        pending: [],
        completed: []
    };

    pendingProjects = fetch('../php/revisor_getProyectos.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
    .then(data => {
        if (data.success) {
            // Aquí se procesa la información recibida
            console.log('Proyectos recibidos:', data.proyectos);
            data.proyectos.forEach(proy => {
                //Solo defino los campos que de verdad uso, no todos los que definió G
                //los meto a pending, new o completed segun corresponda
                //TODO LO SIGUIENTE ES UNSAFE, TENGO QUE CAMBIARLO PARA QUE USE SESSION DE PHP MEJOR
                const ruta = `review-session.html?doc=${proy.entregas[proy.entregas.length-1].pdfPath}&title=${proy.nombre}`;
                console.log("dentro de lo que le pone el switch ese");
                console.log(proy);
                switch (proy.entregas[proy.entregas.length-1].terminado) {
                    case null:
                        state.pending.push({
                            title: proy.nombre,
                            assigned: proy.entregas[0].fechaEntrega,//TODO, esta será puesta manualmente por el manager
                            route: ruta,
                            id: proy.id
                        });
                        break;
                    
                    case 0:
                    case 1:
                        console.log("en el case 0 y 1");
                        state.completed.push({
                            title: proy.nombre,
                            completed: '2025-10-10',//TODO, mejor le quito esto luego
                            logRoute: ruta,
                            verdict: proy.entregas[proy.entregas.length-1].aceptado ? 'Aceptado' : 'Rechazado',
                            id: proy.id
                        });
                        break;
                }
                
            });
            console.log(state);
            renderAll();
        } else {
            console.error('Error al obtener proyectos:', data.message);
        }
    })

    const metrics = {
        pending: $('[data-metric="pending-count"]'),
        pendingInfo: $('[data-metric="pending-next"]'),
        new: $('[data-metric="new-count"]'),
        newInfo: $('[data-metric="new-info"]'),
        completed: $('[data-metric="completed-count"]'),
        completedInfo: $('[data-metric="completed-info"]')
    };

    function parseDate(value) {
        return new Date(value + 'T00:00:00');
    }

    function formatDateLong(value) {
        return parseDate(value).toLocaleDateString(locale, dateOptionsLong);
    }

    function formatDateShort(value) {
        return parseDate(value).toLocaleDateString(locale, dateOptionsShort);
    }

    function getSortKey(type) {
        if (type === 'completed') return 'completed';
        return 'assigned';
    }

    function renderAll() {
        ['new', 'pending', 'completed'].forEach(renderType);
        updateMetrics();
    }

    function renderType(type) {
        const lists = document.querySelectorAll(`[data-sync="${type}"]`);
        if (!lists.length) return;

        const source = state[type]
            .slice()
            .sort((a, b) => parseDate(b[getSortKey(type)]) - parseDate(a[getSortKey(type)]));

        lists.forEach(list => {
            const limit = Number(list.dataset.limit) || source.length;
            const variant = list.dataset.variant || 'table';
            const items = source.slice(0, limit);

            list.innerHTML = '';

            items.forEach(item => {
                list.appendChild(createListItem(type, item, variant));
            });

            const emptyId = list.dataset.empty;
            if (emptyId) {
                const emptyElement = document.getElementById(emptyId);
                if (emptyElement) {
                    emptyElement.hidden = source.length > 0;
                }
            }
        });
    }

    function createListItem(type, item, variant) {
        if (variant === 'card') {
            const li = document.createElement('li');
            li.className = 'doc-row' + (type === 'new' ? ' is-new' : '');
            li.dataset.id = item.id;
            const summary = item.summary ? `<p class="doc-summary">${item.summary}</p>` : '';
            const actions = type === 'new'
                ? `
                    <button class="btn-primary" data-action="start" data-id="${item.id}" data-route="${item.route}">Comenzar revisión</button>
                    <button class="btn-outline" data-action="ack" data-id="${item.id}">Mover a bandeja</button>
                `
                : `
                    <button class="btn-outline" data-action="open" data-id="${item.id}" data-route="${item.route}">Continuar</button>
                `;
            li.innerHTML = `
                <div class="doc-info">
                    <h4 class="doc-title">${item.title}</h4>
                    <p class="doc-meta">
                        <span>Asignado: ${formatDateLong(item.assigned)}</span>
                    </p>
                    ${summary}
                </div>
                <div class="doc-actions">
                    ${actions}
                </div>
            `;
            return li;
        }

        const li = document.createElement('li');
        li.className = 'doc-item';
        li.dataset.id = item.id;

        let sub = '';
        let actionMarkup = '';

        if (type === 'new' || type === 'pending') {
            sub = `Asignado: ${formatDateShort(item.assigned)}`;
            const label = type === 'new' ? 'Registrar y abrir' : 'Continuar';
            const action = type === 'new' ? 'start' : 'open';
            const buttonClass = type === 'new' ? 'btn-tertiary' : 'btn-tertiary';
            actionMarkup = `<button class="${buttonClass}" data-action="${action}" data-id="${item.id}" data-route="${item.route}">${label}</button>`;
        } else {
            sub = `Revisado: ${formatDateShort(item.completed)} · Dictamen: ${item.verdict}`;
            actionMarkup = `<a class="link" href="${item.logRoute || '#'}" aria-label="Ver bitácora de ${item.title}">Bitácora</a>`;
        }

        li.innerHTML = `
            <div class="thumb" aria-hidden="true"></div>
            <div class="meta">
                <div class="title-panels">${item.title}</div>
                <div class="sub">${sub}</div>
            </div>
            ${actionMarkup}
        `;

        return li;
    }

    function updateMetrics() {
        if (metrics.pending) metrics.pending.textContent = state.pending.length;
        if (metrics.new) metrics.new.textContent = state.new.length;
        if (metrics.completed) metrics.completed.textContent = state.completed.length;

        if (metrics.pendingInfo) {
            if (!state.pending.length) {
                metrics.pendingInfo.textContent = 'Sin entregas próximas';
            } else {
                metrics.pendingInfo.textContent = `${state.pending.length} documento(s) en revisión`;
            }
        }

        if (metrics.newInfo) {
            metrics.newInfo.textContent = state.new.length
                ? `Coordinación asignó ${state.new.length} documento(s) reciente(s)`
                : 'Coordinación no ha asignado nuevos documentos';
        }

        if (metrics.completedInfo) {
            if (!state.completed.length) {
                metrics.completedInfo.textContent = 'Aún sin revisiones entregadas';
            } else {
                const latest = state.completed
                    .slice()
                    .sort((a, b) => parseDate(b.completed) - parseDate(a.completed))[0];
                metrics.completedInfo.textContent = `Última revisión: ${formatDateShort(latest.completed)}`;
            }
        }
    }

    function moveToPending(id) {
        const index = state.new.findIndex(item => item.id === id);
        if (index === -1) return;
        const [item] = state.new.splice(index, 1);
        state.pending.push(item);
        renderAll();
    }

    document.addEventListener('click', async event => {
        const button = event.target.closest('[data-action]');
        if (!button) return;
        const action = button.dataset.action;
        const id = button.dataset.id;
        if (!id) return;

        if (action === 'ack') {
            moveToPending(id);
            return;
        }

        if (action === 'start') {
            moveToPending(id);
            const route = button.dataset.route;
            if (route) {
                await fetch('../php/revisor_guardarIds.php', { method: 'POST', credentials: 'same-origin' , body: JSON.stringify({ id }) });
                window.location.href = route;
            }
            return;
        }

        if (action === 'open') {
            const route = button.dataset.route;
            if (route) {
                await fetch('../php/revisor_guardarIds.php', { method: 'POST', credentials: 'same-origin' , body: JSON.stringify({ id }) });
                window.location.href = route;
            }
        }
    });

    renderAll();
})();