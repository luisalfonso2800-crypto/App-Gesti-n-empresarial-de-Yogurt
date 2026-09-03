import { Injectable, Dependencies, NotFoundException } from '@nestjs/common';
import { ProductionRepository } from './production.repository';

@Injectable()
@Dependencies(ProductionRepository)
export class ProductionService {
  constructor(repository) {
    this.repository = repository;
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id) {
    const item = await this.repository.findById(id);
    if (!item) throw new NotFoundException('Production not found');
    return item;
  }

  async create(createDto) {
    return this.repository.createWithTransaction(createDto);
  }
}
