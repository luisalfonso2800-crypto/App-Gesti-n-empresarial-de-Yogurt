# MANUAL DE ESTANDARIZACIÓN Y MODERNIZACIÓN DE VISTAS (MAN-UI-003)
> **Código de Referencia:** `MAN-UI-003-VIEW-MODERNIZATION`  
> **Ámbito de Aplicación:** Todos los módulos principales, submódulos de catálogo y operaciones en `apps/web/src/app/`.  
> **Cumplimiento:** OBLIGATORIO (STRICT).

---

## 1. OBJETIVO Y FILOSOFÍA
Estandarizar el diseño, la interacción, la ergonomía de planta y la arquitectura del frontend en la modernización de pantallas de la suite empresarial MANNÁ.  
Garantizar que todo módulo entregue una experiencia uniforme, fluida en pantallas táctiles y móviles, altamente informativa mediante KPIs interactivos, limpia en sus filtros y 100% resiliente según los límites arquitectónicos de SRP.

---

## 2. ANATOMÍA Y ESTRUCTURA OBLIGATORIA DE UN MÓDULO

Cada vista principal de módulo (`page.jsx`) debe organizarse en una estructura de 5 componentes estándar desacoplados:

```
apps/web/src/app/[module]/
├── components/
│   ├── [Module]Metrics.jsx             # 4 Tarjetas de KPIs superiores interactivas (< 120 líneas)
│   ├── [Module]MetricsDetailModal.jsx   # Modal de desglose al hacer click en un KPI (< 150 líneas)
│   ├── [Module]FilterBar.jsx           # Filtros con botón 'X' individual y separador (< 140 líneas)
│   ├── [Module]HistoryTable.jsx        # Vista dual: Tabla Desktop + Tarjetas Móviles (< 140 líneas)
│   ├── [Module]MobileCard.jsx          # Card táctil para pantallas < 768px (touch target >= 40px)
│   ├── [Module]Pagination.jsx          # Paginación fija de 10 registros (< 60 líneas)
│   └── [Action]Modal.jsx               # Modales Poka-Yoke de acción (si aplica, con SmartModal)
├── hooks/
│   └── use[Module]Data.js              # Lógica de datos, estado de filtros, métricas y paginación
├── page.jsx                            # Orquestador delgado (ESTRICTAMENTE < 120 líneas)
└── [module].module.css                 # 100% CSS Modules (0 inline styles, veto anti-blue)
```

---

## 3. LOS 6 PILARES DEL ESTÁNDAR MANNÁ

### PILAR 1: Las 4 Tarjetas Métricas (KPIs) Interactivas
- **Cantidad:** Siempre 4 tarjetas en grid responsivo (`grid-template-columns: repeat(4, 1fr)` en escritorio, `repeat(2, 1fr)` en tablet, `1fr` en móvil).
- **Semántica:**
  1. *Volumen Total:* Total de registros o documentos históricos (`Forest Green #182622`).
  2. *Estado Operativo / Activo:* Registros disponibles, en stock o vigentes (`Emerald Green #166534`).
  3. *Proceso / Especialidad:* En ruta, cepas vivas WIP o pedidos pendientes (`Teal #0d9488`).
  4. *Riesgo / Alerta / Auditoría:* Por vencer (FEFO), costos o vencidos (`Amber #d97706` / `Wine #991b1b`).
- **Interacción:** Cada tarjeta debe ser clickeable (`<button type="button">`) y abrir un modal de desglose ([`[Module]MetricsDetailModal.jsx`](file:///[Module]MetricsDetailModal.jsx)) con opción de filtrar directamente en la vista.

### PILAR 2: Barra de Filtros con Botón 'X' Individual y Separador Vertical
- Todo campo de filtro (`<select>` o `<input>`) debe contar con su propio botón `X` de limpieza individual cuando tenga un valor seleccionado.
- **Divisor visual:** El botón `X` debe tener un separador vertical sutil a la izquierda:
  ```css
  .clearFilterBtn {
    position: absolute;
    right: 0.35rem;
    top: 50%;
    transform: translateY(-50%);
    border-left: 1.5px solid #E8E2D7;
    padding-left: 0.45rem;
    color: #78716C;
  }
  .clearFilterBtn:hover {
    color: #dc2626;
    border-left-color: #dc2626;
  }
  ```
- **Botón Global de Limpiar:** Debe aparecer condicionalmente a la derecha cuando exista al menos un filtro activo (`hasFilters`).

### PILAR 3: Vista Dual Responsiva (Desktop Table vs Mobile Cards)
- Prohibido el scroll horizontal ciego de tablas en dispositivos móviles (`< 768px`).
- La vista debe alternarse limpiamente con CSS sin recalcular en JavaScript:
  ```css
  .desktopTableContainer { display: block; }
  .mobileCardsContainer { display: none; }

  @media (max-width: 768px) {
    .desktopTableContainer { display: none; }
    .mobileCardsContainer { display: block; }
  }
  ```
- Las tarjetas móviles ([`[Module]MobileCard.jsx`](file:///[Module]MobileCard.jsx)) deben:
  - Destacar en cabecera el código/ID y su Badge de estado.
  - Mostrar datos agrupados en grid de 2 columnas con iconos identificadores (`lucide-react`).
  - Botones de acción táctiles con altura mínima de **40px a 44px** (cumpliendo WCAG 2.1 AA para uso con guantes o en planta).

### PILAR 4: Paginación Fija a 10 Registros
- Tamaño de página constante (`PAGE_SIZE = 10`) para prevenir lentitud de renderizado y mantener consistencia ergonómica.
- Mostrar leyenda clara: `Mostrando X-Y de N registros`.
- Controles de navegación limpios: `Anterior`, números de página y `Siguiente`.

### PILAR 5: Poka-Yoke en Modales (Zero Native Alerts/Prompts)
- **Veto Absoluto:** Prohibido usar `window.prompt()`, `window.alert()` o `window.confirm()`.
- Toda acción que requiera captura de datos (baja de lotes, fusiones, cancelaciones) debe usar un modal dedicado basado en [`SmartModal`](file:///apps/web/src/components/ui/SmartModal.jsx).
- Validación de campos requeridos, valores numéricos mayores a cero y motivos seleccionables desde lista desplegable.
- Confirmación de seguridad si el usuario intenta cerrar un formulario con cambios sin guardar (`isDirty`).

### PILAR 6: Formatos y Simetría Ergonómica
- **Moneda:** Formato estricto colombiano `$ 1.250.000` (`Math.round(val).toLocaleString('es-CO')`).
- **Prefijos de columnas:** Cuando se listen parámetros o rangos (mínimo, objetivo, máximo), usar columnas simétricas de igual ancho con prefijos claros (`↓ Mín`, `🎯 Obj`, `↑ Máx`).
- **Estados y Badges:** Colores corporativos basados en semáforo de calidad MANNÁ (Verde Bosque, Esmeralda, Ámbar, Rojo Borgoña).

---

## 4. CHECKLIST DE VERIFICACIÓN ANTES DE COMMIT (GATEKEEPER)

Antes de dar por completado un módulo modernizado, se debe ejecutar y verificar:
1. `node .agents/scripts/verify-srp.js` -> Debe reportar **0 infracciones** (`page.jsx` < 120 líneas, componentes < 150 líneas).
2. `pnpm --filter web lint` -> Limpio, sin advertencias de variables no usadas ni errores sintácticos.
3. Cero estilos inline (`style={{...}}`) en componentes de presentación.
4. Presencia del botón `X` individual en cada filtro activo.
5. Verificación de vista dual (`desktopTableContainer` vs `mobileCardsContainer`).
