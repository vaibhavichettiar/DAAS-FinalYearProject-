### Processing Server 

#### Run Processing Server 
- Create .env file and put AWS s3 credentials with below key : 

AWS_ACCESS_KEY=

AWS_SECRET_ACCESS_KEY=

#### Components: 
- Spark-master : 
web UI URL : localhost:8080
spark master port : localhost:7077

- Spark-worker 
web UI URL : localhost:8081

- flaks-server
URL : localhost:5000 

#### Database Tables interected by flask server 
- modelsinfo : 
data : store processingId and modelfile name information.
usage : to fetch model pkl file for prediction purpose. 

- processinginfo:
data : unique processingId (UUID) and tablename (actual user's dataset stored in cassandra) 
usage: to fetch data from correct dataset to train model. 

#### backend API 
- Processing data 
```
URL : http://localhost:5000/processing
Type : POST 
JSON request Payload : 
{
    "FileName" : <file name uplaoded to AWS s3 bucket>,
    "Bucket" : <bucket name where given file is uploaded> 
}

Successful response : 200 OK 
{
    "processingId" : <processingID>,
    "message" : "Processing completed for file: <filename>" 
}

```

- Train Model  
```
URL : http://localhost:5000/trainModel
Type : POST 
JSON request Payload : 
{
    "processingId" : <ProcessingID>,
    "bucketName" : <AWS S3 bucket where trained model weights needs to be stored>
}

Successful response : 200 OK 
{
    "message" : "Model training started for processingID:: <processingID>" 
}

```

- Forcast   
```
URL : http://localhost:5000/forcastSale
Type : POST 
JSON request Payload : 
{
    "dates" : <Time range>,
    "productId" : <productID>,
    "bucketName" : <AWS S3 bucket where trained model weights needs to be stored>,
    "processingId" : <processingID> 
}
```

 
