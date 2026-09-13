/**
 * @file uploads.module.js
 * @module uploads
 * @description Módulo NestJS para gestión de subidas de archivos estáticos.
 * @responsibility Configurar controladores y proveedores para el submódulo uploads.
 * @usedBy apps/api/src/app.module.js, apps/api/src/presentations/presentations.module.js
 * @dependencies @nestjs/common, UploadsController, UploadsService
 */

import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

@Module({
  controllers: [UploadsController],
  providers: [UploadsService],
  exports: [UploadsService],
})
export class UploadsModule {}
