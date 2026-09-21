import { Controller, Dependencies, Get, Post, Body, Patch, Param, Delete, Bind, HttpException, HttpStatus } from '@nestjs/common';
import { SuppliesService } from './supplies.service';

@Controller('supplies')
@Dependencies(SuppliesService)
export class SuppliesController {
  constructor(suppliesService) {
    this.suppliesService = suppliesService;
  }

  @Post()
  @Bind(Body())
  async create(createDto) {
    try {
      return await this.suppliesService.create(createDto);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'No se pudo crear el insumo',
        message: error.message
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  findAll() {
    return this.suppliesService.findAll();
  }

  @Get('active')
  findActive() {
    return this.suppliesService.findActive();
  }

  @Get('brands')
  findBrands() {
    return this.suppliesService.findBrands();
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
