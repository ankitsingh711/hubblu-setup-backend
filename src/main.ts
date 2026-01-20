import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { LoggerService } from './common/logger/logger.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        bufferLogs: true,
    });

    // Get configuration service
    const configService = app.get(ConfigService);
    const logger = app.get(LoggerService);

    // Use custom logger
    app.useLogger(logger);

    // Security headers
    app.use(helmet());

    // CORS
    app.enableCors({
        origin: configService.get<string[]>('cors.origins'),
        credentials: true,
    });

    // Global prefix
    const apiPrefix = configService.get<string>('apiPrefix');
    const apiVersion = configService.get<string>('apiVersion');
    app.setGlobalPrefix(`${apiPrefix}/${apiVersion}`);

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // Swagger documentation
    if (configService.get<boolean>('swagger.enabled')) {
        const config = new DocumentBuilder()
            .setTitle(configService.get<string>('swagger.title'))
            .setDescription(configService.get<string>('swagger.description'))
            .setVersion(configService.get<string>('swagger.version'))
            .addBearerAuth()
            .addTag('Authentication', 'Authentication and authorization endpoints')
            .addTag('Users', 'User management endpoints')
            .addTag('Health', 'Application health and monitoring')
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
            swaggerOptions: {
                persistAuthorization: true,
            },
        });

        logger.log(
            `Swagger documentation available at http://localhost:${configService.get('port')}/${apiPrefix}/docs`,
            'Bootstrap',
        );
    }

    // Start server
    const port = configService.get<number>('port');
    await app.listen(port);

    logger.log(`🚀 Application is running on: http://localhost:${port}/${apiPrefix}/${apiVersion}`, 'Bootstrap');
    logger.log(`Environment: ${configService.get('env')}`, 'Bootstrap');
}

bootstrap();
