import { Module } from '@nestjs/common';
import { ProductionService } from './production.service';
import { ProductionController } from './production.controller';
import { ProductionRepository } from './production.repository';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductionController],
  providers: [ProductionService, ProductionRepository],
  exports: [ProductionService],
})
export class ProductionModule {}
