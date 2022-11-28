from app.settings.setting import KEYSPACE
from app.settings.setting import DATASETMETADATA
from app.settings.setting import BUCKET
from app.models.spark import sparkSession
from app.models.cassandra import cassandraConnection
from pyspark.sql.functions import monotonically_increasing_id
from pyspark.sql.functions import unix_timestamp
from pyspark.sql import types, functions as F
from pyspark.sql.functions import to_date
from app.exception.processingException import ProcessingException
from app.utils.jobType import JobType
from app.utils.jobType import JobStatus
import pyspark
import time
import uuid
from flask import jsonify
import logging 

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PreprocessingService:
    def __init__(self, userId, datasetId, timeColumn, targetColumn, dateFormat):
        self.userId = userId
        self.datasetId = datasetId
        if timeColumn is None:
            timeColumn = "date"
        self.timeColumn = timeColumn.lower()
        if targetColumn is None:
            targetColumn = "target"
        self.targetColumn = targetColumn.lower()
        if dateFormat is None or dateFormat == "":
            dateFormat = 'MM/dd/yyyy'
        self.dateFormat = dateFormat
    
    def processFile(self):
        try:
            if not cassandraConnection.isTableExist(self.getTableName()):
                datasetName = self.getDatasetName()
                dataFrame = sparkSession.read.option("header", "true").csv("s3a://" + BUCKET + "/" + self.userId + "/" + datasetName)
                
                # add primary column with id 
                dataFrame = dataFrame.withColumn("id", monotonically_increasing_id())

                # remove symbols from column names 
                dataFrame = self.renameColumns(dataFrame)
                dataFrame = self.changeDataTypes(dataFrame)
                dataFrame = self.handleNullVal(dataFrame)
                logger.info(dataFrame.take(2))
                # Create table query to push data in to the cassandra db
                tableName = self.convertCSVDataToTable(dataFrame)

                # Hack: wait for 15s before AWS Keyspace generate the table
                time.sleep(35)

                self.updateJobStatusWithTable(tableName, JobType.PROCESSING, JobStatus.RUNNING)
                # publish data to the cassandra db 
                dataFrame.write.format('org.apache.spark.sql.cassandra').mode('append').options(table=tableName, keyspace=KEYSPACE).save()
                logger.info("Uploaded data successfully")
                
                # update processing job status with sucessful. 
                self.updateJobStatusWithTable(tableName, JobType.PROCESSING, JobStatus.SUCCESS)

            return jsonify(message='Processing completed for dataset: ' + self.datasetId)
        except Exception as e:
            logger.exception(e)
            self.updateJobStatus(JobType.PROCESSING, JobStatus.FAILED)
            raise ProcessingException("Error Occured while processing dataset. Reason : " + str(e), status_code=500)

    def jsonifyDataFrame(self, dataframe):
        return dataframe.toJSON().first()
    
    def changeDataTypes(self, dataframe):
        try:
            for column in dataframe.columns:
                if "id" in column:
                    dataframe = dataframe.withColumn(column, dataframe[column].cast(types.IntegerType()))
                if self.timeColumn.casefold() == column.casefold():
                    dataframe = dataframe.withColumn(column,to_date(dataframe[column], self.dateFormat))
                    #dataframe = dataframe.withColumn(column, F.from_unixtime(unix_timestamp('date', 'MM/dd/yyyy')))
                if self.targetColumn.casefold() == column.casefold():
                    dataframe = dataframe.withColumn(column, dataframe[column].cast(types.FloatType()))
            return dataframe
        except Exception as e:
            logger.error(e)
            raise ProcessingException("Problem occurred while converting data types. Reason: " + str(e), status_code=500)
    
    def handleNullVal(self, dataframe):
        return dataframe.na.drop(subset=[self.timeColumn, self.targetColumn])


    def renameColumns(self, dataframe):
        if dataframe is not None:
            for column in dataframe.columns:
                if column.lower() == self.targetColumn.lower():
                    logger.info("Changing the column name %s to %s", column, 'target')
                    dataframe = dataframe.withColumnRenamed(column, 'target')
                    self.targetColumn = 'target'
                elif column.lower() == self.timeColumn.lower():
                    logger.info("Changing the column name %s to %s", column, 'date')
                    dataframe = dataframe.withColumnRenamed(column, 'date')
                    self.timeColumn = 'date'
                else:
                    renamedColumn = ''.join(letter for letter in column if letter.isalnum())
                    dataframe = dataframe.withColumnRenamed(column, renamedColumn.lower())
                
            return dataframe
        else:
            raise Exception("Data is not valid")

    def getCQLType(self, dataType):
        if "StringType" == dataType:
            return "text"
        elif "IntegerType" == dataType:
            return "int"
        elif "FloatType" == dataType:
            return "float"
        elif "DateType" == dataType:
            return "date"
        return "text"

    def createTableQuery(self, dataframe, tableName):
        try:
            query = "CREATE TABLE IF NOT EXISTS " + tableName + "("
            isFirst = True
            for field in dataframe.schema.fields:
                if isFirst:
                    isFirst = False
                else:
                    query += ', '
                columnName = field.name
                logger.info("Field name %s , Field type %s", field.name, field.dataType)
                dataType = self.getCQLType(str(field.dataType))
                query += '"' + columnName + '" ' + dataType
                # if "id" == columnName:
                #     query += " PRIMARY KEY"
            #query += ");"
            query += ', PRIMARY KEY ((id), "' + self.timeColumn + '") ) WITH CLUSTERING ORDER BY ("' + self.timeColumn + '" DESC);'
            logger.info(query)
            return query
        except Exception as e:
            logger.error(e)
            raise ProcessingException("Problem occurred while generating table query", status_code=500)

    def getTableName(self):
        tableName = "data" + str(self.datasetId)
        renamedTableName = ''.join(letter if letter.isalnum() else '_' for letter in tableName)
        return renamedTableName

    def getUUID(self):
        return uuid.uuid4()

    def getDatasetName(self):
        query = "SELECT name FROM " + KEYSPACE + "." + DATASETMETADATA + " WHERE id=?"
        results = cassandraConnection.getSelectQueryResults(query, [uuid.UUID(str(self.datasetId))])
        return results.one().name

    def updateJobStatusWithTable(self, tableName, job_type, job_status):
        query = "UPDATE " + KEYSPACE + "." + DATASETMETADATA + " SET  table_name = ? , job_type = ? , job_status = ? WHERE id = ? IF EXISTS"
        cassandraConnection.updateTableQuery(query, [tableName, job_type, job_status, uuid.UUID(self.datasetId)])

    def updateJobStatus(self, job_type, job_status):
        query = "UPDATE " + KEYSPACE + "." + DATASETMETADATA + " SET  job_type = ? , job_status = ? WHERE id = ? IF EXISTS"
        cassandraConnection.updateTableQuery(query, [job_type, job_status, uuid.UUID(self.datasetId)])

    def convertCSVDataToTable(self, dataFrame):
        tableName = self.getTableName() 
        query = self.createTableQuery(dataFrame, tableName)
        cassandraConnection.createTable(query)
        return tableName




