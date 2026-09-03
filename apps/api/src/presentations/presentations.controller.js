import { Controller, Dependencies, Get, Post, Body, Patch, Param, Delete, Bind } from '@nestjs/common';
import { PresentationsService } from './presentations.service';

@Controller('presentations')
@Dependencies(PresentationsService)
export class PresentationsController {
  constructor(presentationsService) {
    this.presentationsService = presentationsService;
  }

  @Post()
  @Bind(Body())
  create(createDto) {
    return this.presentationsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.presentationsService.findAll();
  }

  @Get('active')
  findActive() {
    return this.presentationsService.findActive();
  }

  @Get(':id')
  @Bind(Param('id'))
  findOne(id) {
    return this.presentationsService.findOne(id);
  }

  @Patch(':id')
  @Bind(Param('id'), Body())
  update(id, updateDto) {
    return this.presentationsService.update(id, updateDto);
  }

  @Delete(':id')
  @Bind(Param('id'))
  remove(id) {
    return this.presentationsService.remove(id);
  }
}
