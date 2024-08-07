import { handleCloseResponse } from '../utils/response-builder.js';

export const handleWelcomeIntent = async (event) => {
  return handleCloseResponse(event, 'Fulfilled', '');
};