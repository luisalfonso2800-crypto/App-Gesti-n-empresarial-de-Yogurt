import { Injectable, Dependencies, NotFoundException } from '@nestjs/common';
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
    return this.repository.create(createDto);
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
    await this.findOne(id);
    return this.repository.remove(id);
  }
}
