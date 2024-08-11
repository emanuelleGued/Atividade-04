import fs from 'node:fs';

// Caminho do arquivo JSON com os dados das pizzas
const pizzasUrl = new URL('./Pizzas.json', import.meta.url);

export const getPizzaPrice = async (pizzaTypeSlot, pizzaSizeSlot) => {
  // Lê o arquivo JSON com os dados das pizzas
  const response = fs.readFileSync(pizzasUrl, 'utf8');
  const pizzas = await JSON.parse(response).Pizzas;

  let price = 0;

  // Procura o preço da pizza escolhida
  pizzas.map(pizza => {
    if (pizza.Nome === pizzaTypeSlot) {
      price = pizza.Tamanho[pizzaSizeSlot];
    }
  });

  return price;
};