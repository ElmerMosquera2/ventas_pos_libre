import { inicializarSuperNav } from '../components/views/manejoSuperNav.js';
import { appState, coleccionVistas } from "../components/views/hookNavs.js";

document.addEventListener('DOMContentLoaded', () => {
    const visor = document.getElementById('main');
    const navHome = document.getElementById('nav-index');

    // Inicializamos el Nav principal apuntando a la propiedad 'vista'
    inicializarSuperNav(
        appState,
        "vista",
        visor,
        navHome,
        coleccionVistas
    );
});
