import boto3
import os
from dotenv import load_dotenv

load_dotenv()

profile_name = os.getenv('AWS_PROFILE')
table_name = 'audios-polly'

def create_dynamodb_table():
    session = boto3.Session(profile_name=profile_name)
    dynamodb = session.resource('dynamodb')

    table = dynamodb.create_table(
        TableName=table_name,
        KeySchema=[
            {
                'AttributeName': 'id',
                'KeyType': 'HASH'  # Chave primária
            }
        ],
        AttributeDefinitions=[
            {
                'AttributeName': 'id',
                'AttributeType': 'S'  # Tipo String
            }
        ],
        ProvisionedThroughput={
            'ReadCapacityUnits': 5,
            'WriteCapacityUnits': 5
        }
    )

    # Espera a tabela ser criada
    table.meta.client.get_waiter('table_exists').wait(TableName=table_name)
    print(f'Table {table_name} created successfully.')

# Exemplo de uso
create_dynamodb_table()
