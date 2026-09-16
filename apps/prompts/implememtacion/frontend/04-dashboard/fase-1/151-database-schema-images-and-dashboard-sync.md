# MIGRACIÓN DE BASE DE DATOS, PERSISTENCIA BACKEND Y SINCRONIZACIÓN DE IMÁGENES (PRODUCTOS, PRESENTACIONES Y DASHBOARD)

REGLAS DE MÁXIMO AHORRO DE CUOTA:
- Modo bisturí: modifica únicamente los archivos indicados.
- Cero Tailwind: usa CSS Modules.
- Integridad Poka-Yoke: no dejes campos huérfanos ni valores null sin fallback.

---

### FASE 1: ACTUALIZACIÓN DE SCHEMA PRISMA Y MIGRACIÓN (`apps/api/prisma/`)

1. En `schema.prisma`:
   - Agrega `imagenUrl String?` al modelo `Producto` (para la etiqueta visual específica del sabor/línea).
   - Agrega `imagenUrl String?` al modelo `Presentacion` (para el tipo de envase base: botella, vaso, frasco).
2. Ejecuta la sincronización en terminal:
   `pnpm --filter api exec prisma db push`
   `pnpm --filter api exec prisma generate`

3. Actualización de datos existentes (One-Time Patch en Prisma):
   - Asigna los presets visuales por defecto a los 3 productos y presentaciones existentes en la base de datos para que no queden en blanco:
     * `Yogur Escolar 3.5 oz` -> `/images/presets/vaso-escolar.png` (Preset Vaso 3.5 oz)
     * `Yogur Tradicional Fresa 1L` -> `/images/presets/botella-1l.png` (Preset Botella 1 Litro)
     * `Yogur Griego Natural 500g` -> `/images/presets/vaso-griego.png` (Preset Vaso 500g)

---

### FASE 2: PERSISTENCIA EN BACKEND (`apps/api/src/`)

1. DTOs y Repositorios de Catálogo:
   - En `products`: asegura que los DTOs de creación/edición y el repositorio admitan y guarden `imagenUrl`.
   - En `presentations`: asegura que los DTOs y el repositorio admitan y guarden `imagenUrl`.

2. Servicio de Telemetría SCADA (`apps/api/src/dashboard/dashboard.service.js`):
   - En la consulta que arma `productsTelemetry` dentro de `getFullTelemetry()`:
     * Incluye en el select/include: `imagenUrl` del `Producto` y de su `Presentacion`.
     * Mapea en el objeto retornado:
       `imagenUrl: producto.imagenUrl || producto.presentacion?.imagenUrl || '/images/presets/default-yogurt.png'`

---

### FASE 3: PRESETS LOCALES Y ASISTENTE VISUAL EN FRONTEND (`apps/web/`)

1. Catálogo de Presets Locales (`apps/web/src/lib/presetImages.js`):
   - Define y exporta un array de presets MANNÁ con SVG/imágenes base:
     * `PRESET_VASO_3_5`: Vaso escolar 3.5 oz / 105 ml.
     * `PRESET_BOTELLA_1L`: Botella vidrio/plástico 1 Litro.
     * `PRESET_VASO_500G`: Tarro/vaso mediano griego 500g.
     * `PRESET_FRASCO_VIDRIO`: Frasco artesanal 250g.
   - Función utilitaria: `resolveProductImage(producto)` que retorne la URL personalizada si existe, o el preset según nombre/envase.

2. Modales de Creación/Edición con Selector de Presets:
   - En el modal de **Presentaciones** (`apps/web/src/app/catalog/presentations/`) y de **Productos** (`apps/web/src/app/catalog/products/`):
     * Muestra una cuadrícula de selección rápida con los 4 presets MANNÁ en miniatura clicables.
     * Campo input de texto para `URL personalizada` (autocompletado al hacer clic en un preset).
     * Previsualizador en vivo (caja de 60x60px con bordes suaves estilo lino).

3. Renderizado en Telemetría SCADA (`apps/web/src/app/dashboard/`):
   - En la sección "Telemetría Productos" de `page.jsx`:
     * Renderiza la miniatura del producto a 44x44px a la izquierda del nombre.
     * Marco con borde `#E8E2D7`, esquinas redondeadas (`8px`), fondo pergamino (`#FBF9F5`) y `object-fit: cover`.

---

### VALIDACIÓN:
1. Verifica que la API arranque sin errores tras `prisma generate`.
2. Compila el cliente con `pnpm --filter web build --no-lint`.
3. Confirma en `http://localhost:3000/dashboard` que los productos en la grilla táctica muestren inmediatamente sus imágenes correspondientes.