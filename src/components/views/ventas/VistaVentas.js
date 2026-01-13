import { inicializarSuperNav } from "../manejoSuperNav.js";
import { appState, subColeccionVistasVentas } from "../hookNavs.js";
import stylesFirstSub from '../../../css/firstSub.css' with { type: 'css' };


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
        this.shadowRoot.adoptedStyleSheets = [stylesFirstSub];

        // 1. Configuración de datos (Fácil de mantener y escalar)
        const menuConfig = [
            { label: 'Transaccion', link: 'transaccion' },
            { label: 'Registro', link: 'registro'}
        ];

        // 2. Creación de los contenedores principales
        const nav = document.createElement('nav');
        nav.id = 'nav-ventas';
        nav.className = 'nav-firstSub';

        const title = document.createElement('h1');
        title.className = 'title-firstSub';
        title.textContent = 'Ventas';

        const navUl = document.createElement('ul');
        navUl.className = 'navUl-firstSub';

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
        navUl.append(...items);
        nav.append(title, navUl);

        const container = document.createElement('div');
        container.id = 'container-ventas';
        container.className = 'main-firstSub';

        // 5. Inserción final al Shadow Root
        this.shadowRoot.append(nav, container);
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
