from app.settings.setting import KEYSPACE
from app.settings.setting import DATASETMETADATA
from app.settings.setting import MODELS
from app.settings.setting import BUCKET
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

class PredictionService():

    def predict(self, futureDates, productId, userId, datasetId):
        try:
            modelFilename = self.getModelFileName(productId, datasetId)
            logger.info("ModelFilename: %s", modelFilename)
            response = s3Conn.Object(BUCKET, userId + "/models/" + modelFilename)

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
            logger.exception(e)
            raise ProcessingException("Error ocurred while forcasting data. Reason: " + str(e), status_code=500) 

    def getModelFileName(self, productId, datasetId):
        query = "SELECT model_filename FROM " + KEYSPACE + "." + MODELS + " WHERE dataset_id=? and product_id=?"
        results = cassandraConnection.getSelectQueryResults(query, [uuid.UUID(str(datasetId)), productId])
        return results.one().model_filename
