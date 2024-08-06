import { handleElicitSlotResponse, handleCloseResponse } from '../utils/response-builder.js';

export const handleGetDetailsOfPizzaIntent = async (event) => {
  let pizzaType;

  try {
    // Acessando o valor do slot 'PizzaType'
    pizzaType = event.sessionState.intent.slots.PizzaType.value.interpretedValue;
  } catch (e) {
    console.error(`Erro ao acessar o slot: ${e}`);

    return handleElicitSlotResponse(event, 'PizzaType', 'Desculpe, não consegui processar a sua solicitação. Por favor, informe o sabor da pizza novamente.');
  }

  const menuDetails = {
    "Margherita": "Ingredientes da Margherita: Tomate, queijo muçarela e manjericão.",
    "Pepperoni": "Ingredientes da Pepperoni: Queijo, molho de tomate e pepperoni.",
    "Calabresa": "Ingredientes da Calabresa: Calabresa, queijo e cebola.",
    "Frango com Catupiry": "Ingredientes da Frango com Catupiry: Frango desfiado, catupiry e milho.",
    "Churrasco": "Ingredientes da Churrasco: Carne de churrasco, queijo e molho barbecue.",
    "Portuguesa": "Ingredientes da Portuguesa: Presunto, queijo, ovos, cebola e azeitona.",
    "Marguerita": "Ingredientes da Marguerita: Tomate, queijo muçarela e manjericão.",
    "Napolitana": "Ingredientes da Napolitana: Tomate, queijo e alho.",
    "Toscana": "Ingredientes da Toscana: Calabresa, queijo, tomate e manjericão.",
    "Vegetariana": "Ingredientes da Vegetariana: Legumes variados, queijo e molho de tomate."
  };

  let responseMessage;

  if (pizzaType && menuDetails[pizzaType]) {
    responseMessage = menuDetails[pizzaType];
  } else {
    responseMessage = "Infelizmente o sabor que você deseja não está no nosso cardápio.";
  }

  return handleCloseResponse(event, 'Fulfilled', responseMessage);
};