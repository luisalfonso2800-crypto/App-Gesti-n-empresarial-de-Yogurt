import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

const includeRecipe = {
  etapas: {
    where: { activo: true },
    orderBy: { orden: 'asc' },
    include: {
      detalles: {
        where: { activo: true },
        include: { insumo: true }
      }
    }
  },
  producto: true
};

@Injectable()
@Dependencies(PrismaService)
export class RecipesRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    return this.prisma.receta.findMany({
      include: includeRecipe
    });
  }

  async findActive() {
    return this.prisma.receta.findMany({
      where: { activo: true },
      include: includeRecipe
    });
  }

  async findById(id) {
    return this.prisma.receta.findUnique({
      where: { id },
      include: includeRecipe
    });
  }

  async create(data) {
    return this.prisma.$transaction(async (tx) => {
      const receta = await tx.receta.create({
        data: {
          idProducto: data.idProducto,
          nombre: data.nombre,
          rendimientoBase: data.rendimientoBase,
          unidadRendimiento: data.unidadRendimiento,
          activo: data.activo !== undefined ? data.activo : true,
          observaciones: data.observaciones,
          etapas: data.etapas ? {
            create: data.etapas.map((e, index) => {
              const insumosEnEtapa = new Set();
              return {
                nombre: e.nombre,
                orden: e.orden !== undefined ? e.orden : (index + 1),
                tiempoMinimoMin: e.tiempoMinimoMin,
                tiempoEstandarMin: e.tiempoEstandarMin,
                tiempoMaximoMin: e.tiempoMaximoMin,
                tempMinimaGrados: e.tempMinimaGrados,
                tempMaximaGrados: e.tempMaximaGrados,
                instrucciones: e.instrucciones,
                activo: e.activo !== undefined ? e.activo : true,
                detalles: e.detalles ? {
                  create: e.detalles.map(d => {
                    if (d.activo !== false) {
                      if (insumosEnEtapa.has(d.idInsumo)) {
                        throw new Error(`Insumo duplicado en la misma etapa: ${d.idInsumo}`);
                      }
                      insumosEnEtapa.add(d.idInsumo);
                    }
                    return {
                      idInsumo: d.idInsumo,
                      cantidadRequerida: d.cantidadRequerida,
                      unidad: d.unidad,
                      mermaPorcentaje: d.mermaPorcentaje,
                      esOpcional: d.esOpcional !== undefined ? d.esOpcional : false,
                      grupoVariante: d.grupoVariante,
                      tipoInsumo: d.tipoInsumo || 'BASE',
                      activo: d.activo !== undefined ? d.activo : true,
                      observaciones: d.observaciones
                    };
                  })
                } : undefined
              };
            })
          } : undefined
        },
        include: includeRecipe
      });
      return receta;
    });
  }

  async update(id, data) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Update cabecera
      await tx.receta.update({
        where: { id },
        data: {
          idProducto: data.idProducto,
          nombre: data.nombre,
          rendimientoBase: data.rendimientoBase,
          unidadRendimiento: data.unidadRendimiento,
          activo: data.activo,
          observaciones: data.observaciones
        }
      });

      if (data.etapas) {
        // Fetch existing stages and details to manage deactivations
        const existingEtapas = await tx.etapaReceta.findMany({
          where: { idReceta: id, activo: true },
          include: { detalles: { where: { activo: true } } }
        });

        const incomingEtapaIds = data.etapas.filter(e => e.id).map(e => e.id);
        const etapasToDeactivate = existingEtapas.filter(e => !incomingEtapaIds.includes(e.id));

        for (const e of etapasToDeactivate) {
          await tx.etapaReceta.update({
            where: { id: e.id },
            data: { activo: false }
          });
          // Also deactivate its children
          for (const d of e.detalles) {
            await tx.detalleReceta.update({
              where: { id: d.id },
              data: { activo: false }
            });
          }
        }

        for (const [index, etapa] of data.etapas.entries()) {
          let etapaId = etapa.id;
          if (etapaId) {
            await tx.etapaReceta.update({
              where: { id: etapaId },
              data: {
                nombre: etapa.nombre,
                orden: etapa.orden !== undefined ? etapa.orden : (index + 1),
                tiempoMinimoMin: etapa.tiempoMinimoMin,
                tiempoEstandarMin: etapa.tiempoEstandarMin,
                tiempoMaximoMin: etapa.tiempoMaximoMin,
                tempMinimaGrados: etapa.tempMinimaGrados,
                tempMaximaGrados: etapa.tempMaximaGrados,
                instrucciones: etapa.instrucciones,
                activo: etapa.activo
              }
            });
          } else {
            const newEtapa = await tx.etapaReceta.create({
              data: {
                idReceta: id,
                nombre: etapa.nombre,
                orden: etapa.orden !== undefined ? etapa.orden : (index + 1),
                tiempoMinimoMin: etapa.tiempoMinimoMin,
                tiempoEstandarMin: etapa.tiempoEstandarMin,
                tiempoMaximoMin: etapa.tiempoMaximoMin,
                tempMinimaGrados: etapa.tempMinimaGrados,
                tempMaximaGrados: etapa.tempMaximaGrados,
                instrucciones: etapa.instrucciones,
                activo: etapa.activo !== undefined ? etapa.activo : true
              }
            });
            etapaId = newEtapa.id;
          }

          if (etapa.detalles) {
            const existingDetalles = etapa.id ? (existingEtapas.find(e => e.id === etapa.id)?.detalles || []) : [];
            const incomingDetalleIds = etapa.detalles.filter(d => d.id).map(d => d.id);
            const detallesToDeactivate = existingDetalles.filter(d => !incomingDetalleIds.includes(d.id));

            for (const d of detallesToDeactivate) {
              await tx.detalleReceta.update({
                where: { id: d.id },
                data: { activo: false }
              });
            }

            const insumosEnEtapa = new Set();
            for (const det of etapa.detalles) {
              if (det.activo !== false) {
                if (insumosEnEtapa.has(det.idInsumo)) {
                  throw new Error(`Insumo duplicado en la misma etapa: ${det.idInsumo}`);
                }
                insumosEnEtapa.add(det.idInsumo);
              }

              if (det.id) {
                await tx.detalleReceta.update({
                  where: { id: det.id },
                  data: {
                    idInsumo: det.idInsumo,
                    cantidadRequerida: det.cantidadRequerida,
                    unidad: det.unidad,
                    mermaPorcentaje: det.mermaPorcentaje,
                    esOpcional: det.esOpcional,
                    grupoVariante: det.grupoVariante,
                    tipoInsumo: det.tipoInsumo,
                    activo: det.activo,
                    observaciones: det.observaciones
                  }
                });
              } else {
                await tx.detalleReceta.create({
                  data: {
                    idEtapaReceta: etapaId,
                    idInsumo: det.idInsumo,
                    cantidadRequerida: det.cantidadRequerida,
                    unidad: det.unidad,
                    mermaPorcentaje: det.mermaPorcentaje,
                    esOpcional: det.esOpcional !== undefined ? det.esOpcional : false,
                    grupoVariante: det.grupoVariante,
                    tipoInsumo: det.tipoInsumo || 'BASE',
                    activo: det.activo !== undefined ? det.activo : true,
                    observaciones: det.observaciones
                  }
                });
              }
            }
          }
        }
      }

      return tx.receta.findUnique({
        where: { id },
        include: includeRecipe
      });
    });
  }

  async remove(id) {
    return this.prisma.receta.update({
      where: { id },
      data: { activo: false }
    });
  }
}
