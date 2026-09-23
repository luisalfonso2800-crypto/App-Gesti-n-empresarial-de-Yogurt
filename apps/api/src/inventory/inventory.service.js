import { Injectable, Dependencies, NotFoundException } from '@nestjs/common';
import { InventoryRepository } from './inventory.repository';
import { UnitConverter } from '../common/utils/unit-converter';
import { normalizeUnit, getFactor } from '../common/units/unit-registry.js';

@Injectable()
@Dependencies(InventoryRepository)
export class InventoryService {
  constructor(repository) {
    this.repository = repository;
  }

  async findAll() {
    const data = await this.repository.findAll();
    
    const enriched = data.map(item => {
      let costoUnitario = Number(item.costoPromedio) || 0;

      if (!costoUnitario && item.insumo?.precios?.length > 0) {
        const sortedPrices = [...item.insumo.precios].sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro));
        costoUnitario = Number(sortedPrices[0].costoUnidadBase) || 0;
      }

      const stockActual = Number(item.cantidadActual) || 0;
      // HAL-F1-03: Eliminar heurística monetaria 'costoUnitario > 100'. El costo ya representa el valor por unidad base.
      const valorTotal = Math.round(stockActual * costoUnitario);

      const stockMinimo = Number(item.insumo?.stockMinimo) || 0;
      
      let estado = 'OPTIMO';
      if (stockActual <= 0) estado = 'CRITICO';
      else if (stockActual <= stockMinimo) estado = 'BAJO';

      return { ...item, stockActual, stockMinimo, costoUnitario, valorTotal, estado };
    });

    const metadata = {
      valorTotalBodega: enriched.reduce((acc, curr) => acc + curr.valorTotal, 0),
      totalCriticos: enriched.filter(i => i.estado === 'CRITICO').length,
      totalBajoMinimo: enriched.filter(i => i.estado === 'BAJO').length,
      totalReferencias: enriched.length
    };

    return { data: enriched, metadata };
  }

  async findFinishedProducts() {
    return this.repository.findFinishedProducts();
  }

  async findWipLots() {
    return this.repository.findWipLots();
  }

  async findByInsumo(idInsumo) {
    const item = await this.repository.findByInsumo(idInsumo);
    if (!item) throw new NotFoundException('Inventory not found');
    return item;
  }

  async findMovements(idInsumo) {
    return this.repository.findMovements(idInsumo);
  }

  async adjustInventory(body) {
    if (!body.motivo && ['AJUSTE_NEGATIVO', 'MERMA_DESPERDICIO'].includes(body.tipo)) {
      throw new Error('Motivo es obligatorio para salidas y mermas');
    }
    return this.repository.adjustInventory(body);
  }
}
