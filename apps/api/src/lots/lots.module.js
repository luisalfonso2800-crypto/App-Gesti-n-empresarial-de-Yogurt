import { Module } from '@nestjs/common';
import { LotsService } from './lots.service';
import { LotsController } from './lots.controller';
import { LotsRepository } from './lots.repository';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [LotsController],
  providers: [LotsService, LotsRepository],
  exports: [LotsService],
})
export class LotsModule {}
