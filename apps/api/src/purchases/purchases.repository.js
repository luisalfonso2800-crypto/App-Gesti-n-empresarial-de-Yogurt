import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
@Dependencies(PrismaService)
export class PurchasesRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    return this.prisma.compra.findMany({
      include: { detalles: true }
    });
  }

  async findById(id) {
    return this.prisma.compra.findUnique({
      where: { id },
      include: { detalles: true }
    });
  }

  async createWithTransaction(data) {
    return this.prisma.$transaction(async (prisma) => {
      // 1. Manejar Proveedor nuevo si viene
      let idProveedorFinal = data.idProveedor;
      if (data.esNuevoProveedor) {
        const prov = await prisma.proveedor.create({
          data: {
            nombre: data.nuevoProveedor.nombre,
            nitCedula: data.nuevoProveedor.nitCedula,
            telefono: data.nuevoProveedor.telefono || null,
            nombreContacto: data.nuevoProveedor.personaContacto || null,
            activo: true,
          }
        });
        idProveedorFinal = prov.id;
      }

      // 2. Generar Consecutivo
      const count = await prisma.compra.count();
      const year = new Date().getFullYear();
      const consecutive = `CMP-${year}-${String(count + 1).padStart(4, '0')}`;
      
      const paymentConditionStr = data.condicion || 'CONTADO';
      
      const obsFinal = data.observaciones 
        ? `${consecutive} - Condición: ${paymentConditionStr} - ${data.observaciones}`
        : `${consecutive} - Condición: ${paymentConditionStr}`;

      // 3. Procesar Insumos (crear nuevos si es necesario)
      const detallesProcesados = [];
      for (const d of data.detalles) {
        let idInsumoFinal = d.idInsumo;
        
        if (d.esNuevoInsumo) {
          const ins = await prisma.insumo.create({
            data: {
              nombre: d.nuevoInsumo.nombre,
              categoria: d.nuevoInsumo.categoria || 'MATERIA_PRIMA',
              subcategoria: d.nuevoInsumo.categoria || 'MATERIA_PRIMA',
              marca: d.nuevoInsumo.marca || 'N/A',
              unidadBase: d.nuevoInsumo.unidadBase,
              stockMinimo: d.nuevoInsumo.stockMinimo || 0,
              activo: true
            }
          });
          idInsumoFinal = ins.id;
        }

        detallesProcesados.push({
          ...d,
          idInsumo: idInsumoFinal
        });
      }

      // 4. Crear la Compra
      const compra = await prisma.compra.create({
        data: {
          id: consecutive,
          idProveedor: idProveedorFinal,
          fechaCompra: new Date(data.fechaCompra || Date.now()),
          estado: data.estado || 'CONFIRMADA',
          total: data.total,
          observaciones: obsFinal,
          detalles: {
            create: detallesProcesados.map(d => ({
              idInsumo: d.idInsumo,
              cantidad: d.cantidad,
              precioUnitario: d.precioUnitario,
              subtotal: d.subtotal
            }))
          }
        },
        include: { detalles: true }
      });

      // 5. Inventarios y Precios
      if (compra.estado === 'CONFIRMADA') {
        for (const detalle of detallesProcesados) {
          const cantidadNetaBase = detalle.cantidadBaseTotal || (detalle.cantidad * (detalle.contenidoBase || 1));
          
          // Inventario
          const inv = await prisma.inventario.findUnique({ where: { idInsumo: detalle.idInsumo } });
          if (inv) {
            await prisma.inventario.update({
              where: { idInsumo: detalle.idInsumo },
              data: { cantidadActual: { increment: cantidadNetaBase } }
            });
          } else {
            await prisma.inventario.create({
              data: {
                idInsumo: detalle.idInsumo,
                cantidadActual: cantidadNetaBase
              }
            });
          }

          // Movimiento
          await prisma.movimientoInventario.create({
            data: {
              idInsumo: detalle.idInsumo,
              tipoMovimiento: 'ENTRADA',
              cantidad: cantidadNetaBase,
              motivo: 'ENTRADA_COMPRA',
              operacionOrigen: compra.id
            }
          });

          // Precio Proveedor (upsert)
          const precioExistente = await prisma.precioProveedor.findFirst({
            where: {
              idProveedor: idProveedorFinal,
              idInsumo: detalle.idInsumo,
              presentacionCompra: detalle.presentacion || 'N/A'
            }
          });

          const costoUnidadBaseCalculado = detalle.costoBase || (detalle.precioUnitario / (detalle.contenidoBase || 1));

          if (precioExistente) {
            await prisma.precioProveedor.update({
              where: { id: precioExistente.id },
              data: {
                precioCompra: detalle.precioUnitario,
                costoUnidadBase: costoUnidadBaseCalculado,
                fechaUltimaCompra: new Date()
              }
            });
          } else {
            await prisma.precioProveedor.create({
              data: {
                idProveedor: idProveedorFinal,
                idInsumo: detalle.idInsumo,
                presentacionCompra: detalle.presentacion || 'N/A',
                cantidadPresentacion: detalle.cantidad || 1,
                unidadPresentacion: detalle.unidadEmpaque || 'UNIDAD',
                cantidadEquivalenteBase: detalle.contenidoBase || 1,
                precioCompra: detalle.precioUnitario,
                costoUnidadBase: costoUnidadBaseCalculado,
                fechaUltimaCompra: new Date()
              }
            });
          }
        }
      }
      return compra;
    });
  }

  async simulate(data) {
    const itemsLiquidados = [];
    let subtotalGlobal = 0;

    for (const item of data.items) {
      let factorReal = 1;
      let unidadBase = 'Unidades';

      if (item.idPrecioProveedor) {
        const precioProv = await this.prisma.precioProveedor.findUnique({
          where: { id: item.idPrecioProveedor },
          include: { insumo: true }
        });
        
        if (precioProv) {
          factorReal = parseFloat(precioProv.cantidadEquivalenteBase || 1);
          unidadBase = precioProv.insumo?.unidadBase || unidadBase;
        }
      }

      const ingresoNetoBodega = item.cantidadEmpaques * factorReal;
      const subtotal = item.cantidadEmpaques * item.precioEmpaque;
      const costoBaseUnitario = item.precioEmpaque / factorReal;

      subtotalGlobal += subtotal;

      itemsLiquidados.push({
        idPrecioProveedor: item.idPrecioProveedor,
        subtotal,
        ingresoNetoBodega,
        costoBaseUnitario,
        unidadBase
      });
    }

    return {
      subtotalGlobal,
      itemsLiquidados
    };
  }
}
