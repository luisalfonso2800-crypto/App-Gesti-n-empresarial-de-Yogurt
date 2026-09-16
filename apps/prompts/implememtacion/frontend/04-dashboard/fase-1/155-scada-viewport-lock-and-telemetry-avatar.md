# AJUSTE ESTRICTO DE VIEWPORT SCADA 100VH (CERO SCROLL) Y AVATAR EXPANDIDO EN TELEMETRÍA

REGLAS DE ARQUITECTURA Y AHORRO DE CUOTA:
- Modo bisturí: modifica exclusivamente `Dashboard.module.css` y la estructura de bloques en `apps/web/src/app/dashboard/page.jsx`.
- CERO TAILWIND: Usa únicamente CSS Modules nativos.
- CERO SCROLL GLOBAL: La pantalla del Centro de Comando debe encajar al 100% de la altura de pantalla (`height: calc(100vh - header); overflow: hidden`). Todo el contenido debe ser visible simultáneamente como una consola industrial real sin barra de desplazamiento vertical en la página.
- NO eliminar componentes: redistribuye alturas con `fr`, paddings compactos y aprovecha el ancho completo.

---

### 1. BLOQUEO DE VIEWPORT Y ESTRUCTURA ULTRA-COMPACTA (`Dashboard.module.css`)
Ajusta la caja contenedora y la grilla táctica:

```css
/* Contenedor principal sin desborde */
.dashboardContainer {
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 0.65rem 1rem;
  gap: 0.5rem;
  box-sizing: border-box;
  background-color: #F7F4EE;
}

/* Fila Superior: Header + Selector de Canales */
.topHeaderRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 38px;
  flex-shrink: 0;
}

/* Fila de Métricas Rápidas (4 contadores en línea) */
.kpiStrip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  height: 52px;
  flex-shrink: 0;
}

.kpiCard {
  padding: 0.35rem 0.75rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Grilla Principal SCADA (2 columnas que ocupan todo el espacio sobrante) */
.mainTacticalGrid {
  flex: 1;
  min-height: 0; /* Vital para permitir contracción sin scroll */
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 0.55rem;
}

/* Tarjetas Tácticas compactas */
.tacticalCard {
  background: #FFFFFF;
  border: 1px solid #E8E2D7;
  border-radius: 8px;
  padding: 0.55rem 0.75rem;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.cardHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.35rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}