from app.settings.setting import KEYSPACE
from app.settings.setting import PROCESSINGTABLE
from app.settings.setting import MODELINFOTABLE
from app.models.spark import sparkSession
from app.models.s3 import s3Conn
from app.models.cassandra import cassConn
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

class forcastModelService:

    def trainModel(self, processingId, bucketname):
        try:
            datasetTablename = self.getTableName(processingId)

            dataframe = self.load_and_get_table_df(KEYSPACE, datasetTablename)
            logger.info("Loaded %s successfully", datasetTablename)

            dataframe = dataframe.toPandas()
            #dataframe = self.renamedColumn(dataframe)
            dataframe = self.convertDataType(dataframe)
            logger.info("Data types are converted successfully")

            # Do multipart time series modeling 
            self.multipartModeling(dataframe, bucketname, processingId)
        except Exception as e:
            logger.error(e)
            raise ProcessingException("Error ocuured while training model:" + str(e), status_code=500)

    def load_and_get_table_df(self, keys_space_name, table_name):
        try:
            table_df = sparkSession.read.format("org.apache.spark.sql.cassandra").options(table=table_name, keyspace=keys_space_name).load()
            return table_df
        except Exception as e:
            logger.error(e)
            raise Exception("Unable to load table :" +  table_name)

    def getTableName(self, processingId):
        query = "SELECT * FROM " + KEYSPACE + "." + PROCESSINGTABLE + " WHERE id=" + str(processingId)
        try:
            results = cassConn.execute(query)
            return results.one().tablename
        except:
            logger.error("Not find the tablename for processingID: %s", processingId)
            raise ProcessingException("Not find the tablename for processingID: " + processingId + " Message: " + str(e), status_code=404) 

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

    def multipartModeling(self, dataframe, bucketname, processingId):
        try:
            for productId in pd.unique(dataframe['storeid']):
                dataframe = dataframe[dataframe['storeid'] == productId] 
                dataframe = dataframe[['date', 'sales']]
                dataframe.columns = ['ds', 'y']
                model = Prophet(interval_width=0.95)
                model.fit(dataframe)
                pickle_byte_obj = pickle.dumps(model)
                modelFileName = self.getModelFileName(productId, processingId)
                s3Conn.Object(bucketname , modelFileName).put(Body=pickle_byte_obj)
                self.addProessingId(uuid.UUID(str(processingId)), productId, modelFileName)
                logger.info("Successfully trained model for productId %s and model file name %s", str(productId), modelFileName)
                break
        except Exception as e:
            logger.error("Error while training prophet model with processingId: %s" , processingId)
            raise ProcessingException("Error while training prophet model with processingId: " + processingId + " Message: " + str(e), status_code=500)

    def getModelFileName(self, productId, processingId):
        return "model_" + str(processingId) + "_" + str(productId) + ".pkl"

    def addProessingId(self, processingId, productId, modelFileName):
        try:
            stmt = cassConn.prepare("INSERT INTO " + KEYSPACE + "." + MODELINFOTABLE + "(id, productid, filename) VALUES (?, ?, ?) IF NOT EXISTS")
            cassConn.execute(stmt, [processingId, productId, modelFileName])
        except Exception as e:
            logger.error("Error while inserting processing info for processingId: %s" , processingId)
            raise ProcessingException("Error while inserting processing info for processingId: " + processingId + " Message: " + str(e), status_code=500)
    


