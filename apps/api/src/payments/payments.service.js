import { Injectable, Dependencies, NotFoundException, BadRequestException } from '@nestjs/common';
import { PaymentsRepository } from './payments.repository';
import { createPaymentSchema } from './schemas/create-payment.schema';

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
    const parseResult = createPaymentSchema.safeParse(createDto);
    if (!parseResult.success) {
      const issues = parseResult.error.issues || [];
      const errorMsg = issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new BadRequestException(`Validación de pago fallida: ${errorMsg}`);
    }
    return this.repository.create(parseResult.data);
  }

  async getReceivables(filters) {
    return this.repository.getReceivables(filters);
  }
}
