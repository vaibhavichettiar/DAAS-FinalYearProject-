from app.models.spark import sparkSession
import pyspark


class preprocessingService:
    def __init__(self, bucket, file):
        self.file = file
        self.bucket = bucket
    
    def processFile(self):
        df = sparkSession.read.csv("s3a://" + self.bucket + "/" + self.file)
        return self.jsonifyDataFrame(df)

    def jsonifyDataFrame(self, dataframe):
        return dataframe.toJSON().first()




