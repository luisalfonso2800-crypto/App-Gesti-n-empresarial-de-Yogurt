import { Injectable, Dependencies, NotFoundException } from '@nestjs/common';
import { SalesRepository } from './sales.repository';

@Injectable()
@Dependencies(SalesRepository)
export class SalesService {
  constructor(repository) {
    this.repository = repository;
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id) {
    const item = await this.repository.findById(id);
    if (!item) throw new NotFoundException('Sales record not found');
    return item;
  }

  async create(createDto) {
    return this.repository.createWithTransaction(createDto);
  }
}
