<?php
    require_once '../php/db.php';

    //consigo el token
    $token = $_GET['token']??'';
    $rol = $_GET['rol']??'';
    $hashToken = hash("sha256",$token);

    //checo si es valido
    $result = q("SELECT id FROM tokens WHERE hashToken = ? AND rol = ? AND expira > NOW()","ss",[$hashToken,$rol]);

    //si no es valido, muestro mensaje de token invalido
    if($result->num_rows == 0){
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PULSOTEC</title>
    <link rel="stylesheet" href="../styles/styles_general.css">
    <link rel="stylesheet" href="../styles/styles_index.css">
    <link rel="stylesheet" href="../styles/styles_login.css">
</head>


<body>
    <header class="site-header">
        <div class="header-top">
            <div class="container">
                <div class="logo-text"><span class="gold"></span></div>
                <h1 class="title">PULSO<span class="gold">TEC</span></h1>
            </div>
        </div>
        <nav class="nav-bar">
            <div class="container">
                <ul class="nav-list">
                    <li><a href="../index.html">INICIO</a></li>
                    <li><a href="./acerca-de.php">ACERCA DE</a></li>
                    <li class="login">
                        <a href="./login.php">
                            <span class="icon-user">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <circle cx="12" cy="8" r="4"></circle>
                                    <path d="M4 20c0-4 4-6 8-6s8 2 8 6"></path>
                                </svg>
                            </span>
                            INICIAR SESION
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    </header>

    <main class="hero" role="main" aria-label="Contenido principal">

        <div class="container-flex">

            <div class="container card card-head">
                <h2>TOKEN INVALIDO</h2>
                <div class="field">
                    <p>El enlace para cambiar su contraseña ya expiró, genere otro enlace desde 
                        la pagina 'inicio de sesión'
                    </p> 
                    <div class="actions">
                        <a href="./login.php">OK</a>
                    </div>
                </div>                      
            </div>
        </div>
            
    </main>
    <!-- para el ojo de la contraseña -->
    <script type="module" src="../pages/script_cambiarContra.js"></script>
</body>
</html>

<?php
    }else{
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PULSOTEC</title>
    <link rel="stylesheet" href="../styles/styles_general.css">
    <link rel="stylesheet" href="../styles/styles_index.css">
    <link rel="stylesheet" href="../styles/styles_login.css">
</head>


<body>
    <header class="site-header">
        <div class="header-top">
            <div class="container">
                <div class="logo-text"><span class="gold"></span></div>
                <h1 class="title">PULSO<span class="gold">TEC</span></h1>
            </div>
        </div>
        <nav class="nav-bar">
            <div class="container">
                <ul class="nav-list">
                    <li><a href="../index.html">INICIO</a></li>
                    <li><a href="./acerca-de.php">ACERCA DE</a></li>
                    <li class="login">
                        <a href="./login.php">
                            <span class="icon-user">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <circle cx="12" cy="8" r="4"></circle>
                                    <path d="M4 20c0-4 4-6 8-6s8 2 8 6"></path>
                                </svg>
                            </span>
                            INICIAR SESION
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    </header>

    <main class="hero" role="main" aria-label="Contenido principal">

        <div class="container-flex">

            <div class="container card card-head">
                <h2>CAMBIAR CONTRASEÑA</h2>
                <div class="field">
                            <label for="contra">nueva contraseña</label>
                            <div class="field password-field">
                            <label for="contra">Contraseña</label>
                            <div class="password-field_with-icon">
                                <input id="password" name="contra" type="password" autocomplete="current-password" required placeholder="Ingresa tu contraseña">
                                <button type="button" class="toggle-password" aria-label="Mostrar u ocultar contraseña" aria-controls="password">
                                    <!-- SVG -->
                                    <svg class="icon-eye" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                </button>
                            </div>
                            <label for="contra2">escriba la contraseña de nuevo</label>
                            <div class="password-field_with-icon">
                                <input id="password" name="password" type="password" autocomplete="current-password" required placeholder="Ingresa tu contraseña">
                                <button type="button" class="toggle-password" aria-label="Mostrar u ocultar contraseña" aria-controls="password">
                                    <!-- SVG -->
                                    <svg class="icon-eye" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                </button>
                            </div>
                            
                            <div class="actions">
                            <button type="button" class="btn-primary" id="boton-reestablecer-contra" onclick="cambiarLaContraEnBDD('<?php echo $rol;?>','<?php echo $hashToken;?>')">CAMBIAR CONTRASEÑA</button>
                    </div>
                </div>                      
            </div>
        </div>
            
    </main>
    <!-- para el ojo de la contraseña -->
    <script type="module" src="../pages/script_cambiarContra.js"></script>
</body>
</html>
<?php
    }
    //elimino el token despues de usarlo
?>
