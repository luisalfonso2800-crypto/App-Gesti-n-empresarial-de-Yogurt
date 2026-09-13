/**
 * @file system.module.js
 * @module system
 * @description Módulo NestJS para herramientas y diagnósticos de sistema.
 * @responsibility Agrupar controlador, servicio y repositorio de sistema.
 * @usedBy apps/api/src/app.module.js
 * @dependencies apps/api/src/database/database.module.js
 */
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SystemController } from './system.controller';
import { SystemService } from './system.service';
import { SystemRepository } from './system.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [SystemController],
  providers: [SystemService, SystemRepository],
  exports: [SystemService],
})
export class SystemModule {}
