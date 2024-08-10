import { handleElicitSlotResponse, handleCloseResponse } from '../utils/response-builder.js';
import { api } from '../lib/api.js';

export const handleOrderPizzaIntent = async (event) => {
  let responseMessage = "";

  try {
    console.log("Evento recebido:", JSON.stringify(event, null, 2));

    const { PizzaType, PizzaSize, DeliveryAddress, NumberAdress } = event.sessionState.intent.slots;

    // Verificação do tipo de pizza
    if (PizzaType && PizzaType.value) {
      let pizzaTypeSlot = PizzaType.value.resolvedValues[0]?.toLowerCase().trim();
      console.log("PizzaType recebido:", pizzaTypeSlot);

      if (pizzaTypeSlot) {
        responseMessage = `Você escolheu uma pizza de ${pizzaTypeSlot}. `;
        console.log("Tipo de pizza válido adicionado à mensagem.");
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
    if (PizzaSize && PizzaSize.value) {
      let pizzaSizeSlot = PizzaSize.value.resolvedValues[0]?.toLowerCase().trim();
      console.log("PizzaSize recebido:", pizzaSizeSlot);

      if (pizzaSizeSlot) {
        responseMessage += `Tamanho escolhido: ${pizzaSizeSlot}. `;
        console.log("Tamanho da pizza válido adicionado à mensagem.");
      } else {
        responseMessage = "Desculpe, não temos esse tamanho no cardápio.";
        console.log(responseMessage);
        return handleCloseResponse(event, 'Fulfilled', responseMessage);
      }
    } else {
      console.log("Solicitando o tamanho da pizza...");
      return handleElicitSlotResponse(event, 'PizzaSize', 'Entendi, qual o tamanho de pizza você prefere?');
    }

    // Verificação do endereço de entrega
    if (DeliveryAddress && DeliveryAddress.value) {
      let deliveryAddressSlot = DeliveryAddress.value.originalValue.trim();
      console.log("DeliveryAddress recebido:", deliveryAddressSlot);

      if (deliveryAddressSlot) {
        responseMessage += `Endereço de entrega: ${deliveryAddressSlot}. `;
        console.log("Endereço de entrega válido adicionado à mensagem.");
      } else {
        responseMessage = "Desculpe, não consegui entender o endereço de entrega.";
        console.log(responseMessage);
        return handleCloseResponse(event, 'Fulfilled', responseMessage);
      }
    } else {
      console.log("Solicitando o endereço de entrega...");
      return handleElicitSlotResponse(event, 'DeliveryAddress', 'Qual é o endereço de entrega?');
    }

    // Verificação do número do endereço
    if (NumberAdress && NumberAdress.value) {
      let numberAdressSlot = NumberAdress.value.originalValue.trim();
      console.log("NumberAdress recebido:", numberAdressSlot);

      if (numberAdressSlot) {
        responseMessage += `Número: ${numberAdressSlot}. `;
        console.log("Número do endereço válido adicionado à mensagem.");
      } else {
        responseMessage = "Desculpe, não consegui entender o número do endereço.";
        console.log(responseMessage);
        return handleCloseResponse(event, 'Fulfilled', responseMessage);
      }
    } else {
      console.log("Solicitando o número do endereço...");
      return handleElicitSlotResponse(event, 'NumberAdress', 'Qual é o número do endereço?');
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
