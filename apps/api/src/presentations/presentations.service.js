import { Injectable, Dependencies, NotFoundException, ConflictException } from '@nestjs/common';
import { PresentationsRepository } from './presentations.repository';
import { UploadsService } from '../uploads/uploads.service';

@Injectable()
@Dependencies(PresentationsRepository, UploadsService)
export class PresentationsService {
  constructor(repository, uploadsService) {
    this.repository = repository;
    this.uploadsService = uploadsService;
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findActive() {
    return this.repository.findActive();
  }

  async findOne(id) {
    const presentation = await this.repository.findById(id);
    if (!presentation) {
      throw new NotFoundException(`La presentación con ID ${id} no fue encontrada`);
    }
    return presentation;
  }

  async create(createDto) {
    const isGranel = createDto.tipoEnvase === 'BALDE' || createDto.tipoEnvase === 'TANQUE_GRANEL';
    const payload = { ...createDto };
    if (isGranel && (payload.cantidadMl === undefined || payload.cantidadMl === null || payload.cantidadMl === 0)) {
      payload.cantidadMl = 1000;
      payload.cantidadOz = payload.cantidadOz || 33.81;
    }
    return this.repository.create(payload);
  }

  async update(id, updateDto) {
    const current = await this.findOne(id);
    if (
      updateDto.imagenUrl !== undefined &&
      current.imagenUrl &&
      current.imagenUrl !== updateDto.imagenUrl
    ) {
      this.uploadsService.deletePhysicalFile(current.imagenUrl);
    }
    return this.repository.update(id, updateDto);
  }

  async remove(id) {
    const current = await this.findOne(id);
    const count = await this.repository.countProductsByPresentation(id);
    if (count > 0) {
      throw new ConflictException(
        'No se puede eliminar la presentación porque está asociada a productos en el catálogo. Manténgala desactivada.'
      );
    }

    if (current.imagenUrl) {
      this.uploadsService.deletePhysicalFile(current.imagenUrl);
    }

    return this.repository.deletePermanent(id);
  }
}
