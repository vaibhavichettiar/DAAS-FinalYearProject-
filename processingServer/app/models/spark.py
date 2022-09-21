import os
from pyspark import SparkContext, SparkConf
from pyspark.sql import SparkSession
from app.settings.setting import AWS_ACCESS_KEY
from app.settings.setting import AWS_SECRET_ACCESS_KEY

sparkSession = None
class sparkConnection:
    @staticmethod
    def initSparkSession():
        global sparkSession
        if(sparkSession == None):
            sparkSession = SparkSession.builder.appName("PySpark Data Preprocessing").\
config("spark.jars.packages", "com.datastax.spark:spark-cassandra-connector-assembly_2.12:3.1.0").\
config("spark.sql.catalog.client", "com.datastax.spark.connector.datasource.CassandraCatalog").\
config("spark.sql.catalog.client.spark.cassandra.connection.host", os.environ['CASSANDRA_HOST']).\
config("spark.cassandra.connection.host", os.environ['CASSANDRA_HOST']).\
config("spark.cassandra.auth.username", "cassandra").\
config("spark.cassandra.auth.password", os.environ['CASSANDRA_PASSWORD']).\
getOrCreate()
            sparkSession._jsc.hadoopConfiguration().set("fs.s3a.access.key", AWS_ACCESS_KEY)
            sparkSession._jsc.hadoopConfiguration().set("fs.s3a.secret.key", AWS_SECRET_ACCESS_KEY)
            sparkSession._jsc.hadoopConfiguration().set("fs.s3a.endpoint", "s3.amazonaws.com")
            sparkSession.sql("set spark.sql.legacy.timeParserPolicy=LEGACY")
        
        return sparkSession