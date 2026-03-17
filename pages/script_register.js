
(function () {
    const toggle = document.querySelector('.toggle-password');
    const pwd = document.getElementById('password');
    if (toggle && pwd) {
        toggle.addEventListener('click', function () {
            const reveal = pwd.type === 'password';
            pwd.type = reveal ? 'text' : 'password';
            toggle.classList.toggle('revealed', reveal);
            pwd.focus({ preventScroll: true });
        });
    }
})();

    (function () {
        const toggleConfirm = document.querySelector('.toggle-password-confirm');
        const pwdConfirm = document.getElementById('password-confirm');

        if (toggleConfirm && pwdConfirm) {
            toggleConfirm.addEventListener('click', function () {
                const reveal = pwdConfirm.type === 'password';
                pwdConfirm.type = reveal ? 'text' : 'password';
                toggleConfirm.classList.toggle('revealed', reveal);
                pwdConfirm.focus({ preventScroll: true });
            });
        }
    })();

    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM cargado');
    
        function updateVisibility() {
            const role = document.querySelector('input[name="role"]:checked').value;
    
            const elements = {
                curpDiv: document.getElementById('curpDiv'),
                areaConocimientoDiv: document.getElementById('areaConocimientoDiv'),
                orcidDiv: document.getElementById('orcidDiv'),
                institucionDiv: document.getElementById('institucionDiv'),
                direccionDiv: document.getElementById('direccionDiv'),
            };
    
            if (role === 'revisor') {
                elements.curpDiv.classList.remove('hidden');
                elements.areaConocimientoDiv.classList.remove('hidden');

                elements.orcidDiv.classList.add('hidden');
                elements.institucionDiv.classList.add('hidden');
                elements.direccionDiv.classList.add('hidden');

                console.log('Todo bien')
            } else {
                elements.curpDiv.classList.add('hidden');
                elements.areaConocimientoDiv.classList.add('hidden');

                elements.orcidDiv.classList.remove('hidden');
                elements.institucionDiv.classList.remove('hidden');
                elements.direccionDiv.classList.remove('hidden');
                console.log('Todo bien')
            }
        }
    
        // Ejecuta la lógica una vez al cargar
        updateVisibility();
    
        // Escucha cuando se cambia el rol
        document.querySelectorAll('input[name="role"]').forEach(input =>
            input.addEventListener('change', updateVisibility)
        );
    });

    function validarORCID(orcid) {//esto checa los digitos verificadores con la formula que se supone que es, pero no lo uso porque no se si hacerlo
        const regexOrcid = /^\d{4}\d{4}\d{4}\d{3}[\dXx]$/;
        if (!regexOrcid.test(orcid)) return false;

        const digits = orcid.replace(/-/g, '');
        let total = 0;

        // cálculo ISO 7064 mod 11-2
        for (let i = 0; i < 15; i++) {
            total = (total + parseInt(digits[i], 10)) * 2;
        }

        const remainder = total % 11;
        const result = (12 - remainder) % 11;
        const checkDigit = result === 10 ? "X" : String(result);

        return checkDigit === digits[15];
    }


    async function registrar() {
        //consigo los datos de los campos y los verifico

        //nombre
        const nombre = document.querySelector('#nombre').value;
        if (!nombre) {
            alert("Por favor ingresa tu nombre.");
            return;
        }

        const apellidoPaterno = document.querySelector('#primer-apellido').value;
        if (!apellidoPaterno) {
            alert("Por favor ingresa tu apellido paterno.");
            return;
        }

        const apellidoMaterno = document.querySelector('#segundo-apellido').value;
        if (!apellidoMaterno) {
            alert("Por favor ingresa tu apellido materno.");
            return;
        }

        //correo
        const regexCorreo =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const correo = document.querySelector('#correo').value;
        if (!regexCorreo.test(correo)) {
            alert("Por favor ingresa un correo valido.");
            return;
        }

        //password
        //verifico que las contraseñas sean iguales
        const password = document.querySelector('#password').value;
        const passwordConfirm = document.querySelector('#password-confirm').value;
        console.log("passwords", password, passwordConfirm);
        if (password !== passwordConfirm) {
            alert("Las contraseñas no coinciden.");
            return;
        }
    
        if (password.length < 8){
            alert("La contraseña debe tener al menos 8 caracteres.");
            return;
        }
        
        const roleElegido = document.querySelector('input[name="role"]:checked');
        if (!roleElegido) {
            alert("Por favor selecciona un rol.");
            return;
        }

        //datos extra del revisor
        const areaDeConocimiento = document.querySelector('#area-conocimiento')?.value ?? '0';
        const curp = document.querySelector('#curp')?.value ?? '';

        //datos extra del autor
        const orcid = document.querySelector('#orcid')?.value ?? '';
        const institucion = document.querySelector('#institucion')?.value ?? '';
        const estado = document.querySelector('#estado')?.value ?? '';
        const ciudad = document.querySelector('#ciudad')?.value ?? '';
        const calle = document.querySelector('#calle')?.value ?? '';
        const numeroDeCalle = document.querySelector('#numero')?.value ?? '';
        const colonia = document.querySelector('#colonia')?.value ?? '';
        // Puede no existir en algunas versiones del formulario
        const pais = document.querySelector('#pais')?.value ?? '';

        if (roleElegido.value === 'revisor') {
            
            //valido la curp TODO ME GUSTARIA USAR RENAPO PERO NO TIENE API
            const regexCurp = /^[A-Z]{1}[AEIOU]{1}[A-Z]{2}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[HM]{1}(AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d]{1}\d{1}$/;

            if (!regexCurp.test(curp)) {
                alert("CURP no válida, por favor verifique.");
                return;
            }

            //tambien el area de conocimiento
            if (areaDeConocimiento === '0') {
                alert("Por favor ingrese el area de conocimiento.");
                return;
            }

        }else{//si es autor aparte leo el orcid
            if (orcid === '') {
                alert("Por favor ingrese el orcid.");
                return;
            }

            //tambien la institucion
            if (institucion === '') {
                alert("Por favor ingrese la institucion.");
                return;
            }

            //tambien la direccion de la institucion
            if(estado === '' || ciudad === '' || calle === '' || numeroDeCalle === '' || colonia === '') {
                alert("Por favor ingrese la direccion de la institucion.");
                return;
            }

        }
        console.log(areaDeConocimiento);

        //ahora que tengo todo, lo envio al backend
        //TODO VERIFICAR QUE NO HAYA UN USUARIO CON LA MISMA CURP PORQUE ESO SIGNIFICA QUE YA SE REGISTRO
        const role = roleElegido.value;
        const jsonAMandar = JSON.stringify({role, correo, password, nombre, apellidoPaterno, apellidoMaterno, curp, areaDeConocimiento, orcid, estado, ciudad, calle, numeroDeCalle, colonia, pais, institucion });
        console.log("jsonAMandar", jsonAMandar);

        try {
            const res = await fetch("../php/registro.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: jsonAMandar,
                credentials: "same-origin" // para enviar cookies de la sesion
            });

            const data = await res.json();
            if (!data.success) {
                alert("Algo salió mal: " + (data.message || "No se pudo registrar."));
                return;
            }

            alert("Registro exitoso.");
            window.location.href = "./login.php";
        } catch (error) {
            console.error("Error al registrar:", error);
            alert("No se pudo completar el registro. Inténtalo de nuevo.");
        }

        //valido el email mandando un correo TODO no se si necesito hacer esto
            //si es valido, lo envio al backend
            //si no es valido, muestro error
    }
