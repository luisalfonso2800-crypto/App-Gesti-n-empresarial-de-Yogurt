import { Controller, Dependencies, Get, Post, Patch, Body, Param, Bind, BadRequestException } from '@nestjs/common';
import { PurchasesService } from './purchases.service';

@Controller('purchases')
@Dependencies(PurchasesService)
export class PurchasesController {
  constructor(service) {
    this.service = service;
  }

  @Post('simulate')
  @Bind(Body())
  simulate(simulateDto) {
    return this.service.simulate(simulateDto);
  }

  @Post()
  @Bind(Body())
  create(createDto) {
    return this.service.create(createDto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('orders/active')
  findActiveOrders() {
    return this.service.findActiveOrders();
  }

  @Post('orders')
  @Bind(Body())
  async createOrder(createDto) {
    if (!createDto || !createDto.items || createDto.items.length === 0) {
      throw new BadRequestException('El payload debe incluir un arreglo "items" válido.');
    }
    try {
      return await this.service.createOrder(createDto);
    } catch (error) {
      console.error('[CreateOrder Error Detail]:', error);
      throw new BadRequestException(error.message || 'Error al crear la orden de compra');
    }
  }

  @Get('orders/:id')
  @Bind(Param('id'))
  findOneOrder(id) {
    return this.service.findOneOrder(id);
  }

  @Patch('orders/:id')
  @Bind(Param('id'), Body())
  updateOrder(id, updateDto) {
    return this.service.updateOrder(id, updateDto);
  }

  @Patch('orders/:id/items/:itemId')
  @Bind(Param('id'), Param('itemId'), Body())
  updateOrderItem(id, itemId, updateDto) {
    return this.service.updateOrderItem(id, itemId, updateDto);
  }

  @Get(':id')
  @Bind(Param('id'))
  findOne(id) {
    return this.service.findOne(id);
  }
}
