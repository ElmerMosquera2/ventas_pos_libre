// //1. Importamos el CSS como un objeto de hoja de estilos
// import styles from './styles.css' with { type: 'css' };

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
        // 5 Aqui creamos la interface
    }
}

// Registramos el elemento
customElements.define('vista-inicio', VistaInicio);