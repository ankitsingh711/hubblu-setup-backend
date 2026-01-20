import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private logger: LoggerService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest<Request>();
        const { method, url, ip, body } = request;
        const userAgent = request.get('user-agent') || '';
        const startTime = Date.now();

        this.logger.http('Incoming Request', {
            method,
            url,
            ip,
            userAgent,
            body: this.sanitizeBody(body),
        });

        return next.handle().pipe(
            tap({
                next: (data) => {
                    const response = context.switchToHttp().getResponse();
                    const statusCode = response.statusCode;
                    const duration = Date.now() - startTime;

                    this.logger.http('Outgoing Response', {
                        method,
                        url,
                        statusCode,
                        duration: `${duration}ms`,
                    });
                },
                error: (error) => {
                    const duration = Date.now() - startTime;
                    this.logger.error(`Request failed: ${method} ${url}`, error.stack, 'LoggingInterceptor');
                    this.logger.http('Request Error', {
                        method,
                        url,
                        duration: `${duration}ms`,
                        error: error.message,
                    });
                },
            }),
        );
    }

    private sanitizeBody(body: any): any {
        if (!body) return body;

        const sanitized = { ...body };
        const sensitiveFields = ['password', 'token', 'refreshToken', 'secret'];

        sensitiveFields.forEach((field) => {
            if (sanitized[field]) {
                sanitized[field] = '***REDACTED***';
            }
        });

        return sanitized;
    }
}
