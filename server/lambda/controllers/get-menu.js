import { handleElicitSlotResponse, handleCloseResponse } from '../utils/response-builder.js';

export const handleGetMenuIntent = async (event) => {
  const responseMessage = `Estes são nossos itens do cardápio. Qual sabor você gostaria de saber mais?`;

  return handleCloseResponse(event, 'Fulfilled', responseMessage);
};