import { Module } from '@nestjs/common';
import { SuppliesService } from './supplies.service';
import { SuppliesController } from './supplies.controller';
import { SuppliesRepository } from './supplies.repository';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SuppliesController],
  providers: [SuppliesService, SuppliesRepository],
  exports: [SuppliesService],
})
export class SuppliesModule {}
