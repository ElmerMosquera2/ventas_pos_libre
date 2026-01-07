import { inicializarSuperNav } from '../components/views/manejoSuperNav.js';
import { appState, coleccionVistas } from "../components/views/hookNavs.js";

document.addEventListener('DOMContentLoaded', () => {
    const visor = document.getElementById('main');

    // Inicializamos el Nav principal apuntando a la propiedad 'vista'
    inicializarSuperNav(appState, visor, coleccionVistas, "nav-index", "vista");

    // Si tuvieras un nav interno, lo inicializas aquí mismo:
    // inicializarSuperNav(appState, visorInterno, coleccionVentaInterna, "nav-ventas", "subVistaVentas");
});
