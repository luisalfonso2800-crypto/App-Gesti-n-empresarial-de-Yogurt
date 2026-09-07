import { Injectable, Dependencies, NotFoundException } from '@nestjs/common';
import { PurchasesRepository } from './purchases.repository';

@Injectable()
@Dependencies(PurchasesRepository)
export class PurchasesService {
  constructor(repository) {
    this.repository = repository;
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id) {
    const item = await this.repository.findById(id);
    if (!item) throw new NotFoundException('Purchase not found');
    return item;
  }

  async create(createDto) {
    // Executing transaction via repository
    return this.repository.createWithTransaction(createDto);
  }

  async simulate(simulateDto) {
    return this.repository.simulate(simulateDto);
  }
}
