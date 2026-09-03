import { Controller, Dependencies, Get, Post, Body, Patch, Param, Delete, Bind } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';

@Controller('suppliers')
@Dependencies(SuppliersService)
export class SuppliersController {
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

  @Get('active')
  findActive() {
    return this.service.findActive();
  }

  @Get(':id')
  @Bind(Param('id'))
  findOne(id) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Bind(Param('id'), Body())
  update(id, updateDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @Bind(Param('id'))
  remove(id) {
    return this.service.remove(id);
  }
}
