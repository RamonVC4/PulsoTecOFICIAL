/**
 * @param {Response} resp
 * Se le da la respuesta, usualmente de un fetch y verifica los casos mas comunes */
export async function getJsonSafely(resp){
    if (resp.ok){
            const text = await resp.text();
            try {
                return JSON.parse(text);
            } catch {
                console.log(text);
                throw new Error("Respuesta no es json, es: " + text);
            }
    }else{
        alert(`Algo salió mal: ${resp.error}`);
        throw new Error(`url:${resp.url}  HTTP: ${resp.error}`);
    }
}