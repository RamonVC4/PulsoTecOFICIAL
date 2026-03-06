
import { areasDeConocimiento } from "../config/config.js";

const elements = { 
    ownAreas: document.getElementById('own-areas'),
    otherAreas: document.getElementById('other-areas')
}


async function obtener_areas() { 
    const res = await fetch("../php/revisor_conseguirAreasDeConocimiento.php");

    return await res.json();
}

async function addKnowledge(idArea) {
    const res = await fetch("../php/revisor_addArea.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            idArea
        }),
        credentials: "same-origin"
    });

    // const data = await res.json();
    const text = await res.text();
    console.log(text);
    return JSON.parse(text);
}

async function removeKnowledge(idArea) {
    const res = await fetch("../php/revisor_removerArea.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            idArea
        }),
        credentials: "same-origin"
    });

    // const data = await res.json();
    const text = await res.text();
    console.log(text);
    return JSON.parse(text);
}



function createOptionCard(area, doknow) {
    const card = document.createElement("div");
    card.classList.add("area-option");

    let action = doknow ? "quitar" : "agregar";

    card.classList.add("card");
    card.classList.add("card-conocimiento");
    card.innerHTML = `
        <p>${area.name}</p>
        <button class="know-button ${action}">${action}</button>
    `;

    //card.textContent = area.name;

    const button = card.querySelector(".know-button");

    
    button.addEventListener("click", async () => {
        if (doknow) {
           const res = await removeKnowledge(area.id);

            if (!res || res.status !== "ok") {
                alert("Error actualizando los datos");
                return;
            }

            alert("Area de Conocimiento eliminada correctamente");
            elements.otherAreas.appendChild(card);
        } else {
             const res = await addKnowledge(area.id);

            if (!res || res.status !== "ok") {
                alert("Error actualizando los datos");
                return;
            }

            alert("Area de Conocimiento agregada correctamente");
            elements.ownAreas.appendChild(card);
        }

        doknow = !doknow;
        button.textContent = doknow ? "quitar" : "agregar";

        button.classList.toggle("agregar");
        button.classList.toggle("quitar");
    });


    if (doknow) {
        elements.ownAreas.appendChild(card);
    } else {
        elements.otherAreas.appendChild(card);
    }

    return card;
}



(async () => {
    console.log("entro");
    const data = await obtener_areas();
    
    console.log("salio");
    console.log(data);
    //const areas = data.areas;
    const areas = Object.values(data.areas || {});

    
    
    Object.entries(areasDeConocimiento).forEach(([id, name]) => {
        if (id === "0") return;
        const doknow = areas.some(a => Number(a.idAreaDeConocimiento) === Number(id));
        createOptionCard({id: Number(id), name}, doknow);
    });
})();