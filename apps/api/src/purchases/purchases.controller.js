import { Controller, Dependencies, Get, Post, Body, Param, Bind } from '@nestjs/common';
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

  @Get(':id')
  @Bind(Param('id'))
  findOne(id) {
    return this.service.findOne(id);
  }
}
