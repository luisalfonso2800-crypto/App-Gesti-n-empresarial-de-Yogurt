import { Injectable, Dependencies, NotFoundException } from '@nestjs/common';
import { SuppliesRepository } from './supplies.repository';

@Injectable()
@Dependencies(SuppliesRepository)
export class SuppliesService {
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
    const supply = await this.repository.findById(id);
    if (!supply) {
      throw new NotFoundException(`Supply with ID ${id} not found`);
    }
    return supply;
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
