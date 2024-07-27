import boto3
import os
from dotenv import load_dotenv

load_dotenv()

BUCKET_NAME = os.getenv('S3_BUCKET_NAME')

polly = boto3.client('polly')
s3 = boto3.client('s3')

def convert_text_to_speech_and_upload(phrase, hash_id):
    try:
        # Converter texto em áudio usando Amazon Polly
        response = polly.synthesize_speech(
            Text=phrase,
            OutputFormat='mp3',
            VoiceId='Joanna'
        )
        
        # Salvar o áudio no S3
        audio_file = '{}.mp3'.format(hash_id)
        s3.put_object(
            Bucket=BUCKET_NAME,
            Key=audio_file,
            Body=response['AudioStream'].read()
        )
        
        # Gerar a URL do áudio
        audio_url = f'https://{BUCKET_NAME}.s3.amazonaws.com/{audio_file}'

        return audio_url
    except Exception as e:
        raise Exception("Error generating and uploading audio: " + str(e))
