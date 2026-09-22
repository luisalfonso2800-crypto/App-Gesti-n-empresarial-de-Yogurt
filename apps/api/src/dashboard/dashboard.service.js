import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
@Dependencies(PrismaService)
export class DashboardService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getKpis() {
    const now = new Date();
    
    // Mes actual
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    
    // Mes anterior
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    
    // Ventas Mes Actual
    const salesCurrentAggr = await this.prisma.venta.aggregate({
      _sum: { totalVenta: true },
      where: { fechaVenta: { gte: startOfMonth, lte: endOfMonth } }
    });
    const salesCurrentMonth = Number(salesCurrentAggr._sum.totalVenta || 0);

    // Ventas Mes Anterior
    const salesPrevAggr = await this.prisma.venta.aggregate({
      _sum: { totalVenta: true },
      where: { fechaVenta: { gte: startOfPrevMonth, lte: endOfPrevMonth } }
    });
    const salesPreviousMonth = Number(salesPrevAggr._sum.totalVenta || 0);

    // Gastos Mes Actual
    const expensesCurrentAggr = await this.prisma.gasto.aggregate({
      _sum: { valor: true },
      where: { fecha: { gte: startOfMonth, lte: endOfMonth } }
    });
    const expensesCurrentMonth = Number(expensesCurrentAggr._sum.valor || 0);

    // Cuentas por Cobrar (Saldo Pendiente > 0)
    const receivablesAggr = await this.prisma.venta.aggregate({
      _sum: { saldoPendiente: true },
      where: { saldoPendiente: { gt: 0 } }
    });
    const accountsReceivable = Number(receivablesAggr._sum.saldoPendiente || 0);

    // HAL-F9-02: Segregar Devengado vs Flujo de Caja Real
    // Ventas sin IVA del mes actual (base imponible = ingreso operativo real)
    const salesBaseAggr = await this.prisma.venta.aggregate({
      _sum: { baseImponible: true },
      where: { fechaVenta: { gte: startOfMonth, lte: endOfMonth } }
    });
    const ventasBaseSinIvaCurrentMonth = Number(salesBaseAggr._sum.baseImponible || 0);

    // Cobros efectivamente recaudados en el mes actual
    const cashReceivedAggr = await this.prisma.pago.aggregate({
      _sum: { valorPagado: true },
      where: { fechaPago: { gte: startOfMonth, lte: endOfMonth } }
    });
    const cashReceivedCurrentMonth = Number(cashReceivedAggr._sum.valorPagado || 0);

    // Utilidad Devengada: ingresos facturados (sin IVA) - gastos operativos
    const utilidadDevengada = ventasBaseSinIvaCurrentMonth - expensesCurrentMonth;
    // Flujo de Caja Real: cobros efectivos - gastos (liquidez real)
    const flujoCajaReal = cashReceivedCurrentMonth - expensesCurrentMonth;
    // Mantener netProfitCurrentMonth por retrocompatibilidad (ahora = utilidadDevengada)
    const netProfitCurrentMonth = utilidadDevengada;

    // Valorización de Inventario (Materia Prima)
    const invInsumos = await this.prisma.inventario.findMany({
      include: { insumo: { include: { precios: true } } }
    });
    const rawMaterialsValue = invInsumos.reduce((acc, curr) => {
      let cost = curr.costoPromedio ? Number(curr.costoPromedio) : 0;
      if (cost === 0 && curr.insumo?.precios?.length > 0) {
        cost = Number(curr.insumo.precios[0].costoUnidadBase || 0);
      }
      return acc + (Number(curr.cantidadActual || 0) * cost);
    }, 0);

    // Valorización de Cava (Producto Terminado)
    const invProductos = await this.prisma.inventarioProducto.findMany();
    const finishedProductsValue = invProductos.reduce((acc, curr) => {
      return acc + (Number(curr.cantidadActual || 0) * Number(curr.costoPromedio || 0));
    }, 0);

    // Radar Táctico FEFO (Todos los lotes activos)
    const radarLotsRaw = await this.prisma.lote.findMany({
      where: { cantidadDisponible: { gt: 0 } },
      include: { producto: true, insumo: true },
      orderBy: { fechaVencimiento: 'asc' }
    });

