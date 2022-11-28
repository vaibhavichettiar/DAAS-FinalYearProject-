const express = require('express');
const app = express();
// const session = require('express-session');
// var kafka = require('kafka-node');
// var config = require('./config/config.json');
// var cassandra_drv = require('cassandra-driver'); 
const cors = require('cors');
const route = require('./routes/routes.js');
// const CassandraStore = require("cassandra-store");
// const dotenv = require('dotenv');
// dotenv.config();

//const { client, host, auth, sslOptions } = require('./config/config');

app.use(express.json())

// const region = process.env.AWS_REGION;

// client.connect(function (err) {
//     console.log(err);
// });

// const query = "SELECT * FROM daas_ks.users";

// client.execute(query, function (err, result) {
//   var user = result.first();
//   //The row is an Object with column names as property keys.
// });

//Do Not Remove: Might use for presentation
// var kafka_consumer = require('./kafka/consumer');

app.use(cors());
// app.use(
//     session(
//         {
//             "secret": "cmpe_295b",
//             "cookie": { "maxAge": 3600000},
//             "resave": false,
//             "saveUninitialized": true,
//             "store": new CassandraStore({
//                 table: "sessions",
//                 client: null,
//                 clientOptions: {
//                     contactPoints: [ host ],
//                     localDataCenter: region,
//                     authProvider: auth,
//                     sslOptions: sslOptions,
//                     protocolOptions: { port: 9142 },
//                     queryOptions: { consistency: cassandra_drv.types.consistencies.localQuorum },
//                     keyspace: "sessions_store"
//                 }
//             }),
//         }
//     )
// )

app.use('/api', route);
app.get('/', (req, res) => {
    res.sendStatus(200);
    // Producer = kafka.Producer,
    //     KeyedMessage = kafka.KeyedMessage,
    //     connectionString = config.kafka.host,
    //     client = new kafka.KafkaClient(connectionString),
    //     producer = new Producer(client);
    // payloads = [
    //     { topic: 'test_topic', messages: "Hello....." }
    // ];
    // producer.on('ready', function () {
    //     producer.send(payloads, function (err, data) {
    //         console.log('kafka' + data);
    //         client.close();
    //     });
    // });
    // producer.on('error', function (err) {
    //     console.log('Error Occured  at Kafka Server: ' + err);
    //     client.close();
    // });
});

app.listen(5001, () => {
    console.log("my server is running on port 5001");
    
    //Do Not Remove: Might use for presentation
    // kafka_consumer.consumer();
})