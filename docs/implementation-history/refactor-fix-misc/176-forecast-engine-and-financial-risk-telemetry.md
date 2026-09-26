**Nombre del archivo:**

`apps/prompts/implememtacion/frontend/06-analytics-engine/176-forecast-engine-and-financial-risk-telemetry.md`

---

**Prompt 176:**

```markdown
# IMPLEMENTACIÓN DEL MOTOR DE FORECAST A 7 DÍAS, VELOCIDAD DE VENTAS E IMPACTO ECONÓMICO EN ALARMAS (FASES C Y E)

REGLAS DE MÁXIMO AHORRO DE CUOTA Y ARQUITECTURA:
- Desacoplamiento total: crea `apps/api/src/dashboard/forecast.engine.service.js` para proyecciones y estimación de demanda a 7 días sin sobrecargar el servicio base[cite: 1].
- Modifica `apps/api/src/dashboard/dashboard.service.js`, `apps/api/src/dashboard/dashboard.module.js`, `apps/web/src/app/dashboard/page.jsx` y `apps/web/src/app/dashboard/Dashboard.module.css`.
- CERO SCRIPTS TEMPORALES: escribe los archivos y cambios directamente sin crear archivos auxiliares (`fix.js`, `patch.js`).
- CERO TAILWIND: emplea CSS Modules nativos con la paleta MANNÁ (#182622, #F7F4EE, #CAD5B5, #C58A3E, #10B981, #EF4444).
- CERO SCROLL GLOBAL: conserva el viewport 100vh estricto en el dashboard principal.
- Cuantificación monetaria real: cada alarma debe calcular su impacto económico en pesos ($)[cite: 1]:
  * Lotes FEFO en riesgo: `cantidadDisponible * costoPromedio` (capital inmovilizado en riesgo de merma)[cite: 1].
  * Insumos bajo mínimo: `(stockMinimo - stockActual) * costoUnitario` (inversión requerida para reordenar)[cite: 1].
  * Finanzas/Cartera: monto adeudado en mora[cite: 1].

---

### 1. SERVICIO DE FORECASTING EN BACKEND (`apps/api/src/dashboard/forecast.engine.service.js`):
Crea el motor que calcula velocidad de salida, días de cobertura (DOI) y proyección de demanda para los próximos 7 días[cite: 1]:

```javascript
export class ForecastEngineService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  /**
   * Calcula métricas de demanda, velocidad diaria y proyección a 7 días por producto
   */
  async getWeeklyDemandForecast() {
    const now = new Date();
    const hace28Dias = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);

    const productos = await this.prisma.producto.findMany({
      where: { estado: 'ACTIVO' },
      include: {
        inventarioProducto: true,
        detallesVenta: {
          where: {
            venta: {
              fechaVenta: { gte: hace28Dias },
              estado: { not: 'ANULADO' }
            }
          },
          include: {
            venta: true
          }
        }
      }
    });

    return productos.map((prod) => {
      const stockActual = Number(prod.inventarioProducto?.cantidadActual || 0);
      const totalVendido28d = prod.detallesVenta.reduce(
        (acc, d) => acc + Number(d.cantidad || 0), 
        0
      );

      // Velocidad diaria promedio basada en las últimas 4 semanas
      const velocidadDiaria = totalVendido28d > 0 ? Number((totalVendido28d / 28).toFixed(2)) : 0.35;
      
      // Proyección a 7 días con ponderación de tendencia
      const demandaProyectada7d = Math.ceil(velocidadDiaria * 7);

      // Días de inventario restante (DOI)
      const diasCobertura = velocidadDiaria > 0 ? Math.round(stockActual / velocidadDiaria) : 99;

      // Detección de tendencia (últimos 7 días vs promedio 28d)
      const hace7Dias = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const ventasUltimos7d = prod.detallesVenta
        .filter(d => new Date(d.venta.fechaVenta) >= hace7Dias)
        .reduce((acc, d) => acc + Number(d.cantidad || 0), 0);

      const ritmoSemanalEsperado = velocidadDiaria * 7;
      let tendencia = 'ESTABLE';
      if (ventasUltimos7d > ritmoSemanalEsperado * 1.15) tendencia = 'ALZA';
      if (ventasUltimos7d < ritmoSemanalEsperado * 0.85) tendencia = 'BAJA';

      return {
        productoId: prod.id,
        nombre: prod.nombre,
        stockActual,
        velocidadDiaria,
        demandaProyectada7d,
        diasCobertura,
        tendencia,
        confianza: totalVendido28d > 10 ? 85 : 65
      };
    });
  }
}

