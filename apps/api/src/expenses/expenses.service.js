import { Injectable, Dependencies, NotFoundException } from '@nestjs/common';
import { ExpensesRepository } from './expenses.repository';

@Injectable()
@Dependencies(ExpensesRepository)
export class ExpensesService {
  constructor(repository) {
    this.repository = repository;
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id) {
    const item = await this.repository.findById(id);
    if (!item) throw new NotFoundException('Expense not found');
    return item;
  }

  async create(createDto) {
    return this.repository.create(createDto);
  }
}
