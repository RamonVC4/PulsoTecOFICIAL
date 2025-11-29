// Este js crea el header para las páginas
// Es reutilizable y se puede usar en cualquier página. Distingue entre el login y el cerrar sesión.
// Evitamos código duplicado y mantenemos organización, limpieza, mantenibilidad y legibilidad.

import { create } from '../js/utils/dom.js';


/** 
* @returns {HTMLElement} - Elemento HTML del header top
*/
export function createHeaderTop() {
    const header_top = create('div', ['header-top']);
    header_top.innerHTML = `
        <div class="container">
            <div class="logo-text">PT<span class="gold"></span></div>
            <h1 class="title">PULSO<span class="gold">TEC</span></h1>
        </div>
    `;
    return header_top;
}



/**
 * @param {Object} links_map - Mapa de {label: href}
 * @param {string|null} login_link - URL del enlace de login (default: null)
 * @param {string|null} cerrar_sesion_link - URL del enlace de cerrar sesión (default: null)
 * @returns {HTMLElement} - Elemento HTML de la barra de navegación
 */

export function createHeaderNav(links_map = {}, login_link = null, cerrar_sesion_link = null) {

    const nav = create('nav', ['nav-bar']);
    const container = create('div', ['container']);
    const list = create('ul', ['nav-list']);

    nav.appendChild(container);
    container.appendChild(list);

    //Links principales
    Object.entries(links_map).forEach(([label, href]) => {
        const li = create('li');
        li.innerHTML = `<a href="${href}">${label}</a>`;
        list.appendChild(li);
    });

    // Botón de sesión
    if (cerrar_sesion_link) {
        const li = create('li', ['login'] );
        li.innerHTML = `<a href="${cerrar_sesion_link}">CERRAR SESIÓN</a>`;
        list.appendChild(li);
    } else if (login_link) {
        const li = create('li', ['login']);
        li.innerHTML = `
            <a href="${login_link}">
                <span class="icon-user">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="8" r="4"></circle>
                        <path d="M4 20c0-4 4-6 8-6s8 2 8 6"></path>
                    </svg>
                </span>
                INICIAR SESIÓN
            </a>
        `;
        list.appendChild(li);
    }

    return nav;
}
