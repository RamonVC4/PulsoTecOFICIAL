// Este js carga el header y las cards de los creadores para la página de acerca-de.html

import {createCreatorCard} from '../components/creator-card.js';
import {createHeaderTop, createHeaderNav} from '../components/header.js';
import {select} from '../js/utils/dom.js';
import {creators} from '../config/config.js';



// =============================================
//               CARGAR EL HEADER
// =============================================

const urls = {
    'INICIO': '../Index.html',
    'ACERCA DE': './acerca-de.php',
}
const login_link = './login.php';

const header = select('.site-header');
header.appendChild(createHeaderTop());
header.appendChild(createHeaderNav(urls, login_link));




// =============================================
//       CARGAR LAS CARDS DE LOS CREADORES
// =============================================
const container = select('.creator-cards-container');

creators.forEach(c => {
    container.appendChild(createCreatorCard(c));
});



