import { Controller, Dependencies, Get, Post, Put, Delete, Body, Param, Bind } from '@nestjs/common';
import { GoalsService } from './goals.service';

@Controller('goals')
@Dependencies(GoalsService)
export class GoalsController {
  constructor(service) {
    this.service = service;
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('available-funds')
  getAvailableFunds() {
    return this.service.getAvailableFunds();
  }

  @Get(':id')
  @Bind(Param('id'))
  findOne(id) {
    return this.service.findOne(id);
  }

  @Post()
  @Bind(Body())
  create(createDto) {
    return this.service.create(createDto);
  }

  @Post(':id')
  @Bind(Param('id'), Body())
  updatePost(id, updateDto) {
    return this.service.update(id, updateDto);
  }

  @Put(':id')
  @Bind(Param('id'), Body())
  update(id, updateDto) {
    return this.service.update(id, updateDto);
  }

  @Post(':id/contribute')
  @Bind(Param('id'), Body())
  contribute(id, contributeDto) {
    return this.service.contribute(id, contributeDto);
  }

  @Delete(':id')
  @Bind(Param('id'))
  delete(id) {
    return this.service.delete(id);
  }
}
