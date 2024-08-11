import { api } from '../lib/api.js';

// Função para gerar a resposta TTS e retornar o URL do áudio
export const generateTTSResponse = async (phrase) => {
  try {
    const payload = { phrase };
    console.log("Payload enviado para a API de TTS:", payload);

    const ttsResponse = await api.post('/v1/tts', payload);
    return ttsResponse.data.url_to_audio;
  } catch (error) {
    console.error('Erro ao chamar a API de TTS:', error);
    throw new Error('Failed to generate TTS');
  }
};

// Função para lidar com a resposta final e fechar o diálogo
export const handleFinalResponse = (event, state, message, audioUrl = null) => {
  const messages = [
    {
      contentType: 'PlainText',
      content: message,
    },
  ];

  if (audioUrl) {
    messages.push({
      contentType: 'PlainText',
      content: `Aqui está o áudio da sua resposta: ${audioUrl}`,
    });
  }

  return {
    sessionState: {
      sessionAttributes: event.sessionState.sessionAttributes,
      dialogAction: {
        type: 'Close',
      },
      intent: {
        name: event.sessionState.intent.name,
        state: state,
      },
    },
    messages,
  };
};

// Função para solicitar preenchimento de um slot específico
export const handleElicitSlotResponse = (event, slotToElicit, message) => {
  return {
    sessionState: {
      sessionAttributes: event.sessionState.sessionAttributes,
      dialogAction: {
        type: 'ElicitSlot',
        slotToElicit: slotToElicit,
      },
      intent: event.sessionState.intent
    },
    messages: [
      {
        contentType: 'PlainText',
        content: message
      }
    ]
  };
};

// Função para encerrar o diálogo com uma mensagem
export const handleCloseResponse = (event, state, message) => {
  return {
    sessionState: {
      sessionAttributes: event.sessionState.sessionAttributes,
      dialogAction: {
        type: 'Close',
      },
      intent: {
        name: event.sessionState.intent.name,
        state: state
      }
    },
    messages: message ? [
      {
        contentType: 'PlainText',
        content: message
      }
    ] : []
  };
};
