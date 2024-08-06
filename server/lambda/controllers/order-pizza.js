import { handleElicitSlotResponse, handleCloseResponse } from '../utils/response-builder.js';

export const handleOrderPizzaIntent = async (event) => {
  // Lógica para processar o pedido de pizza
  return handleCloseResponse(event, 'Fulfilled', 'Seu pedido foi recebido. Gostaria de pedir mais alguma coisa?');
};
