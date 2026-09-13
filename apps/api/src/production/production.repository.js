/**
 * @file production.repository.js
 * @module Production/Repository
 * @description Repositorio de persistencia transaccional para órdenes de manufactura, explosión de materiales (BOM) y liquidación de costos.
 * @responsibility Administrar la creación de órdenes de producción con snapshots inmutables de receta, trazabilidad de lotes y redondeo de consumo discreto de empaques.
 * @usedBy apps/api/src/production/production.service.js
 * @dependencies @nestjs/common, apps/api/src/database/prisma.service.js
 */

import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

/**
 * Familias de unidades de medida discretas e indivisibles en planta.
 * Requieren redondeo estricto hacia arriba (Math.ceil) para evitar fraccionamiento físico en kardex.
 */
const UNIDADES_DISCRETAS = ['UNIDAD', 'UNIDADES', 'UND', 'PZA', 'PIEZA', 'VASO', 'BOTELLA', 'TAPA', 'ETIQUETA'];

const includeProduction = {
  detalles: {
    include: {
      insumo: true,
      productoIntermedio: {
        include: {
          presentacion: true,
          inventario: true
        }
      }
    }
  },
  lotes: {
    include: {
      lotePadre: true,
      lotesHijos: true
    }
  },
  producto: {
    include: {
      presentacion: true,
      inventario: true
    }
  }
};

