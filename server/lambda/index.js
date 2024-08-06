import { handleFallbackIntent } from './controllers/fallback.js';
import { handleGetDetailsOfPizzaIntent } from './controllers/get-details-of-pizza.js';
import { handleGetMenuIntent } from './controllers/get-menu.js';
import { handleOrderPizzaIntent } from './controllers/order-pizza.js';
import { handleWelcomeIntent } from './controllers/welcome.js';

export const handler = async (event) => {
  const intentName = event.sessionState.intent.name;

  switch (intentName) {
    case 'WelcomeIntent':
      return await handleWelcomeIntent(event);
    case 'GetMenuIntent':
      return await handleGetMenuIntent(event);
    case 'GetDetailsOfPizzaIntent':
      return await handleGetDetailsOfPizzaIntent(event);
    case 'OrderPizzaIntent':
      return await handleOrderPizzaIntent(event);
    case 'FallbackIntent':
      return await handleFallbackIntent(event);
    default:
      return handleCloseResponse(event, 'Failed', 'Desculpe, não consegui processar a sua solicitação.');
  }
};