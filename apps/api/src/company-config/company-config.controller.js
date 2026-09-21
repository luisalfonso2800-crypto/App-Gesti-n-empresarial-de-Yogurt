import { Controller, Dependencies, Get, Put, Body, Bind } from '@nestjs/common';
import { CompanyConfigService } from './company-config.service';

@Controller('company-config')
@Dependencies(CompanyConfigService)
export class CompanyConfigController {
  constructor(service) {
    this.service = service;
  }

  @Get()
  getConfig() {
    return this.service.getConfig();
  }

  @Put()
  @Bind(Body())
  updateConfig(data) {
    return this.service.updateConfig(data);
  }
}
