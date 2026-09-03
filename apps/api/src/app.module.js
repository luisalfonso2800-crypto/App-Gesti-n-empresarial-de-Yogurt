import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validationSchema } from './config/env.validation';
import { DatabaseModule } from './database/database.module';
import { PresentationsModule } from './presentations/presentations.module';
import { SuppliesModule } from './supplies/supplies.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { SupplierPricesModule } from './supplier-prices/supplier-prices.module';
import { ProductsModule } from './products/products.module';
import { RecipesModule } from './recipes/recipes.module';
import { PurchasesModule } from './purchases/purchases.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    DatabaseModule,
    PresentationsModule,
    SuppliesModule,
    SuppliersModule,
    SupplierPricesModule,
    ProductsModule,
    RecipesModule,
    PurchasesModule,
    InventoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
