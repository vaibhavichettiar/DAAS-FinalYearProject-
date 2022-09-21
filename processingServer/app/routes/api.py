from app.app import app
from app.models.spark import sparkSession
from flask import request, json, jsonify
from app.services.preprocessingService import preprocessingService
from app.services.forcastModelService import forcastModelService
from app.services.predictionService import predictionService
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
	data = json.loads(request.data)
	preprocessFileObj = preprocessingService(data["Bucket"], data["FileName"])
	return preprocessFileObj.processFile()

@app.route('/trainModel', methods=['POST'])
def trainModel():
	logger.info("In the trainModel")
	processingId = json.loads(request.data)['processingId']
	bucketName = json.loads(request.data)['bucketName']
	train(processingId, bucketName)
	return jsonify(message='Model training started for processingID: ' + processingId)

@app.route('/forcastSale', methods=['POST'])
def predictSale():
	data = json.loads(request.data)
	predictionServiceObj = predictionService()
	return predictionServiceObj.predict(data['dates'], data['productId'], data['bucketName'], data['processingId'])

def train(processingId, bucketName):
	forcastModelServiceObj = forcastModelService()
	forcastModelServiceObj.trainModel(processingId, bucketName)



