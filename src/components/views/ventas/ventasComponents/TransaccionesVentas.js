export class TransaccionesVentas extends HTMLElement {
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

        const pElemento = document.createElement('p')
        pElemento.textContent = 'Hola desde transacciones de ventas'

        this.shadowRoot.appendChild(pElemento)

    }
}

// Registramos el elemento
customElements.define('transacciones-ventas', TransaccionesVentas);