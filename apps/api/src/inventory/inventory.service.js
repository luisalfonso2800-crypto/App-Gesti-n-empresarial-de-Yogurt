import { Injectable, Dependencies, NotFoundException } from '@nestjs/common';
import { InventoryRepository } from './inventory.repository';

@Injectable()
@Dependencies(InventoryRepository)
export class InventoryService {
  constructor(repository) {
    this.repository = repository;
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findByInsumo(idInsumo) {
    const item = await this.repository.findByInsumo(idInsumo);
    if (!item) throw new NotFoundException('Inventory not found');
    return item;
  }

  async findMovements(idInsumo) {
    return this.repository.findMovements(idInsumo);
  }
}
