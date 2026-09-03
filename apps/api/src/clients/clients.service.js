import { Injectable, Dependencies, NotFoundException } from '@nestjs/common';
import { ClientsRepository } from './clients.repository';

@Injectable()
@Dependencies(ClientsRepository)
export class ClientsService {
  constructor(repository) {
    this.repository = repository;
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id) {
    const item = await this.repository.findById(id);
    if (!item) throw new NotFoundException('Client not found');
    return item;
  }

  async create(createDto) {
    return this.repository.create(createDto);
  }
}
