import { handleElicitSlotResponse, handleCloseResponse, generateTTSResponse, handleFinalResponse } from '../utils/response-builder.js';
import { handleGetPizzaPrice } from '../utils/payment.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Pizzas = require('../utils/Pizzas.json');


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


    // Access the list of pizzas
    const pizzas = Pizzas.Pizzas;

    const pizzaTypeSlots = event.sessionState.intent.slots.PizzaType.value.resolvedValues[0]?.toLowerCase().trim();
    const pizzaSizeSlots = event.sessionState.intent.slots.PizzaSize.value.resolvedValues[0]?.toLowerCase().trim();;
    // Iterate over the list of pizzas
    for (let i in pizzas) {
      let pizza = pizzas[i];
      // Compare the pizza type (Nome)
      if (pizza.Nome === pizzaTypeSlots) {
        // If the pizza type matches, check the size
        let price = pizza.Tamanho[pizzaSizeSlots];
        if (price !== undefined) {
          responseMessage += `Preço: ${price} Reais. `;
          console.log(`Pizza encontrada: ${pizza.Nome} (${pizzaSizeSlots}) - ${price} Reais`);
        } else {
          console.log(`Tamanho ${pizzaSizeSlots} não encontrado para a pizza ${pizza.Nome}`);
        }
        break; // Exit the loop once the pizza is found
      }
    }

    console.log("Frase principal extraída:", responseMessage);

    try {
      // Gerar o áudio utilizando a função de TTS
      const audioUrl = await generateTTSResponse(responseMessage);

      // Retornar a resposta final com o áudio
      return handleFinalResponse(event, 'Fulfilled', responseMessage, audioUrl);
    } catch (error) {
      // Retornar a resposta final em caso de falha na geração do áudio
      return handleFinalResponse(event, 'Failed', 'Houve um problema ao gerar o áudio da resposta.');
    }

  } catch (error) {
    console.error('Erro ao processar a intenção de pedido de pizza:', error);
    // Retornar a resposta final em caso de erro no processamento
    return handleCloseResponse(event, 'Failed', 'Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.');
  }
};
