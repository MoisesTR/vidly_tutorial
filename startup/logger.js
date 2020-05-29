const { createLogger, format, transports } = require('winston');
const config = require('config');
require('winston-mongodb');
require('express-async-errors');

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [ 
        new transports.File({ filename: './logs/error.log', level: 'error'}),
        new transports.File({ filename: './logs/combined.log' })
    ],
    exceptionHandlers: [
        new transports.File({ filename: './logs/exceptions.log', timestamp: true, maxsize: 1000000 })
    ],  
    exitOnError: false, 
    meta: true
});

const optionsMongoDb = {
    db: config.get('db'),
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    collection: 'logs',
    capped: true,
    metaKey: 'meta',
    level: 'error'
};

logger.add(new transports.MongoDB(optionsMongoDb));

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console(
        {
            handleExceptions: true,
            format: format.combine(format.colorize({all: true}))
        }
    ));
}

module.exports = logger;