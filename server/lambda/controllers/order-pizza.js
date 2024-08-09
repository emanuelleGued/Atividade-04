import { handleElicitSlotResponse, handleCloseResponse } from '../utils/response-builder.js';

const validSizes = ['grande', 'media', 'pequena', 'p', 'm', 'g'];

// Definição do cardápio para consulta
const menuDetails = [
  'margherita',
  'pepperoni',
  'calabresa',
  'frango com catupiry',
  'churrasco',
  'portuguesa',
  'napolitana',
  'toscana',
  'vegetariana',
  'quatro queijos'
];

export const handleOrderPizzaIntent = async (event) => {
  let responseMessage = "";

  try {
    console.log("Evento recebido:", JSON.stringify(event, null, 2));

    if (event.sessionState && event.sessionState.intent && event.sessionState.intent.slots) {
      const { PizzaType, PizzaSize } = event.sessionState.intent.slots;

      // Verificação do tipo de pizza
      if (PizzaType) {
        let pizzaTypeSlot = PizzaType.value ? PizzaType.value.originalValue.toLowerCase().trim() : null;
        console.log("PizzaType recebido:", pizzaTypeSlot);

        if (pizzaTypeSlot && menuDetails.includes(pizzaTypeSlot)) {
          responseMessage += `Você escolheu uma pizza de ${pizzaTypeSlot}. `;
        } else {
          responseMessage = "Desculpe, não temos essa pizza no cardápio.";
          console.log(responseMessage);
          return handleCloseResponse(event, 'Fulfilled', responseMessage);
        }
      } else {
        console.log("Solicitando o tipo de pizza...");
        return handleElicitSlotResponse(event, 'PizzaType', 'Que sabor de pizza você gostaria de pedir?');
      }

      // Verificação do tamanho da pizza
      if (PizzaSize) {
        let pizzaSizeSlot = PizzaSize.value ? PizzaSize.value.originalValue.toLowerCase().trim() : null;
        console.log("PizzaSize recebido:", pizzaSizeSlot);

        if (pizzaSizeSlot && validSizes.includes(pizzaSizeSlot)) {
          responseMessage += `Tamanho escolhido: ${pizzaSizeSlot}. `;
        } else {
          responseMessage = "Desculpe, não temos esse tamanho no cardápio.";
          console.log(responseMessage);
          return handleCloseResponse(event, 'Fulfilled', responseMessage);
        }
      } else {
        console.log("Solicitando o tamanho da pizza...");
        return handleElicitSlotResponse(event, 'PizzaSize', 'Entendi, qual o tamanho de pizza você prefere?');
      }
    } else {
      responseMessage = "Houve um problema ao processar sua solicitação.";
      console.log(responseMessage);
    }

    console.log("Mensagem de resposta final:", responseMessage);
    return handleCloseResponse(event, 'Fulfilled', responseMessage);
  } catch (error) {
    console.error('Erro ao processar a intenção de pedido de pizza:', error);
    return handleCloseResponse(event, 'Failed', 'Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.');
  }
};
