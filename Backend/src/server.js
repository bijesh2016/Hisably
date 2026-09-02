require('dotenv').config();
const app = require('./app');
const config = require('./config/app.config');
const logger = require('./utils/logger');

const server = app.listen(config.app.port, () => {
  logger.info(`${config.app.name} is running on port ${config.app.port} in ${config.app.env} mode`);
  logger.info('✅ Database connected successfully');
  logger.info(`Server is running on : http://localhost:${config.app.port}`);
  logger.info(`Swagger documentation available at: http://localhost:${config.app.port}/api-docs`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  server.close(() => process.exit(1));
});
