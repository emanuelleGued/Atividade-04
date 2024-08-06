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
    messages: [
      {
        contentType: 'PlainText',
        content: message
      }
    ]
  };
};