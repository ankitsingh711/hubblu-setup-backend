import { Controller, Get } from '@nestjs/common';
import {
    HealthCheck,
    HealthCheckService,
    MongooseHealthIndicator,
    MemoryHealthIndicator,
    DiskHealthIndicator,
} from '@nestjs/terminus';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '@common/decorators/public.decorator';

@ApiTags('Health')
@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private db: MongooseHealthIndicator,
        private memory: MemoryHealthIndicator,
        private disk: DiskHealthIndicator,
    ) { }

    @Get()
    @Public()
    @HealthCheck()
    @ApiOperation({ summary: 'Health check endpoint' })
    @ApiResponse({ status: 200, description: 'Application is healthy' })
    @ApiResponse({ status: 503, description: 'Application is unhealthy' })
    check() {
        return this.health.check([
            () => this.db.pingCheck('database'),
            () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // 150MB
            () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024), // 150MB
            () =>
                this.disk.checkStorage('storage', {
                    path: '/',
                    thresholdPercent: 0.9, // 90%
                }),
        ]);
    }

    @Get('live')
    @Public()
    @ApiOperation({ summary: 'Liveness probe' })
    @ApiResponse({ status: 200, description: 'Application is alive' })
    checkLiveness() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
        };
    }

    @Get('ready')
    @Public()
    @HealthCheck()
    @ApiOperation({ summary: 'Readiness probe' })
    @ApiResponse({ status: 200, description: 'Application is ready' })
    @ApiResponse({ status: 503, description: 'Application is not ready' })
    checkReadiness() {
        return this.health.check([() => this.db.pingCheck('database')]);
    }
}
