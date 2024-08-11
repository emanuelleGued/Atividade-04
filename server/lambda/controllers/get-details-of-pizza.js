import { handleElicitSlotResponse, handleCloseResponse, generateTTSResponse, handleFinalResponse } from '../utils/response-builder.js';

export const handleGetDetailsOfPizzaIntent = async (event) => {
    let responseMessage = "";

    try {
        console.log("Evento recebido:", JSON.stringify(event, null, 2));

        if (event.sessionState &&
            event.sessionState.intent &&
            event.sessionState.intent.slots) {

            if (event.sessionState.intent.slots.PizzaType) {
                console.log("Processando o slot PizzaType...");

                const pizzaSlot = event.sessionState.intent.slots.PizzaType;
                let pizzaTypeSlot = null;

                if (pizzaSlot && pizzaSlot.value && pizzaSlot.value.originalValue) {
                    pizzaTypeSlot = pizzaSlot.value.originalValue.toLowerCase().trim();

                    const menuDetails = {
                        "margherita": "Ingredientes da Margherita: Tomate, queijo muçarela e manjericão.",
                        "pepperoni": "Ingredientes da Pepperoni: Queijo, molho de tomate e pepperoni.",
                        "calabresa": "Ingredientes da Calabresa: Calabresa, queijo e cebola.",
                        "frango com catupiry": "Ingredientes da Frango com Catupiry: Frango desfiado, catupiry e milho.",
                        "churrasco": "Ingredientes da Churrasco: Carne de churrasco, queijo e molho barbecue.",
                        "portuguesa": "Ingredientes da Portuguesa: Presunto, queijo, ovos, cebola e azeitona.",
                        "marguerita": "Ingredientes da Marguerita: Tomate, queijo muçarela e manjericão.",
                        "napolitana": "Ingredientes da Napolitana: Tomate, queijo e alho.",
                        "toscana": "Ingredientes da Toscana: Calabresa, queijo, tomate e manjericão.",
                        "vegetariana": "Ingredientes da Vegetariana: Legumes variados, queijo e molho de tomate.",
                        "quatro queijos": "Ingredientes da Quatro Queijos: Muçarela, gorgonzola, parmesão, catupiry e orégano."
                    };

                    if (pizzaTypeSlot && menuDetails[pizzaTypeSlot]) {
                        responseMessage = menuDetails[pizzaTypeSlot];
                        console.log("Mensagem de detalhes da pizza adicionada.");
                    } else {
                        responseMessage = "Desculpe, não temos essa pizza no cardápio.";
                        console.log(responseMessage);
                    }
                } else {
                    responseMessage = "Desculpe, não consegui entender o tipo de pizza.";
                    console.log(responseMessage);
                }
            } else {
                console.log("Solicitando o tipo de pizza...");
                return handleElicitSlotResponse(event, 'PizzaType', 'Qual sabor de pizza você gostaria de saber mais?');
            }
        } else {
            responseMessage = "Houve um problema ao processar sua solicitação.";
            console.log(responseMessage);
        }

        console.log("Frase principal extraída:", responseMessage);

        try {
            // Gerar o áudio utilizando a função de TTS
            const audioUrl = await generateTTSResponse(responseMessage);

            // Retornar a resposta final com o áudio
            return handleFinalResponse(event, 'Fulfilled', responseMessage, audioUrl);
        } catch (error) {
            // Retornar a resposta final em caso de falha na geração do áudio
            return handleFinalResponse(event, 'Failed', 'Houve um problema ao gerar o áudio da resposta.');
        }

    } catch (error) {
        console.error('Erro ao processar a intenção de pedido de pizza:', error);
        // Retornar a resposta final em caso de erro no processamento
        return handleCloseResponse(event, 'Failed', 'Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.');
    }
};
