from flask import Flask, jsonify, request
from pyspark import SparkContext, SparkConf
from pyspark.sql import SparkSession
import os

app = Flask(__name__)

@app.route('/')
def home():
	sparkSession = initSparkSession()
	return 'Installed PySpark Version :' + sparkSession.version


def initSparkSession():
	spark = SparkSession \
    .builder \
    .appName("Python Spark SQL basic example") \
    .getOrCreate()
	return spark


if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)