var config = require('../config/config.json');
var kafka = require('kafka-node');

exports.consumer = function () {
        Consumer = kafka.Consumer,
        client = new kafka.KafkaClient(config.kafka.host),
        consumer = new Consumer(
            client,
            [
                {
                    topic:'test_topic'
                }
            ],
            {
                autoCommit: false
            }
        );
    consumer.on('message', function (message) {
        console.log(message);
    });
    consumer.on('error', function (err) {
        console.log(err);
    });
}