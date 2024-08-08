import { handleElicitSlotResponse, handleCloseResponse } from '../utils/response-builder.js';

export const handleGetDetailsOfPizzaIntent = async (event) => {
    let responseMessage = "";

    if (event.sessionState && 
        event.sessionState.intent && 
        event.sessionState.intent.slots) {
        
        if (event.sessionState.intent.slots.PizzaType) {
            // Obtém o valor do slot 'PizzaType' se estiver presente
            const pizzaSlot = event.sessionState.intent.slots.PizzaType;
            let pizzaTypeSlot = null;

            // Verifica se pizzaSlot e pizzaSlot.value são válidos
            if (pizzaSlot && pizzaSlot.value && pizzaSlot.value.originalValue) {
                // Normaliza o valor do slot para minúsculas e remove espaços extras
                pizzaTypeSlot = pizzaSlot.value.originalValue.toLowerCase().trim();
                
                const menuDetails = {
                    "margherita": "Ingredientes da Margherita: Tomate, queijo muçarela e manjericão.",
                    "pepperoni": "Ingredientes da Pepperoni: Queijo, molho de tomate e pepperoni.",
                    "calabresa": "Ingredientes da Calabresa: Calabresa, queijo e cebola.",
                    "frango com catupiry": "Ingredientes da Frango com Catupiry: Frango desfiado, catupiry e milho.",
                    "churrasco": "Ingredientes da Churrasco: Carne de churrasco, queijo e molho barbecue.",
                    "portuguesa": "Ingredientes da Portuguesa: Presunto, queijo, ovos, cebola e azeitona.",
                    "marguerita": "Ingredientes da Marguerita: Tomate, queijo muçarela e manjericão.",
                    "napolitana": "Ingredientes da Napolitana: Tomate, queijo e alho.",
                    "toscana": "Ingredientes da Toscana: Calabresa, queijo, tomate e manjericão.",
                    "vegetariana": "Ingredientes da Vegetariana: Legumes variados, queijo e molho de tomate.",
                    "quatro queijos": "Ingredientes da Quatro Queijos: Muçarela, gorgonzola, parmesão, catupiry e orégano."
                };
                
                // Verifica se a pizza está no cardápio
                if (pizzaTypeSlot && menuDetails[pizzaTypeSlot]) {
                    responseMessage = menuDetails[pizzaTypeSlot];
                } else {
                    responseMessage = "Desculpe, não temos essa pizza no cardápio.";
                }
            } else {
                responseMessage = "Desculpe, não consegui entender o tipo de pizza.";
            }
        } else {
            // Se o slot 'PizzaType' não foi preenchido, pedir ao usuário que forneça o sabor da pizza
            return handleElicitSlotResponse(event, 'PizzaType', 'Qual sabor de pizza você gostaria de saber mais?');
        }
    } else {
        responseMessage = "Houve um problema ao processar sua solicitação.";
    }

    return handleCloseResponse(event, 'Fulfilled', responseMessage);
};
