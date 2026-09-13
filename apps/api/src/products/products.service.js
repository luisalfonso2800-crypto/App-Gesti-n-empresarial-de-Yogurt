import { Injectable, Dependencies, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';

@Injectable()
@Dependencies(ProductsRepository)
export class ProductsService {
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

  async create(createDto) {
    const {
      id,
      presentacion,
      recetas,
      producciones,
      lotes,
      detalleVentas,
      inventario,
      movimientos,
      recetasConsumo,
      detallesProduccionConsumo,
      createdAt,
      updatedAt,
      ...cleanData
    } = createDto || {};

    const idPresentacionFinal = cleanData.idPresentacion || presentacion?.id;
    if (idPresentacionFinal) {
      cleanData.idPresentacion = idPresentacionFinal;
    }

    return this.repository.create(cleanData);
  }

  async update(id, updateDto) {
    await this.findOne(id);
    const {
      id: _id,
      presentacion,
      recetas,
      producciones,
      lotes,
      detalleVentas,
      inventario,
      movimientos,
      recetasConsumo,
      detallesProduccionConsumo,
      createdAt,
      updatedAt,
      ...cleanData
    } = updateDto || {};

    const idPresentacionFinal = cleanData.idPresentacion || presentacion?.id;
    if (idPresentacionFinal) {
      cleanData.idPresentacion = idPresentacionFinal;
    }

    return this.repository.update(id, cleanData);
  }

  async remove(id) {
    await this.findOne(id);
    return this.repository.remove(id);
  }
}
