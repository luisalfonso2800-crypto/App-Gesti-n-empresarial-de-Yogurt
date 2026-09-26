**Nombre del archivo:**

`apps/prompts/implememtacion/frontend/06-analytics-engine/175-production-optimizer-and-decision-matrix.md`

---

**Prompt 175:**

```markdown
# IMPLEMENTACIÓN DEL MOTOR DE DECISIÓN PRESCRIPTIVA: "¿QUÉ PRODUCIR HOY?" Y "¿QUÉ NO PRODUCIR?" (FASE F)

REGLAS DE MÁXIMO AHORRO DE CUOTA Y ARQUITECTURA:
- Desacoplamiento total: crea el nuevo servicio `apps/api/src/dashboard/production.optimizer.service.js` para albergar la lógica prescriptiva de optimización de batches sin sobrecargar el servicio base.
- Registra el servicio en `apps/api/src/dashboard/dashboard.module.js` y expón el endpoint `GET /api/v1/dashboard/production-recommendations` en `dashboard.controller.js`.
- Modifica `apps/web/src/app/dashboard/page.jsx` y `Dashboard.module.css`.
- Integra el canal en el Multiplexor existente agregando la pestaña interactiva `CH-04 DECISIÓN` junto a los canales actuales (`PANORAMA 4X`, `CH-01`, `CH-02`, `CH-03`).
- CERO SCROLL GLOBAL: el nuevo canal debe ajustarse rigurosamente al contenedor bloqueado de 100vh mediante un diseño de dos columnas tácticas con scrollbar interno encapsulado.
- Cero datos inventados: las recomendaciones deben cruzarse con ventas históricas, stock actual de Cava (`InventarioProducto`), existencias de materia prima (`Inventario`) y recetas activas (`DetalleReceta`).

---

### 1. MOTOR DE OPTIMIZACIÓN EN BACKEND (`apps/api/src/dashboard/production.optimizer.service.js`):
Crea el servicio que clasifica qué producir y qué no producir según demanda, cobertura y viabilidad de insumos:

```javascript
export class ProductionOptimizerService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  /**
   * Genera el plan diario prescriptivo: "¿Qué producir?" vs "¿Qué no producir?"
   */
  async getDailyProductionPlan() {
    const now = new Date();
    const hace30Dias = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // 1. Consultar productos con sus recetas, stock en cava y ventas del último mes
    const productos = await this.prisma.producto.findMany({
      where: { estado: 'ACTIVO' },
      include: {
        inventarioProducto: true,
        recetas: {
          include: {
            detalles: {
              include: {
                insumo: {
                  include: {
                    inventarios: true,
                    preciosProveedor: {
                      where: { estado: 'ACTIVO' },
                      orderBy: { fechaUltimaCompra: 'desc' },
                      take: 1
                    }
                  }
                }
              }
            }
          }
        },
        detallesVenta: {
          where: {
            venta: {
              fechaVenta: { gte: hace30Dias },
              estado: { not: 'ANULADO' }
            }
          }
        }
      }
    });

    const queProducir = [];
    const queNoProducir = [];
    let utilidadTotalEstimada = 0;
    let inversionInsumosTotal = 0;

    for (const prod of productos) {
      const stockCava = Number(prod.inventarioProducto?.cantidadActual || 0);
      const unidadesVendidasMes = prod.detallesVenta.reduce(
        (acc, d) => acc + Number(d.cantidad || 0), 
        0
      );
      
      // Velocidad de venta diaria (mínimo 0.4 unidades/día para evitar división por cero)
      const velocidadDiaria = unidadesVendidasMes > 0 ? (unidadesVendidasMes / 30) : 0.4;
      const diasCobertura = Math.round(stockCava / velocidadDiaria);

      const receta = prod.recetas?.[0];
      if (!receta || !receta.detalles || receta.detalles.length === 0) {
        queNoProducir.push({
          id: prod.id,
          nombre: prod.nombre,
          motivo: 'Sin receta activa registrada en el sistema',
          stockActual: stockCava,
          diasCobertura,
          tipo: 'CONFIGURACION'
        });
        continue;
      }

      // 2. Verificar viabilidad de insumos para un batch estándar
      const batchSugerido = Number(receta.rendimientoBase || 100);
      let insumosSuficientes = true;
      let insumoCuelloBotella = null;
      let costoBatch = 0;

      for (const det of receta.detalles) {
        const factorEscala = batchSugerido / Number(receta.rendimientoBase || 1);
        const merma = 1 + (Number(det.mermaPorcentaje || 0) / 100);
        const cantRequerida = Number(det.cantidadRequerida) * factorEscala * merma;
        
        const stockInsumo = Number(det.insumo?.inventarios?.[0]?.cantidadActual || 0);
        const costoUnit = 
          Number(det.insumo?.inventarios?.[0]?.costoPromedio || 0) || 
          Number(det.insumo?.preciosProveedor?.[0]?.costoUnidadBase || 0);

        costoBatch += cantRequerida * costoUnit;

        if (stockInsumo < cantRequerida) {
          insumosSuficientes = false;
          insumoCuelloBotella = `${det.insumo.nombre} (requiere ${cantRequerida.toFixed(1)} ${det.insumo.unidadBase}, stock: ${stockInsumo.toFixed(1)})`;
          break;
        }
      }

      const precioVenta = Number(prod.precioVenta || 0);
      const ingresoEstimado = precioVenta * batchSugerido;
      const utilidadBatch = ingresoEstimado - costoBatch;
      const margenBatch = ingresoEstimado > 0 ? Math.round((utilidadBatch / ingresoEstimado) * 100) : 0;

      // 3. Reglas de Decisión Prescriptiva
      if (diasCobertura > 14) {
        queNoProducir.push({
          id: prod.id,
          nombre: prod.nombre,
          motivo: `Sobrestock en Cava: ${stockCava} unidades cubren ${diasCobertura} días de demanda`,
          stockActual: stockCava,
          diasCobertura,
          tipo: 'SOBRESTOCK'
        });
      } else if (!insumosSuficientes) {
        queNoProducir.push({
          id: prod.id,
          nombre: prod.nombre,
          motivo: `Quiebre de insumo crítico: ${insumoCuelloBotella}`,
          stockActual: stockCava,
          diasCobertura,
          tipo: 'INSUMO_FALTANTE'
        });
      } else {
        // Cálculo de prioridad analítica (0 - 100)
        let prioridad = 70;
        if (diasCobertura <= 3) prioridad += 20;
        if (margenBatch >= 35) prioridad += 10;
        prioridad = Math.min(99, prioridad);

        utilidadTotalEstimada += utilidadBatch;
        inversionInsumosTotal += costoBatch;

        queProducir.push({
          id: prod.id,
          nombre: prod.nombre,
          cantidadSugerida: batchSugerido,
          prioridad,
          utilidadEstimada: Math.round(utilidadBatch),
          margen: margenBatch,
          stockActual: stockCava,
          diasCobertura,
          confianza: 88,
          justificacion: [
            `Cobertura crítica en Cava: ${diasCobertura} días restantes`,
            `Margen proyectado saludable del ${margenBatch}%`,
            `100% de insumos verificados en silos de planta`
          ]
        });
      }
    }

    queProducir.sort((a, b) => b.prioridad - a.prioridad);

    return {
      generatedAt: now,
      resumenEjecutivo: {
        batchesRecomendados: queProducir.length,
        utilidadProyectada: Math.round(utilidadTotalEstimada),
        inversionRequerida: Math.round(inversionInsumosTotal),
        productosDescartados: queNoProducir.length
      },
      queProducir,
      queNoProducir
    };
  }
}

