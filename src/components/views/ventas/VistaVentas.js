export class VistaVentas extends HTMLElement {
    constructor() {
        super();
        // 1. Creamos el Shadow Root (modo 'open' para permitir acceso si es necesario)
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        // 2. Limpiamos el shadowRoot (por seguridad)
        this.shadowRoot.replaceChildren();

    }
}

// Registramos el elemento
customElements.define('vista-ventas', VistaVentas);
