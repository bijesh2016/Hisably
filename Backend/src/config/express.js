const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const config = require('./app.config');

const expressConfig = (app) => {
  // Security middleware
  app.use(helmet());

  // CORS
  app.use(cors(config.cors));

  // Body parser
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Compression
  app.use(compression());

  // Logging
  if (config.app.env === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined'));
  }

  // Trust proxy
  app.set('trust proxy', 1);
};

module.exports = expressConfig;
