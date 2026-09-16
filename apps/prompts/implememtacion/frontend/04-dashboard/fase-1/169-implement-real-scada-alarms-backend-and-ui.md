# IMPLEMENTACIÓN DEL ENDPOINT REAL DE ALARMAS SCADA Y CONEXIÓN DINÁMICA CON EL FRONTEND

REGLAS DE ARQUITECTURA Y MODO BISTURÍ:
- Modifica exclusivamente los archivos backend `apps/api/src/dashboard/dashboard.service.js` y `dashboard.controller.js`, y los archivos frontend `apps/web/src/app/dashboard/page.jsx` y `apps/web/src/components/shell/Shell.jsx`.
- Cero Tailwind: conserva CSS Modules.
- Cero datos simulados/hardcodeados: las alertas deben provenir de consultas reales a Prisma ORM según los hallazgos de la auditoría.
- Si no hay contingencias activas, muestra un estado visual limpio ("Sin contingencias activas en Planta MANNÁ").

---

### 1. IMPLEMENTACIÓN EN BACKEND (`apps/api/src/dashboard/`)

#### A. En `dashboard.controller.js`:
Expón la nueva ruta HTTP GET:
```javascript
@Get('alarms')
async getAlarms() {
  return await this.dashboardService.getAlarms();
}

async getAlarms() {
  const now = new Date();
  const alarms = [];

  // 1. [CRÍTICA] Lotes Vencidos con Stock Disponible en Cava
  const expiredLots = await this.prisma.lote.findMany({
    where: {
      fechaVencimiento: { lt: now },
      cantidadDisponible: { gt: 0 }
    },
    include: {
      producto: true,
      insumo: true
    },
    take: 10
  });

  expiredLots.forEach((lot) => {
    const nombreItem = lot.producto?.nombre || lot.insumo?.nombre || 'Item sin identificar';
    const diasVencido = Math.max(1, Math.floor((now.getTime() - new Date(lot.fechaVencimiento).getTime()) / (1000 * 60 * 60 * 24)));
    alarms.push({
      id: `ALM-C02-${lot.id}`,
      level: 'CRITICAL',
      channel: 'CANAL 02 · CAVA / FEFO',
      title: `Lote vencido con stock disponible: ${nombreItem}`,
      detail: `Lote ${lot.codigoLote || lot.id.slice(0, 8)} venció hace ${diasVencido} día(s). Stock actual: ${Number(lot.cantidadDisponible)} und/kg.`,
      action: 'Bloquear inmediatamente en cava y generar orden de merma/desecho.',
      entityType: 'Lote',
      entityId: lot.id,
      timestamp: lot.fechaVencimiento
    });
  });

  // 2. [ADVERTENCIA] Insumos bajo Stock Mínimo (Punto de Reorden)
  const inventarios = await this.prisma.inventario.findMany({
    include: { insumo: true }
  });

  inventarios.forEach((inv) => {
    const stockActual = Number(inv.cantidadActual || 0);
    const stockMin = Number(inv.insumo?.stockMinimo || 0);
    if (inv.insumo && stockActual <= stockMin) {
      const isCritical = stockActual <= 0;
      alarms.push({
        id: `ALM-W01-${inv.id}`,
        level: isCritical ? 'CRITICAL' : 'WARNING',
        channel: 'CANAL 03 · SUMINISTROS',
        title: isCritical ? `Quiebre total de stock: ${inv.insumo.nombre}` : `Insumo bajo stock mínimo: ${inv.insumo.nombre}`,
        detail: `Stock actual: ${stockActual} ${inv.insumo.unidadBase || ''} (Mínimo requerido: ${stockMin}).`,
        action: 'Generar orden de compra inmediata al proveedor de suministro.',
        entityType: 'Insumo',
        entityId: inv.insumoId,
        timestamp: inv.fechaActualizacion || now
      });
    }
  });

  // 3. [ADVERTENCIA] Lotes Críticos Próximos a Vencer (FEFO <= 7 días)
  const sieteDiasMas = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const lotsExpiringSoon = await this.prisma.lote.findMany({
    where: {
      fechaVencimiento: {
        gte: now,
        lte: sieteDiasMas
      },
      cantidadDisponible: { gt: 0 }
    },
    include: {
      producto: true
    },
    take: 10
  });

  lotsExpiringSoon.forEach((lot) => {
    const diasRestantes = Math.max(0, Math.ceil((new Date(lot.fechaVencimiento).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    alarms.push({
      id: `ALM-W02-${lot.id}`,
      level: 'WARNING',
      channel: 'CANAL 02 · PLANTA / FEFO',
      title: `Riesgo FEFO: ${lot.producto?.nombre || 'Producto'} próximo a caducar`,
      detail: `Restan ${diasRestantes} días de vida útil. Stock comprometido: ${Number(lot.cantidadDisponible)} unidades.`,
      action: 'Priorizar despacho y rotación comercial inmediata de este lote.',
      entityType: 'Lote',
      entityId: lot.id,
      timestamp: lot.fechaVencimiento
    });
  });

  // 4. [ADVERTENCIA] Cuentas por Cobrar Vencidas (Mora Cartera)
  const overdueSales = await this.prisma.venta.findMany({
    where: {
      estado: { not: 'ANULADO' },
      saldoPendiente: { gt: 0 },
      fechaLimitePago: { lt: now }
    },
    include: { cliente: true },
    take: 10
  });

  overdueSales.forEach((v) => {
    const diasMora = Math.floor((now.getTime() - new Date(v.fechaLimitePago).getTime()) / (1000 * 60 * 60 * 24));
    alarms.push({
      id: `ALM-W04-${v.id}`,
      level: 'WARNING',
      channel: 'CANAL 01 · FINANZAS',
      title: `Cuenta por cobrar vencida: ${v.cliente?.nombre || 'Cliente'}`,
      detail: `Saldo pendiente: $${Number(v.saldoPendiente).toLocaleString()} con ${diasMora} días de mora.`,
      action: 'Contactar al cliente y suspender nuevos despachos a crédito.',
      entityType: 'Venta',
      entityId: v.id,
      timestamp: v.fechaLimitePago
    });
  });

  const criticalCount = alarms.filter(a => a.level === 'CRITICAL').length;
  const warningCount = alarms.filter(a => a.level === 'WARNING').length;

  return {
    generatedAt: now,
    summary: {
      critical: criticalCount,
      warning: warningCount,
      total: alarms.length
    },
    alarms
  };
}


{alarmsData.alarms && alarmsData.alarms.length > 0 ? (
  alarmsData.alarms.map((alarm) => (
    <div 
      key={alarm.id} 
      className={`${styles.alarmItem} ${alarm.level === 'CRITICAL' ? styles.alarmCritical : styles.alarmWarning}`}
    >
      <div className={styles.alarmStatusDot} />
      <div className={styles.alarmDetails}>
        <div className={styles.alarmMeta}>
          <span className={styles.alarmLevel}>{alarm.level === 'CRITICAL' ? 'CRÍTICA' : 'ADVERTENCIA'}</span>
          <span className={styles.alarmChannel}>{alarm.channel}</span>
          <span className={styles.alarmTime}>{new Date(alarm.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <strong className={styles.alarmMsg}>{alarm.title}</strong>
        <p className={styles.alarmDesc}>{alarm.detail}</p>
        <p className={styles.alarmAction}><strong>Protocolo:</strong> {alarm.action}</p>
      </div>
      <button type="button" className={styles.ackButton}>Inspeccionar</button>
    </div>
  ))
) : (
  <div className={styles.emptyAlarmsState}>
    <span className={styles.emptyAlarmsIcon}>🌿</span>
    <h4>Cero contingencias activas</h4>
    <p>Todos los silos, lotes y cuentas por cobrar operan dentro de los umbrales normales de Planta MANNÁ.</p>
  </div>
)}

