import { handleElicitSlotResponse, handleCloseResponse } from '../utils/response-builder.js';

export const handleFallbackIntent = async (event) => {
  return handleCloseResponse(event, 'Fulfilled', 'Desculpe, não entendi sua solicitação. Pode repetir, por favor?');
};