import { Injectable, Dependencies, NotFoundException, BadRequestException } from '@nestjs/common';
import { PurchasesRepository } from './purchases.repository';
import { createPurchaseSchema } from './schemas/create-purchase.schema';

@Injectable()
@Dependencies(PurchasesRepository)
export class PurchasesService {
  constructor(repository) {
    this.repository = repository;
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id) {
    const item = await this.repository.findById(id);
    if (!item) throw new NotFoundException('Purchase not found');
    return item;
  }

  async create(createDto) {
    const parseResult = createPurchaseSchema.safeParse(createDto);
    if (!parseResult.success) {
      const issues = parseResult.error.issues || [];
      const errorMsg = issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new BadRequestException(`Validación de compra fallida: ${errorMsg}`);
    }
    return this.repository.createWithTransaction(parseResult.data);
  }

  async simulate(simulateDto) {
    return this.repository.simulate(simulateDto);
  }

  async findActiveOrders() {
    return this.repository.findActiveOrders();
  }

  async addItemToOrder(orderId, itemData) {
    return this.repository.addItemToOrder(orderId, itemData);
  }

  async moveItem(moveDto) {
    return this.repository.moveItem(moveDto);
  }

  
  async mergeOrders(mergeDto) {
    return this.repository.mergeOrders(mergeDto);
  }

  async createOrder(createDto) {
    return this.repository.createOrder(createDto);
  }

  async findOneOrder(id) {
    const order = await this.repository.findOneOrder(id);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateOrder(id, updateDto) {
    return this.repository.updateOrder(id, updateDto);
  }

  async updateOrderItem(id, itemId, updateDto) {
    return this.repository.updateOrderItem(id, itemId, updateDto);
  }

  async deleteOrder(id) {
    return this.repository.deleteOrder(id);
  }
}
