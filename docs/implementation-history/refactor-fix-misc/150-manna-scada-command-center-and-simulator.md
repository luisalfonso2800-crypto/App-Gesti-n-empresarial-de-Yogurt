# REDISEÑO ESTÉTICO MANNÁ SCADA Y SIMULADOR TÁCTICO DE PRODUCCIÓN

REGLAS ESTRICTAS DE CUOTA Y ARQUITECTURA:
- Cero Tailwind: usa exclusivamente CSS Modules (`Dashboard.module.css`).
- No toques la lógica interna matemática de los Canvas; solo ajusta su paleta de color y dimensiones.
- Poka-Yoke: valores monetarios formateados a enteros con `formatCurrency` ($X.XXX).

---

### 1. RE-SKINNING A LA IDENTIDAD VISUAL MANNÁ (`Dashboard.module.css`):
Transforma la interfaz del negro matriz al estilo artesanal-industrial de MANNÁ:
- **Fondo General del Dashboard:** Lino cálido `#F7F4EE` (no negro).
- **Tarjetas y Contenedores:** Fondo blanco hueso `#FFFFFF`, bordes sutiles `#E8E2D7`, sombras tenues `rgba(0,0,0,0.04)`.
- **Tipografías y Títulos:** Serif elegante para cabeceras ("SCADA MULTIPLEXOR por Canales Tácticos") y tipografía monoespaciada en lecturas de instrumentos.
- **Header Táctico:** Botones de canales con diseño redondeado vintage:
  `[AUTO-SCAN]` (verde bosque), `[CH-01 FINANZAS]`, `[CH-02 PLANTA/FEFO]`, `[CH-03 SUMINISTROS]`, `[TODOS]`.
- **Gráficos Canvas Integrados:**
  * `OscilloscopeCanvas`: Cuadrícula tenue en `#EFEAE1` sobre fondo marfil, líneas en verde bosque (#1C3F35) y terracota (#B91C1C).
  * `RadarSweepCanvas` y `LiquidSilosCanvas`: Alojados dentro de tarjetas blancas con marcos industriales limpios, preservando los fluidos ámbar y verde lechoso.

---

### 2. TELEMETRÍA DETALLADA POR PRODUCTO (`page.jsx`):
En el panel "Telemetría Productos":
- Muestra los productos con su categoría y empaque (`Yogur Escolar 3.5 oz`, `Yogur Fresa 1L`, `Yogur Griego 500g`).
- Para cada producto renderiza: Nombre, Stock en cava, Costo unitario base, Tacómetro análogo de margen (%) y botón de acción `⋮`.
- **Ficha Técnica (Drill-Down con SmartModal):** Al hacer clic en un producto, abre `<SmartModal>` con su radiografía:
  * Desglose de formulación: Leche cruda, cultivo, fruta, endulzante y empaque.
  * Margen por canal de venta: Minorista vs Directo.
  * Botón directo: "Simular Lote de este Producto".

---

### 3. SIMULADOR TÁCTICO DE PRODUCCIÓN Y GANANCIA (HERRAMIENTA CLAVE):
En el encabezado o como acceso rápido táctico, incorpora el botón "[⚙ SIMULAR PRODUCCIÓN]" que despliega un `<SmartModal>` interactivo:
- **Selector de Producto:** Eliges el yogur a simular.
- **Entrada Controlada:** Input `StrictNumberInput` para "Litros a Procesar" (ej: `100 L`).
- **Cálculo Reactivo Inmediato en Pantalla:**
  * Unidades estimadas a producir según presentación (ej: 100 botellas de 1L o 950 vasos de 3.5 oz).
  * Insumos requeridos de inventario (Leche: X L, Azúcar: X kg, Fruta: X kg, Envases: X und).
  * Alerta de viabilidad de stock: marca en verde si hay insumos suficientes en bodega o en rojo qué insumo falta.
  * Costo total proyectado de fabricación ($).
  * Facturación potencial bruta ($) y Margen de Utilidad estimado ($ y %).
- **Botón de Cierre Asistido:** "Crear Orden de Producción Real con estos Parámetros" (redirecciona a `/operations/production` precargando los datos).

---

### 4. VALIDACIÓN:
- Compila con `pnpm --filter web build --no-lint`.
- Confirma en `http://localhost:3000/dashboard` que el fondo sea lino/crema, la tipografía respete la marca MANNÁ y el simulador de producción calcule unidades y márgenes al instante sin errores de consola.