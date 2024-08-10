import { handleElicitSlotResponse, handleCloseResponse } from '../utils/response-builder.js';
import { api } from '../lib/api.js';

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
      console.log("Processando os slots...");

      const { PizzaType, PizzaSize, DeliveryAddress, NumberAdress } = event.sessionState.intent.slots;

      // Verificação do tipo de pizza
      if (!PizzaType || !PizzaType.value) {
        console.log("Solicitando o tipo de pizza...");
        return handleElicitSlotResponse(event, 'PizzaType', 'Que sabor de pizza você gostaria de pedir?');
      } else {
        let pizzaTypeSlot = PizzaType.value.originalValue.toLowerCase().trim();
        console.log("PizzaType recebido:", pizzaTypeSlot);

        if (menuDetails.includes(pizzaTypeSlot)) {
          responseMessage = `Você escolheu uma pizza de ${pizzaTypeSlot}. `;
          console.log("Tipo de pizza válido adicionado à mensagem.");
        } else {
          responseMessage = "Desculpe, não temos essa pizza no cardápio.";
          console.log(responseMessage);
          return handleCloseResponse(event, 'Fulfilled', responseMessage);
        }
      }

      // Verificação do tamanho da pizza
      if (!PizzaSize || !PizzaSize.value) {
        console.log("Solicitando o tamanho da pizza...");
        return handleElicitSlotResponse(event, 'PizzaSize', 'Entendi, qual o tamanho de pizza você prefere?');
      } else {
        let pizzaSizeSlot = PizzaSize.value.originalValue.toLowerCase().trim();
        console.log("PizzaSize recebido:", pizzaSizeSlot);

        if (validSizes.includes(pizzaSizeSlot)) {
          responseMessage += `Tamanho escolhido: ${pizzaSizeSlot}. `;
          console.log("Tamanho da pizza válido adicionado à mensagem.");
        } else {
          responseMessage = "Desculpe, não temos esse tamanho no cardápio.";
          console.log(responseMessage);
          return handleCloseResponse(event, 'Fulfilled', responseMessage);
        }
      }

      // Verificação do endereço de entrega
      if (!DeliveryAddress || !DeliveryAddress.value) {
        console.log("Solicitando o endereço de entrega...");
        return handleElicitSlotResponse(event, 'DeliveryAddress', 'Por favor, informe o endereço de entrega.');
      } else {
        let deliveryAddress = DeliveryAddress.value.originalValue.trim();
        responseMessage += `Endereço de entrega: ${deliveryAddress}. `;
        console.log("Endereço de entrega adicionado à mensagem.");
      }

      // Verificação do número da casa
      if (!NumberAdress || !NumberAdress.value) {
        console.log("Solicitando o número da casa...");
        return handleElicitSlotResponse(event, 'NumberAdress', 'Por favor, informe o número da casa.');
      } else {
        let numberAdress = NumberAdress.value.originalValue.trim();
        responseMessage += `Número: ${numberAdress}. `;
        console.log("Número da casa adicionado à mensagem.");
      }

    } else {
      responseMessage = "Houve um problema ao processar sua solicitação.";
      console.log(responseMessage);
    }

    console.log("Frase principal extraída:", responseMessage);

    // Chamar a API de TTS para gerar o áudio
    try {
      const payload = {
        phrase: responseMessage,
      };
      console.log("Payload enviado para a API de TTS:", payload);

      const ttsResponse = await api.post('/v1/tts', payload);
      const audioUrl = ttsResponse.data.audio_url;

      // Retornar a mensagem original e o link do áudio
      return {
        sessionState: {
          dialogAction: {
            type: 'Close',
          },
          intent: {
            name: event.sessionState.intent.name,
            state: 'Fulfilled',
          },
        },
        messages: [
          {
            contentType: 'PlainText',
            content: responseMessage,
          },
          {
            contentType: 'PlainText',
            content: `Aqui está o áudio da sua resposta: ${audioUrl}`,
          },
        ],
      };
    } catch (error) {
      console.error('Erro ao chamar a API de TTS:', error);
      return {
        sessionState: {
          dialogAction: {
            type: 'Close',
          },
          intent: {
            name: event.sessionState.intent.name,
            state: 'Failed',
          },
        },
        messages: [
          {
            contentType: 'PlainText',
            content: 'Houve um problema ao gerar o áudio da resposta.',
          },
        ],
      };
    }

  } catch (error) {
    console.error('Erro ao processar a intenção de pedido de pizza:', error);
    return {
      sessionState: {
        dialogAction: {
          type: 'Close',
        },
        intent: {
          name: event.sessionState.intent.name,
          state: 'Failed',
        },
      },
      messages: [
        {
          contentType: 'PlainText',
          content: 'Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.',
        },
      ],
    };
  }
};
