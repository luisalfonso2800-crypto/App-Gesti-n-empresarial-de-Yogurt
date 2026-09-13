/**
 * @file uploads.controller.js
 * @module uploads
 * @description Controlador para subida y desvinculación física de imágenes de presentaciones.
 * @responsibility Recibir multipart/form-data, validar mime image/*, límite 3MB, almacenar con hash/timestamp y devolver URL.
 * @usedBy apps/api/src/uploads/uploads.module.js
 * @dependencies @nestjs/common, @nestjs/platform-express, multer, crypto, path, fs
 */

import { 
  Controller, 
  Post, 
  Delete,
  Body,
  UseInterceptors, 
  UploadedFile, 
  BadRequestException, 
  Dependencies, 
  Bind 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { UploadsService } from './uploads.service';

const uploadDirectory = path.join(process.cwd(), 'uploads', 'presentations');
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Configuración de almacenamiento en disco con nombrado seguro (hash + timestamp)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const hash = crypto.randomBytes(8).toString('hex');
    const timestamp = Date.now();
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `pres-${timestamp}-${hash}${ext}`);
  },
});

// Filtro de validación: solo archivos de imagen (image/*)
const fileFilter = (req, file, cb) => {
  if (!file.mimetype || !file.mimetype.startsWith('image/')) {
    return cb(new BadRequestException('Solo se permiten archivos de imagen (image/*)'), false);
  }
  cb(null, true);
};

@Controller('uploads')
@Dependencies(UploadsService)
export class UploadsController {
  constructor(uploadsService) {
    this.uploadsService = uploadsService;
  }

  /**
   * Endpoint de subida de imágenes de presentaciones.
   * Límite estricto de 3MB, validación MIME image/* y retorno de URL local.
   */
  @Post('presentations')
  @UseInterceptors(FileInterceptor('file', {
    storage,
    limits: { fileSize: 3 * 1024 * 1024 }, // 3 MB
    fileFilter,
  }))
  @Bind(UploadedFile())
  uploadPresentationImage(file) {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado un archivo válido de imagen o supera el límite de 3MB');
    }
    return {
      url: `/uploads/presentations/${file.filename}`,
    };
  }

  /**
   * Endpoint para remoción física explícita de archivo al desvincular imagen.
   */
  @Delete('presentations')
  @Bind(Body())
  deletePresentationImage(body) {
    const url = body?.url;
    if (!url) {
      throw new BadRequestException('Se requiere la URL del archivo para eliminar');
    }
    const removed = this.uploadsService.deletePhysicalFile(url);
    return { success: removed };
  }
}