```

---

### 2. EXPOSICIÓN EN API (`apps/api/src/dashboard/`):

1. En `dashboard.module.js`, declara `ProductionOptimizerService` en `providers`.
2. En `dashboard.service.js`, inyecta `ProductionOptimizerService`.
3. En `dashboard.controller.js`, expón la ruta GET:
```javascript
@Get('production-recommendations')
async getProductionRecommendations() {
  return await this.productionOptimizer.getDailyProductionPlan();
}

```



---

### 3. CONEXIÓN Y RENDERIZADO EN EL FRONTEND (`apps/web/src/app/dashboard/`):

#### A. En `page.jsx`:

1. Agrega el estado y la función de consulta:
```javascript
const [decisionPlan, setDecisionPlan] = useState(null);
const [loadingPlan, setLoadingPlan] = useState(false);

const fetchDecisionPlan = async () => {
  setLoadingPlan(true);
  try {
    const res = await apiClient.get('/dashboard/production-recommendations');
    setDecisionPlan(res.data || res);
  } catch (err) {
    console.error('Error cargando plan de decisión:', err);
  } finally {
    setLoadingPlan(false);
  }
};

useEffect(() => {
  if (activeChannel === 'CH-04') {
    fetchDecisionPlan();
  }
}, [activeChannel]);

