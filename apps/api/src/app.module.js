import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validationSchema } from './config/env.validation';
import { DatabaseModule } from './database/database.module';
import { PresentationsModule } from './presentations/presentations.module';
import { SuppliesModule } from './supplies/supplies.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    DatabaseModule,
    PresentationsModule,
    SuppliesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
