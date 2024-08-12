import { getPizzas } from "./get-pizzas.js";

export const getPizzaPrice = async (pizzaTypeSlot, pizzaSizeSlot) => {
  const pizzas = await getPizzas();

  let price = 0;

  // Procura o preço da pizza escolhida
  pizzas.map(pizza => {
    if (pizza.Nome === pizzaTypeSlot) {
      price = pizza.Tamanho[pizzaSizeSlot];
    }
  });

  return price;
};