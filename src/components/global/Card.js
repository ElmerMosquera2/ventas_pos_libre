// Debe retornar un elemento HTML para que el elmento custom + la funcion de filtro muestre los datos

export const Card = ({ codigo, nombre, precio }) => {
  const card = document.createElement('article');
  card.classList.add('card'); // Clase principal

  const nombreEl = document.createElement('h3');
  nombreEl.textContent = nombre;
  nombreEl.classList.add('card__title'); 

  const codigoEl = document.createElement('span');
  codigoEl.textContent = `ID: ${codigo}`;
  codigoEl.classList.add('card__code');

  const precioEl = document.createElement('span');
  precioEl.textContent = `$${precio}`;
  precioEl.classList.add('card__price');

  // Construcción
  card.append(nombreEl, codigoEl, precioEl);
  
  return card;
};
