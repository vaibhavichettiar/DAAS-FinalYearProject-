import boto3
import os
from dotenv import load_dotenv
load_dotenv()

s3Conn = None
class S3connection:
    @staticmethod
    def getS3Connection():
        global s3Conn
        if(s3Conn == None):
            s3Conn = boto3.client('s3')
            s3Conn = boto3.resource(
                service_name='s3',
                region_name='us-west-1',
                aws_access_key_id=os.getenv('AWS_ACCESS_KEY'),
                aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
	        )
        return s3Conn




