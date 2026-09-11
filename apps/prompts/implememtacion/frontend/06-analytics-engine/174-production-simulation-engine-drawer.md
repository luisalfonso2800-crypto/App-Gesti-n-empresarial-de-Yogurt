Con la Fase 1 del Motor Analítico consolidada (costeo real desde recetas de Prisma, valorización viva de Cava y clasificación 4-Box en el avatar de telemetría sin romper el viewport de 100vh), el siguiente paso natural de la **Matriz Maestra** es activar el botón **`⚙ SIMULAR PRODUCCIÓN`** mediante el **Motor de Simulación ("What-If")**.

---

**Nombre del archivo:**

`apps/prompts/implememtacion/frontend/06-analytics-engine/177-production-simulation-engine-drawer.md`

---

**Prompt 177:**

```markdown
# IMPLEMENTACIÓN DEL MOTOR DE SIMULACIÓN "WHAT-IF" Y DRAWER TÁCTICO DE PRODUCCIÓN (FASE D)

REGLAS DE MÁXIMO AHORRO DE CUOTA Y ARQUITECTURA:
- Arquitectura desacoplada: crea `apps/api/src/dashboard/simulation.engine.service.js` y expón el endpoint `POST /api/v1/dashboard/simulate-batch`.
- Frontend: crea el drawer lateral táctico `SimulationDrawer.jsx` dentro de `apps/web/src/app/dashboard/components/` y enlaza el evento al botón existente `⚙ SIMULAR PRODUCCIÓN` en `page.jsx`.
- Viewport lock: el drawer debe deslizarse sobre el lateral derecho (ancho 580px, 100vh, z-index 1000) con scrollbar interno invisible, sin provocar desbordamiento en la pantalla principal.
- Cero Tailwind: emplea exclusivamente CSS Modules nativos en la paleta botánica MANNÁ (#182622, #F7F4EE, #CAD5B5, #C58A3E).

---

### 1. SERVICIO DE SIMULACIÓN EN BACKEND (`apps/api/src/dashboard/simulation.engine.service.js`):
Implementa el cálculo predictivo del escenario:

```javascript
export class SimulationEngineService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  /**
   * Simula la producción de X unidades de un producto
   * @param {string} productoId
   * @param {number} cantidadSimulada
   * @param {number} precioSimulado (opcional para simulación de margen)
   */
  async simulateBatch(productoId, cantidadSimulada, precioSimulado = null) {
    const producto = await this.prisma.producto.findUnique({
      where: { id: productoId },
      include: {
        recetas: {
          include: {
            detalles: {
              include: {
                insumo: {
                  include: { inventarios: true }
                }
              }
            }
          }
        }
      }
    });

    if (!producto || !producto.recetas?.[0]) {
      throw new Error('El producto no posee una receta activa configurada.');
    }

    const receta = producto.recetas[0];
    const rendimientoBase = Number(receta.rendimientoBase || 1);
    const factorEscala = cantidadSimulada / rendimientoBase;

    let costoTotalSimulado = 0;
    let esViable = true;
    const requerimientos = [];

    for (const det of receta.detalles) {
      const mermaFactor = 1 + (Number(det.mermaPorcentaje || 0) / 100);
      const cantidadNecesaria = Number(det.cantidadRequerida) * factorEscala * mermaFactor;
      
      const stockDisponible = Number(det.insumo.inventarios?.[0]?.cantidadActual || 0);
      const costoUnitario = Number(det.insumo.inventarios?.[0]?.costoPromedio || 0);
      const subtotalCosto = cantidadNecesaria * costoUnitario;
      
      costoTotalSimulado += subtotalCosto;
      const deficit = stockDisponible < cantidadNecesaria ? (cantidadNecesaria - stockDisponible) : 0;
      
      if (deficit > 0) esViable = false;

      requerimientos.push({
        insumoId: det.insumoId,
        nombre: det.insumo.nombre,
        unidad: det.insumo.unidadBase,
        cantidadNecesaria: Number(cantidadNecesaria.toFixed(2)),
        stockDisponible: Number(stockDisponible.toFixed(2)),
        deficit: Number(deficit.toFixed(2)),
        alcanza: deficit === 0,
        subtotalCosto: Math.round(subtotalCosto)
      });
    }

    const precioVentaEfectivo = precioSimulado ? Number(precioSimulado) : Number(producto.precioVenta || 0);
    const ingresoProyectado = precioVentaEfectivo * cantidadSimulada;
    const utilidadProyectada = ingresoProyectado - costoTotalSimulado;
    const margenProyectado = ingresoProyectado > 0 
      ? Number(((utilidadProyectada / ingresoProyectado) * 100).toFixed(1)) 
      : 0;

    return {
      producto: {
        id: producto.id,
        nombre: producto.nombre,
        precioVentaActual: Number(producto.precioVenta || 0)
      },
      escenario: {
        cantidadSimulada,
        precioAplicado: precioVentaEfectivo,
        esViable,
        ingresoProyectado: Math.round(ingresoProyectado),
        costoTotalSimulado: Math.round(costoTotalSimulado),
        costoUnitarioProyectado: Math.round(costoTotalSimulado / cantidadSimulada),
        utilidadProyectada: Math.round(utilidadProyectada),
        margenProyectado
      },
      requerimientos
    };
  }
}

