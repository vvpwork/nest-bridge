import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckResult, HealthCheckService, HealthIndicatorResult, SequelizeHealthIndicator } from '@nestjs/terminus';
import { Public } from '@/common/decorators';

/**
 * https://docs.nestjs.com/recipes/terminus
 */
@Controller()
export class HealthController {
  constructor(private health: HealthCheckService, private db: SequelizeHealthIndicator) {}

  @Public()
  @Get('health')
  @HealthCheck()
  public async check(): Promise<HealthCheckResult> {
    return this.health.check([
      async (): Promise<HealthIndicatorResult> => this.db.pingCheck('database'),

      async () => ({
        info: {
          status: 'up',
          uptime: process.uptime(),
          version: 'test',
        },
      }),
    ]);
  }
}
