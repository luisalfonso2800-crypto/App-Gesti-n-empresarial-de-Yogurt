import { Controller, Dependencies, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@Dependencies(DashboardService)
export class DashboardController {
  constructor(service) {
    this.service = service;
  }


  @Get('full-telemetry')
  getFullTelemetry() {
    return this.service.getFullTelemetry();
  }

  @Get('kpis')
  getKpis() {
    return this.service.getKpis();
  }

  @Get('rotation')
  getRotation() {
    return this.service.getRotation();
  }
}
