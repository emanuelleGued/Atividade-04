import { handleElicitSlotResponse, handleCloseResponse } from '../utils/response-builder.js';

export const handleWelcomeIntent = async (event) => {
  // Lógica para processar a saudação de boas-vindas
  return handleCloseResponse(event, 'Fulfilled', 'Seja bem vindo a nossa pizzaria. Qual sabor de pizza você gostaria de pedir?');
};