# ------- standard library imports -------
import os

# ------- 3rd party imports -------
from flask import Flask, jsonify, request, json


# ------- local imports -------
from app.models.s3 import S3connection
from app.models.spark import sparkConnection
from app.models.cassandra import cassandraConnection


def create_app(config_file):
    """
    Creating and returning the app
    """
    app_path = os.path.dirname(os.path.abspath(__file__))
    project_folder = os.path.expanduser(app_path)

    app = Flask(__name__)
    app.config.from_pyfile(config_file)

    s3 = S3connection.getS3Connection() 
    sparkSession = sparkConnection.initSparkSession()
    cassConn = cassandraConnection.initCassandraConnection()

    with app.app_context():
        return app