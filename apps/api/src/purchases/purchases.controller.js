import { Controller, Dependencies, Get, Post, Patch, Delete, Body, Param, Bind, BadRequestException } from '@nestjs/common';
import { PurchasesService } from './purchases.service';

@Controller('purchases')
@Dependencies(PurchasesService)
export class PurchasesController {
  constructor(service) {
    this.service = service;
  }

  // --- Rutas estáticas y de acción (deben ir ANTES de las paramétricas /:id) ---

  @Post('simulate')
  @Bind(Body())
  simulate(simulateDto) {
    return this.service.simulate(simulateDto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  /** GET /purchases/orders/active — lista órdenes PENDIENTE / EN_PROCESO */
  @Get('orders/active')
  findActiveOrders() {
    return this.service.findActiveOrders();
  }

  /** POST /purchases/items/move — transfiere un ítem entre dos órdenes */
  @Post('items/move')
  @Bind(Body())
  async moveItem(moveDto) {
    if (!moveDto || !moveDto.itemId || !moveDto.fromOrderId || !moveDto.toOrderId) {
      throw new BadRequestException('Se requieren itemId, fromOrderId y toOrderId');
    }
    return await this.service.moveItem(moveDto);
  }

  /** POST /purchases/orders/merge — fusiona múltiples órdenes en una nueva */
  @Post('orders/merge')
  @Bind(Body())
  async mergeOrders(mergeDto) {
    if (!mergeDto || !mergeDto.sourceOrderIds || mergeDto.sourceOrderIds.length < 2) {
      throw new BadRequestException('Se requieren al menos 2 órdenes para fusionar');
    }
    return await this.service.mergeOrders(mergeDto);
  }

  /**
   * POST /purchases/orders — crea una nueva orden de compra.
   * Acepta items: [] (array vacío) para crear listas en blanco desde el carrito.
   * Solo requiere el campo "nombre" como mínimo.
   */
  @Post('orders')
  @Bind(Body())
  async createOrder(createDto) {
    if (!createDto || !createDto.nombre) {
      throw new BadRequestException('El payload debe incluir al menos el campo "nombre".');
    }
    try {
      return await this.service.createOrder(createDto);
    } catch (error) {
      console.error('[CreateOrder Error Detail]:', error);
      throw new BadRequestException(error.message || 'Error al crear la orden de compra');
    }
  }

  // --- Rutas paramétricas (deben ir DESPUÉS de las estáticas) ---

  /** GET /purchases/orders/:id — detalle de una orden */
  @Get('orders/:id')
  @Bind(Param('id'))
  findOneOrder(id) {
    return this.service.findOneOrder(id);
  }

  /** POST /purchases/orders/:id/items — añade un ítem a una orden existente */
  @Post('orders/:id/items')
  @Bind(Param('id'), Body())
  async addItemToOrder(id, itemData) {
    return await this.service.addItemToOrder(id, itemData);
  }

  /** PATCH /purchases/orders/:id — actualiza nombre/estado de una orden */
  @Patch('orders/:id')
  @Bind(Param('id'), Body())
  updateOrder(id, updateDto) {
    return this.service.updateOrder(id, updateDto);
  }

  /** PATCH /purchases/orders/:id/items/:itemId — actualiza el estado de un ítem */
  @Patch('orders/:id/items/:itemId')
  @Bind(Param('id'), Param('itemId'), Body())
  updateOrderItem(id, itemId, updateDto) {
    return this.service.updateOrderItem(id, itemId, updateDto);
  }

  /** DELETE /purchases/orders/:id — elimina una orden y sus ítems */
  @Delete('orders/:id')
  @Bind(Param('id'))
  deleteOrder(id) {
    return this.service.deleteOrder(id);
  }

  /** POST /purchases — registra una compra real (flujo de compra con detalles) */
  @Post()
  @Bind(Body())
  create(createDto) {
    return this.service.create(createDto);
  }

  /** GET /purchases/:id — detalle de una compra real */
  @Get(':id')
  @Bind(Param('id'))
  findOne(id) {
    return this.service.findOne(id);
  }
}