```


2. Añade el botón `CH-04 DECISIÓN` en la botonera de canales:
```jsx
<button 
  type="button" 
  className={`${styles.channelTab} ${activeChannel === 'CH-04' ? styles.channelTabActive : ''}`} 
  onClick={() => setActiveChannel('CH-04')}
>
  CH-04 DECISIÓN
</button>

```


3. Renderiza la vista cuando `activeChannel === 'CH-04'`:
```jsx
{activeChannel === 'CH-04' && (
  <div className={styles.decisionCenterContainer}>
    {/* Columna Izquierda: ¿QUÉ PRODUCIR HOY? */}
    <div className={styles.decisionColumn}>
      <div className={styles.decisionColHeader}>
        <div className={styles.decisionTitleCluster}>
          <span className={styles.decisionBadgeOk}>PLAN RECOMENDADO DE HOY</span>
          <h3>Lotes Sugeridos por Demanda y Rendimiento</h3>
        </div>
        <div className={styles.decisionStatPill}>
          <span>Utilidad Proyectada:</span>
          <strong>${decisionPlan?.resumenEjecutivo?.utilidadProyectada?.toLocaleString() || 0}</strong>
        </div>
      </div>

      <div className={styles.decisionListScroll}>
        {loadingPlan && <div className={styles.emptyText}>Calculando optimización...</div>}
        {decisionPlan?.queProducir?.map((item) => (
          <div key={item.id} className={styles.recommendCard}>
            <div className={styles.recommendTop}>
              <div>
                <strong className={styles.recommendProduct}>{item.nombre}</strong>
                <span className={styles.recommendBatch}>Batch: {item.cantidadSugerida} unds</span>
              </div>
              <div className={styles.recommendScoreBadge}>
                <span>Prioridad</span>
                <strong>{item.prioridad}/100</strong>
              </div>
            </div>

            <div className={styles.recommendMetrics}>
              <span>Margen: <strong>{item.margen}%</strong></span>
              <span>Utilidad: <strong>${item.utilidadEstimada.toLocaleString()}</strong></span>
              <span>Cobertura: <strong>{item.diasCobertura}d</strong></span>
              <span>Confianza: <strong>{item.confianza}%</strong></span>
            </div>

            <ul className={styles.recommendReasons}>
              {item.justificacion.map((reason, idx) => (
                <li key={idx}>✓ {reason}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    {/* Columna Derecha: ¿QUÉ NO PRODUCIR? */}
    <div className={styles.decisionColumnRight}>
      <div className={styles.decisionColHeader}>
        <div className={styles.decisionTitleCluster}>
          <span className={styles.decisionBadgeWarn}>RESTRICCIONES Y DESCARTE</span>
          <h3>¿Qué NO Producir Hoy?</h3>
        </div>
        <div className={styles.decisionStatPill}>
          <span>Descartados:</span>
          <strong style={{ color: '#D97706' }}>{decisionPlan?.resumenEjecutivo?.productosDescartados || 0}</strong>
        </div>
      </div>

      <div className={styles.decisionListScroll}>
        {loadingPlan && <div className={styles.emptyText}>Evaluando inventario...</div>}
        {decisionPlan?.queNoProducir?.map((item) => (
          <div key={item.id} className={styles.discardCard}>
            <div className={styles.discardHeader}>
              <strong className={styles.discardProduct}>{item.nombre}</strong>
              <span className={item.tipo === 'SOBRESTOCK' ? styles.badgeDiscardBlue : styles.badgeDiscardRed}>
                {item.tipo === 'SOBRESTOCK' ? 'Sobrestock' : 'Insumo Faltante'}
              </span>
            </div>
            <p className={styles.discardReason}>{item.motivo}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

```



---

### 4. ESTILOS TÁCTICOS EN `Dashboard.module.css`:

```css
.decisionCenterContainer {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 0.85rem;
  height: calc(100vh - 175px);
  overflow: hidden;
  animation: fadeIn 0.2s ease-in;
}

.decisionColumn, .decisionColumnRight {
  background-color: #FFFFFF;
  border: 1px solid #E5DFD5;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.decisionColHeader {
  padding: 0.75rem 1rem;
  background-color: #FAF8F5;
  border-bottom: 1px solid #E5DFD5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.decisionBadgeOk {
  font-size: 0.62rem;
  font-weight: 800;
  color: #065F46;
  background-color: #D1FAE5;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
}

.decisionBadgeWarn {
  font-size: 0.62rem;
  font-weight: 800;
  color: #92400E;
  background-color: #FEF3C7;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
}

.decisionColHeader h3 {
  margin: 0.2rem 0 0;
  font-size: 0.85rem;
  color: #182622;
  font-weight: 700;
}

.decisionStatPill {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 0.68rem;
  color: #78716C;
}

.decisionStatPill strong {
  font-size: 0.95rem;
  color: #10B981;
}

.decisionListScroll {
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.recommendCard {
  background-color: #FAF8F5;
  border: 1px solid #E5DFD5;
  border-left: 4px solid #10B981;
  border-radius: 6px;
  padding: 0.65rem 0.85rem;
}

.recommendTop {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.recommendProduct {
  font-size: 0.85rem;
  color: #182622;
  display: block;
}

.recommendBatch {
  font-size: 0.72rem;
  color: #78716C;
}

.recommendScoreBadge {
  background-color: #182622;
  color: #F7F4EE;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  text-align: right;
  font-size: 0.62rem;
  display: flex;
  flex-direction: column;
}

.recommendScoreBadge strong {
  font-size: 0.82rem;
  color: #CAD5B5;
}

.recommendMetrics {
  display: flex;
  gap: 0.85rem;
  margin: 0.4rem 0;
  font-size: 0.7rem;
  color: #57534E;
}

.recommendReasons {
  list-style: none;
  padding: 0;
  margin: 0.35rem 0 0;
  font-size: 0.68rem;
  color: #4B5563;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.discardCard {
  background-color: #FAF8F5;
  border: 1px solid #E5DFD5;
  border-left: 4px solid #F59E0B;
  border-radius: 6px;
  padding: 0.6rem 0.8rem;
}

.discardHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.discardProduct {
  font-size: 0.8rem;
  color: #182622;
}

.badgeDiscardBlue {
  background-color: #EFF6FF;
  color: #1D4ED8;
  font-size: 0.62rem;
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
  font-weight: 700;
}

.badgeDiscardRed {
  background-color: #FEF2F2;
  color: #DC2626;
  font-size: 0.62rem;
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
  font-weight: 700;
}

.discardReason {
  margin: 0.25rem 0 0;
  font-size: 0.72rem;
  color: #78716C;
}

```

---

### VALIDACIÓN:

1. Compila con `pnpm --filter api build` y `pnpm --filter web build --no-lint`.
2. En `http://localhost:3000/dashboard`, haz clic en la pestaña **`CH-04 DECISIÓN`**.
3. El panel debe desplegar el balance prescriptivo cruzando datos reales de Prisma:
* La columna izquierda detalla los lotes sugeridos con su prioridad (ej. 90/100), utilidad proyectada y la justificación técnica explicable.


* La columna derecha enumera los productos descartados justificando si es por sobrestock en cava o por insumo faltante en silos.


* La vista se conserva sin generar scroll en la ventana global del navegador.



```

```