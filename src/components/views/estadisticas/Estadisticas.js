import {appState, subColeccionVistaEstadisticas} from "../hookNavs.js";
import {inicializarSuperNav} from "../manejoSuperNav.js";
import stylesFirstSub from '../../../css/firstSub.css' with { type: 'css' };



export class VistaEstadisticas extends HTMLElement {
    constructor() {
        super();
        // 1. Creamos el Shadow Root (modo 'open' para permitir acceso si es necesario)
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.configurarSubNavegacion()
    }

    render() {
        // 2. Limpiamos el shadowRoot (por seguridad)
        this.shadowRoot.replaceChildren();
        this.shadowRoot.adoptedStyleSheets = [stylesFirstSub];

        const menuConfig = [
            { label: 'Más Vendidos', link: 'masVendidos' },
            { label: 'Tendencia', link: 'tendencia'},
            { label: 'Horas Pico', link: 'horasPico' },
        ];

        const nav = document.createElement('nav');
        nav.id = 'nav-estadisticas';
        nav.className = 'nav-firstSub';

        const title = document.createElement('h1');
        title.className = 'title-firstSub';
        title.textContent = 'Inventario';

        const navUl = document.createElement('ul');
        navUl.className = 'navUl-firstSub';

        const items = menuConfig.map(item => {
            const li = document.createElement('li');
            li.className = 'navUlLi-firstSub';

            const a = document.createElement('a');
            a.className = 'navUlLiLink-firstSub';
            a.textContent = item.label;
            a.dataset.link = item.link;

            li.appendChild(a);
            return li;
        });

        navUl.append(...items);
        nav.append(title, navUl);

        const container = document.createElement('div');
        container.id = 'container-estadisticas';
        container.className = 'main-firstSub';

        this.shadowRoot.append(nav, container);

    }

    configurarSubNavegacion() {
        const navFirstSub = this.shadowRoot.getElementById('nav-estadisticas');
        const mainFirstSub = this.shadowRoot.getElementById('container-estadisticas');

        if (appState && navFirstSub && mainFirstSub) {
            inicializarSuperNav(
                appState,
                'subVistaEstadisticas',
                mainFirstSub,
                navFirstSub,
                subColeccionVistaEstadisticas
            );
        }
    }
}

// Registramos el elemento
customElements.define('vista-estadisticas', VistaEstadisticas);