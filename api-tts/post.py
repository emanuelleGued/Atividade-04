import json
import hashlib
import boto3
from botocore.exceptions import ClientError
from utils.convert_text_to_speech import convert_text_to_speech_and_upload

# Configuração do boto3 para acessar o DynamoDB
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('audios-polly')

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
        # Verifica se o evento é uma verificação de URL do Slack
        if body.get("type") == "url_verification":
            response = {
                "statusCode": 200,
                "body": json.dumps({"response": body.get("challenge")})
            }
            return response

        # Verifica se o evento é uma requisição para o TTS
        if body.get('phrase'):
            return v1_tts(event, context)
        else:
            raise ValueError("Phrase is required in the body of the request.")
    
    except ValueError as e:
        response = {
            "statusCode": 400,
            "body": json.dumps({"message": str(e)})
        }
        return response
        
    except Exception as e:
        response = {
            "statusCode": 500,
            "body": json.dumps({"message": "Internal server error", "error": str(e)})
        }
        return response

def v1_tts(event, context):
    try:
        # Extrair o corpo da requisição
        body = json.loads(event['body'])
        phrase = body.get('phrase')
        
        # Gerar um hash único para a frase
        hash_id = hashlib.md5(phrase.encode('utf-8')).hexdigest()
        
        # Verificar se o hash já existe no DynamoDB
        response = table.get_item(Key={'id': hash_id})
        if 'Item' in response:
            # Se o hash já existir, retornar a URL do áudio
            audio_url = response['Item']['audio_url']
            body = {
                "message": "Audio already generated.",
                "audio_url": audio_url
            }
        else:
            # Se o hash não existir, converter a frase em áudio e salvar a referência no DynamoDB
            audio_url = convert_text_to_speech_and_upload(phrase, hash_id)
            
            # Salvar o novo item no DynamoDB
            table.put_item(
                Item={
                    'id': hash_id,
                    'phrase': phrase,
                    'audio_url': audio_url
                }
            )
            
            body = {
                "message": "Audio generated and saved.",
                "audio_url": audio_url
            }
        
        response = {
            "statusCode": 200,
            "body": json.dumps(body)
        }
        
    except ClientError as e:
        response = {
            "statusCode": 500,
            "body": json.dumps({"message": "DynamoDB error", "error": str(e)})
        }

    return response