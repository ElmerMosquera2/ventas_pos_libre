import { crearEstado } from '../../js/localLib.js'; // Tu función original

// 1. Estado único y centralizado
export const appState = crearEstado({
    vista: 'inicio',          // Controla el Nav principal
    subVistaInicio: 'resumen',
    subVistaVentas: 'transaccion',
    subVistaInventario: 'productos',
    subVistaEstadisticas: 'masVendidos',
});

// 2. Colección Principal (Con rutas relativas desde donde se ejecuta el IMPORT)
export const coleccionVistas = {
    inicio: {
        etiqueta: 'vista-inicio',
        importar: './inicio/VistaInicio.js'
    },
    ventas: {
        etiqueta: 'vista-ventas',
        importar: './ventas/VistaVentas.js'
    },
    inventario: {
        etiqueta: 'vista-inventario',
        importar: './inventario/VistaInventario.js'
    },
    estadisticas: {
        etiqueta: 'vista-estadisticas',
        importar: './estadisticas/Estadisticas.js'
    }
};

export const subColeccionVistasInicio = {
    resumen: {
        etiqueta: 'resumen-inicio',
        importar: './inicio/inicioComponents/ResumenInicio.js'
    },
    notificaciones: {
        etiqueta: 'notificaciones-inicio',
        importar: './inicio/inicioComponents/NotificacionesInicio.js'
    },

}

export const subColeccionVistasVentas = {
    transaccion: {
        etiqueta: 'transaccion-ventas',
        importar: './ventas/ventasComponents/TransaccionVentas.js'
    },
    registro: {
        etiqueta: 'registro-ventas',
        importar: './ventas/ventasComponents/RegistroVentas.js'
    },

}

export const subColeccionVistaInventario = {
    productos: {
        etiqueta: 'productos-inventario',
        importar: './inventario/inventarioComponents/ProductosInventario.js'
    },
    actualizarValorProducto: {
        etiqueta: 'actualizar-valor-inventario',
        importar: './inventario/inventarioComponents/ActualizarValorProductoInventario.js'
    },
    ofertas: {
        etiqueta: 'ofertas-inventario',
        importar: './inventario/inventarioComponents/OfertasInventario.js'
    },

}

export const subColeccionVistaEstadisticas = {
    masVendidos: {
        etiqueta: 'mas-vendidos-estadisticas',
        importar: './estadisticas/estadisticasComponents/MasVendidosEstadisticas.js'
    },
    tendencia: {
        etiqueta: 'tendencia-estadisticas',
        importar: './estadisticas/estadisticasComponents/TendenciaEstadisticas.js'
    },
    horasPico: {
        etiqueta: 'horas-pico-estadisticas',
        importar: './estadisticas/estadisticasComponents/HorasPicoEstadisticas.js'
    },
}