from app.app import app
from app.models.spark import sparkSession
from flask import request, json, jsonify
from app.services.preprocessingService import PreprocessingService
from app.services.trainModelService import TrainModelService
from app.services.predictionService import PredictionService
from app.exception.processingException import ProcessingException
import time
import asyncio
import logging 

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/')
def home():
	return 'Installed PySpark Version :' + sparkSession.version

@app.route('/processing', methods=['POST'])
def startPreprocessing():
	try:
		data = json.loads(request.data)
		preprocessFileObj = PreprocessingService(data["userId"], data["datasetId"])
		return preprocessFileObj.processFile()
	except Exception as e:
		raise ProcessingException(e.message, e.status_code) 

@app.route('/trainModel', methods=['POST'])
def trainModel():
	try:
		data = json.loads(request.data)
		train(data["userId"], data["datasetId"])
		return jsonify(message='Model training started for datasetId: ' + data["datasetId"])
	except Exception as e:
		raise ProcessingException(e.message, e.status_code)

@app.route('/predict', methods=['GET'])
def predictSale():
	try:
		data = json.loads(request.data)
		predictionServiceObj = PredictionService()
		return predictionServiceObj.predict(data['startDate'], data['endDate'], data['productId'], data['userId'], data['datasetId'])
	except Exception as e:
		logger.exception(e)
		raise ProcessingException(str(e), e.status_code)

def train(userId, datasetId):
	try:
		trainModelServiceObj = TrainModelService()
		trainModelServiceObj.trainModel(userId, datasetId)
	except Exception as e:
		raise ProcessingException(str(e))


@app.errorhandler(ProcessingException)
def invalid_api_usage(e):
    return jsonify(e.to_dict()), e.status_code