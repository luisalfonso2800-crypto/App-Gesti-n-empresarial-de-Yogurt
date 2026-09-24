import { Controller, Dependencies, Get, Post, Body, Patch, Param, Delete, Query, Res, Bind } from '@nestjs/common';
import { SupplierPricesService } from './supplier-prices.service';

@Controller('supplier-prices')
@Dependencies(SupplierPricesService)
export class SupplierPricesController {
  constructor(service) {
    this.service = service;
  }

  @Get('lookup')
  @Bind(Query('idProveedor'), Query('idInsumo'), Res())
  async lookup(idProveedor, idInsumo, res) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    const result = await this.service.lookup(idProveedor, idInsumo);
    return res.status(200).json(result);
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
