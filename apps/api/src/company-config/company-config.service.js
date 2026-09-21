import { Injectable, Dependencies } from '@nestjs/common';
import { CompanyConfigRepository } from './company-config.repository';

@Injectable()
@Dependencies(CompanyConfigRepository)
export class CompanyConfigService {
  constructor(repository) {
    this.repository = repository;
  }

  getConfig() {
    return this.repository.getConfig();
  }

  updateConfig(data) {
    return this.repository.updateConfig(data);
  }
}
