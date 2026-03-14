import { apiFetch } from "./loading.js";
import { getJsonSafely } from "../js/utils/verify.js";

/**Esta función hace visible el resto del form de cambiarPassword*/
function mostrarElRestoDelForm(){
    //consigo el div 
    const restoDelForm = document.getElementById("resto-del-form");
    restoDelForm.hidden = false
}

/**Llama a php para generar el token y enviar el correo Y actualiza el contenido de la pagina para comunicar eso al usuario*/
async function reestablecerContra(){

    //consigo el rol
    const rol = document.querySelector("#role-switcher input[name='role']:checked").value;
    
    //consigo el correo
    const correo = document.getElementById("correo").value;
    
    //llamo php
    let result = await apiFetch(
        "../php/enviarCorreoRecuperacion.php",
        {
        method: 'POST',
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({rol:rol,correo:correo}),
    });
    
    //actualizar contenido de la pagina
    //pongo mensaje mal por si falla
    const msjMal = document.getElementById('mensaje-mal'); 
    msjMal.hidden = false;

    //trato de leer lo que me regresaron
    const data = await getJsonSafely(result);//esto crashea si no esta bien la respuesta, ese es el plan


    document.getElementById('mensaje-bien').hidden = false;//si no crashea, muestra el mensaje bien
    msjMal.hidden = true;
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("role-autor").addEventListener('click',mostrarElRestoDelForm)
    document.getElementById("role-revisor").addEventListener('click',mostrarElRestoDelForm)
    document.getElementById("role-manager").addEventListener('click',mostrarElRestoDelForm)

    document.getElementById('boton-reestablecer-contra').addEventListener('click', reestablecerContra);
})