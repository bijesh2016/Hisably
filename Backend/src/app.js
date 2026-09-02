const express = require('express');
const { expressConfig, routerConfig, swaggerConfig } = require('./config');
const { errorHandler, notFound } = require('./middlewares');

const app = express();

// Express configuration
expressConfig(app);

// Swagger documentation
swaggerConfig(app);

// Routes
routerConfig(app);

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
