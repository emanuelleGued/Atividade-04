import fs from 'node:fs';

// Caminho do arquivo JSON com os dados das pizzas
const pizzasUrl = new URL('./Pizzas.json', import.meta.url);

export const getPizzas = async () => {
    // Lê o arquivo JSON com os dados das pizzas
    const response = fs.readFileSync(pizzasUrl, 'utf8');
    const pizzas = await JSON.parse(response).Pizzas;

    return pizzas;
};