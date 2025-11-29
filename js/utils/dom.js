// Este js contiene funciones para manipular el DOM.
// Busca hacer el dom más fácil de manipular y mantener.

/**
 * @param {string} query - Selector CSS
 * @param {HTMLElement} parent - Elemento padre (default: document)
 * @returns {HTMLElement} - Elemento HTML encontrado
 */
export const select = (query, parent = document) => parent.querySelector(query);


/**
 * @param {string} query - Selector CSS
 * @param {HTMLElement} parent - Elemento padre (default: document)
 * @returns {NodeList} - Lista de elementos HTML encontrados
 */
export const selectAll = (query, parent = document) => parent.querySelectorAll(query);


/**
 * @param {string} tag - Etiqueta HTML
 * @param {string[]} classes - Clases CSS (default: [])
 * @returns {HTMLElement} - Elemento HTML creado
 */
export const create = (tag, classes = []) => {
    const el = document.createElement(tag);

    if (classes.length > 0) {
        classes.forEach(c => el.classList.add(c));
    }
    
    return el;
};
