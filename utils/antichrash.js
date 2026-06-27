const logger = require('./logger');

module.exports = () => {
  process.on('unhandledRejection', (reason) => {
    logger.error('UNHANDLED REJECTION: ' + (reason?.stack || reason));
  });

  process.on('uncaughtException', (err) => {
    logger.error('UNCAUGHT EXCEPTION: ' + err?.stack);
  });

  process.on('warning', (warning) => {
    logger.warn('PROCESS WARNING: ' + warning?.stack);
  });

  process.on('exit', (code) => {
    logger.info(`Process exited with code ${code}`);
  });
};
