export const toCamelCase = (str) => {
    return str
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quita acentos (Ventas Máximas -> Ventas Maximas)
        .toLowerCase()
        .trim()
        .split(/\s+/) // Divide por cualquier espacio
        .map((word, index) =>
            index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join('');
};

/**
 * Inserta contenido en un nodo DOM gestionando la estrategia (Reemplazar vs Agregar).
 * Normaliza el contenido para aceptar Nodos, Arrays de Nodos o Texto simple.
 *
 * @param {HTMLElement} contenedor - El elemento donde se insertará el contenido.
 * @param {Node|Node[]|string} contenido - Lo que quieres insertar.
 * @param {boolean} reemplazar - True: Borra lo anterior (replace). False: Agrega al final (append).
 * @returns {HTMLElement} El contenedor (para encadenamiento).
 * @nota ⚠️ Nota de seguridad:
 * Los Node recibidos deben provenir de código confiable.
 * Los strings siempre se insertan como texto plano.
 */
export function inyectarContenido(contenedor, contenido, reemplazar) {
    if (!contenedor) {
        console.warn('[inyectarContenido] Contenedor no definido');
        return null;
    }

    // 1. Normalización: Convertimos cualquier entrada en un Array de Nodos
    // Esto hace que la función sea muy flexible con lo que recibe.
    let nodos = [];

    if (Array.isArray(contenido)) {
        nodos = contenido;
    } else if (contenido instanceof Node) {
        nodos = [contenido];
    } else if (contenido !== null && contenido !== undefined) {
        // Si es string o número, creamos nodo de texto para evitar innerHTML
        nodos = [document.createTextNode(String(contenido))];
    }

    // 2. Ejecución: Usamos las APIs modernas del DOM
    if (reemplazar) {
        // replaceChildren vacía y agrega de una sola vez (muy optimizado)
        contenedor.replaceChildren(...nodos);
    } else {
        // append agrega al final sin tocar lo existente
        contenedor.append(...nodos);
    }

    return contenedor;
}