import { getPizzaPrice } from '../utils/get-pizza-price.js';
import { handleResponse } from '../utils/response-builder.js';
import { generateTTS } from '../utils/generate-tts.js';

export const handleOrderPizzaIntent = async (event) => {
  let responseMessage = "";

  try {
    console.log("Evento recebido:", JSON.stringify(event, null, 2));

    const { PizzaType, PizzaSize, DeliveryAddress } = event.sessionState.intent.slots;

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
        return handleResponse(event, 'ElicitSlot', 'PizzaType', responseMessage);
      }
    } else {
      console.log("Solicitando o tipo de pizza...");
      return handleResponse(event, 'ElicitSlot', 'PizzaType', 'Qual sabor de pizza você gostaria de pedir?');
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
        return handleResponse(event, 'ElicitSlot', 'PizzaSize', responseMessage);
      }
    } else {
      console.log("Solicitando o tamanho da pizza...");
      return handleResponse(event, 'ElicitSlot', 'PizzaSize', 'Entendi, qual o tamanho de pizza você prefere?');
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
        return handleResponse(event, 'ElicitSlot', 'DeliveryAddress', responseMessage);
      }
    } else {
      console.log("Solicitando o endereço de entrega...");
      return handleResponse(event, 'ElicitSlot', 'DeliveryAddress', 'Qual é o endereço de entrega?');
    }

    const pizzaTypeSlot = event.sessionState.intent.slots.PizzaType.value.resolvedValues[0]?.toLowerCase().trim();
    const pizzaSizeSlot = event.sessionState.intent.slots.PizzaSize.value.resolvedValues[0]?.toLowerCase().trim();;

    // Obter o preço da pizza
    const pizzaPrice = await getPizzaPrice(pizzaTypeSlot, pizzaSizeSlot);

    responseMessage += `Preço: ${pizzaPrice} Reais.`;

    try {
      // Gerar o áudio utilizando a função de TTS
      const audioUrl = await generateTTS(responseMessage);

      // Retornar a resposta final com o áudio
      return handleResponse(event, 'Close', null, [responseMessage, audioUrl]);
    } catch (error) {
      // Retornar a resposta final em caso de falha na geração do áudio
      return handleResponse(event, 'Failed', null, 'Houve um problema ao gerar o áudio da resposta.');
    }
  } catch (error) {
    console.error('Erro ao processar a intenção de pedido de pizza:', error);
    // Retornar a resposta final em caso de erro no processamento
    return handleResponse(event, 'Failed', null, 'Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.');
  }
};
