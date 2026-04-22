import { areasDeConocimiento } from "../config/config.js";

//cargo las areas de conocimientos desde el archivo que las tiene en vez de hardcodearlas
const areasDeConocimientoSelectField = document.querySelector("#area-conocimiento")
for(let areaKey in areasDeConocimiento){
    let currOption = document.createElement("option")
    if (areaKey == 0){
        currOption.selected = true
    }
    currOption.value = areaKey
    currOption.text = areasDeConocimiento[areaKey]
    areasDeConocimientoSelectField.appendChild(currOption)
}