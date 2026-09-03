import { Controller, Dependencies, Get, Post, Body, Patch, Param, Delete, Bind } from '@nestjs/common';
import { SuppliesService } from './supplies.service';

@Controller('supplies')
@Dependencies(SuppliesService)
export class SuppliesController {
  constructor(suppliesService) {
    this.suppliesService = suppliesService;
  }

  @Post()
  @Bind(Body())
  create(createDto) {
    return this.suppliesService.create(createDto);
  }

  @Get()
  findAll() {
    return this.suppliesService.findAll();
  }

  @Get('active')
  findActive() {
    return this.suppliesService.findActive();
  }

  @Get(':id')
  @Bind(Param('id'))
  findOne(id) {
    return this.suppliesService.findOne(id);
  }

  @Patch(':id')
  @Bind(Param('id'), Body())
  update(id, updateDto) {
    return this.suppliesService.update(id, updateDto);
  }

  @Delete(':id')
  @Bind(Param('id'))
  remove(id) {
    return this.suppliesService.remove(id);
  }
}
