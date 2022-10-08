from app.settings.setting import KEYSPACE
from app.settings.setting import PROCESSINGTABLE
from app.settings.setting import MODELINFOTABLE
from app.models.spark import sparkSession
from app.models.s3 import s3Conn
from app.models.cassandra import cassConn
from app.models.cassandra import cassandraConnection
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
        datasetTablename = self.getTableName(processingId)

        dataframe = self.load_and_get_table_df(KEYSPACE, datasetTablename)
        logger.info("Loaded %s successfully", datasetTablename)

        dataframe = dataframe.toPandas()
        #dataframe = self.renamedColumn(dataframe)
        dataframe = self.convertDataType(dataframe)
        logger.info("Data types are converted successfully")

        # Do multipart time series modeling 
        self.multipartModeling(dataframe, bucketname, processingId) 

    def load_and_get_table_df(self, keys_space_name, table_name):
        table_df = sparkSession.read.format("org.apache.spark.sql.cassandra").options(table=table_name, keyspace=keys_space_name).load()
        return table_df

    def getTableName(self, processingId):
        query = "SELECT * FROM " + KEYSPACE + "." + PROCESSINGTABLE + " WHERE id=" + str(processingId)
        try:
            results = cassConn.execute(query)
            return results.one().tablename
        except:
            logger.error("Not find the tablename for processingID: ", processingId)
            return None

    def renamedColumn(self, dataframe):
        dataframe.columns = ['id', 'date', 'storeid', 'sales']
        return dataframe

    def convertDataType(self, dataframe):
        dataframe["sales"] = dataframe.sales.astype(float)
        dataframe["storeid"] = dataframe.storeid.astype(int)
        dataframe['date'] = pd.to_datetime(dataframe['date'])
        dataframe = dataframe.sort_values(by='date')

        return dataframe

    def multipartModeling(self, dataframe, bucketname, processingId):
        for productId in pd.unique(dataframe['storeid']):
            dataframe = dataframe[dataframe['storeid'] == productId] 
            dataframe = dataframe[['date', 'sales']]
            dataframe.columns = ['ds', 'y']
            model = Prophet(interval_width=0.95)
            model.fit(dataframe)
            pickle_byte_obj = pickle.dumps(model)
            modelFileName = self.getModelFileName(productId)
            s3Conn.Object(bucketname , modelFileName).put(Body=pickle_byte_obj)
            self.addProessingId(uuid.UUID(str(processingId)), productId, modelFileName)
            logger.info("Successfully trained model for productId %s and model file name %s", str(productId), modelFileName)
            break

    def getModelFileName(self, productId):
        return "model_" + str(productId) + ".pkl"

    def addProessingId(self, processingId, productId, modelFileName):
        stmt = cassConn.prepare("INSERT INTO " + KEYSPACE + "." + MODELINFOTABLE + "(id, productid, filename) VALUES (?, ?, ?) IF NOT EXISTS")
        cassConn.execute(stmt, [processingId, productId, modelFileName])
    


