import { Controller, Dependencies, Get, Post, Body, Param, Bind } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
@Dependencies(InventoryService)
export class InventoryController {
  constructor(service) {
    this.service = service;
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('finished-products')
  findFinishedProducts() {
    return this.service.findFinishedProducts();
  }

  @Get('wip')
  findWipLots() {
    return this.service.findWipLots();
  }

  @Get(':idInsumo')
  @Bind(Param('idInsumo'))
  findByInsumo(idInsumo) {
    return this.service.findByInsumo(idInsumo);
  }

  @Get(':idInsumo/movements')
  @Bind(Param('idInsumo'))
  findMovements(idInsumo) {
    return this.service.findMovements(idInsumo);
  }

  @Post('adjustments')
  @Bind(Body())
  adjustInventory(body) {
    return this.service.adjustInventory(body);
  }
}
