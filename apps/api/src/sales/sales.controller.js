import { Controller, Dependencies, Get, Post, Body, Param, Bind } from '@nestjs/common';
import { SalesService } from './sales.service';

@Controller('sales')
@Dependencies(SalesService)
export class SalesController {
  constructor(service) {
    this.service = service;
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
