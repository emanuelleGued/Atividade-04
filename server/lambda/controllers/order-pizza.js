import { getPizzaPrice } from '../utils/get-pizza-price.js';
import { handleResponse } from '../utils/response-builder.js';
import { generateTTS } from '../utils/generate-tts.js';
import { promises as fs } from 'fs';
import path from 'path';

// __dirname não está disponível em módulos ES6, então precisamos definir o caminho de forma diferente.
const PizzasPath = path.resolve(path.dirname(''), '../server/lambda/utils/Pizzas.json');

export const handleOrderPizzaIntent = async (event) => {
  let responseMessage = "";

  try {
    // Carregar o conteúdo do arquivo JSON
    const data = await fs.readFile(PizzasPath, 'utf-8');
    const pizzasData = JSON.parse(data);

    const { PizzaType, PizzaSize, DeliveryAddress } = event.sessionState.intent.slots;

    // Verificação do tipo de pizza
    if (PizzaType && PizzaType.value) {
      let pizzaTypeSlot = PizzaType.value.originalValue.toLowerCase().trim();

      const pizzas = pizzasData.Pizzas;
      const pizza = pizzas.find(p => p.Nome.toLowerCase() === pizzaTypeSlot);

      if (pizza) {
        responseMessage = `Você escolheu uma pizza de ${pizzaTypeSlot}. `;
      } else {
        responseMessage = "Desculpe, não temos essa pizza no cardápio.";
        return handleResponse(event, 'ElicitSlot', 'PizzaType', responseMessage);
      }
    } else {
      return handleResponse(event, 'ElicitSlot', 'PizzaType', 'Qual sabor de pizza você gostaria de pedir?');
    }

    // Verificação do tamanho da pizza
    if (PizzaSize && PizzaSize.value) {
      let pizzaSizeSlot = PizzaSize.value.originalValue.toLowerCase().trim();

      if (pizzaSizeSlot) {
        responseMessage += `Tamanho escolhido: ${pizzaSizeSlot}. `;
      } else {
        responseMessage = "Desculpe, não temos esse tamanho no cardápio.";
        return handleResponse(event, 'ElicitSlot', 'PizzaSize', responseMessage);
      }
    } else {
      return handleResponse(event, 'ElicitSlot', 'PizzaSize', 'Entendi, qual o tamanho de pizza você prefere?');
    }

    // Verificação do endereço de entrega
    if (DeliveryAddress && DeliveryAddress.value) {
      let deliveryAddressSlot = DeliveryAddress.value.originalValue.trim();

      if (deliveryAddressSlot) {
        responseMessage += `Endereço de entrega: ${deliveryAddressSlot}. `;
      } else {
        responseMessage = "Desculpe, não consegui entender o endereço de entrega.";
        return handleResponse(event, 'ElicitSlot', 'DeliveryAddress', responseMessage);
      }
    } else {
      return handleResponse(event, 'ElicitSlot', 'DeliveryAddress', 'Qual é o endereço de entrega?');
    }

    const pizzaTypeSlot = event.sessionState.intent.slots.PizzaType.value.resolvedValues[0]?.toLowerCase().trim();
    const pizzaSizeSlot = event.sessionState.intent.slots.PizzaSize.value.resolvedValues[0]?.toLowerCase().trim();

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
      return handleResponse(event, 'Close', null, 'Houve um problema ao gerar o áudio da resposta.');
    }
  } catch (error) {
    // Retornar a resposta final em caso de erro no processamento
    return handleResponse(event, 'Failed', null, 'Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.');
  }
};