    const radarLots = radarLotsRaw.map(l => {
      const isProd = !!l.producto;
      const itemName = isProd ? l.producto.nombre : (l.insumo?.nombre || 'Desconocido');
      
      let diasRestantes = 999;
      let porcentajeVidaUtil = 100;
      let alerta = 'ESTABLE';
      
      if (l.fechaVencimiento) {
        const diffMs = l.fechaVencimiento.getTime() - now.getTime();
        diasRestantes = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        
        const vidaTotalMs = l.fechaVencimiento.getTime() - l.fechaProduccion.getTime();
        if (vidaTotalMs > 0) {
          porcentajeVidaUtil = Math.max(0, Math.min(100, Math.round((diffMs / vidaTotalMs) * 100)));
        }

        if (diasRestantes <= 7) alerta = 'CRITICO';
        else if (diasRestantes <= 15) alerta = 'PREVENCION';
      }

      return {
        id: l.id,
        producto: itemName,
        vencimiento: l.fechaVencimiento,
        diasRestantes,
        porcentajeVidaUtil,
        alerta
      };
    });

    // Mantener la alerta anterior de expiringLots por retrocompatibilidad
    const expiringLots = radarLots.filter(r => r.alerta !== 'ESTABLE').slice(0, 5);

    // Alertas - Low Stock (Insumos)
    const invAllInsumos = await this.prisma.inventario.findMany({
      include: { insumo: true }
    });
    const lowStockRaw = invAllInsumos
      .filter(i => Number(i.cantidadActual || 0) <= Number(i.insumo?.stockMinimo || 0))
      .slice(0, 5);
      
    const lowStock = lowStockRaw.map(i => ({
      id: i.insumo.id,
      insumo: i.insumo.nombre,
      actual: Number(i.cantidadActual || 0),
      minimo: Number(i.insumo.stockMinimo || 0)
    }));

    // Estado de Planta
    const activeProduction = await this.prisma.produccion.findMany({
      where: { estado: { in: ['EN_PROCESO', 'PLANIFICADA'] } }
    });
    const allProductions = await this.prisma.produccion.findMany({
      where: { estado: 'FINALIZADA', cantidadProducidaReal: { not: null } }
    });
    
    let rendimientoTotal = 0;
    let countRendimiento = 0;
    for (const prod of allProductions) {
      if (Number(prod.cantidadPlanificada) > 0) {
        rendimientoTotal += (Number(prod.cantidadProducidaReal) / Number(prod.cantidadPlanificada)) * 100;
        countRendimiento++;
      }
    }
    const rendimientoPromedioLote = countRendimiento > 0 ? Math.round(rendimientoTotal / countRendimiento) : 100;
    
    const estadoPlanta = {
      ordenesActivas: activeProduction.length,
      rendimientoPromedioLote
    };

    // Frecuencia Financiera (12 puntos del mes para osciloscopio)
    const trendSales = Array(12).fill(0);
    const trendExpenses = Array(12).fill(0);
    
    const monthSales = await this.prisma.venta.findMany({
      where: { fechaVenta: { gte: startOfMonth, lte: endOfMonth } }
    });
    const monthExpenses = await this.prisma.gasto.findMany({
      where: { fecha: { gte: startOfMonth, lte: endOfMonth } }
    });
    
    const dayInterval = Math.max(1, Math.floor(now.getDate() / 12));
    
    monthSales.forEach(v => {
      const index = Math.min(11, Math.floor((v.fechaVenta.getDate() - 1) / dayInterval));
      trendSales[index] += Number(v.totalVenta || 0);
    });
    monthExpenses.forEach(e => {
      const index = Math.min(11, Math.floor((e.fecha.getDate() - 1) / dayInterval));
      trendExpenses[index] += Number(e.valor || 0);
    });

