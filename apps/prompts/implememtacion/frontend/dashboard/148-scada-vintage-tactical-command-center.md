# IMPLEMENTACIÓN DEFINITIVA — CENTRO DE COMANDO TÁCTICO SCADA VINTAGE (WAR ROOM INDUSTRIAL)

## REGLAS CRÍTICAS DE CUOTA Y ARQUITECTURA:
1. CERO TAILWIND: Usa exclusivamente CSS Modules (`Dashboard.module.css`).
2. CERO CÁLCULOS EN CLIENTE: Todo agregado matemático, coordenada de radar y porcentaje de llenado viene precalculado desde el Backend (`dashboard.service.js`).
3. EXPERIENCIA VISUAL: Estética retro-industrial táctica (búnker/sala de control vintage): monitores monocromáticos fósforo ámbar (#D97706) y esmeralda (#10B981) sobre pizarra (#1C1917) y papel lino (#FAF8F5), diales análogos y gráficos Canvas a 60 FPS con `requestAnimationFrame`.
4. RESOLUCIÓN DE BUGS PREVIOS: Conectar el valor real de Materia Prima (~$5.804.339 devuelto por la base de datos) que actualmente se muestra en $0.

---

### FASE 1: AMPLIACIÓN ANALÍTICA BACKEND (`apps/api/src/dashboard/`)

1. En `dashboard.service.js`, expande y asegura la entrega de datos sin ceros falsos:
   - **Valorización Real:** Corregir el cálculo de `rawMaterialsValue`: sumar `(inventario.cantidadActual * insumo.costoPromedio)` asegurando que traiga el valor acumulado real existente (~$5.8M) y no 0.
   - **Radar Táctico FEFO:** Enviar arreglo `radarLots` con lotes activos calculando `diasRestantes`, `porcentajeVidaUtil` y nivel de alerta (`CRITICO` <= 7 días, `PREVENCION` <= 15 días, `ESTABLE` > 15 días).
   - **Estado de Planta:** Contar órdenes de producción activas (`EN_PROCESO`, `PLANIFICADA`) y rendimiento promedio de lote (eficiencia %).
   - **Frecuencia Financiera:** Retornar vector de 12 puntos históricos diarios del mes (`trendSales`, `trendExpenses`) para graficar la onda continua en canvas.

---

### FASE 2: MOTORES GRÁFICOS HTML5 CANVAS (`apps/web/src/app/dashboard/components/`)

Crea los componentes Canvas puros (sin librerías externas) optimizados para GPU:

1. `RadarSweepCanvas.jsx` (Radar Táctico FEFO / Detección de Riesgos):
   - Pantalla circular de radar vintage estilo fósforo verde/ámbar con retícula concéntrica y barrido rotatorio continuo (360°).
   - Plotea los lotes e insumos en riesgo como puntos parpadeantes (blips). Al pasar el cursor sobre un punto, muestra tooltip con el lote/insumo.
   - Al hacer clic en un blip crítico, dispara `SmartModal` para ordenar compra o gestionar lote.

2. `LiquidSilosCanvas.jsx` (Tanques de Nivel con Física de Fluidos):
   - Sustituye las barras grises planas por dos silos industriales transparentes con líquido animado (ondas sinusoidales suaves con rebote):
     * Silo 1: Materia Prima (Color ámbar lechoso vintage, volumen real ~$5.8M y % de capacidad).
     * Silo 2: Cava de Producto Terminado (Color verde pálido o crema lácteo, unidades y valor).
   - Indicador graduado en regla de cristal lateral y display numérico en pie.

3. `OscilloscopeCanvas.jsx` (Sismógrafo de Pulso Financiero & Operativo):
   - Registro tipo tambor sismográfico de papel continuo con cuadrícula milimétrica.
   - Renderiza las ondas simultáneas de Ventas, Gastos y Punto de Equilibrio con pulso activo en el cabezal de aguja.

---

### FASE 3: ORQUESTACIÓN Y VINCULACIÓN EN `apps/web/src/app/dashboard/page.jsx`

1. **Header Táctico:**
   - Reloj industrial en tiempo real (HH:MM:SS), selector de modo (AUTOMÁTICO / MANUAL) y LED de estado del sistema (`ONLINE / MONITORIZANDO`).
2. **Distribución del Centro de Mando:**
   - **Fila Superior:** Telemetría de Cava con rotación automática (Modo Monitor tras 8s de inactividad) + Tacómetros análogos de aguja real para margen y vida útil.
   - **Fila Media:** `OscilloscopeCanvas` (Flujo de Caja) junto a `LiquidSilosCanvas` (Materia Prima vs Cava).
   - **Fila Inferior:** `RadarSweepCanvas` (Riesgo FEFO interactivo) acompañado de la grilla de alertas accionables y accesos directos de emergencia (Fabricación, Trazabilidad, Despacho).
3. **Poka-Yoke & Integración:**
   - Conectar cada tarjeta de KPI a su variable real con `formatCurrency` (cero decimales).
   - Eliminar cualquier texto `N/A` o `$ 0` que tenga datos subyacentes en base de datos.

---

### VALIDACIÓN:
- Compila con `pnpm --filter web build --no-lint`.
- Confirma que el valor de materia prima marque los ~$5.8M reales.
- Verifica que el radar y los fluidos de los silos se animen a 60 FPS sin fugas de memoria.