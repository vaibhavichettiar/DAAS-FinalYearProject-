from app.models.s3 import s3Conn
from app.models.cassandra import KEYSPACE
from app.models.cassandra import cassConn
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

        modelFilename = self.getModelFileName(productId, processingId)

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

    def getModelFileName(self, productId, processingId):
        query = "SELECT id, productid, filename FROM " + KEYSPACE + ".models WHERE id=" + str(processingId) + " and productid=" + str(productId) + ";"
        try:
            results = cassConn.execute(query)
            return results.one().filename
        except:
            logger.error("Not find the filename for processingID: ", processingId)
            return None
