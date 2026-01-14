import { inyectarContenido } from './js/utilis.js'

/**
 * Carga y renderiza dinámicamente una vista basada en una clave (key) y una colección de configuraciones.
 * Utiliza lazy loading (carga perezosa) para importar módulos solo cuando son necesarios.
 *
 * @param {string} key - La clave que identifica la vista específica en la colección.
 * @param {HTMLElement} contenedor - El elemento DOM donde se inyectará la vista.
 * @param {object} coleccion - Un objeto que mapea las claves a sus configuraciones de vista.
 * @param {boolean} reemplazar - True: Borra lo anterior (replace). False: Agrega al final (append).
 *
 */
export async function renderizarVista(key, contenedor, coleccion, reemplazar = true) {
    // Si el contenedor no existe, la función termina silenciosamente para evitar errores.
    if (!contenedor) return;

    const configuracion = coleccion?.[key];

    // 1. Manejo de llave inexistente: Si la clave no está definida, muestra un error en la UI.
    if (!configuracion) {
        // Asume que 'inyectarErrorUI' es una función definida globalmente para mostrar mensajes de error al usuario.
        return inyectarContenido(contenedor, `La vista "${key}" no está definida en la colección.`, reemplazar);
    }

    try {
        // 2. Carga dinámica del módulo (Code Splitting):
        // Si la configuración tiene una ruta de importación, espera a cargar el JS del componente.
        if (configuracion.importar) {
            // Esto es un 'lazy load' (carga perezosa): el código JS se descarga del servidor AHORA, no antes.
            await import(configuracion.importar);
        }

        // 3. Creación del elemento:
        // Determina el nombre de la etiqueta HTML (ej. 'mi-componente-personalizado').
        const etiqueta = configuracion.etiqueta || configuracion;
        // Crea la instancia del elemento DOM real.
        const componente = document.createElement(etiqueta);

        // 4. Inyección atómica
        contenedor.replaceChildren(componente);

    } catch (error) {
        // Captura errores de red durante la importación (si el archivo JS no carga)
        // o errores durante la creación del elemento.
        console.error(`[RenderizarVista] Error al cargar la llave: ${key}`, error);
        inyectarContenido(contenedor, 'Error de red o de carga del componente.', reemplazar);
    }
}