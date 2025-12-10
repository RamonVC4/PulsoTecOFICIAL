<?php require_once '../php/protect_revisor.php'; ?>
<!DOCTYPE html>

<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Revisor - Panel principal</title>
    <link rel="stylesheet" href="../styles/styles_general.css">
    <link rel="stylesheet" href="../styles/styles_revisor.css">
</head>
<body>
    <header class="site-header">
        <div class="header-top">
            <div class="container">
                <div class="logo-text">PT</div>
                <h1 class="title">PULSO<span class="gold">TEC</span></h1>
            </div>
        </div>
        <nav class="nav-bar">
            <div class="container">
                <ul class="nav-list">
                    <li><a href="../Index.html">INICIO</a></li>
                    <li><a href="#">DOCUMENTOS</a></li>
                    <!-- <li><a href="#">AYUDA</a></li> -->
                    <li class="login"><a href="./login.html">CERRAR SESIÓN</a></li>
                </ul>
            </div>
        </nav>
    </header>
    
    <main class="container revisor-main">
        <section class="revisor-overview">
            <div class="overview-copy">
                <h2>Panel de revisión</h2>
                <p class="muted">Gestiona tus solicitudes y prioriza las revisiones que ya aceptaste. Mantén tu bandeja limpia antes de tomar nuevos documentos.</p>
            </div>
            <div class="overview-metrics">
                <article class="metric-card is-critical" aria-label="Revisiones en curso">
                    <span class="metric-label">Pendientes</span>
                    <span class="metric-value" data-metric="pending-count">0</span>
                    <p class="metric-sub" data-metric="pending-next">Sin entregas próximas</p>
                </article>
                <article class="metric-card is-info" aria-label="Nuevos documentos asignados">
                    <span class="metric-label">Nuevos</span>
                    <span class="metric-value" data-metric="new-count">0</span>
                    <p class="metric-sub" data-metric="new-info">Coordinación no ha asignado nuevos documentos</p>
                </article>
                <article class="metric-card is-success" aria-label="Revisiones entregadas">
                    <span class="metric-label">Entregadas</span>
                    <span class="metric-value" data-metric="completed-count">0</span>
                    <p class="metric-sub" data-metric="completed-info">Aún sin revisiones entregadas</p>
                </article>
            </div>
        </section>

        <section class="revisor-board">
            <!-- <article class="card new-card" aria-labelledby="new-title">
                <header class="card-head">
                    <div>
                        <h3 id="new-title">Nuevos asignados</h3> -->
                        <!-- esto de bandeja para que es? -->
                        <!-- <p class="muted">El área de coordinación te asignó estos documentos. Confirma la recepción para moverlos a tu bandeja.</p>
                    </div>
                    <span class="badge badge-info">Nuevos</span>
                </header>

                <ul class="doc-queue" data-sync="new" data-variant="card" data-empty="empty-new"></ul>
                <div class="doc-empty" id="empty-new" hidden>No tienes nuevos documentos pendientes de confirmar.</div>
            </article> -->

            <article class="card focus-card" aria-labelledby="focus-title">
                <header class="card-head">
                    <div>
                        <h3 id="focus-title">Revisiones pendientes</h3>
                        <p class="muted">Accede a tus documentos en curso y continúa con la evaluación cuando lo necesites.</p>
                    </div>
                    <span class="badge badge-critical">Prioridad alta</span>
                </header>

                <ul class="doc-queue focus-list" data-sync="pending" data-variant="card" data-limit="3" data-empty="empty-pending"></ul>
                <div class="doc-empty" id="empty-pending" hidden>Cuando confirmes o avances un documento aparecerá aquí.</div>
            </article>

            <aside class="card board-card" aria-labelledby="board-title">
                <header class="card-head">
                    <div>
                        <h3 id="board-title">Bandeja de documentos</h3>
                        <p class="muted">Consulta los documentos recién asignados, tus revisiones en curso y el historial.</p>
                    </div>
                    <!-- <button class="btn-secondary" type="button">Exportar resumen</button> -->
                </header>


                <!-- BUSCADOR DE DOCUMENTOS -->
                <div class="board-tools">
                    <label class="sr-only" for="search">Buscar documentos</label>
                    <input id="search" type="search" placeholder="Buscar por título, autor o fecha...">
                </div>


                <!-- TABS PARA LAS LISTAS DE DOCUMENTOS -->
                <div class="tabs board-tabs" role="tablist" aria-label="Listas de documentos">
                    <button id="tab-nuevos" class="tab is-active" role="tab" aria-selected="true" data-target="panel-nuevos">Nuevos</button>
                    <button id="tab-pendientes" class="tab" role="tab" aria-selected="false" data-target="panel-pendientes">En curso</button>
                    <button id="tab-revisados" class="tab" role="tab" aria-selected="false" data-target="panel-revisados">Revisados</button>
                </div>

                <!-- PÁNELES DE AVISOS DE "NO DOCUMENTOS ENCONTRADOS" -->
                <div class="panels">
                    <ul id="panel-nuevos" class="docs-list panel is-active" role="tabpanel" aria-labelledby="tab-nuevos" data-sync="new" data-variant="table" data-empty="empty-panel-new"></ul>
                    <div class="doc-empty is-panel" id="empty-panel-new" hidden>Sin nuevos documentos asignados por el momento.</div>

                    <ul id="panel-pendientes" class="docs-list panel" role="tabpanel" aria-labelledby="tab-pendientes" data-sync="pending" data-variant="table" data-empty="empty-panel-pending"></ul>
                    <div class="doc-empty is-panel" id="empty-panel-pending" hidden>No tienes documentos en curso.</div>

                    <ul id="panel-revisados" class="docs-list panel" role="tabpanel" aria-labelledby="tab-revisados" data-sync="completed" data-variant="table" data-empty="empty-panel-completed"></ul>
                    <div class="doc-empty is-panel" id="empty-panel-completed" hidden>Aún no hay revisiones concluidas.</div>
                </div>


            </aside>
        </section>
    </main>

    <!-- SCRIPT PARA EL REVISOR -->
    <script src="../pages/script_revisor.js"></script>
</body>
</html>

