**Nombre del archivo:**

`apps/prompts/implememtacion/frontend/06-analytics-engine/186-actionable-product-carousel-and-reorder-engine.md`

---

**Prompt 186:**

```markdown
# CONTROLADOR MANUAL Y ROTACIÓN DE TELEMETRÍA DE PRODUCTOS + INSUMOS OPERATIVOS CON ACCIÓN DE COMPRA

OBJETIVOS:
1. Telemetría de Productos Interactiva:
   - Convertir la tarjeta de "TELEMETRÍA PRODUCTOS" en un carrusel táctico con controles manuales de avance y retroceso (botones [ ◀ ] y [ ▶ ] + indicador de posición `X / N`).
   - Permitir al operador pausar la rotación automática para inspeccionar cualquier producto a voluntad sin que el temporizador salte de pantalla.
   - Mostrar datos técnicos completos por producto: nombre, categoría, clasificación 4-Box (`✦ ESTRELLA`, `✦ VOLUMEN`, `✦ NICHO`, `✦ BAJO RENDIMIENTO`), stock en cava, costo unitario de receta viva, tacómetro radial de margen (%) y barra inferior de Forecast a 7 días (velocidad de venta diaria, proyección y días de cobertura DOI).
2. Insumos Críticos Operativos (Punto de Reorden):
   - Reemplazar la lista estática por una tabla de 4 columnas (`Insumo`, `Actual / Mín`, `Última Cotización`, `Acción Táctica`).
   - Botón directo `🛒 Comprar` en cada fila que navega inmediatamente a `/precios-proveedores?insumoId=...` con el insumo preseleccionado para cotizar o emitir la orden de compra en un clic.
3. Reglas de arquitectura:
   - Modifica exclusivamente `apps/web/src/app/dashboard/page.jsx` y `apps/web/src/app/dashboard/Dashboard.module.css`.
   - CERO SCRIPTS TEMPORALES (`patch*.js`, `fix*.js`).
   - Viewport 100vh estricto: cero barras de scroll en la ventana principal.

---

### 1. ACTUALIZACIÓN EN `apps/web/src/app/dashboard/page.jsx`:

1. Importa `useRouter` y configura los estados de paginación y pausa de telemetría:
```javascript
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useMemo } from 'react';

// Dentro del componente Dashboard:
const router = useRouter();

// Estados para navegación de productos en telemetría
const [currentProductIdx, setCurrentProductIdx] = useState(0);
const [isProductAutoPlay, setIsProductAutoPlay] = useState(true);

// Lista de productos extraídos de la telemetría viva o catálogo
const productList = useMemo(() => {
  if (telemetryData?.products && telemetryData.products.length > 0) {
    return telemetryData.products;
  }
  return [];
}, [telemetryData]);

const totalProducts = productList.length;
const currentProduct = productList[currentProductIdx] || null;

// Rotación automática con control de pausa interactiva
useEffect(() => {
  if (!isProductAutoPlay || totalProducts <= 1) return;
  const interval = setInterval(() => {
    setCurrentProductIdx((prev) => (prev + 1) % totalProducts);
  }, 6000);
  return () => clearInterval(interval);
}, [isProductAutoPlay, totalProducts]);

// Handlers de navegación manual
const handlePrevProduct = () => {
  setIsProductAutoPlay(false);
  setCurrentProductIdx((prev) => (prev === 0 ? totalProducts - 1 : prev - 1));
};

const handleNextProduct = () => {
  setIsProductAutoPlay(false);
  setCurrentProductIdx((prev) => (prev + 1) % totalProducts);
};

const handleToggleAutoPlay = () => {
  setIsProductAutoPlay((prev) => !prev);
};

// Navegación operativa a precios y compras
const handleIrAComprar = (item) => {
  const query = item.insumoId || item.id 
    ? `?insumoId=${item.insumoId || item.id}&nombre=${encodeURIComponent(item.nombre)}`
    : `?nombre=${encodeURIComponent(item.nombre)}`;
  router.push(`/precios-proveedores${query}`);
};

