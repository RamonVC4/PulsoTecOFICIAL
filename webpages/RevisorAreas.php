<?php require_once '../php/protect_revisor.php'; ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Revisor-AreasConocimiento</title>
    <link rel="stylesheet" href="../styles/styles_general.css">
    <link rel="stylesheet" href="../styles/styles_revisor.css">
    <link rel="stylesheet" href="../styles/styles_revisor_areas.css">
</head>
<body>
    <!-- HEADER -->
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
                    <li><a href="./revisor.php">DOCUMENTOS</a></li>
                    <li><a href="#">Areas de conocimiento</a></li>
                    <!-- <li><a href="#">AYUDA</a></li> -->
                    <li class="login"><a href="../php/logout.php">CERRAR SESIÓN</a></li>
                </ul>
            </div>
        </nav>
    </header>



    <main>
       <div class="flex-row">
             <div id="own-areas" class=" flex-row-item card">
                <h2>Areas de Conocimiento que posees</h2>
            </div>

            <div id="other-areas" class="flex-row-item card">
                <h2>Otras áreas de conocimiento</h2>
            </div>
        
       </div>
    </main>


    <script type="module" src="../pages/script_areas-revisor.js"></script>
</body>
</html>

