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

      // 3. Crear Compra con Detalles
      const newCompra = await prisma.compra.create({
        data: {
          idProveedor: idProveedorFinal,
          fechaCompra: data.fechaCompra ? new Date(data.fechaCompra) : new Date(),
          total: data.total,
          observaciones: obsFinal,
          estado: 'COMPLETADO',
          detalles: {
            create: data.detalles.map(d => ({
              idInsumo: d.idInsumo,
              cantidad: d.cantidad,
              precioUnitario: d.precioUnitario,
              subtotal: d.subtotal,
              presentacion: d.presentacion || 'N/A',
              empaques: d.empaques || d.cantidad,
              contenidoBase: d.contenidoBase || 1,
              unidadEmpaque: d.unidadEmpaque || 'Unidad',
              cantidadBaseTotal: d.cantidadBaseTotal || d.cantidad,
              costoBase: d.costoBase || d.precioUnitario,
              marca: d.marca || ''
            }))
          }
        },
        include: {
          detalles: true
        }
      });

      // 4. Actualizar Precios (Histórico e Insumo) e Inventarios
      for (const detalle of data.detalles) {
        // ... (truncated rest of logic, keep it exactly as it was originally)
        const currentInsumo = await prisma.insumo.findUnique({
          where: { id: detalle.idInsumo }
        });

        // 4.1 Update Insumo Stock and Cost
        if (currentInsumo) {
          const isLtsOrKgs = ['Lt', 'Lts', 'Kg', 'Kgs'].includes(currentInsumo.unidadBase);
          const costoUnidadBaseNumber = Number(detalle.costoBase);
          
          let updatedCost = Number(currentInsumo.costoUnidadBase);
          if (costoUnidadBaseNumber > 0) {
            updatedCost = costoUnidadBaseNumber;
          }

          let incrementStock = isLtsOrKgs 
            ? Number(detalle.cantidadBaseTotal) * 1000 
            : Number(detalle.cantidadBaseTotal);

          await prisma.insumo.update({
            where: { id: detalle.idInsumo },
            data: {
              stockActual: { increment: incrementStock },
              costoUnidadBase: updatedCost,
              ultimaCompra: new Date()
            }
          });
        }

        // 4.2 Record Precio Histórico
        await prisma.precioHistorico.create({
          data: {
            idInsumo: detalle.idInsumo,
            idProveedor: idProveedorFinal,
            idCompra: newCompra.id,
            fechaRegistro: new Date(),
            precioCompra: detalle.precioUnitario,
            presentacionCompra: detalle.presentacion || 'N/A',
            cantidadEquivalenteBase: detalle.contenidoBase || 1,
            costoUnidadBase: detalle.costoBase || detalle.precioUnitario,
            unidadBase: detalle.unidadEmpaque || 'Unidad',
            marca: detalle.marca || ''
          }
        });

        // 4.3 Upsert Supplier Link (PrecioProveedor)
        const provLink = await prisma.precioProveedor.findFirst({
          where: { idInsumo: detalle.idInsumo, idProveedor: idProveedorFinal }
        });
        
        if (provLink) {
          await prisma.precioProveedor.update({
            where: { id: provLink.id },
            data: {
              precioCompra: detalle.precioUnitario,
              presentacionCompra: detalle.presentacion || 'N/A',
              cantidadEquivalenteBase: detalle.contenidoBase || 1,
              ultimaActualizacion: new Date()
            }
          });
        } else {
          await prisma.precioProveedor.create({
            data: {
              idInsumo: detalle.idInsumo,
              idProveedor: idProveedorFinal,
              precioCompra: detalle.precioUnitario,
              presentacionCompra: detalle.presentacion || 'N/A',
              cantidadEquivalenteBase: detalle.contenidoBase || 1
            }
          });
        }
      }

      return newCompra;
    });
  }

  async simulate(data) {
    const itemsLiquidados = [];
    let subtotalGlobal = 0;

    for (const item of data.items) {
      let factorReal = item.factorReal ? parseFloat(item.factorReal) : 1;
      let unidadBase = item.unidadBase || 'Unidades';

      if (item.idPrecioProveedor && !item.factorReal) {
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

  async findActiveOrders() {
    try {
      const orders = await this.prisma.ordenCompra.findMany({
        where: {
          estado: { in: ['PENDIENTE', 'EN_PROCESO'] }
        },
        include: {
          items: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      return orders || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async createOrder(data) {
    return this.prisma.$transaction(async (prisma) => {
      const year = new Date().getFullYear();
      
      const lastOrder = await prisma.ordenCompra.findFirst({
        where: { codigo: { startsWith: `ORD-${year}-` } },
        orderBy: { createdAt: 'desc' }
      });
      
      let nextNumber = 1;
      if (lastOrder && lastOrder.codigo) {
        const parts = lastOrder.codigo.split('-');
        if (parts.length === 3) {
          nextNumber = parseInt(parts[2], 10) + 1;
        }
      } else {
        const count = await prisma.ordenCompra.count();
        nextNumber = count + 1;
      }
      
      const codigo = `ORD-${year}-${String(nextNumber).padStart(4, '0')}`;

      const itemsData = (data.items || []).map(item => {
        const cantidad = parseFloat(item.cantidad || item.cantidadSolicitada || 1);
        const precioEstimado = parseFloat(item.precioEstimado || item.precioEmpaque || item.precio || 0);
        
        const rawInsumoId = item.insumoId || item.idInsumo || item.id;
        const rawProveedorId = item.proveedorId || item.idProveedor;
        const rawPresentacionId = item.presentacionId || item.idPresentacion;

        return {
          idInsumo: (rawInsumoId === 'undefined' || rawInsumoId === '') ? null : (rawInsumoId || null),
          idProveedor: (rawProveedorId === 'undefined' || rawProveedorId === '') ? null : (rawProveedorId || null),
          idPresentacion: (rawPresentacionId === 'undefined' || rawPresentacionId === '') ? null : (rawPresentacionId || null),
          cantidad: isNaN(cantidad) ? 1 : cantidad,
          precioEstimado: isNaN(precioEstimado) ? 0 : precioEstimado,
          estadoItem: 'PENDIENTE'
        };
      });

      return prisma.ordenCompra.create({
        data: {
          codigo,
          nombre: data.nombre || `Lista de Compras #${nextNumber}`,
          estado: 'PENDIENTE',
          items: {
            create: itemsData
          }
        },
        include: { items: true }
      });
    });
  }

  async findOneOrder(id) {
    try {
      return await this.prisma.ordenCompra.findUnique({
        where: { id },
        include: { items: true }
      });
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async updateOrder(id, data) {
    return this.prisma.ordenCompra.update({
      where: { id },
      data: {
        nombre: data.nombre,
        estado: data.estado
      }
    });
  }

  async updateOrderItem(id, itemId, data) {
    return this.prisma.$transaction(async (prisma) => {
      const updatedItem = await prisma.ordenCompraItem.update({
        where: { id: itemId },
        data: { estadoItem: data.estadoItem }
      });

      // Check if all items in order are processed
      const allItems = await prisma.ordenCompraItem.findMany({
        where: { idOrden: id }
      });

      const allProcessed = allItems.every(i => i.estadoItem !== 'PENDIENTE');
      if (allProcessed) {
        await prisma.ordenCompra.update({
          where: { id },
          data: { estado: 'COMPLETADA' }
        });
      }

      return updatedItem;
    });
  }
}