```

2. Reemplaza el bloque de **TELEMETRÍA PRODUCTOS** en el JSX:

```jsx
{/* TARJETA: TELEMETRÍA DE PRODUCTOS CON NAVEGACIÓN MANUAL */}
<div className={styles.productTelemetryCard}>
  <div className={styles.productTelemetryHeader}>
    <div className={styles.telemetryTitleGroup}>
      <span className={styles.telemetrySectionTag}>TELEMETRÍA PRODUCTOS</span>
      {currentProduct?.classification && (
        <span 
          className={styles.boxMatrixBadge}
          data-type={currentProduct.classification.type}
        >
          {currentProduct.classification.label}
        </span>
      )}
    </div>

    {/* Controles tácticos de navegación paso a paso */}
    <div className={styles.productNavControls}>
      <button 
        type="button" 
        className={styles.productNavBtn} 
        onClick={handlePrevProduct}
        title="Producto anterior"
      >
        ◀
      </button>
      <span className={styles.productNavCounter}>
        {totalProducts > 0 ? `${currentProductIdx + 1} / ${totalProducts}` : '0 / 0'}
      </span>
      <button 
        type="button" 
        className={styles.productNavBtn} 
        onClick={handleNextProduct}
        title="Producto siguiente"
      >
        ▶
      </button>
      <button 
        type="button" 
        className={`${styles.productNavBtn} ${isProductAutoPlay ? styles.productNavBtnActive : ''}`} 
        onClick={handleToggleAutoPlay}
        title={isProductAutoPlay ? "Pausar rotación automática" : "Reanudar rotación automática"}
      >
        {isProductAutoPlay ? '⏸' : '▶'}
      </button>
    </div>
  </div>

  {currentProduct ? (
    <div className={styles.productTelemetryBody}>
      <div className={styles.productMainRow}>
        {/* Foto o Icono Táctico */}
        <div className={styles.productImageWrapper}>
          {currentProduct.imagenUrl ? (
            <img 
              src={currentProduct.imagenUrl} 
              alt={currentProduct.nombre} 
              className={styles.productImage}
            />
          ) : (
            <div className={styles.productImageFallback}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8C827A" strokeWidth="1.5">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
          )}
        </div>

        {/* Nombres y categoría */}
        <div className={styles.productInfoCol}>
          <h3 className={styles.productNameTitle}>{currentProduct.nombre}</h3>
          <span className={styles.productCategoryTag}>
            {currentProduct.categoria?.nombre || currentProduct.codigo || 'LÁCTEOS'}
          </span>
          <div className={styles.productMetricNumbers}>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>STOCK CAVA</span>
              <strong className={styles.metricValue}>{Number(currentProduct.stockActual || currentProduct.stock || 0)} unds</strong>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>COSTO BASE</span>
              <strong className={styles.metricValue}>${Number(currentProduct.costoUnitario || currentProduct.costo || 0).toLocaleString()}</strong>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>PRECIO VENTA</span>
              <strong className={styles.metricValue}>${Number(currentProduct.precioVenta || 0).toLocaleString()}</strong>
            </div>
          </div>
        </div>

        {/* Tacómetro Radial de Margen */}
        <div className={styles.productRadialWrapper}>
          <div className={styles.radialGaugeContainer}>
            <svg viewBox="0 0 100 55" className={styles.gaugeSvg}>
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="#E5DFD5"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke={Number(currentProduct.margen || 0) >= 30 ? '#10B981' : Number(currentProduct.margen || 0) >= 15 ? '#F59E0B' : '#EF4444'}
                strokeWidth="8"
                strokeDasharray="125.6"
                strokeDashoffset={125.6 - (125.6 * Math.min(100, Math.max(0, Number(currentProduct.margen || 0)))) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className={styles.gaugeText}>
              <strong>{Math.round(currentProduct.margen || 0)}%</strong>
              <span>MARGEN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Forecast Semanal */}
      <div className={styles.productForecastBar}>
        <span>Ventas: <strong>{currentProduct.forecast?.velocidadDiaria || 0.4} und/día</strong></span>
        <span>Demanda 7d: <strong>{currentProduct.forecast?.demandaProyectada7d || 3} unds</strong></span>
        <span>Cobertura: <strong>{currentProduct.forecast?.diasCobertura || 99} días</strong></span>
        <span 
          className={styles.trendBadge} 
          data-trend={currentProduct.forecast?.tendencia || 'ESTABLE'}
        >
          {currentProduct.forecast?.tendencia === 'ALZA' ? '▲ Alta Rotación' : currentProduct.forecast?.tendencia === 'BAJA' ? '▼ Demanda Lenta' : '● Demanda Estable'}
        </span>
      </div>
    </div>
  ) : (
    <div className={styles.productEmptyState}>
      <span>No hay productos activos para telemetría</span>
    </div>
  )}
