import Pizzas from './Pizzas.json' assert { type: 'json' };

export const handleGetPizzaPrice = (pizzaTypeSlot, pizzaSizeSlot) => {

try {
    console.log("Iniciando busca pela pizza...");

    // Access the list of pizzas
    const pizzas = Pizzas.Pizzas;

    // Iterate over the list of pizzas
    for (let i in pizzas) {
        let pizza = pizzas[i];
        
        // Compare the pizza type (Nome)
        if (pizza.Nome === pizzaTypeSlot) {
            // If the pizza type matches, check the size
            let price = pizza.Tamanho[pizzaSizeSlot];
            
            if (price !== undefined) {
                return `Pizza encontrada: ${pizza.Nome} (${pizzaSizeSlot}) - R$ ${price}`;
            } else {
                return (`Tamanho ${pizzaSizeSlot} não encontrado para a pizza ${pizza.Nome}`);
            }
            break; // Exit the loop once the pizza is found
        }
    }
} catch (error) {
    // Handle errors
    console.error('Erro ao buscar dados:', error);
    }};

