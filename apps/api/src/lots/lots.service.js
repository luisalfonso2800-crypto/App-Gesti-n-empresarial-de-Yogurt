import { Injectable, Dependencies, NotFoundException } from '@nestjs/common';
import { LotsRepository } from './lots.repository';

@Injectable()
@Dependencies(LotsRepository)
export class LotsService {
  constructor(repository) {
    this.repository = repository;
  }

  async findAll(query) {
    return this.repository.findAll(query);
  }

  async findOne(id) {
    const item = await this.repository.findById(id);
    if (!item) throw new NotFoundException('Lot not found');
    return item;
  }

  async discardLot(id, data) {
    return this.repository.discardLot(id, data);
  }
}