</div>

```

3. Reemplaza la sección de **INSUMOS CRÍTICOS (PUNTO DE REORDEN)** con la tabla interactiva de 4 columnas:

```jsx
{/* TABLA ACCIONABLE DE INSUMOS CRÍTICOS */}
<div className={styles.reorderTableCard}>
  <div className={styles.reorderTableHeader}>
    <span>Insumo</span>
    <span style={{ textAlign: 'center' }}>Actual / Mín</span>
    <span>Último Proveedor</span>
    <span style={{ textAlign: 'right' }}>Acción Táctica</span>
  </div>
  <div className={styles.reorderTableBody}>
    {telemetryData?.silos?.reorderPoints?.map((item, idx) => {
      const isDeficit = Number(item.actual || item.stockActual || 0) < Number(item.minimo || item.stockMinimo || 1);
      return (
        <div key={item.id || idx} className={styles.reorderTableRow}>
          <div className={styles.reorderColInsumo}>
            <strong>{item.nombre}</strong>
            <span className={styles.reorderUnit}>{item.unidadBase || 'Unidades'}</span>
          </div>

          <div className={styles.reorderColStock}>
            <span className={isDeficit ? styles.stockPillCritical : styles.stockPillWarning}>
              {item.actual || item.stockActual || 0} / {item.minimo || item.stockMinimo || 0}
            </span>
          </div>

          <div className={styles.reorderColSupplier}>
            <span className={styles.supplierName}>{item.proveedor || 'Proveedor Registrado'}</span>
            <span className={styles.supplierPrice}>${Number(item.precio || item.costo || 0).toLocaleString()}</span>
          </div>

          <div className={styles.reorderColAction}>
            <button
              type="button"
              className={styles.buyActionButton}
              onClick={() => handleIrAComprar(item)}
              title={`Cotizar o comprar ${item.nombre} con proveedor`}
            >
              🛒 Comprar
            </button>
          </div>
        </div>
      );
    })}
  </div>
</div>

```

---

### 2. ESTILOS EN `apps/web/src/app/dashboard/Dashboard.module.css`:

Agrega o reemplaza las siguientes clases CSS:

```css
/* ========================================================
   TELEMETRÍA DE PRODUCTOS: CARRUSEL Y NAVEGACIÓN MANUAL
   ======================================================== */
.productTelemetryCard {
  background-color: #FFFFFF;
  border: 1px solid #E5DFD5;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  overflow: hidden;
}

.productTelemetryHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #EFEAE1;
  padding-bottom: 0.45rem;
  margin-bottom: 0.5rem;
}

