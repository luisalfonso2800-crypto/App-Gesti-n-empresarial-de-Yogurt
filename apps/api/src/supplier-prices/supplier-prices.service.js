import { Injectable, Dependencies, NotFoundException } from '@nestjs/common';
import { SupplierPricesRepository } from './supplier-prices.repository';

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

  _computePriceFields(dto) {
    const data = { ...dto };
    const tieneIva = data.tieneIva !== undefined ? Boolean(data.tieneIva) : true;
    const porcentajeIva = data.porcentajeIva !== undefined ? Number(data.porcentajeIva) : 19.0;
    const precioIncluyeIva = data.precioIncluyeIva !== undefined ? Boolean(data.precioIncluyeIva) : true;
    const precioCompra = Number(data.precioCompra || 0);
    const cantidadEquivalenteBase = Number(data.cantidadEquivalenteBase || 1);

    let costoBaseSinIva = 0;
    let precioTotalConIva = precioCompra;

    if (tieneIva && porcentajeIva > 0) {
      const factor = 1 + (porcentajeIva / 100);
      if (precioIncluyeIva) {
        costoBaseSinIva = precioCompra / factor;
        precioTotalConIva = precioCompra;
      } else {
        costoBaseSinIva = precioCompra;
        precioTotalConIva = precioCompra * factor;
      }
    } else {
      costoBaseSinIva = precioCompra;
      precioTotalConIva = precioCompra;
    }

    const costoUnidadBase = cantidadEquivalenteBase > 0 ? (precioTotalConIva / cantidadEquivalenteBase) : 0;

    data.tieneIva = tieneIva;
    data.porcentajeIva = porcentajeIva;
    data.precioIncluyeIva = precioIncluyeIva;
    data.costoBaseSinIva = costoBaseSinIva;
    data.costoUnidadBase = costoUnidadBase;

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
