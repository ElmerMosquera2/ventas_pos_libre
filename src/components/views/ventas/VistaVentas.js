import { inicializarSuperNav } from "../manejoSuperNav.js";
import { appState, subColeccionVistasVentas } from "../hookNavs.js";


export class VistaVentas extends HTMLElement {
    constructor() {
        super();
        // 1. Creamos el Shadow Root (modo 'open' para permitir acceso si es necesario)
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.configurarSubNavegacion();
    }

    render() {
        this.shadowRoot.replaceChildren();

        // 1. Configuración de datos (Fácil de mantener y escalar)
        const menuConfig = [
            { label: 'Transacciones', link: 'transacciones' },
            { label: 'Registro',      link: 'registro'      }
        ];

        // 2. Creación de los contenedores principales
        const navVentas = document.createElement('nav');
        navVentas.id = 'nav-ventas';
        navVentas.className = 'nav-firstSub';

        const tituloVentas = document.createElement('h1');
        tituloVentas.className = 'title-firstSub';
        tituloVentas.textContent = 'Ventas';

        const navUlVentas = document.createElement('ul');
        navUlVentas.className = 'navUl-firstSub';

        // 3. Mapeo de ítems (Transformación de datos a elementos)
        const items = menuConfig.map(item => {
            const li = document.createElement('li');
            li.className = 'navUlLi-firstSub';

            const a = document.createElement('a');
            a.className = 'navUlLiLink-firstSub';
            a.textContent = item.label;
            a.dataset.link = item.link; // Usamos el link definido en el objeto

            li.appendChild(a);
            return li;
        });

        // 4. Inserción eficiente
        // .append() permite insertar múltiples hijos de una vez y acepta el spread operator
        navUlVentas.append(...items);
        navVentas.append(tituloVentas, navUlVentas);

        const containerVentas = document.createElement('div');
        containerVentas.id = 'container-ventas';
        containerVentas.className = 'main-firstSub';

        // 5. Inserción final al Shadow Root
        this.shadowRoot.append(navVentas, containerVentas);
    }

    configurarSubNavegacion() {
        const navFirstSub = this.shadowRoot.getElementById('nav-ventas');
        const mainFirstSub = this.shadowRoot.getElementById('container-ventas');

        if (appState && navFirstSub && mainFirstSub) {
            inicializarSuperNav(
                appState,
                'subVistaVentas',
                mainFirstSub,
                navFirstSub,
                subColeccionVistasVentas
            );
        }
    }
}

// Registramos el elemento
customElements.define('vista-ventas', VistaVentas);
