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
 * Inyecta un nodo en el DOM con manejo de errores.
 * @param {HTMLElement} parent - El contenedor destino.
 * @param {Node} child - El nodo o fragmento a inyectar.
 * @param {boolean} replace - Si es true, vacía el contenedor antes de inyectar.
 */
export const inyectarNodo = (parent, child, replace = false) => {
    try {
        // Validación técnica previa a la ejecución
        if (!(parent instanceof HTMLElement)) {
            throw new TypeError("El 'parent' proporcionado no es un elemento HTML válido.");
        }
        if (!(child instanceof Node)) {
            throw new TypeError("El 'child' proporcionado no es un Nodo o DocumentFragment válido.");
        }

        // Operación atómica
        replace ? parent.replaceChildren(child) : parent.append(child);

        return parent;
    } catch (error) {
        // Centralizar el log de errores para ayudar a la depuración en contenedores
        console.error(`[Error de Inyección]: ${error.message}`, { parent, child });

        // Devolvemos null para que el flujo funcional sepa que la operación falló
        return null;
    }
};

/**
 * FUNCIÓN PURA DE ESTRUCTURA: Crea la representación básica de un mensaje.
 * No posee lógica de estilo ni de ubicación, cumpliendo con la creación atómica.
 */
function createMsgNode(text) {
    const el = document.createElement('p');
    el.textContent = text;
    return el; // Devuelve un nodo HTML nativo
}


/**
 * DECORADOR DE COMPORTAMIENTO: Envuélve un nodo HTML para inyectar una interfaz
 * de estilización encadenable (Fluent API). Separa la anatomía del nodo de su identidad visual.
 *
 * @param {HTMLElement} nodo - El elemento a transformar.
 * @returns {Object} API con métodos de estilización condicional.
 */
function estilizarNodo(nodo) {
    if (!(nodo instanceof HTMLElement)) throw new Error("Se requiere un nodo HTML");

    const aplicarBase = () => {
        nodo.style.padding = '1rem';
        nodo.style.borderRadius = '8px';
        nodo.style.margin = '0.5rem 0';
        nodo.style.fontFamily = 'system-ui, sans-serif';
    };

    const api = {
        node: nodo,
        msgError: () => {
            aplicarBase();
            nodo.style.backgroundColor = '#ffcccc';
            nodo.style.color = '#990000';
            return api;
        },
        msgAlert: () => {
            aplicarBase();
            nodo.style.backgroundColor = '#fff3cd';
            nodo.style.color = '#856404';
            return api;
        },
        msgCheck: () => {
            aplicarBase();
            nodo.style.backgroundColor = '#d4edda';
            nodo.style.color = '#155724';
            return api;
        },
        msgNotify: () => {
            aplicarBase();
            nodo.style.backgroundColor = '#e2e3e5';
            return {
                black: () => { nodo.style.color = 'black'; return api; },
                white: () => { nodo.style.color = 'white'; return api; }
            };
        }
    };

    return api;
}

/**
 * COMPOSITOR DE NODOS (Optimizado 2026):
 * Reduce un Array de elementos a un único contenedor virtual (DocumentFragment).
 * Utiliza el operador de propagación para una inserción masiva, eliminando
 * la necesidad de iteraciones manuales y optimizando el motor de renderizado.
 *
 * @param {Array<Node>} nodos - Array de nodos HTML nativos.
 * @returns {DocumentFragment} Contenedor de memoria volátil listo para inyección única.
 */
export function empaquetarNodos(nodos) {
    const fragment = document.createDocumentFragment();

    try {
        // Inserción masiva: append() acepta múltiples argumentos y es más eficiente
        // que iterar con forEach en arrays de tamaño medio/grande.
        fragment.append(...nodos);
    } catch (error) {
        console.error("[Error al empaquetar]: Asegúrate de que todos los elementos sean Nodos válidos.", error);
        const errorNode = msgNodeHTMLError(`Error al empaquetar → Detalles en la consola`);
        fragment.append(errorNode);

    }
    return fragment;
}


export const msgNodeHTMLError = (text) =>
    estilizarNodo(createMsgNode(text)).msgError().node;