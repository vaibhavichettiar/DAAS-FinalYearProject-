from app.settings.setting import KEYSPACE
from app.settings.setting import DATASETMETADATA
from app.settings.setting import MODELS
from app.settings.setting import BUCKET
from app.models.spark import sparkSession
from app.models.s3 import s3Conn
from app.models.cassandra import cassandraConnection
from app.exception.processingException import ProcessingException
import pandas as pd
import prophet
from prophet import Prophet
import pickle
import logging 
import uuid

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TrainModelService:

    def trainModel(self, userId, datasetId):
        try:
            datasetTablename = self.getTableName(datasetId)

            dataframe = self.load_and_get_table_df(KEYSPACE, datasetTablename)
            logger.info("Loaded %s successfully", datasetTablename)

            dataframe = dataframe.toPandas()
            #dataframe = self.renamedColumn(dataframe)
            dataframe = self.convertDataType(dataframe)
            logger.info("Data types are converted successfully")

            # Do multipart time series modeling 
            self.multipartModeling(dataframe, userId, datasetId)
            self.updateJobStatus(datasetTablename, 1, datasetId)
        except Exception as e:
            logger.exception(e)
            raise ProcessingException("Error ocuured while training model:" + str(e), status_code=500)

    def load_and_get_table_df(self, keys_space_name, table_name):
        try:
            table_df = sparkSession.read.format("org.apache.spark.sql.cassandra").options(table=table_name, keyspace=keys_space_name).load()
            return table_df
        except Exception as e:
            logger.error(e)
            raise Exception("Unable to load table :" +  table_name)

    def getTableName(self, datasetId):
        query = "SELECT table_name FROM " + KEYSPACE + "." + DATASETMETADATA + " WHERE id=?"
        results = cassandraConnection.getSelectQueryResults(query, [uuid.UUID(str(datasetId))])
        return results.one().table_name

    def renamedColumn(self, dataframe):
        dataframe.columns = ['id', 'date', 'storeid', 'sales']
        return dataframe

    def convertDataType(self, dataframe):
        try:
            dataframe["sales"] = dataframe.sales.astype(float)
            dataframe["storeid"] = dataframe.storeid.astype(int)
            dataframe['date'] = pd.to_datetime(dataframe['date'])
            dataframe = dataframe.sort_values(by='date')
            return dataframe
        except Exception as e:
            logger.error(e)
            raise Exception("Unable to convert Data type for the data.")

    def multipartModeling(self, dataframe, userId, datasetId):
        try:
            for productId in pd.unique(dataframe['storeid']):
                dataframe = dataframe[dataframe['storeid'] == productId] 
                dataframe = dataframe[['date', 'sales']]
                dataframe.columns = ['ds', 'y']
                model = Prophet(interval_width=0.95)
                model.fit(dataframe)
                pickle_byte_obj = pickle.dumps(model)
                modelFileName = self.getModelFileName(datasetId, productId)
                s3Conn.Object(BUCKET , userId + "/models/" + modelFileName).put(Body=pickle_byte_obj)
                self.insertModelFileName(datasetId, productId, modelFileName)
                logger.info("Successfully trained model for productId %s and model file name %s", str(productId), modelFileName)
                break
        except Exception as e:
            logger.exception("Error while training prophet model with datasetId: %s" , datasetId)
            raise ProcessingException("Error while training prophet model with datasetId: " + datasetId + " Message: " + str(e), status_code=500)

    def getModelFileName(self, datasetId, productId):
        return "model_" + str(datasetId) + "_" + str(productId) + ".pkl"

    def insertModelFileName(self, datasetId, productId, modelFileName):
        query = "INSERT INTO " + KEYSPACE + "." + MODELS + "(dataset_id, product_id, model_filename) VALUES (?, ?, ?) IF NOT EXISTS"
        cassandraConnection.updateTableQuery(query, [uuid.UUID(str(datasetId)), productId, modelFileName])
    
    def updateJobStatus(self, tableName, job_status, datasetId):
        query = "UPDATE " + KEYSPACE + "." + DATASETMETADATA + " SET  table_name = ? , job_status = ? WHERE id = ? IF EXISTS"
        cassandraConnection.updateTableQuery(query, [tableName, job_status, uuid.UUID(str(datasetId))])



