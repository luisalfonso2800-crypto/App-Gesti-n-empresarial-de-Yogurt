import { Module } from '@nestjs/common';
import { CompanyConfigController } from './company-config.controller';
import { CompanyConfigService } from './company-config.service';
import { CompanyConfigRepository } from './company-config.repository';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CompanyConfigController],
  providers: [CompanyConfigService, CompanyConfigRepository],
  exports: [CompanyConfigService]
})
export class CompanyConfigModule {}
