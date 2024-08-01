import json
import boto3

# função backend-lex

lex_client = boto3.client('lex-runtime')

def slack_handler(event, context):
    try:
        # Extrai a mensagem do Slack
        message = json.loads(event['body'])
        user_message = message.get('event', {}).get('text', '')

        # Envia a mensagem para o Amazon Lex
        response = lex_client.post_text(
            botName='SeuNomeDoBot',
            botAlias='SeuAliasDoBot',
            userId='UserID',  # Use um identificador único para cada usuário
            inputText=user_message
        )

        # Formata a resposta do Lex
        lex_message = response['message']

        # Prepara a resposta para o Slack
        slack_response = {
            "text": lex_message
        }

        return {
            'statusCode': 200,
            'body': json.dumps(slack_response),
            'headers': {
                'Content-Type': 'application/json'
            }
        }
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Erro interno do servidor.'}),
            'headers': {
                'Content-Type': 'application/json'
            }
        }
