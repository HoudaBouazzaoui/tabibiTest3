const { createLogger, format, transports } = require('winston');

/*
module.exports = createLogger({
transports:
    new transports.File({
    filename: '_logs/server.log',
    format:format.combine(
        format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
        format.align(),
        format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
    )}),
});
*/

module.exports = createLogger({
    transports: [
        new transports.File({
            filename: '_logs/combined.log',
            format: format.combine(
                format.timestamp({ format: 'MM-DD-YYYY HH:mm:ss' }),
                format.align(),
                format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
            )
        }),
        new transports.File({
            filename: '_logs/errors.log',
            level: 'error',
            format: format.combine(
                format.timestamp({ format: 'MM-DD-YYYY HH:mm:ss' }),
                format.align(),
                format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
            )
        })
    ]
});
