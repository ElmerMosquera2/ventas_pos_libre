const ACCIONES_SECRETAS = Symbol('acciones');

export function crearEstado(objetoInicial) {
    // Usamos Set para evitar duplicados automáticamente (Mejora del Código B)
    const estadoBase = {
        ...objetoInicial,
        [ACCIONES_SECRETAS]: new Set()
    };

    return new Proxy(estadoBase, {
        set(target, prop, valor) {
            const anterior = target[prop];

            // 1. Optimización: Si el valor es idéntico, no hacemos nada
            if (anterior === valor) return true;

            target[prop] = valor;

            const acciones = target[ACCIONES_SECRETAS];
            if (!acciones || acciones.size === 0) return true;

            // 2. Snapshot: Convertimos el Set a Array antes de iterar.
            // Esto evita errores si una acción añade/elimina otras acciones mientras se ejecuta.
            const snapshot = Array.from(acciones);

            snapshot.forEach(fn => {
                // 3. Seguridad: Try/Catch para que un error no rompa la app
                try {
                    fn({ estado: target, prop, valor, anterior });
                } catch (err) {
                    console.error('⚠️ Error en acción de estado:', err);
                }
            });

            return true;
        }
    });
}

// FUNCIÓN 1: Suscripción estándar
export function onlineStateActions(estado, nuevaAccion) {
    const acciones = estado[ACCIONES_SECRETAS];
    if (!acciones) throw new Error("El objeto no es un estado válido");

    acciones.add(nuevaAccion);

    // Retornamos función para desuscribirse limpiamente
    return () => {
        acciones.delete(nuevaAccion);
    };
}

// FUNCIÓN 2: Suscripción con limpieza (Efectos) - Mejorada para evitar conflictos
export function onlineStateActionExclusive(estado, accion) {
    const acciones = estado[ACCIONES_SECRETAS];
    if (!acciones) throw new Error("El objeto no es un estado válido");

    // Variable local en el closure: Mantiene la limpieza SOLO de esta acción específica.
    // Esto permite tener múltiples "Exclusive" corriendo sin que se pisen entre ellas.
    let cleanupFunc = null;

    const wrapper = (info) => {
        // A. Limpiamos el rastro de la ejecución anterior (si existe)
        if (typeof cleanupFunc === 'function') {
            try {
                cleanupFunc();
            } catch (e) {
                console.error('Error al limpiar efecto anterior:', e);
            }
        }

        // B. Ejecutamos la acción y guardamos la nueva función de limpieza
        const resultado = accion(info);

        // Solo guardamos si devolvió una función
        if (typeof resultado === 'function') {
            cleanupFunc = resultado;
        } else {
            cleanupFunc = null;
        }
    };

    acciones.add(wrapper);

    // Retorno: Desuscribirse y ejecutar la limpieza final
    return () => {
        acciones.delete(wrapper);
        if (typeof cleanupFunc === 'function') cleanupFunc();
    };
}