```

---

### 2. EXPOSICIÓN EN API (`dashboard.controller.js` y `dashboard.service.js`):

1. Inyecta `SimulationEngineService` en `DashboardModule` y `DashboardService`.
2. Expón la ruta:
```javascript
@Post('simulate-batch')
async simulateBatch(@Body() body) {
  const { productoId, cantidadSimulada, precioSimulado } = body;
  return await this.simulationEngine.simulateBatch(productoId, Number(cantidadSimulada), precioSimulado);
}

```



---

### 3. FRONTEND: DRAWER TÁCTICO `SimulationDrawer.jsx`:

Ubícalo en `apps/web/src/app/dashboard/components/SimulationDrawer.jsx`:

* **Panel de Entrada:**
* Selector del producto a simular (precargando la lista de productos de telemetría).
* Control numérico para cantidad de unidades (por defecto 100, 250, 500 o manual).
* Slider opcional de variación de precio (-10%, 0%, +10%).


* **Panel de Resultados en Tiempo Real:**
* Indicador de viabilidad tipo semáforo: `● PRODUCCIÓN FACTIBLE` (verde) o `⚠ QUIEBRE DE STOCK` (rojo).
* 4 Tarjetas de impacto: Ingreso Proyectado, Costo Estimado, Utilidad Neta y Margen %.
* Tabla de balance de insumos: Lista de requerimientos indicando cantidad necesaria vs stock en silo y déficit en rojo si falta insumo.


* **Acción:**
* Botón `[Generar Orden de Producción]` (para fases posteriores) y `[✕ Cerrar Simulación]`.



---

### 4. VINCULACIÓN EN `page.jsx`:

* Al hacer clic en el botón superior derecho `⚙ SIMULAR PRODUCCIÓN`:
```jsx
<button 
  className={styles.simBtn} 
  onClick={() => setIsSimulationOpen(true)}
>
  ⚙ SIMULAR PRODUCCIÓN
</button>

```


* Renderiza el `<SimulationDrawer isOpen={isSimulationOpen} onClose={() => setIsSimulationOpen(false)} />`.

---

### VALIDACIÓN:

1. Compila la API y el cliente web (`pnpm --filter api build` y `pnpm --filter web build --no-lint`).
2. En `http://localhost:3000/dashboard`, haz clic en **`⚙ SIMULAR PRODUCCIÓN`**.
3. Se desplegará suavemente el drawer lateral derecho.
4. Al simular 500 unidades de *Yogur Tradicional Fresa*, el sistema desglosa los litros de leche y gramos de cultivo necesarios, indicando de inmediato si el stock actual en planta es suficiente y qué margen de ganancia proyecta.

