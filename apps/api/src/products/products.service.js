import { Injectable, Dependencies, NotFoundException, ConflictException } from '@nestjs/common';
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

  async findIntermediates() {
    return this.repository.findIntermediates();
  }

  async findForSaleSelector() {
    return this.repository.findForSaleSelector();
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
      stockLitros,
      stockCava,
      stockActual,
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

    const relCounts = await this.repository.countDependencies(id);
    const counts = relCounts?._count || {};
    const totalDependencies =
      (counts.recetas || 0) +
      (counts.producciones || 0) +
      (counts.lotes || 0) +
      (counts.detalleVentas || 0) +
      (counts.movimientos || 0) +
      (counts.recetasConsumo || 0) +
      (counts.detallesProduccionConsumo || 0);

    if (totalDependencies > 0) {
      throw new ConflictException(
        'No se puede eliminar el producto porque cuenta con historial operativo o recetas asociadas. En su lugar, desactívelo.'
      );
    }

    await this.repository.hardDelete(id);
    return { success: true, message: 'Producto eliminado exitosamente' };
  }
}