@Injectable()
@Dependencies(PrismaService)
export class ProductionRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    return this.prisma.produccion.findMany({
      include: includeProduction,
      orderBy: { fechaProduccion: 'desc' }
    });
  }

  async findById(id) {
    return this.prisma.produccion.findUnique({
      where: { id },
      include: includeProduction
    });
  }

  async getRecipeBom(idReceta, cantidadProduccion, variantesQuery) {
    const receta = await this.prisma.receta.findUnique({
      where: { id: idReceta },
      include: {
        etapas: {
          where: { activo: true },
          include: {
            detalles: {
              where: { activo: true },
              include: {
                insumo: true,
                productoIntermedio: {
                  include: {
                    presentacion: true,
                    inventario: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!receta) throw new Error("Receta no encontrada");

    const variantes = variantesQuery ? variantesQuery.split(',') : [];
    const factorEscala = cantidadProduccion / (Number(receta.rendimientoBase) || 1);

    const bom = [];

    for (const etapa of receta.etapas) {
      for (const det of etapa.detalles) {
        if (det.esOpcional && !variantes.includes(det.grupoVariante)) {
          continue; // Skip optional items not in active variants
        }

        let reqTeorico = Number(det.cantidadRequerida) * factorEscala;
        const merma = Number(det.mermaPorcentaje) || 0;
        reqTeorico = reqTeorico * (1 + (merma / 100));

        const esUnidadDiscreta = UNIDADES_DISCRETAS.includes((det.unidad || '').toUpperCase().trim());
        const cantidadFinal = esUnidadDiscreta ? Math.ceil(reqTeorico) : Number(reqTeorico.toFixed(4));
        reqTeorico = cantidadFinal;

        if (det.idProductoIntermedio) {
          // Consultar inventario de producto intermedio / semielaborado WIP
          const invProd = await this.prisma.inventarioProducto.findUnique({
            where: { idProducto: det.idProductoIntermedio }
          });
          const stockActual = invProd ? Number(invProd.cantidadActual) : 0;
          const faltante = Math.max(0, reqTeorico - stockActual);

          // Buscar lote padre activo/disponible para costeo y trazabilidad
          const loteWip = await this.prisma.lote.findFirst({
            where: {
              idProducto: det.idProductoIntermedio,
              estado: 'DISPONIBLE',
              cantidadDisponible: { gt: 0 }
            },
            orderBy: { fechaProduccion: 'asc' } // FIFO
          });

          const costoUnitario = loteWip && Number(loteWip.costoUnitario) > 0
            ? Number(loteWip.costoUnitario)
            : (invProd && Number(invProd.costoPromedio) > 0 ? Number(invProd.costoPromedio) : 0);

          const costoTeorico = reqTeorico * costoUnitario;

          bom.push({
            idInsumo: null,
            idProductoIntermedio: det.idProductoIntermedio,
            nombreInsumo: det.productoIntermedio ? `${det.productoIntermedio.nombre} (Base / WIP)` : 'Producto Semielaborado',
            etapa: etapa.nombre,
            tipoInsumo: det.tipoInsumo || 'INTERMEDIO_WIP',
            requeridoTeorico: reqTeorico,
            unidad: det.unidad || 'Litros',
            stockActual: stockActual,
            faltante: faltante,
            ok: faltante === 0,
            costoTeorico: costoTeorico,
            costoUnitario: costoUnitario,
            esProductoIntermedio: true,
            idLoteSugerido: loteWip ? loteWip.id : null
          });
        } else {
          // Consultar inventario de insumo tradicional
          const inv = await this.prisma.inventario.findUnique({ where: { idInsumo: det.idInsumo } });
          const stockActual = inv ? Number(inv.cantidadActual) : 0;
          const faltante = Math.max(0, reqTeorico - stockActual);

          // Find cost from latest provider prices or inventory average
          const price = await this.prisma.precioProveedor.findFirst({
            where: { idInsumo: det.idInsumo, activo: true },
            orderBy: { fechaRegistro: 'desc' }
          });
          const costoUnitario = price
            ? Number(price.costoUnidadBase)
            : (inv && Number(inv.costoPromedio) > 0 ? Number(inv.costoPromedio) : 0);
          const costoTeorico = reqTeorico * costoUnitario;

          bom.push({
            idInsumo: det.idInsumo,
            idProductoIntermedio: null,
            nombreInsumo: det.insumo ? det.insumo.nombre : 'Insumo',
            etapa: etapa.nombre,
            tipoInsumo: det.tipoInsumo || 'BASE',
            requeridoTeorico: reqTeorico,
            unidad: det.unidad,
            stockActual: stockActual,
            faltante: faltante,
            ok: faltante === 0,
            costoTeorico: costoTeorico,
            costoUnitario: costoUnitario,
            esProductoIntermedio: false
          });
        }
      }
    }

    return bom;
  }

  async createWithTransaction(data) {
    return this.prisma.$transaction(async (prisma) => {
      // 1. Consultar receta técnica activa para congelar snapshot inmutable de fabricación
      const recetaActiva = await prisma.receta.findFirst({
        where: data.idReceta
          ? { id: data.idReceta }
          : { idProducto: data.idProducto, activo: true },
        include: {
          etapas: {
            where: { activo: true },
            orderBy: { orden: 'asc' },
            include: {
              detalles: {
                where: { activo: true },
                include: {
                  insumo: true,
                  productoIntermedio: true
                }
              }
            }
          }
        }
      });

      // 2. Estructurar snapshot técnico inmutable con tiempos, temperaturas e instrucciones de planta
      const snapshotReceta = recetaActiva ? {
        idRecetaOriginal: recetaActiva.id,
        nombreReceta: recetaActiva.nombre,
        rendimientoBase: Number(recetaActiva.rendimientoBase),
        unidadRendimiento: recetaActiva.unidadRendimiento,
        fechaSnapshot: new Date().toISOString(),
        etapas: recetaActiva.etapas.map(e => ({
          nombre: e.nombre,
          orden: e.orden,
          tiempoMinimoMin: e.tiempoMinimoMin,
          tiempoEstandarMin: e.tiempoEstandarMin,
          tiempoMaximoMin: e.tiempoMaximoMin,
          tempMinimaGrados: e.tempMinimaGrados ? Number(e.tempMinimaGrados) : null,
          tempMaximaGrados: e.tempMaximaGrados ? Number(e.tempMaximaGrados) : null,
          instrucciones: e.instrucciones,
          detalles: e.detalles.map(d => ({
            idInsumo: d.idInsumo,
            nombreInsumo: d.insumo?.nombre || null,
            idProductoIntermedio: d.idProductoIntermedio,
            nombreProductoIntermedio: d.productoIntermedio?.nombre || null,
            cantidadRequerida: Number(d.cantidadRequerida),
            unidad: d.unidad,
            mermaPorcentaje: Number(d.mermaPorcentaje),
            tipoInsumo: d.tipoInsumo,
            grupoVariante: d.grupoVariante,
            esOpcional: d.esOpcional
          }))
        }))
      } : null;

      // 3. Serializar metadatos y observaciones conservando cualquier nota manual previa
      let observacionesPayload = data.observaciones || '';
      if (snapshotReceta) {
        observacionesPayload = JSON.stringify({
          userNotes: data.observaciones || null,
          recipeSnapshot: snapshotReceta
        });
      }

      // 4. Crear orden de producción con cantidades discretas redondeadas y snapshot inmutable
      const produccion = await prisma.produccion.create({
        data: {
          fechaPlanificada: data.fechaPlanificada ? new Date(data.fechaPlanificada) : null,
          fechaProduccion: new Date(data.fechaProduccion),
          idProducto: data.idProducto,
          cantidadPlanificada: data.cantidadPlanificada,
          cantidadProducidaReal: data.cantidadProducidaReal || 0,
          estado: data.estado || 'PLANIFICADA',
          fechaVencimiento: data.fechaVencimiento ? new Date(data.fechaVencimiento) : null,
          observaciones: observacionesPayload,
          detalles: {
            create: data.detalles.map(d => {
              const esUnidadDiscreta = UNIDADES_DISCRETAS.includes((d.unidad || '').toUpperCase().trim());
              const cantTeorica = esUnidadDiscreta ? Math.ceil(Number(d.cantidadTeorica)) : Number(Number(d.cantidadTeorica).toFixed(4));
              return {
                idInsumo: d.idInsumo || null,
                idProductoIntermedio: d.idProductoIntermedio || null,
                cantidadTeorica: cantTeorica,
                unidad: d.unidad,
                costoTeorico: d.costoTeorico,
                cantidadRealUtilizada: null,
                costoReal: null,
                diferencia: null
              };
            })
          }
        },
        include: includeProduction
      });

      return produccion;
    });
  }

  async create(data) {
    return this.createWithTransaction(data);
  }

  async startProduction(id) {
    return this.prisma.$transaction(async (prisma) => {
      const produccion = await prisma.produccion.findUnique({
        where: { id },
        include: { detalles: true }
      });
      if (!produccion) throw new Error("Producción no encontrada");
      if (produccion.estado !== 'PLANIFICADA') throw new Error("Solo órdenes planificadas pueden iniciarse");

      for (const det of produccion.detalles) {
        if (det.idInsumo) {
          const inv = await prisma.inventario.findUnique({ where: { idInsumo: det.idInsumo } });
          const stock = inv ? Number(inv.cantidadActual) : 0;
          if (stock < Number(det.cantidadTeorica)) {
            throw new Error(`Stock insuficiente para el insumo ${det.idInsumo}`);
          }
        } else if (det.idProductoIntermedio) {
          const invProd = await prisma.inventarioProducto.findUnique({ where: { idProducto: det.idProductoIntermedio } });
          const stock = invProd ? Number(invProd.cantidadActual) : 0;
          if (stock < Number(det.cantidadTeorica)) {
            throw new Error(`Stock insuficiente para el producto intermedio/base ${det.idProductoIntermedio}`);
          }
        }
      }

      return prisma.produccion.update({
        where: { id },
        data: { estado: 'EN_PROCESO' },
        include: includeProduction
      });
    });
  }

  async createPurchaseOrderFromShortage(data) {
    const { itemsFaltantes } = data; // Array of { idInsumo, faltante }
    if (!itemsFaltantes || itemsFaltantes.length === 0) throw new Error("No hay items faltantes especificados");

    // Filtrar solo insumos comprables (no productos intermedios producidos internamente)
    const insumosFaltantes = itemsFaltantes.filter(f => f.idInsumo);
    if (insumosFaltantes.length === 0) {
      throw new Error("Los faltantes corresponden a bases intermedias fabricadas en planta; deben programarse en una orden de producción previa");
    }

    return this.prisma.$transaction(async (prisma) => {
      const oc = await prisma.ordenCompra.create({
        data: {
          codigo: `ORD-FALTANTE-${Date.now()}`,
          nombre: `Abastecimiento Automático por Faltante de Producción`,
          estado: 'PENDIENTE',
          items: {
            create: insumosFaltantes.map(f => ({
              idInsumo: f.idInsumo,
              cantidad: f.faltante,
              estadoItem: 'PENDIENTE'
            }))
          }
        },
        include: { items: true }
      });
      return oc;
    });
  }

  async completeProduction(id, data) {
    return this.prisma.$transaction(async (prisma) => {
      const produccion = await prisma.produccion.findUnique({
        where: { id },
        include: { detalles: true, producto: true }
      });

      if (!produccion) throw new Error("Producción no encontrada");
      if (produccion.estado === 'COMPLETADA') throw new Error("Producción ya completada");

      let costoTotalLote = 0;
      let idLotePadreDetectado = null;

      // Update production details and discount items (Insumos or Intermediate Products)
      for (const updateDet of data.detalles) {
        const det = produccion.detalles.find(d => d.id === updateDet.id);
        if (det) {
          const rawQty = Number(updateDet.cantidadRealUtilizada);
          const esUnidadDiscreta = UNIDADES_DISCRETAS.includes((det.unidad || '').toUpperCase().trim());
          const qtyReal = esUnidadDiscreta ? Math.ceil(rawQty) : Number(rawQty.toFixed(4));
          const diferencia = qtyReal - Number(det.cantidadTeorica);

          if (det.idInsumo) {
            // 1. Manejo de Insumo Tradicional
            const inv = await prisma.inventario.findUnique({ where: { idInsumo: det.idInsumo } });
            const stockAnterior = inv ? Number(inv.cantidadActual) : 0;
            const costoUnitarioInsumo = inv && Number(inv.costoPromedio) > 0
              ? Number(inv.costoPromedio)
              : (Number(det.costoTeorico) / (Number(det.cantidadTeorica) || 1) || 0);

            const costReal = qtyReal * costoUnitarioInsumo;
            costoTotalLote += costReal;

            await prisma.detalleProduccion.update({
              where: { id: det.id },
              data: {
                cantidadRealUtilizada: qtyReal,
                diferencia: diferencia,
                costoReal: costReal
              }
            });

            const stockNuevo = stockAnterior - qtyReal;

            await prisma.movimientoInventario.create({
              data: {
                idInsumo: det.idInsumo,
                tipoMovimiento: 'SALIDA_PRODUCCION',
                cantidad: qtyReal,
                stockAnterior: stockAnterior,
                stockNuevo: stockNuevo,
                costoUnitario: costoUnitarioInsumo,
                motivo: 'Consumo por orden de producción',
                operacionOrigen: produccion.id
              }
            });

            await prisma.inventario.upsert({
              where: { idInsumo: det.idInsumo },
              update: { cantidadActual: stockNuevo },
              create: { idInsumo: det.idInsumo, cantidadActual: stockNuevo }
            });

          } else if (det.idProductoIntermedio) {
            // 2. Manejo de Producto Intermedio / Semielaborado (WIP a granel)
            const invProd = await prisma.inventarioProducto.findUnique({
              where: { idProducto: det.idProductoIntermedio }
            });
            const stockAnterior = invProd ? Number(invProd.cantidadActual) : 0;
            const costoUnitarioIntermedio = invProd && Number(invProd.costoPromedio) > 0
              ? Number(invProd.costoPromedio)
              : (Number(det.costoTeorico) / (Number(det.cantidadTeorica) || 1) || 0);

            const costReal = qtyReal * costoUnitarioIntermedio;
            costoTotalLote += costReal;

            await prisma.detalleProduccion.update({
              where: { id: det.id },
              data: {
                cantidadRealUtilizada: qtyReal,
                diferencia: diferencia,
                costoReal: costReal
              }
            });

            const stockNuevo = stockAnterior - qtyReal;

            // Descontar inventario de producto intermedio
            await prisma.inventarioProducto.upsert({
              where: { idProducto: det.idProductoIntermedio },
              update: { cantidadActual: stockNuevo },
              create: { idProducto: det.idProductoIntermedio, cantidadActual: stockNuevo, costoPromedio: costoUnitarioIntermedio }
            });

            // Registrar movimiento de inventario de salida para el semielaborado
            await prisma.movimientoInventario.create({
              data: {
                idProducto: det.idProductoIntermedio,
                tipoMovimiento: 'SALIDA_PRODUCCION_WIP',
                cantidad: qtyReal,
                stockAnterior: stockAnterior,
                stockNuevo: stockNuevo,
                costoUnitario: costoUnitarioIntermedio,
                motivo: `Consumo de base semielaborada en producción ${produccion.id}`,
                operacionOrigen: produccion.id
              }
            });

            // Trazabilidad de Lote Padre: Buscar lote padre activo y deducir cantidad
            let lotePadre = null;
            if (updateDet.idLotePadre) {
              lotePadre = await prisma.lote.findUnique({ where: { id: updateDet.idLotePadre } });
            } else {
              lotePadre = await prisma.lote.findFirst({
                where: {
                  idProducto: det.idProductoIntermedio,
                  cantidadDisponible: { gt: 0 }
                },
                orderBy: { fechaProduccion: 'asc' } // FIFO
              });
            }

            if (lotePadre) {
              idLotePadreDetectado = lotePadre.id;
              const nuevaCantDisponible = Math.max(0, Number(lotePadre.cantidadDisponible) - qtyReal);
              const nuevoEstado = nuevaCantDisponible === 0 ? 'AGOTADO' : lotePadre.estado;

              await prisma.lote.update({
                where: { id: lotePadre.id },
                data: {
                  cantidadDisponible: nuevaCantDisponible,
                  estado: nuevoEstado
                }
              });
            }
          }
        }
      }

      const qtyProducida = Number(data.cantidadProducidaReal) || Number(produccion.cantidadPlanificada);
      const costoUnitarioFabricacion = qtyProducida > 0 ? costoTotalLote / qtyProducida : 0;

      // Update main production status
      const fechaVencimientoFinal = data.fechaVencimiento
        ? new Date(data.fechaVencimiento)
        : (produccion.fechaVencimiento
            ? new Date(produccion.fechaVencimiento)
            : new Date(Date.now() + (produccion.producto?.diasVidaUtil ?? 21) * 86400000));

      await prisma.produccion.update({
        where: { id },
        data: {
          estado: 'COMPLETADA',
          cantidadProducidaReal: qtyProducida,
          fechaProduccion: new Date(),
          fechaVencimiento: fechaVencimientoFinal
        }
      });

      // Determinar si es producto intermedio o producto terminado
      const esIntermedio = produccion.producto?.categoria === 'INTERMEDIO_WIP';
      const tipoLoteGenerado = esIntermedio ? 'SEMIELABORADO_WIP' : 'PRODUCTO_TERMINADO';

      // Generate Lot with ancestry (idLotePadre)
      const lote = await prisma.lote.create({
        data: {
          tipoLote: tipoLoteGenerado,
          idProduccion: produccion.id,
          idProducto: produccion.idProducto,
          idLotePadre: idLotePadreDetectado || null,
          fechaProduccion: new Date(),
          fechaVencimiento: fechaVencimientoFinal,
          cantidadInicial: qtyProducida,
          cantidadDisponible: qtyProducida,
          unidad: esIntermedio ? 'Litros' : 'UNIDAD',
          estado: 'DISPONIBLE',
          costoUnitario: costoUnitarioFabricacion
        }
      });

      await prisma.produccion.update({
        where: { id },
        data: { idLote: lote.id }
      });

      // Upsert Finished or Intermediate Product Inventory
      const invProd = await prisma.inventarioProducto.findUnique({ where: { idProducto: produccion.idProducto } });
      const stockAnteriorProd = invProd ? Number(invProd.cantidadActual) : 0;
      const stockNuevoProd = stockAnteriorProd + qtyProducida;

      // Calculate new weighted average cost
      let nuevoCostoPromedio = costoUnitarioFabricacion;
      if (invProd && stockAnteriorProd > 0) {
        const valorAnterior = stockAnteriorProd * Number(invProd.costoPromedio || 0);
        const valorNuevo = qtyProducida * costoUnitarioFabricacion;
        nuevoCostoPromedio = (valorAnterior + valorNuevo) / stockNuevoProd;
      }

      await prisma.inventarioProducto.upsert({
        where: { idProducto: produccion.idProducto },
        update: { cantidadActual: stockNuevoProd, costoPromedio: nuevoCostoPromedio },
        create: { idProducto: produccion.idProducto, cantidadActual: stockNuevoProd, costoPromedio: nuevoCostoPromedio }
      });

      // Insert Movement for Generated Product
      await prisma.movimientoInventario.create({
        data: {
          idProducto: produccion.idProducto,
          tipoMovimiento: 'ENTRADA_PRODUCCION',
          cantidad: qtyProducida,
          stockAnterior: stockAnteriorProd,
          stockNuevo: stockNuevoProd,
          costoUnitario: costoUnitarioFabricacion,
          motivo: esIntermedio ? 'Ingreso a tanque de base semielaborada' : 'Ingreso a cava de producto terminado',
          operacionOrigen: produccion.id
        }
      });

      return prisma.produccion.findUnique({
        where: { id },
        include: includeProduction
      });
    });
  }
}
