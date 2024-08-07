import { handleElicitSlotResponse, handleCloseResponse } from '../utils/response-builder.js';

export const handleGetDetailsOfPizzaIntent = async (event) => {
  let pizzaType;

  // Verificar se o slot 'PizzaType' está presente e possui um valor
  try {
    pizzaType = event.sessionState.intent.slots.PizzaType.value.interpretedValue;
  } catch (e) {
    console.error(`Erro ao acessar o slot: ${e}`);
  }

  // Se o valor do slot 'PizzaType' não estiver presente, solicitar ao usuário que forneça
  if (!pizzaType) {
    return handleElicitSlotResponse(event, 'PizzaType', 'De qual sabor você gostaria de saber mais?');
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
    "Vegetariana": "Ingredientes da Vegetariana: Legumes variados, queijo e molho de tomate.",
    "Quatro Queijos": "Ingredientes da Quatro Queijos: muçarela, gorgonzola, parmesão, catupiry e orégano."
  };

  let responseMessage;

  if (menuDetails[pizzaType]) {
    responseMessage = menuDetails[pizzaType];
  } else {
    responseMessage = "Infelizmente o sabor que você deseja não está no nosso cardápio.";
  }

  return handleCloseResponse(event, 'Fulfilled', responseMessage);
};