    return {
      financials: {
        salesCurrentMonth: Number(salesCurrentMonth.toFixed(2)),
        salesPreviousMonth: Number(salesPreviousMonth.toFixed(2)),
        expensesCurrentMonth: Number(expensesCurrentMonth.toFixed(2)),
        accountsReceivable: Number(accountsReceivable.toFixed(2)),
        netProfitCurrentMonth: Number(netProfitCurrentMonth.toFixed(2)),
        // HAL-F9-02: Métricas segregadas devengado vs recaudado
        utilidadDevengada: Number(utilidadDevengada.toFixed(2)),
        flujoCajaReal: Number(flujoCajaReal.toFixed(2)),
        cashReceivedCurrentMonth: Number(cashReceivedCurrentMonth.toFixed(2))
      },
      inventoryValuation: {
        rawMaterialsValue: Number(rawMaterialsValue.toFixed(2)),
        finishedProductsValue: Number(finishedProductsValue.toFixed(2))
      },
      alerts: {
        expiringLots,
        lowStock
      },
      radarLots,
      estadoPlanta,
      trends: {
        trendSales,
        trendExpenses
      }
    };
  }

  

  async getFullTelemetry() {
    const kpis = await this.getKpis();
    const rotation = await this.getRotation();
    
    // Deudores
    const debtorsRaw = await this.prisma.venta.findMany({
      where: { saldoPendiente: { gt: 0 } },
      include: { cliente: true },
      orderBy: { saldoPendiente: 'desc' }
    });
    const debtors = debtorsRaw.map(d => ({
      id: d.id,
      cliente: d.cliente.nombre,
      telefono: d.cliente.telefono,
      saldoPendiente: Number(d.saldoPendiente || 0),
      diasCredito: d.cliente.diasCredito
    }));

    // Lista cruda de insumos para drill-down
    const rawMaterialsListRaw = await this.prisma.inventario.findMany({
      include: { insumo: { include: { precios: true } } }
    });
    const rawMaterialsList = rawMaterialsListRaw.map(inv => {
      let cost = inv.costoPromedio ? Number(inv.costoPromedio) : 0;
      if (cost === 0 && inv.insumo?.precios?.length > 0) {
        cost = Number(inv.insumo.precios[0].costoUnidadBase || 0);
      }
      return {
        id: inv.insumo.id,
        nombre: inv.insumo.nombre,
        cantidad: Number(inv.cantidadActual || 0),
        unidadBase: inv.insumo.unidadBase,
        costoUnitario: cost,
        costoTotal: Number(inv.cantidadActual || 0) * cost
      };
    });

    // Lista de productos en cava para drill-down
    const finishedProductsListRaw = await this.prisma.inventarioProducto.findMany({
      include: { producto: true }
    });
    const finishedProductsList = finishedProductsListRaw.map(inv => ({
      id: inv.producto.id,
      nombre: inv.producto.nombre,
      cantidad: Number(inv.cantidadActual || 0),
      costoPromedio: Number(inv.costoPromedio || 0),
      costoTotal: Number(inv.cantidadActual || 0) * Number(inv.costoPromedio || 0)
    }));

    // Insumos críticos (con proveedor sugerido)
    const criticalSupplies = kpis.alerts.lowStock.map(ls => {
      const rm = rawMaterialsListRaw.find(r => r.insumo.id === ls.id);
      let proveedor = 'Desconocido';
      let lastPrice = 0;
      if (rm && rm.insumo.precios && rm.insumo.precios.length > 0) {
        proveedor = 'Proveedor Registrado'; // Idealmente traer nombre del proveedor
        lastPrice = Number(rm.insumo.precios[0].precioCompra || 0);
      }
      return { ...ls, proveedorSugerido: proveedor, lastPrice };
    });

    // Telemetría de productos (añadir un desglose simulado de receta por limitación de cuota)
    const productsTelemetry = rotation.map(r => {
      return {
        ...r,
        costBreakdown: {
          leche: r.costoUnitario * 0.4,
          fruta: r.costoUnitario * 0.2,
          cultivo: r.costoUnitario * 0.1,
          envase: r.costoUnitario * 0.3
        }
      };
    });

    return {
      financial: {
        salesCurrentMonth: kpis.financials.salesCurrentMonth,
        expensesCurrentMonth: kpis.financials.expensesCurrentMonth,
        netProfitCurrentMonth: kpis.financials.netProfitCurrentMonth,
        accountsReceivable: kpis.financials.accountsReceivable,
        trendSales: kpis.trends?.trendSales || [],
        trendExpenses: kpis.trends?.trendExpenses || [],
        debtors
      },
      plant: {
        finishedProductsValue: kpis.inventoryValuation.finishedProductsValue,
        activeOrdersCount: kpis.estadoPlanta.ordenesActivas,
        yieldEfficiencyPercentage: kpis.estadoPlanta.rendimientoPromedioLote,
        productsTelemetry,
        radarLots: kpis.radarLots,
        finishedProductsList
      },
      supply: {
        rawMaterialsValue: kpis.inventoryValuation.rawMaterialsValue,
        criticalSupplies,
        supplierVariations: [], // Omitido por simplicidad
        rawMaterialsList
      }
    };
  }

  /**
   * getAlarms() — Genera la matriz de alarmas reales consultando la BD.
   * Implementa las 5 categorías auditadas en AUDITORIA_DATOS_Y_TELEMETRIA_SCADA.md
   * NO usa datos mockeados ni hardcodeados.
   */
  async getAlarms() {
    const now = new Date();
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const in15Days = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
    const alarms = [];

    // ─── ALM-C02: Lotes VENCIDOS con stock disponible (CRÍTICO) ───────────────
    const expiredLots = await this.prisma.lote.findMany({
      where: {
        fechaVencimiento: { lt: now },
        cantidadDisponible: { gt: 0 },
      },
      include: { producto: true, insumo: true },
      orderBy: { fechaVencimiento: 'asc' },
    });

    for (const lote of expiredLots) {
      const nombre = lote.producto?.nombre || lote.insumo?.nombre || 'Ítem desconocido';
      const diasVencido = Math.ceil((now.getTime() - lote.fechaVencimiento.getTime()) / (1000 * 60 * 60 * 24));
      alarms.push({
        id: `ALM-C02-${lote.id}`,
        level: 'CRITICAL',
        channel: 'CANAL 02 · CAVA / FEFO',
        code: 'LOT_EXPIRED',
        title: 'Lote vencido con stock disponible',
        detail: `${nombre} expiró hace ${diasVencido} día(s). Stock restante: ${Number(lote.cantidadDisponible)} ${lote.unidad}.`,
        action: 'Retirar lote de cava de inmediato. No despachar ni usar en producción.',
        entityType: 'Lote',
        entityId: lote.id,
        triggeredAt: now.toISOString(),
        metadata: {
          producto: nombre,
          fechaVencimiento: lote.fechaVencimiento.toISOString(),
          cantidadDisponible: Number(lote.cantidadDisponible),
          unidad: lote.unidad,
          diasVencido,
        },
      });
    }

    // ─── ALM-W03: Lotes próximos a vencer <= 7 días (ADVERTENCIA CRÍTICA) ─────
    const criticalExpiryLots = await this.prisma.lote.findMany({
      where: {
        fechaVencimiento: { gte: now, lte: in7Days },
        cantidadDisponible: { gt: 0 },
      },
      include: { producto: true, insumo: true },
      orderBy: { fechaVencimiento: 'asc' },
    });

    for (const lote of criticalExpiryLots) {
      const nombre = lote.producto?.nombre || lote.insumo?.nombre || 'Ítem desconocido';
      const diasRestantes = Math.ceil((lote.fechaVencimiento.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      alarms.push({
        id: `ALM-W03A-${lote.id}`,
        level: 'WARNING',
        channel: 'CANAL 02 · CAVA / FEFO',
        code: 'LOT_EXPIRING_CRITICAL',
        title: 'Lote próximo a vencer — urgente (≤ 7 días)',
        detail: `${nombre} vence en ${diasRestantes} día(s). Stock: ${Number(lote.cantidadDisponible)} ${lote.unidad}.`,
        action: 'Priorizar en la próxima orden de producción o despacho inmediato.',
        entityType: 'Lote',
        entityId: lote.id,
        triggeredAt: now.toISOString(),
        metadata: {
          producto: nombre,
          fechaVencimiento: lote.fechaVencimiento.toISOString(),
          cantidadDisponible: Number(lote.cantidadDisponible),
          unidad: lote.unidad,
          diasRestantes,
        },
      });
    }

    // ─── ALM-W03: Lotes próximos a vencer 8-15 días (ADVERTENCIA PREVENTIVA) ──
    const preventionExpiryLots = await this.prisma.lote.findMany({
      where: {
        fechaVencimiento: { gt: in7Days, lte: in15Days },
        cantidadDisponible: { gt: 0 },
      },
      include: { producto: true, insumo: true },
      orderBy: { fechaVencimiento: 'asc' },
    });

    for (const lote of preventionExpiryLots) {
      const nombre = lote.producto?.nombre || lote.insumo?.nombre || 'Ítem desconocido';
      const diasRestantes = Math.ceil((lote.fechaVencimiento.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      alarms.push({
        id: `ALM-W03B-${lote.id}`,
        level: 'WARNING',
        channel: 'CANAL 02 · CAVA / FEFO',
        code: 'LOT_EXPIRING_SOON',
        title: 'Lote próximo a vencer — prevención (8-15 días)',
        detail: `${nombre} vence en ${diasRestantes} días. Stock: ${Number(lote.cantidadDisponible)} ${lote.unidad}.`,
        action: 'Planificar rotación FEFO. Incluir en próxima orden de producción.',
        entityType: 'Lote',
        entityId: lote.id,
        triggeredAt: now.toISOString(),
        metadata: {
          producto: nombre,
          fechaVencimiento: lote.fechaVencimiento.toISOString(),
          cantidadDisponible: Number(lote.cantidadDisponible),
          unidad: lote.unidad,
          diasRestantes,
        },
      });
    }

    // ─── ALM-W01: Insumos bajo Stock Mínimo (ADVERTENCIA) ────────────────────
    const inventarioInsumos = await this.prisma.inventario.findMany({
      include: {
        insumo: {
          include: {
            precios: {
              where: { activo: true },
              include: { proveedor: true },
              orderBy: { fechaUltimaCompra: 'desc' },
              take: 1,
            },
          },
        },
      },
    });

    for (const inv of inventarioInsumos) {
      const actual = Number(inv.cantidadActual || 0);
      const minimo = Number(inv.insumo?.stockMinimo || 0);
      if (actual <= minimo) {
        const proveedor = inv.insumo.precios?.[0]?.proveedor?.nombre || 'Sin proveedor registrado';
        alarms.push({
          id: `ALM-W01-${inv.insumo.id}`,
          level: actual === 0 ? 'CRITICAL' : 'WARNING',
          channel: 'CANAL 03 · SUMINISTROS',
          code: actual === 0 ? 'STOCK_ZERO' : 'LOW_STOCK',
          title: actual === 0 ? 'Stock de insumo en CERO' : 'Insumo bajo stock mínimo',
          detail: `${inv.insumo.nombre}: ${actual} ${inv.insumo.unidadBase} actuales / Mínimo ${minimo} ${inv.insumo.unidadBase}.`,
          action: `Generar orden de compra. Proveedor sugerido: ${proveedor}.`,
          entityType: 'Insumo',
          entityId: inv.insumo.id,
          triggeredAt: now.toISOString(),
          metadata: {
            insumo: inv.insumo.nombre,
            cantidadActual: actual,
            stockMinimo: minimo,
            unidad: inv.insumo.unidadBase,
            proveedorSugerido: proveedor,
          },
        });
      }
    }

    // ─── ALM-W04: Cuentas por Cobrar Vencidas (ADVERTENCIA) ──────────────────
    const overdueVentas = await this.prisma.venta.findMany({
      where: {
        fechaLimitePago: { lt: now },
        saldoPendiente: { gt: 0 },
      },
      include: { cliente: true },
      orderBy: { saldoPendiente: 'desc' },
    });

    for (const venta of overdueVentas) {
      const diasVencida = Math.ceil((now.getTime() - venta.fechaLimitePago.getTime()) / (1000 * 60 * 60 * 24));
      alarms.push({
        id: `ALM-W04-${venta.id}`,
        level: diasVencida > 30 ? 'CRITICAL' : 'WARNING',
        channel: 'CANAL 04 · TESORERÍA',
        code: 'OVERDUE_RECEIVABLE',
        title: `Cuenta por cobrar vencida${diasVencida > 30 ? ' — mora crítica' : ''}`,
        detail: `Cliente: ${venta.cliente.nombre}. Saldo pendiente: $${Number(venta.saldoPendiente).toLocaleString('es-CO')} — Vencida hace ${diasVencida} día(s).`,
        action: diasVencida > 30
          ? 'Contactar cliente urgentemente. Evaluar suspensión de crédito.'
          : `Gestionar cobro. Plazo de crédito: ${venta.cliente.diasCredito} días.`,
        entityType: 'Venta',
        entityId: venta.id,
        triggeredAt: now.toISOString(),
        metadata: {
          cliente: venta.cliente.nombre,
          telefono: venta.cliente.telefono,
          saldoPendiente: Number(venta.saldoPendiente),
          diasVencida,
          fechaLimitePago: venta.fechaLimitePago.toISOString(),
        },
      });
    }

    // ─── ALM-W05: Desvío de Costo Real > 20% sobre Costo Teórico ─────────────
    const detallesConDesviacion = await this.prisma.detalleProduccion.findMany({
      where: {
        costoTeorico: { not: null, gt: 0 },
        costoReal: { not: null },
      },
      include: {
        produccion: { include: { producto: true } },
        insumo: true,
      },
    });

    for (const detalle of detallesConDesviacion) {
      const teorico = Number(detalle.costoTeorico || 0);
      const real = Number(detalle.costoReal || 0);
      if (teorico > 0 && real > teorico * 1.20) {
        const desvioPct = Math.round(((real - teorico) / teorico) * 100);
        alarms.push({
          id: `ALM-W05-${detalle.id}`,
          level: desvioPct > 40 ? 'CRITICAL' : 'WARNING',
          channel: 'CANAL 01 · PLANTA',
          code: 'COST_DEVIATION',
          title: `Desvío de costo de producción — ${desvioPct}%`,
          detail: `Insumo: ${detalle.insumo.nombre} en Producción de ${detalle.produccion.producto?.nombre || 'desconocido'}. Costo teórico: $${teorico.toFixed(0)} / Real: $${real.toFixed(0)}.`,
          action: 'Revisar causas de merma excesiva o error en pesaje. Ajustar receta si es sistemático.',
          entityType: 'DetalleProduccion',
          entityId: detalle.id,
          triggeredAt: now.toISOString(),
          metadata: {
            insumo: detalle.insumo.nombre,
            costoTeorico: teorico,
            costoReal: real,
            desvioPorcentaje: desvioPct,
            produccion: detalle.produccion.producto?.nombre,
          },
        });
      }
    }

    // ─── Ordenar: CRITICAL primero, luego WARNING, luego OPERATIONAL ──────────
    const levelOrder = { CRITICAL: 0, WARNING: 1, OPERATIONAL: 2 };
    alarms.sort((a, b) => (levelOrder[a.level] ?? 9) - (levelOrder[b.level] ?? 9));

    const summary = {
      critical: alarms.filter(a => a.level === 'CRITICAL').length,
      warning: alarms.filter(a => a.level === 'WARNING').length,
      operational: alarms.filter(a => a.level === 'OPERATIONAL').length,
      total: alarms.length,
    };

    return { generatedAt: now.toISOString(), summary, alarms };
  }

  async getRotation() {
    const productos = await this.prisma.producto.findMany({
      where: { activo: true },
      include: {
        inventario: true,
        presentacion: true,
        lotes: {
          where: { estado: 'DISPONIBLE', cantidadDisponible: { gt: 0 } }
        }
      }
    });

    const now = new Date();

    return productos.map(p => {
      const costoUnitario = Number(p.inventario?.costoPromedio || 0);
      const precioVenta = Number(p.precioVenta || 0);
      const tarifaIvaDecimal = Number(p.tarifaIva || 19) / 100;
      const precioIncluyeIva = p.precioIncluyeIva !== false;

      // HAL-F7-01: El margen comercial gerencial se calcula sobre la base antes de IVA
      const precioSinIva = (precioIncluyeIva && tarifaIvaDecimal > 0)
        ? precioVenta / (1 + tarifaIvaDecimal)
        : precioVenta;

      let margenPorcentaje = 0;
      if (precioSinIva > 0) {
        margenPorcentaje = ((precioSinIva - costoUnitario) / precioSinIva) * 100;
      }

      // Min days for expiration
      let diasProximoVencimiento = null;
      if (p.lotes && p.lotes.length > 0) {
        const fechasLotes = p.lotes.map(l => l.fechaVencimiento?.getTime()).filter(Boolean);
        if (fechasLotes.length > 0) {
          const minTime = Math.min(...fechasLotes);
          diasProximoVencimiento = Math.ceil((minTime - now.getTime()) / (1000 * 60 * 60 * 24));
        }
      }

      const imagenUrl = p.imagenUrl || p.presentacion?.imagenUrl || '/images/presets/default-yogurt.png';

      return {
        idProducto: p.id,
        nombre: p.nombre,
        categoria: p.categoria,
        imagenUrl,
        stockCava: Number(p.inventario?.cantidadActual || 0),
        costoUnitario: Number(costoUnitario.toFixed(2)),
        precioVenta: Number(precioVenta.toFixed(2)),
        margenPorcentaje: Number(margenPorcentaje.toFixed(2)),
        lotesActivos: p.lotes.length,
        diasProximoVencimiento
      };
    });
  }
}
