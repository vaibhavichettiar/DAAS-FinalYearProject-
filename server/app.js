const express = require('express');
const app = express();
var kafka = require('kafka-node');
var config = require('./config/config.json');
const cors = require('cors');
const route = require('./routes/routes.js');
const { client } = require("./config/config");

const hostname = config.cassandra.host;
app.use(express.json())

app.use(cors());
app.use('/api', route);

app.get('/', (req, res) => {
    res.sendStatus(200);
    Producer = kafka.Producer,
        KeyedMessage = kafka.KeyedMessage,
        connectionString = config.kafka.host,
        client = new kafka.KafkaClient(connectionString),
        producer = new Producer(client);
    payloads = [
        { topic: 'test_topic', messages: "Hello....." }
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

app.listen(5001, () => {
    console.log("my server is running on port 5001");
})