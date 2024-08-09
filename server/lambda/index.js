import { handleFallbackIntent } from './controllers/fallback.js';
import { handleGetDetailsOfPizzaIntent } from './controllers/get-details-of-pizza.js';
import { handleGetMenuIntent } from './controllers/get-menu.js';
import { handleOrderPizzaIntent } from './controllers/order-pizza.js';
import { handleWelcomeIntent } from './controllers/welcome.js';

export const handler = async (event) => {
  // Verifica se `interpretations` existe e é um array
  if (!event.interpretations || !Array.isArray(event.interpretations)) {
    return await handleFallbackIntent(event);
  }

  // Encontra a interpretação com a maior confiança acima do mínimo de 0.85
  const highConfidenceInterpretation = event.interpretations.find(
    interpretation => interpretation.nluConfidence && interpretation.nluConfidence >= 0.85
  );

  if (!highConfidenceInterpretation) {
    return await handleFallbackIntent(event);
  }

  // Processa a intenção correspondente à interpretação de alta confiança
  const intentName = highConfidenceInterpretation.intent.name;

  switch (intentName) {
    case 'WelcomeIntent':
      return await handleWelcomeIntent(event);
    case 'GetMenuIntent':
      return await handleGetMenuIntent(event);
    case 'GetDetailsOfPizzaIntent':
      return await handleGetDetailsOfPizzaIntent(event);
    case 'OrderPizzaIntent':
      return await handleOrderPizzaIntent(event);
    default:
      return handleCloseResponse(event, 'Failed', 'Desculpe, não consegui processar a sua solicitação.');
  }
};
