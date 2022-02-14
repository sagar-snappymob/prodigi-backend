import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(winston.format.colorize(), winston.format.json()),
  defaultMeta: { api: 'shop' },
  transports: [new winston.transports.Console({ format: winston.format.simple() })],
});

const cxLogger = {
  info: (msg: string, path?: Object) => {
    logger.info(msg, path);
  },
  error: (msg: string, path?: Object) => {
    logger.error(msg, path);
  },
  warn: (msg: string, path?: Object) => {
    logger.warn(msg, path);
  },
};

export default cxLogger;
