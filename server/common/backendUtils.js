const logger = require('../logger/logger.js');
var request = require('request-promise');

const respond = (res, status, body) => {
    if (res.headersSent) {
        logger.warn('Error sending response, headers already sent.');
    } else {
        logger.debug(`Responding status: ${status}`);
        if (body) {
            logger.decide(`Responding body: ${body}`);
            res.status(status).send(body);
        } else {
            res.sendStatus(status);
        }
    }
};

const respondMessage = (res, status, message) => {
    respond(res, status, {message});
};

const sendRequest = async (res, method, endPoint, payload) => {
    var options = {
        method: method,
        uri: 'http://flaskserver:5000/' + endPoint,
        body: payload,
        json: true
    };

    var sendMessage = await request(options)
        .then(function (parsedBody) {
            console.log(parsedBody);
            respond(res, 200, parsedBody);
        })
        .catch(function (err) {
            respond(res, 500, err);
        });
}

module.exports = {
    respond,
    respondMessage,
    sendRequest
};