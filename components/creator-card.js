// Este js crea las cards de los creadores para la página de acerca-de.html


/**
 * @param {Object} creator - Información del creador
 * @returns {HTMLElement} - Elemento HTML de la card
 */

export function createCreatorCard(creator) {
    const { name, githubLink, githubName, email, linkedin } = creator;

    const card = document.createElement("div");
    card.className = "card creator-card";

    card.innerHTML = `
        <h3 class="creator-name">${name}</h3>
        <div class="creator-info">
            ${createInfoItem("github", "../assets/img/logo/github.png", githubLink, githubName)}
            ${createInfoItem("email", "../assets/img/logo/email.png", `mailto:${email}`, email)}
            ${createInfoItem("linkedin", "../assets/img/logo/linkedin.png", linkedin, linkedin)}
        </div>
    `;

    return card;
}


/**
 * @param {string} iconType - Tipo de icono (github, email, linkedin)
 * @param {string} icon - Ruta del icono
 * @param {string} href - URL del enlace
 * @param {string} label - Texto del enlace
 * @returns {string} - Elemento HTML de la información
 */

function createInfoItem(iconType, icon, href, label) {
    return `
        <div class="creator-item-div">
            <img src="${icon}" class="${iconType}-logo"/>
            <a href="${href}" target="_blank">${label}</a>
        </div>
    `;
}
