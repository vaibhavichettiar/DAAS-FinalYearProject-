### Processing Server 

#### Run Processing Server 
- Create .env file under the /processingServer folder and add below key values: 
```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
CASS_USERNAME=
CASS_PASSWORD=
CASSANDRA_KEYSTORE_PASSWORD=
CERTIFICATE_FILE_PATH=
```
- Make sure to have **cassandra_truststore.jks** and **sf-class2-root.crt** under the /processingServer folder. 

#### Components: 
- Spark-master :

    web UI URL : localhost:8080

    spark master port : localhost:7077

- Spark-worker 
web UI URL : localhost:8081

- flaks-server
URL : localhost:5000 

#### Database Tables interected by flask server 

- dataset_metadata:

    datasetId 

    userId 

    name : dataset name stored in AWS s3 

    table_name : table name stored in cassandra 

    job_type : PROCESSING / TRAINING 

    job_status : RUNNING(0) / SUCCESS(1) / FAILED(2) 


- models :  

    dataset_id

    product_id : Each product had different trained model stored in AWS s3. 

    model_filename


#### backend API 
- Processing data 
```
URL : http://localhost:5000/processing
Type : POST 
JSON request Payload : 
{
    "userId" : <userID>,
    "datasetId" : <datasetID>
}

Successful response : 200 OK 
{
    "message" : "Processing completed for dataset: <datasetID>" 
}

```

- Train Model  
```
URL : http://localhost:5001/api/train
Type : POST 
JSON request Payload : 
{
    "userId" : <userID>,
    "datasetId" : <datasetID>,
    "timeColumn" : <date column name>,
    "targetColumn" : <target column name>,
    "categoryColumn" : <category vise modeling or pass null>
}

Successful response : 200 OK 
{
    "message" : "Model training started for datasetID: <datasetID>" 
}

```

- Forcast   
```
URL : http://localhost:5001/api/predict
Type : GET 
JSON request Payload : 
{
    "startDate" : "2019-11-22",
    "endDate" : "2019-12-02",
    "productId" : 35,
    "userId" : "49843a94-ecc0-41b1-9c1d-50bfb1895d6c",
    "datasetId" : "ce196496-e014-488b-b218-4c7c6d8f4a45"
}

Successful response : 200 OK
[
    {
        "date": "2019-11-22",
        "predicted sales": 292663.868
    },
    {
        "date": "2019-11-23",
        "predicted sales": 292668.919
    },
    {
        "date": "2019-11-24",
        "predicted sales": 292673.97
    },
    ...
]
```

#### Time series models
##### Prophet (Open sourced by Facebook) 

Prophet is an additive regression model with a piecewise linear or logistic growth curve trend. It includes a yearly seasonal component modeled using Fourier series and a weekly seasonal component modeled using dummy variables. 
Time series = Signal + Noise 

Prophet model uses the trend lines as regressors in the model 

When the data doesn’t fit to the one regressors then the trend is piecewise. broken in to different pieces of the data using knots. 

User can specify knots or automatically chosen. 

Trend can not be linear either. Hence there is logarithmic trend. 

Seasonal Component : Fourier variables are used to account seasonal components. Designed to identify the seasonal events with weekly and yearly seasonal effects. 

Holiday component : Point intervention variable. At certain day the sales goes high. Holiday variable is 0 and 1. Binary variable. 
 
