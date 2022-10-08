const express = require('express');
const app = express();
var kafka_consumer = require('./kafka/consumer');
var kafka = require('kafka-node');
var config = require('./config/config.json');
const cors = require('cors');
const cassandra = require('cassandra-driver');
const route = require('./routes/routes.js');

const hostname = config.cassandra.host;
app.use(express.json())
// const client = new cassandra.Client({ 
//     contactPoints: [hostname],
//     localDataCenter: 'datacenter1',
//     credentials: { username: 'cassandra', password: 'cassandra' }
// });

// client.connect(function (err) {
//     console.log(err);
// });

// const query = "SELECT * FROM daas_ks.users";

// client.execute(query, function (err, result) {
//   var user = result.first();
//   //The row is an Object with column names as property keys. 
//   console.log('My name is %s and my id is %s', user.name);
// });

app.use(cors());
app.use('/api', route);
//app.use('/file');
app.get('/',(req,res) => {
    res.sendStatus(200);
    Producer = kafka.Producer,
    KeyedMessage = kafka.KeyedMessage,
    connectionString = config.kafka.host,
    client = new kafka.KafkaClient(connectionString),
    producer = new Producer(client);
    payloads = [
        { topic: 'test_topic', messages: "Hello....."}
    ];
    producer.on('ready', function () {
        producer.send(payloads, function (err, data) {
            console.log('kafka' + data);
            client.close();
        });
    });
    producer.on('error', function (err) {
        console.log('Error Occured  at Kafka Server: ' + err);
        client.close();
    });
});

app.listen(5001,()=>{
    console.log("my server is running on port 5001");
    //kafka_consumer.consumer();
})