```

---

**Alternativa directa:** Si prefieres ver primero los puntos de los lotes parpadeando en el radar circular del medio, podemos priorizar el **Paso 2B: Radar FEFO con Lotes Vivos en Canvas** para reflejar la vida útil restante de la cava en tiempo real[cite: 1]. ¿Ejecutamos el Drawer del Simulador o el Radar FEFO en vivo?

```

# CONEXIÓN DEL RADAR TÁCTICO FEFO CON LOTES REALES EN TIEMPO REAL (CANVAS 2D)

REGLAS DE ARQUITECTURA Y MODO BISTURÍ:
- Modifica exclusivamente `apps/api/src/dashboard/dashboard.service.js`, `apps/web/src/app/dashboard/components/RadarSweepCanvas.jsx` (o el componente canvas del radar FEFO) y `apps/web/src/app/dashboard/page.jsx`.
- Cero librerías externas de gráficos pesados: conserva la renderización nativa con Canvas HTML5 (2D context).
- Cero scroll: la vista panorámica debe mantenerse intacta en 100vh.
- Paleta MANNÁ: Fondo cabina `#182622`, barrido verde salvia `#CAD5B5` translúcido, blips según criticidad FEFO (Rojo `#EF4444`, Ámbar `#D97706`, Salvia `#10B981`).
- Los puntos (blips) del radar deben responder a los lotes reales consultados desde la tabla `Lote` en Prisma.

---

### 1. ALIMENTACIÓN DE LOTES VIVOS EN BACKEND (`apps/api/src/dashboard/dashboard.service.js`):
En el método que alimenta la telemetría del dashboard (`getFullTelemetry` o `getRadarLots`), asegura que la consulta a Prisma devuelva los lotes activos con stock:

```javascript
async getRadarFefoData() {
  const now = new Date();
  
  // Consulta lotes con stock disponible ordenados por vencimiento más próximo
  const lotes = await this.prisma.lote.findMany({
    where: {
      cantidadDisponible: { gt: 0 },
      fechaVencimiento: { not: null }
    },
    include: {
      producto: true
    },
    orderBy: {
      fechaVencimiento: 'asc'
    },
    take: 16 // Máximo 16 objetivos simultáneos para mantener legibilidad visual
  });

  return lotes.map((lote, index) => {
    const fVenc = new Date(lote.fechaVencimiento);
    const diasRestantes = Math.ceil((fVenc.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    // Normalización de distancia radial:
    // Centro = 0 días o vencido (peligro inminente).
    // Borde exterior = 30+ días restantes (lote fresco).
    const maxDias = 30;
    const distancia = Math.max(0.12, Math.min(1.0, diasRestantes / maxDias));
    
    // Distribución angular pseudo-balanceada por índice para evitar solapamientos
    const angulo = (index * (360 / Math.max(lotes.length, 1)) + 25) % 360;

    let severidad = 'OPTIMO';
    let color = '#10B981'; // Verde seguro
    if (diasRestantes <= 3) {
      severidad = 'CRITICO';
      color = '#EF4444'; // Rojo crítico
    } else if (diasRestantes <= 10) {
      severidad = 'ALERTA';
      color = '#D97706'; // Ámbar advertencia
    }

    return {
      id: lote.id,
      codigo: lote.codigoLote || lote.id.slice(0, 7),
      producto: lote.producto?.nombre || 'Lote Activo',
      cantidad: Number(lote.cantidadDisponible),
      diasRestantes,
      severidad,
      color,
      distancia, // 0.0 a 1.0 respecto al radio
      angulo: (angulo * Math.PI) / 180 // en radianes para Math.cos / Math.sin
    };
  });
}


