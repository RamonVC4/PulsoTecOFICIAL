import { getJsonSafely } from "../js/utils/verify.js";
import { apiFetch } from "./loading.js";

(function () {
    //Este le da la funcionalidad al ojito de visibilidad de las contras    
    const divs = document.querySelectorAll(".password-field_with-icon");
    divs.forEach(a => {
        const toggleButton = a.querySelector('.toggle-password');
        const pwdField = a.querySelector('#password');
     
        if (toggleButton && pwdField) {
            toggleButton.addEventListener('click', function () {
                const reveal = pwdField.type === 'password';
                pwdField.type = reveal ? 'text' : 'password';
                toggleButton.classList.toggle('revealed', reveal);
                pwdField.focus({ preventScroll: true });
            });
        }
    });

    //Funcionalidad boton
    /**
     * 
     * @param {String} rol el rol, porque un correo puede estar registrado como varios roles
     * @param {String} token el token que se usó
     */
    async function cambiarLaContraEnBDD(rol,token){
        const passwordFields = document.querySelectorAll("#password");
        if (passwordFields[0].value != passwordFields[1].value){
            alert("Las contraseñas no coinciden.");
            return;
        }else if(passwordFields[0].value.length < 8){
            alert("contraseña demasiado corta, use minimo 8 caracteres");
            return;
        }

        const newPassword = passwordFields[0].value;

        let response = await apiFetch('../php/cambiarLaContraEnBDD.php',
            {
                method: 'POST',
                credentials:'same-origin',
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({rol,token,newPassword})
            }
        );

        //muestro mensaje mal
        //creasheo si la respuesta esta bien
        const jsonResultante = await getJsonSafely(response);
        
        alert("contraseña cambiada con exito");
        window.location.href ="../index.html";
    }

    window.cambiarLaContraEnBDD = cambiarLaContraEnBDD;
})();




