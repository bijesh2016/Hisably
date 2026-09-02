const swaggerJsdoc = require('swagger-jsdoc');
const config = require('./app.config');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: config.app.name,
      version: config.app.version,
      description: 'Hisably API Documentation',
    },
    servers: [
      {
        url: `http://localhost:${config.app.port}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/modules/**/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const swaggerConfig = (app) => {
  app.use('/api-docs', require('swagger-ui-express').serve, require('swagger-ui-express').setup(swaggerSpec));
};

module.exports = { swaggerConfig, swaggerSpec };
