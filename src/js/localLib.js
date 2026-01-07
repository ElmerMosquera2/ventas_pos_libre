/**
 * Clave privada (Symbol) para almacenar las acciones/suscriptores dentro del estado.
 * Al ser un Symbol, no colisiona con propiedades del usuario como 'id' o 'nombre'.
 */
const ACCIONES_SECRETAS = Symbol('acciones');

/**
 * @private
 * Helper interno para notificar cambios a los suscriptores de forma segura.
 * Itera sobre las acciones suscritas y ejecuta cada una protegiendo la ejecución con try/catch.
 * * @param {Object} target - El objeto de estado original.
 * @param {string|symbol} prop - La propiedad que cambió.
 * @param {any} valor - El nuevo valor asignado (o undefined si fue eliminado).
 * @param {any} anterior - El valor que tenía antes del cambio.
 */
function notificarCambios(target, prop, valor, anterior) {
    const acciones = target[ACCIONES_SECRETAS];

    // Si no hay sistema de acciones o no hay suscriptores, salimos rápido.
    if (!acciones || acciones.size === 0) return;

    // Snapshot: Creamos una copia (Array) del Set actual.
    // Esto es CRÍTICO para evitar bucles infinitos si una acción añade/elimina
    // otras acciones mientras se está iterando.
    const snapshot = Array.from(acciones);

    snapshot.forEach(fn => {
        try {
            // Ejecutamos la acción pasando un objeto de contexto "info"
            fn({ estado: target, prop, valor, anterior });
        } catch (err) {
            // Error Handling: Evita que un error en una suscripción rompa toda la app.
            console.error(`⚠️ Error en acción de estado para la propiedad '${String(prop)}':`, err);
        }
    });
}

/**
 * Crea un objeto reactivo (Proxy) que permite suscribirse a sus cambios.
 * * @param {Object} objetoInicial - El objeto plano base (ej: { contador: 0 }).
 * @returns {Proxy} El objeto reactivo. Cualquier cambio en él disparará las acciones suscritas.
 * @throws {TypeError} Si objetoInicial no es un objeto válido.
 */
export function crearEstado(objetoInicial) {
    // 1. Validación de seguridad
    if (!objetoInicial || typeof objetoInicial !== 'object') {
        throw new TypeError("crearEstado espera un objeto inicial ({}).");
    }

    // Inicializamos el estado inyectando el Set de acciones oculto
    const estadoBase = {
        ...objetoInicial,
        [ACCIONES_SECRETAS]: new Set()
    };

    return new Proxy(estadoBase, {
        /**
         * Intercepta asignaciones: estado.prop = valor
         */
        set(target, prop, valor) {
            // Protección: Permitir acceso interno al Symbol sin disparar eventos
            if (prop === ACCIONES_SECRETAS) {
                target[prop] = valor;
                return true;
            }

            const anterior = target[prop];

            // Optimización: Si el valor es idéntico, no gastamos recursos notificando
            if (anterior === valor) return true;

            // Aplicamos el cambio
            target[prop] = valor;

            // Notificamos a los observadores
            notificarCambios(target, prop, valor, anterior);
            return true;
        },

        /**
         * Intercepta eliminaciones: delete estado.prop
         */
        deleteProperty(target, prop) {
            // Protección: No permitir borrar el sistema de acciones interno
            if (prop === ACCIONES_SECRETAS) return false;

            // Si la propiedad no existe, confirmamos "éxito" pero no hacemos nada
            if (!(prop in target)) return true;

            const anterior = target[prop];
            const eliminado = delete target[prop];

            if (eliminado) {
                // Notificamos el cambio enviando 'undefined' como nuevo valor
                notificarCambios(target, prop, undefined, anterior);
            }
            return eliminado;
        }
    });
}

/**
 * Suscribe una función para que se ejecute cada vez que el estado cambie.
 * * @param {Proxy} estado - El estado creado con crearEstado().
 * @param {Function} nuevaAccion - Función a ejecutar: ({ estado, prop, valor, anterior }) => { ... }
 * @returns {Function} Función para desuscribirse (unsubscribe).
 */
export function onlineStateActions(estado, nuevaAccion) {
    if (!estado || !estado[ACCIONES_SECRETAS]) {
        throw new Error("El objeto no es un estado válido creado con crearEstado()");
    }
    if (typeof nuevaAccion !== 'function') {
        throw new Error("La acción debe ser una función.");
    }

    const acciones = estado[ACCIONES_SECRETAS];
    acciones.add(nuevaAccion);

    // Retornamos closure para eliminar esta suscripción específica
    return () => {
        acciones.delete(nuevaAccion);
    };
}

/**
 * Suscripción avanzada para efectos secundarios (similar a useEffect de React).
 * Maneja automáticamente la limpieza (cleanup) de la ejecución anterior antes de lanzar la nueva.
 * Útil para listeners de eventos, timers o llamadas a API que pueden cancelarse.
 * * @param {Proxy} estado - El estado reactivo.
 * @param {Function} accion - Función que ejecuta el efecto y opcionalmente retorna una función de limpieza.
 * @returns {Function} Función para desuscribirse totalmente y ejecutar la limpieza final.
 */
export function onlineStateActionExclusive(estado, accion) {
    if (!estado || !estado[ACCIONES_SECRETAS]) {
        throw new Error("El objeto no es un estado válido creado con crearEstado()");
    }

    const acciones = estado[ACCIONES_SECRETAS];

    // Variable local (Closure) para guardar la limpieza de la ejecución previa
    let cleanupFunc = null;

    const wrapper = (info) => {
        // A. Fase de Limpieza: Si hubo una ejecución previa, limpiamos su rastro
        if (typeof cleanupFunc === 'function') {
            try {
                cleanupFunc();
            } catch (e) {
                console.error('Error al limpiar efecto anterior:', e);
            }
        }

        // B. Fase de Ejecución: Corremos la acción y guardamos su nueva limpieza (si retorna una)
        try {
            const resultado = accion(info);
            if (typeof resultado === 'function') {
                cleanupFunc = resultado;
            } else {
                cleanupFunc = null;
            }
        } catch (error) {
            console.error('Error ejecutando acción exclusiva:', error);
        }
    };

    acciones.add(wrapper);

    // Retorno: Unsubscribe manual que asegura la limpieza final
    return () => {
        acciones.delete(wrapper);
        if (typeof cleanupFunc === 'function') {
            try {
                cleanupFunc();
            } catch (e) {
                console.error('Error en limpieza final:', e);
            }
        }
    };
}

/**
 * Elimina TODAS las suscripciones activas de un estado.
 * Útil para desmontar componentes, cerrar sesión o reiniciar la aplicación.
 * * @param {Proxy} estado - El estado reactivo a limpiar.
 * @returns {boolean} True si se limpió correctamente, False si no era un estado válido.
 */
export function clearAllStateActions(estado) {
    if (estado && estado[ACCIONES_SECRETAS]) {
        estado[ACCIONES_SECRETAS].clear();
        return true;
    }
    return false;
}