```

---

### 2. INYECCIÓN DE IMPACTO ECONÓMICO EN ALARMAS SCADA (`apps/api/src/dashboard/dashboard.service.js`):

Modifica el método `getAlarmsData()` o la función que procesa las alertas para cuantificar el dinero en juego (`economicImpact`):

1. Para alertas de insumos con bajo stock:
```javascript
const deficit = Math.max(0, Number(insumo.stockMinimo) - Number(inv.cantidadActual));
const costoUnit = Number(inv.costoPromedio) || Number(insumo.preciosProveedor?.[0]?.costoUnidadBase) || 0;
const economicImpact = Math.round(deficit * costoUnit);

```


2. Para alertas FEFO de lotes próximos a caducar:
```javascript
const valorLote = Number(lote.cantidadDisponible) * Number(lote.costoUnitarioReal || lote.producto?.precioVenta * 0.5 || 0);
const economicImpact = Math.round(valorLote);

```


3. En el payload de cada alarma devuelta por `/api/v1/dashboard/alarms`:
```javascript
{
  id: item.id,
  level: item.level,
  channel: item.channel,
  title: item.title,
  detail: item.detail,
  action: item.action,
  economicImpact: economicImpact > 0 ? economicImpact : null,
  timestamp: new Date()
}

```



---

### 3. ACTUALIZACIÓN EN FRONTEND (`apps/web/src/app/dashboard/`):

#### A. En la Tarjeta de Telemetría de Productos (`page.jsx`):

Muestra debajo del tacómetro radial el forecast semanal y velocidad de consumo del producto seleccionado:

```jsx
{product.forecast && (
  <div className={styles.productForecastBar}>
    <span>Ventas: <strong>{product.forecast.velocidadDiaria} und/día</strong></span>
    <span>Demanda 7d: <strong>{product.forecast.demandaProyectada7d} unds</strong></span>
    <span>Cobertura: <strong>{product.forecast.diasCobertura} días</strong></span>
    <span className={styles.trendBadge} data-trend={product.forecast.tendencia}>
      {product.forecast.tendencia === 'ALZA' ? '▲ Alta Rotación' : product.forecast.tendencia === 'BAJA' ? '▼ Demanda Lenta' : '● Estable'}
    </span>
  </div>
)}

```

#### B. En el Modal y Lista de Alarmas SCADA (`page.jsx`):

Inserta el badge de impacto monetario en la tarjeta de cada alarma:

```jsx
{alarm.economicImpact && (
  <span className={styles.economicRiskBadge}>
    💰 Riesgo: ${alarm.economicImpact.toLocaleString()}
  </span>
)}

```

#### C. Estilos en `Dashboard.module.css`:

```css
/* Badge de Riesgo Económico en Alarmas */
.economicRiskBadge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background-color: #FEF2F2;
  border: 1px solid #FECACA;
  color: #991B1B;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  margin-top: 0.35rem;
  width: fit-content;
}

/* Barra de Forecast en Telemetría de Productos */
.productForecastBar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #FAF8F5;
  border: 1px solid #E5DFD5;
  border-radius: 6px;
  padding: 0.35rem 0.65rem;
  font-size: 0.68rem;
  color: #57534E;
  margin-top: 0.5rem;
}

.productForecastBar strong {
  color: #182622;
}

.trendBadge[data-trend="ALZA"] {
  color: #059669;
  font-weight: 700;
}

.trendBadge[data-trend="BAJA"] {
  color: #D97706;
  font-weight: 700;
}

.trendBadge[data-trend="ESTABLE"] {
  color: #6B7280;
}

```

---

### VALIDACIÓN:

1. Compila con `pnpm --filter api build` y `pnpm --filter web build --no-lint`.
2. Al abrir el modal de **Alarmas SCADA**:
* Cada advertencia de insumo o lote refleja su impacto económico cuantificado en pesos (ej. `💰 Riesgo: $ 450.000`).




3. En la tarjeta de **Telemetría de Productos**:
* Se observa la velocidad diaria de venta, la proyección esperada a 7 días y los días de cobertura real (DOI).




4. La vista SCADA completa mantiene el 100vh exacto sin barras de scroll en el navegador.

```

```