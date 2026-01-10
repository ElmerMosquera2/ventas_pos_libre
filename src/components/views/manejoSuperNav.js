import { onlineStateActionExclusive } from '../../js/localLib.js';

/**
 * @param {Proxy} appState - Estado de la app.
 * @param {string} propiedadEstado - Propiedad que controla la vista.
 * @param {HTMLElement} contenedorVisor - Elemento donde se renderiza.
 * @param {HTMLElement} navInput - Elemento que apunta.
 * @param {Object} coleccion - Mapa de vistas.
 */
export function inicializarSuperNav(
    appState,
    propiedadEstado,
    contenedorVisor,
    navInput,
    coleccion
) {
    const nav = navInput;

    if (!nav) {
        console.error('SuperNav Error: No se encontró el elemento nav', navInput);
        return;
    }

    // 1. EVENTO: Delegamos la gestión de clics a la función separada
    // Capturamos su función de limpieza
    const limpiarClickListener = manejarClicsNav(nav, appState, propiedadEstado)

    // 2. REACCIÓN: Actualizar Clase Activa
    const limpiarResaltado = onlineStateActionExclusive(appState, ({ prop, valor }) => {
        if (prop === propiedadEstado) {
            manageClassCssLinkNavActive(nav, valor);
        }
    });

    // 3. REACCIÓN: Renderizar Vista
    const limpiarRenderizado = onlineStateActionExclusive(appState, ({ prop, valor }) => {
        if (prop === propiedadEstado) {
            renderizarVista(valor, contenedorVisor, coleccion);
        }
    });

    // 4. INICIALIZACIÓN: Sincronía inicial
    const valorInicial = appState[propiedadEstado];
    if (valorInicial) {
        manageClassCssLinkNavActive(nav, valorInicial);
        renderizarVista(valorInicial, contenedorVisor, coleccion);
    }
    // Retornamos un cleanup que limpie ambas suscripciones
    return () => {
        limpiarClickListener();
        limpiarResaltado();
        limpiarRenderizado();
    };
}

/**
 * Configura un event listener en la navegación para escuchar clics en enlaces con data-link.
 * Cuando se hace clic, actualiza la propiedad específica del appState.
 *
 * @param {HTMLElement} nav - El contenedor <nav>.
 * @param {object} appState - El objeto de estado reactivo.
 * @param {string} propiedadEstado - El nombre de la propiedad a mutar (ej: 'rutaActual').
 * @returns {Function} Una función de limpieza para remover el listener.
 */
function manejarClicsNav(nav, appState, propiedadEstado) {
    if (!nav) return console.error('Error en manejarClicsNav: nav es nulo');

    const handler = (e) => {
        const link = e.target.closest('a[data-link]');
        if (!link) return;
        e.preventDefault();

        // Esta es la única responsabilidad de este módulo: mutar el estado.
        appState[propiedadEstado] = link.dataset.link;
    };

    nav.addEventListener('click', handler);

    // Retornamos la función de limpieza para este listener específico
    return () => {
        nav.removeEventListener('click', handler);
    };
}



/**
 * Gestiona las clases CSS y el atributo ARIA para el enlace de navegación activo.
 * @param {HTMLElement} nav - El contenedor de la navegación (ej. <nav> o <ul>).
 * @param {string} valorActual - El valor data-link del enlace activo.
 */

function manageClassCssLinkNavActive(nav, valorActual) {
    if (!nav) {
        console.error("El elemento de navegación no fue proporcionado.");
        return;
    }

    const links = nav.querySelectorAll('a[data-link]');

    links.forEach(link => {
        const esActivo = link.dataset.link === valorActual;

        // 1. Gestiona la clase CSS (como en ambas originales)
        link.classList.toggle('navLink--activo', esActivo);

        // 2. Gestiona la accesibilidad ARIA
        // Usa "page" para indicar que es la página actual.
        if (esActivo) {
            link.setAttribute('aria-current', 'page');
        } else {
            // cuando no está activo para mayor limpieza.
            link.removeAttribute('aria-current');
        }
    });
}

/**
 * Carga y renderiza dinámicamente una vista basada en una clave (key) y una colección de configuraciones.
 * Utiliza lazy loading (carga perezosa) para importar módulos solo cuando son necesarios.
 *
 * @param {string} key - La clave que identifica la vista específica en la colección.
 * @param {HTMLElement} contenedor - El elemento DOM donde se inyectará la vista.
 * @param {object} coleccion - Un objeto que mapea las claves a sus configuraciones de vista.
 */
async function renderizarVista(key, contenedor, coleccion) {
    // Si el contenedor no existe, la función termina silenciosamente para evitar errores.
    if (!contenedor) return;

    const configuracion = coleccion?.[key];

    // 1. Manejo de llave inexistente: Si la clave no está definida, muestra un error en la UI.
    if (!configuracion) {
        // Asume que 'inyectarErrorUI' es una función definida globalmente para mostrar mensajes de error al usuario.
        return inyectarErrorUI(contenedor, `La vista "${key}" no está definida en la colección.`);
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

        // 4. Inyección atómica: Reemplaza de forma eficiente y limpia
        // el contenido anterior del contenedor por el nuevo componente.
        contenedor.replaceChildren(componente);

    } catch (error) {
        // Captura errores de red durante la importación (si el archivo JS no carga)
        // o errores durante la creación del elemento.
        console.error(`[RenderizarVista] Error al cargar la llave: ${key}`, error);
        inyectarErrorUI(contenedor, 'Error de red o de carga del componente.');
    }
}

/**
 * Función auxiliar interna para consistencia visual en errores
 */
function inyectarErrorUI(contenedor, mensaje) {
    contenedor.replaceChildren();
    const p = document.createElement('p');
    p.textContent = mensaje;
    p.classList.add('error-visor'); // Usa clases para estilo en lugar de estilos inline
    contenedor.appendChild(p);
}


