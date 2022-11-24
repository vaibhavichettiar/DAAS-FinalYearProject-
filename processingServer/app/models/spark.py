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
            cassandra_host = "cassandra." + os.getenv('AWS_REGION') + ".amazonaws.com"
            sparkSession = SparkSession.builder.appName("PySpark Data Preprocessing").\
            master("spark://spark-master:7077").\
            config("spark.executor.memory", "512m").\
            config("spark.jars.packages", "com.datastax.spark:spark-cassandra-connector-assembly_2.12:3.1.0").\
            config("spark.sql.catalog.client", "com.datastax.spark.connector.datasource.CassandraCatalog").\
            config("spark.sql.catalog.client.spark.cassandra.connection.host", cassandra_host).\
            config("spark.cassandra.connection.ssl.enabledAlgorithms", "TLS_RSA_WITH_AES_128_CBC_SHA,TLS_RSA_WITH_AES_256_CBC_SHA").\
            config("spark.cassandra.connection.ssl.trustStore.type","JKS").\
            config("spark.cassandra.connection.ssl.protocol","TLS").\
            config('spark.cassandra.connection.ssl.enabled','true').\
            config('spark.cassandra.connection.ssl.trustStore.path',os.getenv('CERTIFICATE_FILE_PATH')).\
            config('spark.cassandra.connection.ssl.trustStore.password',os.getenv('CASSANDRA_KEYSTORE_PASSWORD')).\
            config("spark.cassandra.connection.host", cassandra_host).\
            config("spark.cassandra.connection.port", 9142).\
            config("spark.cassandra.auth.username", os.getenv('CASS_USERNAME')).\
            config("spark.cassandra.auth.password", os.getenv('CASS_PASSWORD')).\
            config("spark.dynamicAllocation.enabled", "false").\
            getOrCreate()
            # Hadoop configuration to support s3 filesystem 
            sparkSession._jsc.hadoopConfiguration().set("fs.s3a.access.key", os.getenv('AWS_ACCESS_KEY_ID'))
            sparkSession._jsc.hadoopConfiguration().set("fs.s3a.secret.key", os.getenv('AWS_SECRET_ACCESS_KEY'))
            sparkSession._jsc.hadoopConfiguration().set("fs.s3a.endpoint", "s3.amazonaws.com")
            sparkSession.sql("set spark.sql.legacy.timeParserPolicy=LEGACY")
        
        return sparkSession