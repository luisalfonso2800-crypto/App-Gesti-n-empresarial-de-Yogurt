import { Injectable, Dependencies, NotFoundException } from '@nestjs/common';
import { PresentationsRepository } from './presentations.repository';

@Injectable()
@Dependencies(PresentationsRepository)
export class PresentationsService {
  constructor(repository) {
    this.repository = repository;
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
      throw new NotFoundException(`Presentation with ID ${id} not found`);
    }
    return presentation;
  }

  async create(createDto) {
    return this.repository.create(createDto);
  }

  async update(id, updateDto) {
    await this.findOne(id);
    return this.repository.update(id, updateDto);
  }

  async remove(id) {
    await this.findOne(id);
    return this.repository.remove(id);
  }
}
