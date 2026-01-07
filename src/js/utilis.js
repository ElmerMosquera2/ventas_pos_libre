export const toCamelCase = (str) => {
    return str
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quita acentos (Ventas Máximas -> Ventas Maximas)
        .toLowerCase()
        .trim()
        .split(/\s+/) // Divide por cualquier espacio
        .map((word, index) =>
            index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join('');
};
