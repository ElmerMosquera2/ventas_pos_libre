import { crearEstado } from '../../js/localLib.js'; // Tu función original

// 1. Estado único y centralizado
export const appState = crearEstado({
    vista: 'inicio',          // Controla el Nav principal
    subVistaVentas: 'transacciones'
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

export const subColeccionVistasVentas = {
    transacciones: {
        etiqueta: 'transacciones-ventas',
        importar: './ventas/ventasComponents/TransaccionesVentas.js'
    },
    registro: {
        etiqueta: 'registro-ventas',
        importar: './ventas/ventasComponents/RegistroVentas.js'
    },

}
