import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { SuppliersRepository } from './suppliers.repository';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SuppliersController],
  providers: [SuppliersService, SuppliersRepository],
  exports: [SuppliersService],
})
export class SuppliersModule {}
