from app.settings.setting import KEYSPACE
from app.settings.setting import MODELINFOTABLE
from app.models.s3 import s3Conn
from app.models.cassandra import cassConn
from app.models.cassandra import cassandraConnection
from app.exception.processingException import ProcessingException
import pandas as pd
import prophet
from prophet import Prophet
import pickle
import json
import logging 
import uuid

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class predictionService():

    def predict(self, futureDates, productId, bucketName, processingId):
        try:
            modelFilename = self.getModelFileName(productId, processingId)
            logger.info("BucketName: %s, ModelFilename: %s", bucketName, modelFilename)
            response = s3Conn.Object(bucketName, modelFilename)

            body_string = response.get()['Body'].read()
            # load model
            model = pickle.loads(body_string)

            # Create dataframe with future dates 
            
            future = pd.DataFrame({'ds': futureDates}) 
            forcastedSales = model.predict(future) 
            forcastedSales = forcastedSales[['ds', 'yhat']] 

            forcastedSales.columns = ['date', 'predicted sales']

            result = forcastedSales.to_json(orient="split")
            parsedResults = json.loads(result)

            return parsedResults
        except Exception as e:
            logger.error(e)
            raise ProcessingException("Error ocurred while forcasting data. Reason: " + str(e), status_code=500) 

    def getModelFileName(self, productId, processingId):
        query = "SELECT id, productid, filename FROM " + KEYSPACE + "." + MODELINFOTABLE + " WHERE id=" + str(processingId) + " and productid=" + str(productId) + ";"
        try:
            results = cassConn.execute(query)
            return results.one().filename
        except Exception as e:
            logger.error("Not find the filename for processingID: %s" , processingId)
            raise ProcessingException("Not find the filename for processingID: " + str(processingId) + " Reason: " + str(e), status_code=500)
