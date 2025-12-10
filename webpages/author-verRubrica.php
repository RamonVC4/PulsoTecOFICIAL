<?php require_once '../php/protect_author.php'; ?>
<!DOCTYPE html>

<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Revisión de documento</title>
    <link rel="stylesheet" href="../styles/styles_general.css">
    <link rel="stylesheet" href="../styles/styles_revisor.css">
</head>



<body>
    <header class="site-header">
        <!-- HEADER CON JS -->
    </header>



    <!-- HEADER SECUNDARIO -->
    <main class="container container-review review-session-main">
        <header class="session-head">
            <!-- HEADER CON JS -->
        </header>

        <div class="session-layout is-rubric-open rubric-author" id="session-layout">
            <aside class="rubric-panel" id="rubric-panel" aria-label="Rúbrica de evaluación">
                <!-- RÚBRICA CREADA CON JS -->
            </aside>
        </div>
    </main>


    <!-- SCRIPT PARA CARGAR LA RÚBRICA -->
    <script type="module" src="../pages/script_author-verRubrica.js"></script>
</body>
</html>

