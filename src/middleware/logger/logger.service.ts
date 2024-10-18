import * as winston from 'winston';

const { combine, timestamp, printf, colorize } = winston.format;

// Define the log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message} ${stack || ''}`;
});

// Create the logger
export const logger = winston.createLogger({
  level: 'info', // Default level is info
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    // Console logging for development
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), logFormat),
    }),
    
    // Log successful requests to application.log
    // new winston.transports.File({
    //   filename: 'logs/application.log',
    //   level: 'info', // Log only info and success messages
    // }),
    
    // Log errors to errors.log
    new winston.transports.File({
      filename: 'logs/errors.log',
      level: 'error', // Log only error messages
    }),
  ],
});
