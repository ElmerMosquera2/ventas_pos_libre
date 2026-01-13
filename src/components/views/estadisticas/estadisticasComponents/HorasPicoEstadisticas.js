export class HorasPicoEstadisticas extends HTMLElement {
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
        pElemento.textContent = 'Hola desde hora pico estadisticas'

        this.shadowRoot.appendChild(pElemento)

    }
}

// Registramos el elemento
customElements.define('horas-pico-estadisticas', HorasPicoEstadisticas);