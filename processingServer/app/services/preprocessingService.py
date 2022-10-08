from app.models.spark import sparkSession
from app.models.cassandra import cassConn
from app.models.cassandra import cassandraConnection
from app.models.cassandra import KEYSPACE
from pyspark.sql.functions import monotonically_increasing_id
from pyspark.sql.functions import unix_timestamp
from pyspark.sql import types, functions as F
from pyspark.sql.functions import to_date
import pyspark
import time
import uuid
from flask import jsonify
import logging 

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class preprocessingService:
    def __init__(self, bucket, file):
        self.file = file
        self.bucket = bucket
    
    def processFile(self):
        dataFrame = sparkSession.read.option("header", "true").csv("s3a://" + self.bucket + "/" + self.file)
        # add primary column with id 
        dataFrame = dataFrame.withColumn("id", monotonically_increasing_id())

        # remove symbols from column names 
        dataFrame = self.renameColumns(dataFrame)
        dataFrame = self.changeDataTypes(dataFrame)

        # Create table query to push data in to the cassandra db
        tableName = self.getTableName() 
        query = self.createTableQuery(dataFrame, tableName)
        cassConn.execute(query)

        # publish data to the cassandra db 
        dataFrame.write.format('org.apache.spark.sql.cassandra').mode('append').options(table=tableName, keyspace=KEYSPACE).save()

        uuid = self.getUUID()
        self.addProessingId(uuid, tableName)
        return jsonify(processingId=uuid , message='Processing completed for file: ' + self.file)

    def jsonifyDataFrame(self, dataframe):
        return dataframe.toJSON().first()
    
    def changeDataTypes(self, dataframe):
        for column in dataframe.columns:
            if "id" in column:
                dataframe = dataframe.withColumn(column, dataframe[column].cast(types.IntegerType()))
            if "date" in column:
                #dataframe = dataframe.withColumn(column,to_date(dataframe[column], 'dd/MM/yyyy'))
                dataframe = dataframe.withColumn(column, F.from_unixtime(unix_timestamp('date', 'MM/dd/yyyy')))
            if "sales" in column:
                dataframe = dataframe.withColumn(column, dataframe[column].cast(types.FloatType()))
        return dataframe

    def renameColumns(self, dataframe):
        for column in dataframe.columns:
            renamedColumn = ''.join(letter for letter in column if letter.isalnum())
            dataframe = dataframe.withColumnRenamed(column, renamedColumn.lower())
        return dataframe

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
        query = "CREATE TABLE IF NOT EXISTS " + tableName + "("
        isFirst = True
        for field in dataframe.schema.fields:
            if isFirst:
                isFirst = False
            else:
                query += ', '
            columnName = field.name
            dataType = self.getCQLType(field.dataType)
            query += columnName + " " + dataType
            if "id" == columnName:
                query += " PRIMARY KEY"
        query += ");"
        logger.info(query)
        return query

    def getTableName(self):
        timestr = time.strftime("%Y%m%d%H%M")
        tablename = self.bucket + self.file + timestr
        renamedTableName = ''.join(letter for letter in tablename if letter.isalnum())
        return renamedTableName

    def getUUID(self):
        return uuid.uuid1()

    def addProessingId(self, uuid, tablename):
        stmt = cassConn.prepare("INSERT INTO " + KEYSPACE + ".processIds (id, tablename) VALUES (?, ?) IF NOT EXISTS")
        cassConn.execute(stmt, [uuid, tablename])
    






