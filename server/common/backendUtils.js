const logger = require('../logger/logger.js');

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

module.exports = {
    respond,
    respondMessage
};