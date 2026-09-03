import { Injectable, Dependencies, NotFoundException } from '@nestjs/common';
import { LotsRepository } from './lots.repository';

@Injectable()
@Dependencies(LotsRepository)
export class LotsService {
  constructor(repository) {
    this.repository = repository;
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id) {
    const item = await this.repository.findById(id);
    if (!item) throw new NotFoundException('Lot not found');
    return item;
  }
}
