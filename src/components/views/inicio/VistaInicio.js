// //1. Importamos el CSS como un objeto de hoja de estilos
import stylesFirstSub from '../../../css/firstSub.css' with { type: 'css' };

import {appState, subColeccionVistasInicio} from "../hookNavs.js";
import {inicializarSuperNav} from "../manejoSuperNav.js";

export class VistaInicio extends HTMLElement {
    constructor() {
        super();
        // 2. Creamos el Shadow Root (modo 'open' para permitir acceso si es necesario)
        this.attachShadow({ mode: 'open' });
        // //3. Aplicamos los estilos directamente al Shadow Root
        // this.shadowRoot.adoptedStyleSheets = [styles];
    }

    connectedCallback() {
        this.render();
        this.configurarSubNavegacion();
    }

    render() {
        // // Esta es otra forma de ponerle estilos la forma tradicional
        // const link = document.createElement('link');
        // link.rel = 'stylesheet';
        // link.href = './styles.css'; // Aqui va la ruta del fichero css
        //
        // this.shadowRoot.appendChild(link);


        // 4. Limpiamos el shadowRoot (por seguridad)
        this.shadowRoot.replaceChildren();
        this.shadowRoot.adoptedStyleSheets = [stylesFirstSub];

        const menuConfig = [
            { label: 'Resumen', link: 'resumen' },
            { label: 'Notificaciones', link: 'notificaciones'},
        ];

        const nav = document.createElement('nav');
        nav.id = 'nav-inicio';
        nav.className = 'nav-firstSub';

        const title = document.createElement('h1');
        title.className = 'title-firstSub';
        title.textContent = 'Inicio';

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
        container.id = 'container-inicio';
        container.className = 'main-firstSub';

        this.shadowRoot.append(nav, container);
    }

    configurarSubNavegacion() {
        const navFirstSub = this.shadowRoot.getElementById('nav-inicio');
        const mainFirstSub = this.shadowRoot.getElementById('container-inicio');

        if (appState && navFirstSub && mainFirstSub) {
            inicializarSuperNav(
                appState,
                'subVistaInicio',
                mainFirstSub,
                navFirstSub,
                subColeccionVistasInicio
            );
        }
    }
}

// Registramos el elemento
customElements.define('vista-inicio', VistaInicio);