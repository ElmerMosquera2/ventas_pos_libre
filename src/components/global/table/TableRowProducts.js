// Debe retornar un elemento HTML para que el elmento custom + la funcion de filtro muestre los datos
export const TableRow = ({ codigo, nombre, precio }) => {
  const tr = document.createElement('tr');
  tr.classList.add('table-row');

  const tdCodigo = document.createElement('td');
  tdCodigo.textContent = codigo;
  tdCodigo.classList.add('cell-code');

  const tdNombre = document.createElement('td');
  tdNombre.textContent = nombre;
  tdNombre.classList.add('cell-name');

  const tdPrecio = document.createElement('td');
  tdPrecio.textContent = `$${precio}`;
  tdPrecio.classList.add('cell-price');

  tr.append(tdCodigo, tdNombre, tdPrecio);
  return tr;
};
