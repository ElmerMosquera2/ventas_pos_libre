/**
 * Crea una estructura de tabla HTML semántica y reutilizable.
 * 
 * @param {Object} params - Objeto de configuración (desestructurado).
 * @param {string[]} params.headers - Array de strings con los títulos de las columnas.
 * @param {Object[]} params.data - Array de objetos con la información a representar.
 * @param {Function} params.rowRenderer - Función que recibe un objeto y retorna un elemento <tr>.
 * @returns {HTMLTableElement} Elemento tabla completo listo para ser insertado en el DOM.
 */
export const createTable = ({ headers, data, rowRenderer }) => {
  // Inicializa el contenedor principal de la tabla con su clase de estilo
  const table = document.createElement('table');
  table.classList.add('custom-table');

  // --- SECCIÓN DE ENCABEZADO ---
  // Se crea el elemento semántico thead y su fila contenedora
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  // Itera sobre los títulos para crear celdas de encabezado (th) seguras
  headers.forEach(text => {
    const th = document.createElement('th');
    th.textContent = text; // Asignación segura para evitar inyección de código
    th.classList.add('table__header');
    headerRow.append(th);
  });
  
  thead.append(headerRow);

  // --- SECCIÓN DE CUERPO ---
  // Se crea el tbody y un DocumentFragment para optimizar el rendimiento del DOM
  const tbody = document.createElement('tbody');
  const fragment = new DocumentFragment();

  // Procesa cada objeto del array 'data' delegando la creación de la fila al rowRenderer
  data.forEach(item => {
    // El rowRenderer debe retornar un elemento <tr> configurado
    const row = rowRenderer(item);
    fragment.append(row);
  });

  // Inserta todas las filas de una sola vez al tbody para evitar múltiples reflujos (reflows)
  tbody.append(fragment);

  // --- ENSAMBLE FINAL ---
  // Une las partes semánticas a la tabla principal
  table.append(thead, tbody);

  return table;
};
