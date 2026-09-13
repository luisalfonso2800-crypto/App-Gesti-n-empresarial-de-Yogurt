import { Module } from '@nestjs/common';
import { PresentationsService } from './presentations.service';
import { PresentationsController } from './presentations.controller';
import { PresentationsRepository } from './presentations.repository';
import { DatabaseModule } from '../database/database.module';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  imports: [DatabaseModule, UploadsModule],
  controllers: [PresentationsController],
  providers: [PresentationsService, PresentationsRepository],
  exports: [PresentationsService],
})
export class PresentationsModule {}
