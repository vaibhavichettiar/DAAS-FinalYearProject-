/**
 * Created by vpaternostro on 4/30/14.
 */
// possible verbs as informed by chrome's errors: GET,POST,PUT,HEAD,DELETE,TRACE,COPY,LOCK,MKCOL,
// MOVE,PROPFIND,PROPPATCH,UNLOCK,REPORT,MKACTIVITY,CHECKOUT,MERGE,M-SEARCH,NOTIFY,SUBSCRIBE,
// UNSUBSCRIBE,PATCH,SEARCH


'use strict';

const LOGGER = require('./logger/logger.js');

module.exports = function (methodsAllowed) {
	if (typeof methodsAllowed === 'object' && 'push' in methodsAllowed) {
		if (methodsAllowed.indexOf('OPTIONS') === -1) {
			methodsAllowed.push('OPTIONS');
		}
	} else {
		methodsAllowed = ['OPTIONS'];
	}

	return function (req, res, next) {
		LOGGER.verbose('Cors handling request: ' + req.method);
		LOGGER.verbose('Cors allowed methods: ' + methodsAllowed);

		res.header('Access-Control-Allow-Methods', methodsAllowed.join(', '));
		res.header('Allow', methodsAllowed.join(', '));

		if (req.method === 'OPTIONS') {
			LOGGER.verbose('Returning the requested options.');
		}
		else {
			LOGGER.verbose('Not an options request. Continuing.');
			next();
		}
	};
};