.telemetryTitleGroup {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.telemetrySectionTag {
  font-size: 0.72rem;
  font-weight: 800;
  color: #182622;
  letter-spacing: 0.04em;
}

.boxMatrixBadge {
  font-size: 0.62rem;
  font-weight: 800;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  text-transform: uppercase;
}
.boxMatrixBadge[data-type="ESTRELLA"] { background-color: #D1FAE5; color: #065F46; }
.boxMatrixBadge[data-type="VOLUMEN"] { background-color: #EFF6FF; color: #1D4ED8; }
.boxMatrixBadge[data-type="NICHO"] { background-color: #FEF3C7; color: #92400E; }
.boxMatrixBadge[data-type="BAJO"] { background-color: #FEE2E2; color: #991B1B; }

.productNavControls {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background-color: #FAF8F5;
  padding: 0.15rem 0.4rem;
  border-radius: 6px;
  border: 1px solid #E5DFD5;
}

.productNavBtn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.68rem;
  color: #57534E;
  padding: 0.15rem 0.35rem;
  border-radius: 3px;
  transition: all 0.12s ease;
}
.productNavBtn:hover {
  background-color: #E5DFD5;
  color: #182622;
}
.productNavBtnActive {
  color: #10B981;
  font-weight: 800;
}

.productNavCounter {
  font-size: 0.65rem;
  font-weight: 700;
  color: #182622;
  min-width: 38px;
  text-align: center;
}

.productTelemetryBody {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}

.productMainRow {
  display: grid;
  grid-template-columns: 80px 1.4fr 110px;
  gap: 0.85rem;
  align-items: center;
}

.productImageWrapper {
  width: 80px;
  height: 80px;
  border-radius: 6px;
  background-color: #FAF8F5;
  border: 1px solid #EFEAE1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.productImage {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.productImageFallback {
  display: flex;
  align-items: center;
  justify-content: center;
}

.productInfoCol {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.productNameTitle {
  margin: 0;
  font-size: 0.92rem;
  font-weight: 800;
  color: #182622;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.productCategoryTag {
  font-size: 0.65rem;
  font-weight: 700;
  color: #78716C;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.productMetricNumbers {
  display: flex;
  gap: 0.85rem;
  margin-top: 0.35rem;
}

.metricItem {
  display: flex;
  flex-direction: column;
}

.metricLabel {
  font-size: 0.58rem;
  font-weight: 700;
  color: #8C827A;
}

.metricValue {
  font-size: 0.78rem;
  color: #182622;
}

/* Tacómetro Radial */
.productRadialWrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.radialGaugeContainer {
  position: relative;
  width: 95px;
  height: 55px;
}

.gaugeSvg {
  width: 100%;
  height: 100%;
}

.gaugeText {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.gaugeText strong {
  font-size: 0.88rem;
  color: #182622;
}

.gaugeText span {
  font-size: 0.55rem;
  color: #78716C;
  font-weight: 700;
}

/* Barra de Forecast Semanal */
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
  margin-top: 0.45rem;
}

.productForecastBar strong {
  color: #182622;
}

.trendBadge[data-trend="ALZA"] { color: #059669; font-weight: 700; }
.trendBadge[data-trend="BAJA"] { color: #D97706; font-weight: 700; }
.trendBadge[data-trend="ESTABLE"] { color: #6B7280; }

.productEmptyState {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  font-size: 0.75rem;
  color: #8C827A;
}

/* ========================================================
   TABLA DE INSUMOS CRÍTICOS (4 COLUMNAS OPERATIVAS)
   ======================================================== */
.reorderTableCard {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.reorderTableHeader {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1.6fr 1fr;
  padding: 0.4rem 0.6rem;
  font-size: 0.68rem;
  font-weight: 700;
  color: #78716C;
  border-bottom: 1px solid #EFEAE1;
  letter-spacing: 0.03em;
}

.reorderTableBody {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding-top: 0.35rem;
}

.reorderTableRow {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1.6fr 1fr;
  align-items: center;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  background-color: #FAF8F5;
  border: 1px solid #EFEAE1;
  transition: background-color 0.15s ease;
}

.reorderTableRow:hover {
  background-color: #F3EFE6;
}

.reorderColInsumo {
  display: flex;
  flex-direction: column;
}

.reorderColInsumo strong {
  font-size: 0.78rem;
  color: #182622;
}

.reorderUnit {
  font-size: 0.62rem;
  color: #8C827A;
}

.reorderColStock {
  display: flex;
  justify-content: center;
}

.stockPillCritical {
  background-color: #FEF2F2;
  color: #DC2626;
  border: 1px solid #FECACA;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

.stockPillWarning {
  background-color: #FFFBEB;
  color: #D97706;
  border: 1px solid #FDE68A;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

.reorderColSupplier {
  display: flex;
  flex-direction: column;
  font-size: 0.72rem;
}

.supplierName {
  color: #182622;
  font-weight: 600;
}

.supplierPrice {
  color: #78716C;
  font-size: 0.65rem;
}

.reorderColAction {
  display: flex;
  justify-content: flex-end;
}

.buyActionButton {
  background-color: #182622;
  color: #F7F4EE;
  border: 1px solid #CAD5B5;
  border-radius: 4px;
  padding: 0.25rem 0.55rem;
  font-size: 0.68rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.15s ease-in-out;
  white-space: nowrap;
}

.buyActionButton:hover {
  background-color: #243832;
  border-color: #C58A3E;
  color: #FFFFFF;
}

```

---

### VALIDACIÓN:

1. Compila con `pnpm --filter web build --no-lint`.
2. En `http://localhost:3000/dashboard`:
* El operador puede presionar **`[ ◀ ]`** y **`[ ▶ ]`** para inspeccionar secuencialmente cada producto. Al interactuar, la rotación automática se detiene o se reanuda con el botón **`[ ⏸ / ▶ ]`**.
* Se reflejan los productos reales inyectados con sus métricas calculadas y su clasificación 4-Box.
* En la tabla de insumos críticos, al pulsar **`🛒 Comprar`**, la aplicación redirige de inmediato a `/precios-proveedores` con el insumo prefiltrado.
* La pantalla completa mantiene el 100vh estricto sin generar barras de scroll.



```

```