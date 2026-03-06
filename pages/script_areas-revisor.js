
import { areasDeConocimiento } from "../config/config.js";

const elements = { 
    ownAreas: document.getElementById('own-areas'),
    otherAreas: document.getElementById('other-areas')
}


async function obtener_areas() { 
    const res = await fetch("../php/revisor_conseguirAreasDeConocimiento.php");

    return await res.json();
}

function createOptionCard(area, doknow) {
    const card = document.createElement("div");
    card.classList.add("area-option");

    let action = doknow ? "quitar" : "agregar";

    card.classList.add("card");
    card.classList.add("card-conocimiento");
    card.innerHTML = `
        <p>${area.name}</p>
        <button class="know-button">${action}</button>
    `;

    //card.textContent = area.name;

    


    if (doknow) {
        elements.ownAreas.appendChild(card);
    } else {
        elements.otherAreas.appendChild(card);
    }

    return card;
}



(async () => {
    const data = await obtener_areas();
    
    console.log(data);
    //const areas = data.areas;
    const areas = Object.values(data.areas || {});

    
    
    Object.entries(areasDeConocimiento).forEach(([id, name]) => {
        if (id === "0") return;
        const doknow = areas.some(a => Number(a.idAreaDeConocimiento) === Number(id));
        createOptionCard({id: Number(id), name}, doknow);
    });
})();