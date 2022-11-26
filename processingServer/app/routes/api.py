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
		return process(data["userId"], data["datasetId"], data["timeColumn"], data["targetColumn"], data["dateFormat"])
	except Exception as e:
		raise ProcessingException(e.message, e.status_code) 

@app.route('/trainModel', methods=['POST'])
def trainModel():
	try:
		data = json.loads(request.data)
		train(data["userId"], data["datasetId"], data["timeColumn"], data["targetColumn"], data["categoryColumn"])
	except Exception as e:
		raise ProcessingException(e.message, e.status_code)

@app.route('/dataPrep', methods=['POST'])
def processAndTrain():
	try:
		data = json.loads(request.data)
		prepareData(data["userId"], data["datasetId"], data["timeColumn"], data["targetColumn"], data["categoryColumn"], data["dateFormat"])
		return jsonify(message='Data Preparation started for datasetId: ' + data["datasetId"])
	except Exception as e:
		logger.exception(e)
		raise ProcessingException(str(e), e.status_code)

@app.route('/predict', methods=['GET'])
def predictSale():
	try:
		data = json.loads(request.data)
		predictionServiceObj = PredictionService()
		return predictionServiceObj.predict(data['startDate'], data['endDate'], data['productId'], data['userId'], data['datasetId'])
	except Exception as e:
		logger.exception(e)
		raise ProcessingException(str(e), e.status_code)

def process(userId, datasetId, timeColumn, targetColumn, dateFormat):
	preprocessFileObj = PreprocessingService(userId, datasetId, timeColumn, targetColumn, dateFormat)
	return preprocessFileObj.processFile()


def train(userId, datasetId, timeColumn, targetColumn, categoryColumn):
	try:
		trainModelServiceObj = TrainModelService()
		trainModelServiceObj.trainModel(userId, datasetId, timeColumn, targetColumn, categoryColumn)
		return jsonify(message='Model training started for datasetId: ' + datasetId)
	except Exception as e:
		raise ProcessingException(str(e))

def prepareData(userId, datasetId, timeColumn, targetColumn, categoryColumn, dateFormat):
	process(userId, datasetId, timeColumn, targetColumn, dateFormat)
	train(userId, datasetId, timeColumn, targetColumn, categoryColumn)
		

@app.errorhandler(ProcessingException)
def invalid_api_usage(e):
    return jsonify(e.to_dict()), e.status_code