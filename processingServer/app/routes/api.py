from app.app import app
from app.models.spark import sparkSession
from flask import request, json, jsonify
from app.services.preprocessingService import preprocessingService
from app.services.forcastModelService import forcastModelService
from app.services.predictionService import predictionService
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
		preprocessFileObj = preprocessingService(data["Bucket"], data["FileName"])
		return preprocessFileObj.processFile()
	except Exception as e:
		raise ProcessingException(e.message, e.status_code) 

@app.route('/trainModel', methods=['POST'])
def trainModel():
	try:
		logger.info("In the trainModel")
		processingId = json.loads(request.data)['processingId']
		bucketName = json.loads(request.data)['bucketName']
		train(processingId, bucketName)
		return jsonify(message='Model training started for processingID: ' + processingId)
	except Exception as e:
		raise ProcessingException(e.message, e.status_code)

@app.route('/forcastSale', methods=['POST'])
def predictSale():
	try:
		data = json.loads(request.data)
		predictionServiceObj = predictionService()
		return predictionServiceObj.predict(data['dates'], data['productId'], data['bucketName'], data['processingId'])
	except Exception as e:
		raise ProcessingException(e.message, e.status_code)

def train(processingId, bucketName):
	try:
		forcastModelServiceObj = forcastModelService()
		forcastModelServiceObj.trainModel(processingId, bucketName)
	except Exception as e:
		raise ProcessingException(e.message, e.status_code)


@app.errorhandler(ProcessingException)
def invalid_api_usage(e):
    return jsonify(e.to_dict()), e.status_code