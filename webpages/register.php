<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acceder - PULSOTEC</title>
    <link rel="stylesheet" href="../styles/styles_register.css">
</head>
<body class="login-page">
    <main class="login-container">

        <header class="return-to-index-header">
            <a href="../index.html">VOLVER A INICIO</a>
        </header>
        
        <section class="card" role="region" aria-labelledby="login-title">
            <h1 id="login-title" class="card-title">REGISTRO</h1>

            <!-- <form class="login-form" action="login.php" method="post" autocomplete="on" novalidate> -->
            <form class="login-form" autocomplete="on" novalidate>



                <!-- Role switcher (submits with the form) -->
                <div class="role-switch" role="tablist" aria-label="Seleccionar rol">
                    <input type="radio" id="role-autor" name="role" value="autor">
                    <input type="radio" id="role-revisor" name="role" value="revisor" checked>

                    <div class="tabs">
                        <label class="tab" for="role-autor" role="autor" aria-controls="tabpanel" aria-selected="false">AUTOR</label>
                        <label class="tab" for="role-revisor" role="revisor" aria-controls="tabpanel" aria-selected="true">REVISOR</label>
                        <span class="pill" aria-hidden="true"></span>
                    </div>
                </div>



                <div class="scrollable-container">      
                    <div id="tabpanel" class="form-fields" role="tabpanel" tabindex="-1">
                

                        <!-- nombre y apellidos para ambos -->
                        <div class="field">
                            <label for="nombre">Nombre</label>
                            <input id="nombre" name="nombre" type="text" inputmode="text" autocomplete="nombre" required placeholder="Ingresa tu nombre">
                        </div>
                        
                        <div class="apellido-field">
                            <div class="field">
                                <label for="primer-apellido">Primer apellido</label>
                                <input id="primer-apellido" name="primer-apellido" type="text" inputmode="text" autocomplete="primer-apellido" required placeholder="Ingresa tu primer apellido">
                            </div>
                            <div class="field">
                                <label for="segundo-apellido">Segundo apellido</label>
                                <input id="segundo-apellido" name="segundo-apellido" type="text" inputmode="text" autocomplete="segundo-apellido" required placeholder="Ingresa tu segundo apellido">
                            </div>
                        </div>


                        <!-- correo para ambos -->
                        <div class="field">
                            <label for="correo">Correo</label>
                            <input id="correo" name="correo" type="text" inputmode="text" autocomplete="correo" required placeholder="Ingresa tu correo">
                        </div>


                        <!-- contraseña para ambos-->
                        <div class="field password-field">
                            <label for="password">Contraseña</label>
                            <div class="password-field_with-icon">

                                <input id="password" name="password" id="password" type="password" autocomplete="current-password" required placeholder="Ingresa tu contraseña">

                                <button type="button" class="toggle-password" aria-label="Mostrar u ocultar contraseña" aria-controls="password">
                                    <!-- SVG -->
                                    <svg class="icon-eye" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <!-- confirmar contraseña para ambos-->
                        <div class="field password-field">
                            <label for="password"> Confirmar contraseña</label>
                            <div class="password-field_with-icon">

                                <input id="password-confirm" name="password-confirm" id="password-confirm" type="password" autocomplete="current-password" required placeholder="Ingresa tu contraseña">

                                <button type="button" class="toggle-password toggle-password-confirm" aria-label="Mostrar u ocultar contraseña" aria-controls="password">
                                    <!-- SVG -->
                                    <svg class="icon-eye" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        

                        <!-- CURP para revisor -->
                        <div class="field" id="curpDiv">
                            <label for="curp">CURP</label>
                            <input id="curp" name="curp" type="text" inputmode="text" autocomplete="curp" placeholder="Ingresa tu CURP">
                        </div>

                        <!-- agregar area de conocimiento para revisor -->
                        <div class="field" id="areaConocimientoDiv">
                            <label for="area-conocimiento">Área de conocimiento</label>
                                <select id="area-conocimiento" name="area-conocimiento" required>
                                    <option value="0" selected>Seleccione una opción</option>
                                    <option value="1">Ingeniería Química y Bioquímica</option>
                                    <option value="2">Ingeniería Industrial</option>
                                    <option value="3">Sistemas Computacionales y TI</option>
                                    <option value="4">Ingeniería en Gestión Empresarial</option>
                                    <option value="5">Ingeniería Eléctrica y Electrónica</option>
                                    <option value="6">Ingeniería Mecánica y Mecatrónica</option>
                                    <option value="7">Ingeniería en Energías Renovables</option>
                                    <option value="8">Ingeniería en Semiconductores</option>
                                    <option value="9">Administración</option>
                                    <option value="10">Investigación Educativa</option>
                                </select>
                        </div>
                       

                        <!-- ORCID para autor -->
                        <div class="field hidden" id="orcidDiv">
                            <label for="orcid">ORCID</label>
                            <input id="orcid" name="orcid" type="text" inputmode="text" autocomplete="orcid" required placeholder="Ingresa tu ORCID">
                        </div>

                        <!-- institucion para autor -->
                        <div class="field hidden" id="institucionDiv">
                            <label for="institucion">Institución</label>
                            <input id="institucion" name="institucion" type="text" inputmode="text" autocomplete="institucion" required placeholder="Ingresa tu institución">
                        </div>

                        <!-- direccion de la institucion para autor -->
                         <div class="field hidden" id="direccionDiv">
                            <label for="direccion">Dirección de la Institución</label>
            
                            <div class="direccion-field">
                                
                                <input id="calle" name="calle" type="text" inputmode="text" autocomplete="calle" required placeholder="Ingresa tu calle">
                                <input id="numero" name="numero" type="text" inputmode="text" autocomplete="numero" required placeholder="Ingresa tu numero">
                                <input id="colonia" name="colonia" type="text" inputmode="text" autocomplete="colonia" required placeholder="Ingresa tu colonia">
                                <input id="ciudad" name="ciudad" type="text" inputmode="text" autocomplete="ciudad" required placeholder="Ingresa tu ciudad">
                                <input id="estado" name="estado" type="text" inputmode="text" autocomplete="estado" required placeholder="Ingresa tu estado">
                            </div>
                        </div>

                    </div>
                </div>




                <div class="actions">
                    <button type="button" class="btn-primary" onclick="registrar()">REGISTRAR</button>
                    <a class="link-ghost" href="./login.php" aria-label="Crear cuenta nueva">YA TENGO CUENTA</a>
                </div>
            </form>
        </section>
    </main>

    <footer class="brand-footer" aria-hidden="true">
        <span>P u l s o T e c&nbsp;&nbsp;V e r i f i c a</span>
    </footer>

    <!-- SCRIPT PARA EL REGISTRO -->
    <script src="../pages/script_register.js"></script>

</body>
</html>

