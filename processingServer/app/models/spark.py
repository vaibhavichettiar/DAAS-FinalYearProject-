import os
import logging
from pyspark import SparkContext, SparkConf
from pyspark.sql import SparkSession
from dotenv import load_dotenv
load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

sparkSession = None
class sparkConnection:
    @staticmethod
    def initSparkSession():
        global sparkSession
        if(sparkSession == None):
            logger.info("Creating sparkSession: ")
            sparkSession = SparkSession.builder.appName("PySpark Data Preprocessing").\
            master("spark://spark-master:7077").\
            config("spark.executor.memory", "512m").\
            config("spark.jars.packages", "com.datastax.spark:spark-cassandra-connector-assembly_2.12:3.1.0").\
            config("spark.sql.catalog.client", "com.datastax.spark.connector.datasource.CassandraCatalog").\
            config("spark.sql.catalog.client.spark.cassandra.connection.host", os.environ['CASSANDRA_HOST']).\
            config("spark.cassandra.connection.host", os.environ['CASSANDRA_HOST']).\
            config("spark.cassandra.auth.username", "cassandra").\
            config("spark.cassandra.auth.password", os.environ['CASSANDRA_PASSWORD']).\
            config("spark.dynamicAllocation.enabled", "false").\
            getOrCreate()
            # Hadoop configuration to support s3 filesystem 
            sparkSession._jsc.hadoopConfiguration().set("fs.s3a.access.key", os.getenv('AWS_ACCESS_KEY'))
            sparkSession._jsc.hadoopConfiguration().set("fs.s3a.secret.key", os.getenv('AWS_SECRET_ACCESS_KEY'))
            sparkSession._jsc.hadoopConfiguration().set("fs.s3a.endpoint", "s3.amazonaws.com")
            sparkSession.sql("set spark.sql.legacy.timeParserPolicy=LEGACY")
        
        return sparkSession