import * as Joi from 'joi';

export const validationSchema = Joi.object({
    // Environment
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),

    // Server
    PORT: Joi.number().default(3000),
    API_PREFIX: Joi.string().default('api'),
    API_VERSION: Joi.string().default('v1'),

    // MongoDB
    MONGODB_URI: Joi.string().required(),
    MONGODB_DB_NAME: Joi.string().required(),

    // JWT
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRATION: Joi.string().default('15m'),
    JWT_REFRESH_SECRET: Joi.string().required(),
    JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),

    // Rate Limiting
    THROTTLE_TTL: Joi.number().default(60),
    THROTTLE_LIMIT: Joi.number().default(100),

    // Logging
    LOG_LEVEL: Joi.string()
        .valid('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly')
        .default('info'),
    LOG_DIR: Joi.string().default('logs'),

    // CORS
    CORS_ORIGINS: Joi.string().default('http://localhost:3000'),

    // Swagger
    SWAGGER_ENABLED: Joi.boolean().default(true),
    SWAGGER_TITLE: Joi.string().default('API Documentation'),
    SWAGGER_DESCRIPTION: Joi.string().default('API Description'),
    SWAGGER_VERSION: Joi.string().default('1.0'),

    // Security
    BCRYPT_SALT_ROUNDS: Joi.number().default(10),
});

export default () => ({
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3000,
    apiPrefix: process.env.API_PREFIX || 'api',
    apiVersion: process.env.API_VERSION || 'v1',

    database: {
        uri: process.env.MONGODB_URI,
        dbName: process.env.MONGODB_DB_NAME,
    },

    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRATION || '15m',
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
    },

    throttle: {
        ttl: parseInt(process.env.THROTTLE_TTL, 10) || 60,
        limit: parseInt(process.env.THROTTLE_LIMIT, 10) || 100,
    },

    logging: {
        level: process.env.LOG_LEVEL || 'info',
        dir: process.env.LOG_DIR || 'logs',
    },

    cors: {
        origins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    },

    swagger: {
        enabled: process.env.SWAGGER_ENABLED === 'true',
        title: process.env.SWAGGER_TITLE || 'API Documentation',
        description: process.env.SWAGGER_DESCRIPTION || 'API Description',
        version: process.env.SWAGGER_VERSION || '1.0',
    },

    security: {
        bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,
    },
});
