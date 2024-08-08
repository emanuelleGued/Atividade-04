import { handleElicitSlotResponse, handleCloseResponse } from '../utils/response-builder.js';

// Exemplo de valores válidos (deverão ser ajustados manualmente)
const validPizzas = [
  'Margherita', 'Pepperoni', 'Calabresa', 'Frango com Catupiry',
  'Churrasco', 'Portuguesa', 'Marguerita', 'Napolitana',
  'Toscana', 'Vegetariana', 'Quatro Queijos'
];

const validSizes = ['grande', 'media', 'pequena', 'p', 'm', 'g'];

export const handleOrderPizzaIntent = async (event) => {
  console.log('Evento recebido:', JSON.stringify(event, null, 2));

  let pizzaType, pizzaSize, deliveryAddress;

  try {
    // Acessar os valores dos slots com verificações adicionais
    pizzaType = event.sessionState?.intent?.slots?.PizzaType?.value?.interpretedValue || null;
    pizzaSize = event.sessionState?.intent?.slots?.PizzaSize?.value?.interpretedValue || null;
    deliveryAddress = event.sessionState?.intent?.slots?.DeliveryAddress?.value?.interpretedValue || null;

    console.log('PizzaType:', pizzaType);
    console.log('PizzaSize:', pizzaSize);
    console.log('DeliveryAddress:', deliveryAddress);
  } catch (e) {
    console.error(`Erro ao acessar os slots: ${e}`);
    return handleCloseResponse(event, 'Failed', 'Desculpe, ocorreu um erro ao processar seu pedido.');
  }

  // Validação do tipo de pizza
  if (!pizzaType) {
    return handleElicitSlotResponse(event, 'PizzaType', 'Que sabor de pizza você gostaria de pedir?');
  }

  let responseMessage;
  if (validPizzas.includes(pizzaType)) {
    responseMessage = `Pedido de pizza ${pizzaType} recebido.`;
  } else {
    responseMessage = "Infelizmente o sabor que você deseja não está no nosso cardápio.";
    return handleCloseResponse(event, 'Fulfilled', responseMessage);
  }

  // Validação do tamanho da pizza
  if (!pizzaSize) {
    return handleElicitSlotResponse(event, 'PizzaSize', 'Entendi, qual o tamanho de pizza você prefere?');
  }

  if (validSizes.includes(pizzaSize.toLowerCase())) {
    responseMessage += ` Tamanho ${pizzaSize} recebido.`;
  } else {
    responseMessage = "Desculpe, o tamanho fornecido não é válido. Por favor, escolha entre grande, média, pequena, p, m e g.";
    return handleCloseResponse(event, 'Fulfilled', responseMessage);
  }

  // Se o endereço de entrega estiver presente, finalize o pedido
  if (deliveryAddress) {
    const orderId = `order-${Date.now()}`;
    const order = {
      orderId: orderId,
      pizzaType: pizzaType,
      pizzaSize: pizzaSize,
      deliveryAddress: deliveryAddress,
      timestamp: new Date().toISOString(),
    };

    responseMessage = `Seu pedido de pizza ${pizzaType} ${pizzaSize} foi recebido. O endereço de entrega é ${deliveryAddress}.`;
    return handleCloseResponse(event, 'Fulfilled', responseMessage);
  }

  // Solicitar o endereço de entrega
  return handleElicitSlotResponse(event, 'DeliveryAddress', 'Pedido realizado com sucesso. Me informe seu endereço de entrega.');
};

// Handler principal
export const handler = async (event) => {
  try {
    console.log('Evento recebido no handler:', JSON.stringify(event, null, 2));
    const intentName = event.sessionState?.intent?.name;

    if (intentName === 'OrderPizzaIntent') {
      return await handleOrderPizzaIntent(event);
    }

    throw new Error(`Intent não suportada: ${intentName}`);
  } catch (error) {
    console.error(error);
    return handleCloseResponse(event, 'Failed', 'Desculpe, ocorreu um erro ao processar seu pedido.');
  }
};
