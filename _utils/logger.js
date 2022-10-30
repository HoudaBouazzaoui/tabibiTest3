/*
const { createLogger, format, transports } = require('winston');

module.exports = createLogger({
    transports: [
        new transports.File({
            filename: '_logs/combined.log',
            level: process.env.LOG_LEVEL || 'debug',
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
                format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}: ${info.stack}`),
            )
        })
    ]
});
*/
const {createLogger, format, transports} = require('winston');
const { timestamp, colorize, printf, errors } = format;
const { Console, File } = transports;

module.exports = createLogger({
        level: process.env.LOG_LEVEL || 'debug',
        transports: [
            new Console(),
            new File({filename: '_logs/combined.log'})
        ],
        format: format.combine(
            errors({ stack: true }),
            timestamp(),
            colorize(),
            printf(({ level, message, timestamp, stack }) => {
                if (stack) {
                    // print log trace 
                    return `${timestamp} ${level}: ${message} - ${stack}`;
                }
                return `${timestamp} ${level}: ${message}`;
            }),
        ),
        expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
        colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
        ignoreRoute: function (req, res) {
            return false;
        } // optional: allows to skip some log messages based on request and/or response
}
);
