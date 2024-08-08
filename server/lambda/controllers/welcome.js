import { handleCloseResponse } from '../utils/response-builder.js';

export const handleWelcomeIntent = async (event) => {
  const response = {
    sessionState: {
      ...event.sessionState,
      intent: {
        name: 'WelcomeIntent',
        state: 'Fulfilled',
      },
      dialogAction: {
        type: 'Close',
      },
    },
    messages: [
      {
        contentType: 'PlainText',
        content: 'Olá, Seja bem vindo a nossa pizzaria!',
      },
      {
        contentType: 'ImageResponseCard',
        imageResponseCard: {
          title: 'O que você gostaria de fazer hoje?',
          imageUrl: 'https://richardws-tts-bucket.s3.amazonaws.com/pizza.jpeg',
          buttons: [
            {
              text: 'Ver Cardápio',
              value: 'Gostaria de ver o cardápio!',
            },
            {
              text: 'Ver Ingredientes de Pizzas',
              value: 'Pode me dizer os ingredientes das suas pizzas?',
            },
            {
              text: 'Pedir uma Pizza',
              value: 'Gostaria de pedir uma pizza!',
            },
          ],
        },
      }
    ]
  };

  return response;
};
