import { Injectable, Dependencies, NotFoundException, BadRequestException } from '@nestjs/common';
import { SupplierPricesRepository } from './supplier-prices.repository';
import { toDecimal, add, div, mul, sub, toNumber } from '../common/decimal/decimal-utils.js';

@Injectable()
@Dependencies(SupplierPricesRepository)
export class SupplierPricesService {
  constructor(repository) {
    this.repository = repository;
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findActive() {
    return this.repository.findActive();
  }

  async findOne(id) {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return item;
  }

  async lookup(idProveedor, idInsumo) {
    if (!idProveedor || !idInsumo) {
      throw new BadRequestException('idProveedor e idInsumo son requeridos para la consulta');
    }
    return this.repository.findBySupplierAndSupply(idProveedor, idInsumo);
  }

  _computePriceFields(dto) {
    const data = { ...dto };
    const tieneIva = data.tieneIva !== undefined ? Boolean(data.tieneIva) : true;
    const porcentajeIva = tieneIva ? toDecimal(data.porcentajeIva !== undefined ? data.porcentajeIva : 19.0) : toDecimal(0);
    const precioIncluyeIva = data.precioIncluyeIva !== undefined ? Boolean(data.precioIncluyeIva) : true;
    const precioCompra = toDecimal(data.precioCompra || 0);
    const cantidadEquivalenteBase = toDecimal(data.cantidadEquivalenteBase || 1);

    let costoBaseSinIva = toDecimal(0);
    let precioTotalConIva = precioCompra;

    if (tieneIva && porcentajeIva.gt(0)) {
      const factor = add(1, div(porcentajeIva, 100));
      if (precioIncluyeIva) {
        costoBaseSinIva = div(precioCompra, factor);
        precioTotalConIva = precioCompra;
      } else {
        costoBaseSinIva = precioCompra;
        precioTotalConIva = mul(precioCompra, factor);
      }
    } else {
      costoBaseSinIva = precioCompra;
      precioTotalConIva = precioCompra;
    }

    // HAL-F4-04 / HAL-F7-04 / HAL-F4-07: Costo contable con Decimal.js exacto
    const costoUnidadBase = cantidadEquivalenteBase.gt(0) ? div(costoBaseSinIva, cantidadEquivalenteBase) : toDecimal(0);

    data.tieneIva = tieneIva;
    data.porcentajeIva = toNumber(porcentajeIva);
    data.precioIncluyeIva = precioIncluyeIva;
    data.costoBaseSinIva = toNumber(costoBaseSinIva.toDecimalPlaces(4));
    data.costoUnidadBase = toNumber(costoUnidadBase.toDecimalPlaces(4));

    return data;
  }

  async create(createDto) {
    const computedData = this._computePriceFields(createDto);
    return this.repository.create(computedData);
  }

  async update(id, updateDto) {
    const existing = await this.findOne(id);
    const merged = { ...existing, ...updateDto };
    const computedData = this._computePriceFields(merged);
    // Remover campos relacionales si vinieran en existing
    delete computedData.insumo;
    delete computedData.proveedor;
    delete computedData.id;
    return this.repository.update(id, computedData);
  }

  async remove(id) {
    await this.findOne(id);
    return this.repository.remove(id);
  }
}
