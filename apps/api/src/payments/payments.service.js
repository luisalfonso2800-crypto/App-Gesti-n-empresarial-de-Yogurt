import { Injectable, Dependencies, NotFoundException } from '@nestjs/common';
import { PaymentsRepository } from './payments.repository';

@Injectable()
@Dependencies(PaymentsRepository)
export class PaymentsService {
  constructor(repository) {
    this.repository = repository;
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id) {
    const item = await this.repository.findById(id);
    if (!item) throw new NotFoundException('Payment not found');
    return item;
  }

  async create(createDto) {
    return this.repository.create(createDto);
  }

  async getReceivables(filters) {
    return this.repository.getReceivables(filters);
  }
}
