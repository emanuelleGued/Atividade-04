import { handleElicitSlotResponse, handleCloseResponse } from '../utils/response-builder.js';

export const handleGetMenuIntent = async (event) => {
  const menu = `
  Aqui está o nosso cardápio de pizzas:

  Margherita:
  - Pequena: R$ 20
  - Média: R$ 30
  - Grande: R$ 40

  Pepperoni:
  - Pequena: R$ 22
  - Média: R$ 32
  - Grande: R$ 42

  Calabresa:
  - Pequena: R$ 24
  - Média: R$ 34
  - Grande: R$ 44

  Frango com Catupiry:
  - Pequena: R$ 26
  - Média: R$ 36
  - Grande: R$ 46

  Churrasco:
  - Pequena: R$ 28
  - Média: R$ 38
  - Grande: R$ 48

  Portuguesa:
  - Pequena: R$ 30
  - Média: R$ 40
  - Grande: R$ 50

  Marguerita:
  - Pequena: R$ 20
  - Média: R$ 30
  - Grande: R$ 40

  Napolitana:
  - Pequena: R$ 22
  - Média: R$ 32
  - Grande: R$ 42

  Toscana:
  - Pequena: R$ 24
  - Média: R$ 34
  - Grande: R$ 44

  Vegetariana:
  - Pequena: R$ 26
  - Média: R$ 36
  - Grande: R$ 46

  Quatro Queijos:
  - Pequena: R$ 30
  - Média: R$ 36
  - Grande: R$ 40
  `;

  return handleCloseResponse(event, 'Fulfilled', menu);
};
