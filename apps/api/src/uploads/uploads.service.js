/**
 * @file uploads.service.js
 * @module uploads
 * @description Servicio para gestión y eliminación física de archivos subidos.
 * @responsibility Administrar almacenamiento en disco y borrado físico seguro de imágenes de presentaciones.
 * @usedBy apps/api/src/uploads/uploads.controller.js, apps/api/src/presentations/presentations.service.js
 * @dependencies @nestjs/common, fs, path
 */

import { Injectable } from '@nestjs/common';
import path from 'path';
import fs from 'fs';

@Injectable()
export class UploadsService {
  constructor() {
    this.uploadsDir = path.join(process.cwd(), 'uploads', 'presentations');
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  /**
   * Elimina un archivo físico del disco de forma segura.
   * Valida que la ruta pertenezca exclusivamente a /uploads/presentations/ y evita directory traversal.
   * @param {string} fileUrl - URL relativa o ruta del archivo a eliminar
   * @returns {boolean} true si el archivo fue eliminado, false en caso contrario
   */
  deletePhysicalFile(fileUrl) {
    if (!fileUrl || typeof fileUrl !== 'string') return false;
    
    // Solo permitir remover archivos que estén dentro del directorio de presentaciones
    if (!fileUrl.includes('/uploads/presentations/')) return false;

    const fileName = path.basename(fileUrl);
    const targetPath = path.resolve(this.uploadsDir, fileName);

    // Verificación de seguridad contra Path Traversal
    if (!targetPath.startsWith(this.uploadsDir)) {
      console.warn(`Intento de acceso o eliminación no autorizada fuera del directorio permitido: ${fileUrl}`);
      return false;
    }

    try {
      if (fs.existsSync(targetPath)) {
        fs.unlinkSync(targetPath);
        return true;
      }
    } catch (err) {
      console.error(`Error al eliminar archivo físico en disco (${targetPath}):`, err);
    }
    return false;
  }
}
