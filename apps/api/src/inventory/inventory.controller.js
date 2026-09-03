import { Controller, Dependencies, Get, Param, Bind } from '@nestjs/common';
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
}
