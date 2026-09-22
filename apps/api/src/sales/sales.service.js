import { Injectable, Dependencies, NotFoundException, BadRequestException } from '@nestjs/common';
import { SalesRepository } from './sales.repository';
import { createSaleSchema } from './schemas/create-sale.schema';

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
    const parseResult = createSaleSchema.safeParse(createDto);
    if (!parseResult.success) {
      const issues = parseResult.error.issues || [];
      const errorMsg = issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new BadRequestException(`Validación de venta fallida: ${errorMsg}`);
    }
    return this.repository.createWithTransaction(parseResult.data);
  }
}
