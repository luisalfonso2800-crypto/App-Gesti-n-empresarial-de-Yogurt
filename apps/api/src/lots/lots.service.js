import { Injectable, Dependencies, NotFoundException, BadRequestException } from '@nestjs/common';
import { LotsRepository } from './lots.repository';
import { discardLotSchema } from './schemas/discard-lot.schema';

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
    const parseResult = discardLotSchema.safeParse(data);
    if (!parseResult.success) {
      const issues = parseResult.error.issues || [];
      const errorMsg = issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new BadRequestException(`Validación de descarte de lote fallida: ${errorMsg}`);
    }
    return this.repository.discardLot(id, parseResult.data);
  }
}
