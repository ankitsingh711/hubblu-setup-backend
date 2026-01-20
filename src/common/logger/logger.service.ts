import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggerService implements NestLoggerService {
    private logger: winston.Logger;

    constructor(private configService: ConfigService) {
        const logLevel = this.configService.get<string>('logging.level', 'info');
        const logDir = this.configService.get<string>('logging.dir', 'logs');

        const customFormat = winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.errors({ stack: true }),
            winston.format.splat(),
            winston.format.json(),
            winston.format.printf(({ timestamp, level, message, context, trace, ...metadata }) => {
                let msg = `${timestamp} [${level.toUpperCase()}] ${context ? `[${context}] ` : ''}${message}`;

                if (Object.keys(metadata).length > 0) {
                    msg += ` ${JSON.stringify(metadata)}`;
                }

                if (trace) {
                    msg += `\n${trace}`;
                }

                return msg;
            }),
        );

        this.logger = winston.createLogger({
            level: logLevel,
            format: customFormat,
            transports: [
                // Console transport
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.printf(
                            ({ timestamp, level, message, context }) =>
                                `${timestamp} ${level} ${context ? `[${context}]` : ''} ${message}`,
                        ),
                    ),
                }),

                // Daily rotate file transport for all logs
                new DailyRotateFile({
                    dirname: logDir,
                    filename: 'application-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                }),

                // Daily rotate file transport for errors only
                new DailyRotateFile({
                    dirname: logDir,
                    filename: 'error-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '30d',
                    level: 'error',
                }),
            ],
        });
    }

    log(message: string, context?: string) {
        this.logger.info(message, { context });
    }

    error(message: string, trace?: string, context?: string) {
        this.logger.error(message, { context, trace });
    }

    warn(message: string, context?: string) {
        this.logger.warn(message, { context });
    }

    debug(message: string, context?: string) {
        this.logger.debug(message, { context });
    }

    verbose(message: string, context?: string) {
        this.logger.verbose(message, { context });
    }

    http(message: string, metadata?: Record<string, any>) {
        this.logger.http(message, metadata);
    }
}
