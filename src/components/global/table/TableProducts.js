import { TableRowProducts } from './TableRowProducts.js'

export const Table = (listaProductos) => {
  // 1. Contenedor principal
  const table = document.createElement('table');
  table.classList.add('main-table');

  // 2. Construcción manual del Encabezado (thead)
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  // Celda de encabezado: Código
  const thCodigo = document.createElement('th');
  thCodigo.textContent = 'Código';
  thCodigo.classList.add('header-cell');

  // Celda de encabezado: Producto
  const thNombre = document.createElement('th');
  thNombre.textContent = 'Producto';
  thNombre.classList.add('header-cell');

  // Celda de encabezado: Precio
  const thPrecio = document.createElement('th');
  thPrecio.textContent = 'Precio';
  thPrecio.classList.add('header-cell');

  // Unir encabezados
  headerRow.append(thCodigo, thNombre, thPrecio);
  thead.append(headerRow);

  // 3. Construcción del Cuerpo (tbody)
  const tbody = document.createElement('tbody');
  const fragment = new DocumentFragment();

  // Iterar y crear filas
  listaProductos.forEach(producto => {
    const row = TableRowProducts(producto);
    fragment.append(row);
  });

  tbody.append(fragment);

  // 4. Ensamble final de la tabla
  table.append(thead, tbody);

  return table;
};

