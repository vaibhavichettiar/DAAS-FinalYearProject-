from app.settings.setting import KEYSPACE
from app.settings.setting import DATASETMETADATA
from app.settings.setting import MODELS
from app.settings.setting import BUCKET
from app.models.spark import sparkSession
from app.models.s3 import s3Conn
from app.models.cassandra import cassandraConnection
from app.exception.processingException import ProcessingException
from app.utils.jobType import JobType
from app.utils.jobType import JobStatus
import pandas as pd
import prophet
from prophet import Prophet
import pickle
import logging 
import uuid

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TrainModelService:

    def trainModel(self, userId, datasetId, timeColumn, targetColumn, categoryColumn):
        try:
            datasetTablename = self.getTableName(datasetId)

            dataframe = self.load_and_get_table_df(KEYSPACE, datasetTablename)
            logger.info("Loaded %s successfully", datasetTablename)

            self.updateJobStatus(JobType.TRAINING, JobStatus.RUNNING, datasetId)

            dataframe = dataframe.toPandas()
            #dataframe = self.renamedColumn(dataframe)
            dataframe = self.convertDataType(dataframe, timeColumn, targetColumn, categoryColumn)
            logger.info("Data types are converted successfully")
            logger.info(len(dataframe))
            # Do multipart time series modeling 
            self.multipartModeling(dataframe, userId, datasetId, timeColumn, targetColumn, categoryColumn)
            self.updateJobStatus(JobType.TRAINING, JobStatus.SUCCESS, datasetId)
        except Exception as e:
            logger.exception(e)
            self.updateJobStatus(JobType.TRAINING, JobStatus.FAILED, datasetId)
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

    def convertDataType(self, dataframe, timeColumn, targetColumn, categoryColumn):
        try:
            dataframe[targetColumn] = dataframe[targetColumn].astype(float)
            if categoryColumn is not None and categoryColumn != "":
                dataframe[categoryColumn] = dataframe[categoryColumn].astype(int)
            dataframe[timeColumn] = pd.to_datetime(dataframe[timeColumn], errors = 'coerce')
            dataframe = dataframe[dataframe[timeColumn].notna()]
            dataframe = dataframe.reset_index(drop = True)
            dataframe = dataframe.sort_values(by=timeColumn)
            return dataframe
        except Exception as e:
            logger.error(e)
            raise Exception("Unable to convert Data type for the data.")

    def multipartModeling(self, dataframe, userId, datasetId, timeColumn, targetColumn, categoryColumn):
        try:
            if categoryColumn is None or categoryColumn == "":
                pickle_byte_obj = self.trainUnivariateModel(dataframe, timeColumn, targetColumn)
                logger.info("model trained successfully")
                self.uploadModelFile(userId, datasetId, 0, pickle_byte_obj)
            else: 
                for categoryId in pd.unique(dataframe[categoryColumn]):
                    dataframe = dataframe[dataframe[categoryColumn] == categoryId] 
                    pickle_byte_obj = self.trainUnivariateModel(dataframe, timeColumn, targetColumn)
                    self.uploadModelFile(userId, datasetId, categoryId, pickle_byte_obj)
                    break
        except Exception as e:
            logger.exception("Error while training prophet model with datasetId: %s" , datasetId)
            raise ProcessingException("Error while training prophet model with datasetId: " + datasetId + " Message: " + str(e), status_code=500)

    def getModelFileName(self, datasetId, categoryId):
        return "model_" + str(datasetId) + "_" + str(categoryId) + ".pkl"

    def insertModelFileName(self, datasetId, categoryId, modelFileName):
        query = "INSERT INTO " + KEYSPACE + "." + MODELS + "(dataset_id, product_id, model_filename) VALUES (?, ?, ?) IF NOT EXISTS"
        cassandraConnection.updateTableQuery(query, [uuid.UUID(str(datasetId)), categoryId, modelFileName])
    
    def updateJobStatus(self, job_type, job_status, datasetId):
        query = "UPDATE " + KEYSPACE + "." + DATASETMETADATA + " SET  job_type = ? , job_status = ? WHERE id = ? IF EXISTS"
        cassandraConnection.updateTableQuery(query, [job_type, job_status, uuid.UUID(str(datasetId))])
    
    def trainUnivariateModel(self, dataframe, timeColumn, targetColumn):
        dataframe = dataframe[[timeColumn, targetColumn]]
        dataframe.columns = ['ds', 'y']
        model = Prophet(interval_width=0.95)
        model.fit(dataframe)
        pickle_byte_obj = pickle.dumps(model)
        return pickle_byte_obj
    
    def uploadModelFile(self, userId, datasetId, categoryId, pickle_byte_obj):
        modelFileName = self.getModelFileName(datasetId, categoryId)
        s3Conn.Object(BUCKET , userId + "/models/" + modelFileName).put(Body=pickle_byte_obj)
        self.insertModelFileName(datasetId, categoryId, modelFileName)
        logger.info("Successfully trained model for categoryId %s and model file name %s", str(categoryId), modelFileName)

