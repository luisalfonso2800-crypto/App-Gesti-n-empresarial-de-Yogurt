import { Controller, Dependencies, Get, Post, Param, Bind, Body, Query } from '@nestjs/common';
import { LotsService } from './lots.service';

@Controller('lots')
@Dependencies(LotsService)
export class LotsController {
  constructor(service) {
    this.service = service;
  }

  @Get()
  @Bind(Query())
  findAll(query) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @Bind(Param('id'))
  findOne(id) {
    return this.service.findOne(id);
  }

  @Post(':id/discard')
  @Bind(Param('id'), Body())
  discardLot(id, body) {
    return this.service.discardLot(id, body);
  }
}
