const config = {
  app: {
    name: process.env.APP_NAME || 'Hisably API',
    version: process.env.APP_VERSION || '1.0.0',
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  upload: {
    maxSize: parseInt(process.env.MAX_UPLOAD_SIZE, 10) || 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
  pagination: {
    defaultLimit: parseInt(process.env.DEFAULT_PAGINATION_LIMIT, 10) || 20,
    maxLimit: parseInt(process.env.MAX_PAGINATION_LIMIT, 10) || 100,
  },
};

module.exports = config;
