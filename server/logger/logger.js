const config = require('config');
const {addColors, createLogger, format, transports} = require('winston');
const {getNamespace} = require('cls-hooked');

const {colorize, combine, errors, printf} = format;
const logConfig = config.get('logging');

const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        debug: 3,
        verbose: 4,
        extra: 5,
        history: 6
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        debug: 'blue',
        verbose: 'grey',
        extra: 'magenta',
        history: 'green'
    }
};

const timestamp = () => {
    switch (logConfig.optional.timestamp) {
        case false:
            return '';
        case 'simple':
            return `${new Date().toLocaleTimeString()} `;
        default:
            return `${new Date().toISOString()} `;
    }
};

const getSession = () => {
    const session = getNamespace('request-logging');
    const id = logConfig.optional.id && session && session.get('id') ? `[${session.get('id')}] ` : '';
    const ip = logConfig.optional.ip && session && session.get('ip') ? `[${session.get('ip')}] ` : '';
    return {id, ip};
};

const prettyFormat = printf((info) => {
    const {level, message, stack, ...meta} = info;
    const {id, ip} = getSession();
    const splatSymbol = meta[Object.getOwnPropertySymbols(meta).find(x => Symbol.keyFor(x) === 'splat')];
    let additionalData = '';
    if (splatSymbol && splatSymbol[0]) {
        if (splatSymbol[0] && splatSymbol[0] instanceof Error) {
            additionalData = stack;
        } else if (splatSymbol[0] && Array.isArray(splatSymbol[0])) {
            additionalData = splatSymbol[0].map(data => (data.constructor === Object ? JSON.stringify(data) : data));
        } else {
            additionalData = splatSymbol[0].constructor === Object
                ? JSON.stringify(splatSymbol[0])
                : splatSymbol[0];
        }
    }
    return `${timestamp()}${id}${ip}${level}: ${message} ${additionalData}`;
});

addColors(customLevels.colors);

// const formatter = (env === 'production' || env === 'stage')
//     ? printf(info => JSON.stringify({...getSession(), ...info}))
//     : combine(colorize(), prettyFormat, errors({stack: true}));

const formatter = combine(colorize(), prettyFormat, errors({stack: true}));

const logger = createLogger({
    level: logConfig.level.console,
    levels: customLevels.levels,
    format: formatter,
    transports: [new transports.Console({handleExceptions: true})],
    exitOnError: false
});

logger.decide = content => (content.length < logConfig.verboseLimit
    ? logger.verbose(content)
    : logger.extra(content));

module.exports = logger;
