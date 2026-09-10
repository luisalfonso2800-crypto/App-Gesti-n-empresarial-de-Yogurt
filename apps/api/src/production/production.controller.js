import { Controller, Dependencies, Get, Post, Body, Param, Query, Bind, Patch } from '@nestjs/common';
import { ProductionService } from './production.service';

@Controller('production')
@Dependencies(ProductionService)
export class ProductionController {
  constructor(service) {
    this.service = service;
  }

  @Get('recipe-bom/:idReceta')
  @Bind(Param('idReceta'), Query('cantidad'), Query('variantes'))
  getRecipeBom(idReceta, cantidad, variantes) {
    return this.service.getRecipeBom(idReceta, Number(cantidad), variantes);
  }

  @Post()
  @Bind(Body())
  create(createDto) {
    return this.service.create(createDto);
  }

  @Patch(':id/complete')
  @Bind(Param('id'), Body())
  complete(id, updateDto) {
    return this.service.complete(id, updateDto);
  }

  @Post(':id/start')
  @Bind(Param('id'))
  start(id) {
    return this.service.start(id);
  }

  @Post('create-purchase-order-from-shortage')
  @Bind(Body())
  createPurchaseOrderFromShortage(body) {
    return this.service.createPurchaseOrderFromShortage(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Bind(Param('id'))
  findOne(id) {
    return this.service.findOne(id);
  }
}
