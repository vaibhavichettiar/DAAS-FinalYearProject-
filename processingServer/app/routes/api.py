from app.app import app
from app.models.spark import sparkSession
from flask import request, json
from app.services.preprocessingService import preprocessingService

@app.route('/')
def home():
	return 'Installed PySpark Version :' + sparkSession.version

@app.route('/processing', methods=['POST'])
def startPreprocessing():
	data = json.loads(request.data)
	preprocessFileObj = preprocessingService(data["Bucket"], data["FileName"])
	return preprocessFileObj.processFile()

