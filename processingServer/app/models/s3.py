import boto3

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
                aws_access_key_id='AKIA6DPURG2BEWYV3L2Y',
                aws_secret_access_key='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'
	        )
        return s3Conn




