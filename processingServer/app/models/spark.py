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
            sparkSession = SparkSession.builder.appName("Python Spark Application").getOrCreate()
            sparkSession._jsc.hadoopConfiguration().set("fs.s3a.access.key", AWS_ACCESS_KEY)
            sparkSession._jsc.hadoopConfiguration().set("fs.s3a.secret.key", AWS_SECRET_ACCESS_KEY)
            sparkSession._jsc.hadoopConfiguration().set("fs.s3a.endpoint", "s3.amazonaws.com")
        
        return sparkSession