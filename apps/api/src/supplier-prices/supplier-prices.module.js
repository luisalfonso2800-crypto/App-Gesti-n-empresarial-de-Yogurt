import { Module } from '@nestjs/common';
import { SupplierPricesService } from './supplier-prices.service';
import { SupplierPricesController } from './supplier-prices.controller';
import { SupplierPricesRepository } from './supplier-prices.repository';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SupplierPricesController],
  providers: [SupplierPricesService, SupplierPricesRepository],
  exports: [SupplierPricesService],
})
export class SupplierPricesModule {}
