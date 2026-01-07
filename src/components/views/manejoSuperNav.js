import { onlineStateActionExclusive } from '../../js/localLib.js';
import { toCamelCase } from '../../js/utilis.js';

/**
 * @param {Proxy} appState - El Proxy de estado
 * @param {HTMLElement} contenedorVisor - Donde se dibuja
 * @param {Object} coleccion - Mapa { llave: 'etiqueta-custom' }
 * @param {string} navId - ID del <nav> en el HTML
 * @param {string} propiedadEstado - Qué propiedad del Proxy debe cambiar
 */
export function inicializarSuperNav(appState, contenedorVisor, coleccion, navId, propiedadEstado = 'vista') {
    const nav = document.getElementById(navId);
    if (!nav) return;

    // 1. CAPTURA DE CLICS
    nav.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        e.preventDefault();

        const texto = link.querySelector('.navUlLiLinkText-index')?.textContent || link.textContent;

        // Actualizamos el estado. El Proxy se encargará de disparar la reacción.
        appState[propiedadEstado] = toCamelCase(texto);
    });

    // 2. REACCIÓN AL CAMBIO
    onlineStateActionExclusive(appState, ({ prop, valor }) => {
        if (prop === propiedadEstado) {
            // Llamamos a la función asíncrona sin bloquear el hilo principal
            renderizarVista(valor, contenedorVisor, coleccion);
        }
    });

    // 3. RENDER INICIAL
    // Importante: Si appState ya tiene un valor, ejecutamos el render inicial inmediatamente
    if (appState[propiedadEstado]) {
        renderizarVista(appState[propiedadEstado], contenedorVisor, coleccion);
    }
}

/**
 * Función asíncrona para gestionar la carga dinámica (Lazy Loading)
 */
async function renderizarVista(key, contenedor, coleccion) {
    if (!contenedor) return;

    const configuracion = coleccion[key];
    if (!configuracion) {
        contenedor.replaceChildren();
        const err = document.createElement('p');
        err.textContent = `Vista "${key}" no configurada.`;
        contenedor.appendChild(err);
        return;
    }

    try {
        // 1. Carga bajo demanda del módulo JS (si existe)
        if (configuracion.importar) {
            await import(configuracion.importar);
        }

        // 2. Limpieza del visor justo antes de inyectar el nuevo componente
        // Esto evita parpadeos blancos mientras el JS se descarga.
        contenedor.replaceChildren();

        // 3. Creación e inyección del Custom Element
        const etiqueta = configuracion.etiqueta || configuracion;
        const componente = document.createElement(etiqueta);
        contenedor.appendChild(componente);

    } catch (error) {
        console.error(`Error crítico al cargar la vista [${key}]:`, error);

        // 1. Vaciar el contenedor
        contenedor.replaceChildren();

        // 2. Crear el nuevo elemento de error
        const mensajeError = document.createElement('p');
        mensajeError.textContent = 'Error al cargar la sección.';
        mensajeError.style.color = 'red';

        // 3. Insertar el nuevo elemento
        contenedor.appendChild(mensajeError);

    }
}



