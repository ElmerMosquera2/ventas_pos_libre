import { onlineStateActionExclusive } from '../../js/localLib.js';
import { toCamelCase } from '../../js/utilis.js';

/**
 * @param {Proxy} appState - Estado de la app.
 * @param {string} propiedadEstado - Propiedad que controla la vista.
 * @param {HTMLElement} contenedorVisor - Donde se renderiza.
 * @param {string} navId - ID del <nav>.
 * @param {Object} coleccion - Mapa de vistas.
 */
export function inicializarSuperNav(
    appState,
    propiedadEstado,
    contenedorVisor,
    navId,
    coleccion
) {
    const nav = document.getElementById(navId);
    if (!nav) return;

    // 1. EVENTO: Solo muta el estado
    nav.addEventListener('click', (e) => {
        const link = e.target.closest('a[data-link]');
        if (!link) return;
        e.preventDefault();

        // Leemos directamente del atributo de datos
        appState[propiedadEstado] = link.dataset.link;
    });

    // 2. REACCIÓN: Actualizar Clase Activa
    onlineStateActionExclusive(appState, ({ prop, valor }) => {
        if (prop === propiedadEstado) {
            manageClassCssLinkNavActive(nav, valor);
        }
    });

    // 3. REACCIÓN: Renderizar Vista
    onlineStateActionExclusive(appState, ({ prop, valor }) => {
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
}

/**
 * Gestiona la clase activa comparando el atributo data-link con el estado.
 * @param {HTMLElement} nav - Contenedor <nav>.
 * @param {string} valorActual - Valor del estado (coincide con data-link).
 */
export function manageClassCssLinkNavActive(nav, valorActual) {
    if (!nav) return;
    const links = nav.querySelectorAll('a[data-link]');
    links.forEach(link => {
        link.classList.toggle('navLink--activo', link.dataset.link === valorActual);
    });
}

/**
 * Función asíncrona para gestionar la carga dinámica (Lazy Loading)
 */
async function renderizarVista(key, contenedor, coleccion) {
    if (!contenedor) return;

    const configuracion = coleccion?.[key];

    // 1. Manejo de llave inexistente
    if (!configuracion) {
        return inyectarErrorUI(contenedor, `La vista "${key}" no está definida en la colección.`);
    }

    try {
        // 2. Carga del módulo (si existe)
        if (configuracion.importar) {
            await import(configuracion.importar);
        }

        // 3. Creación del elemento
        const etiqueta = configuracion.etiqueta || configuracion;
        const componente = document.createElement(etiqueta);

        // 4. Inyección atómica (reemplaza todo el contenido de golpe)
        contenedor.replaceChildren(componente);

    } catch (error) {
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



