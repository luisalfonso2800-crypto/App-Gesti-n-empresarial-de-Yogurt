TAREA CONTROLADA — RECETAS V2: FASE 2 (INTERFAZ DE USUARIO Y EXPERIENCIA COMPLETA)

OBJETIVO
Reemplazar el modal simplificado actual por la interfaz integral de gestión técnica de Recetas:
1. Listado maestro con visualización de producto real (nombre y presentación en vez de UUID), etapas totales e insumos asociados.
2. Formulario en pantalla completa (o vista dedicada expandible) para creación y edición (`/catalog/recipes/new` o vista completa en `/catalog/recipes`).
3. Selectores interactivos `<Select>` para Producto e Insumos (PROHIBIDO pegar UUIDs a mano).
4. Gestión dinámica de Etapas (nombre, orden, tiempos min/est/max, temperaturas e instrucciones).
5. Sub-tabla de BOM por etapa con selector de Insumo, cantidad requerida, unidad base automática, tipo de insumo (BASE, COMPLEMENTO, EMPAQUE_BASE, EMPAQUE_COMPLEMENTO) y grupoVariante.
6. Previsualización en tiempo real del costo proyectado y resumen de materiales antes de guardar.

FUENTES DE VERDAD
- docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md
- Documento de diseño técnico aprobado (Recetas V2)
- apps/api/src/recipes/recipes.repository.js
- apps/web/src/app/catalog/recipes/page.jsx
- apps/web/src/app/catalog/recipes/recipes.module.css

REGLAS TÉCNICAS OBLIGATORIAS
1. Exclusivamente JavaScript/JSX (.js, .jsx). PROHIBIDO TypeScript (.ts, .tsx).
2. CSS Modules exclusivo. PROHIBIDO Tailwind o librerías UI externas.
3. NO alterar la base de datos ni modelos Prisma en esta fase.
4. No romper la compilación de Next.js (`pnpm --filter web build`).

ALCANCE PUNTUAL

1. Listado Maestro (`apps/web/src/app/catalog/recipes/page.jsx`):
   - Mostrar columnas: Nombre de Receta | Producto Asociado | Rendimiento Base | N° Etapas | Estado | Acciones.
   - En Producto Asociado mostrar el nombre del producto y su presentación, resolviendo la relación anidada.
   - Botón "Nueva Receta" que active la interfaz de creación técnica.

2. Constructor de Receta (Creación / Edición):
   - Cabecera:
     * Nombre de la receta.
     * Selector desplegable de Producto (consumiendo `/products`).
     * Rendimiento base numérico y unidad de rendimiento (ej. "Litros", "Unidades").
     * Observaciones generales.
   - Acordeón / Bloque de Etapas Dinámicas:
     * Botón "Agregar Etapa".
     * Campos de etapa: Nombre (ej. "Preparación de Base Blanca", "Fermentación"), orden secuencial.
     * Tolerancias operativas: Tiempos (Mínimo, Estándar, Máximo en minutos u horas) y Temperaturas (°C).
     * Instrucciones de proceso para el operario.
   - Lista de Materiales (BOM) por Etapa:
     * Selector desplegable de Insumos (consumiendo `/supplies`).
     * Al seleccionar un insumo, autocompletar su `unidad` con la `unidadBase` del catálogo.
     * Campo numérico para `cantidadRequerida`.
     * Campo numérico para `mermaPorcentaje`.
     * Selector de `tipoInsumo`: BASE, COMPLEMENTO, EMPAQUE_BASE, EMPAQUE_COMPLEMENTO.
     * Selector o campo asistido para `grupoVariante` (ej. "CEREAL", "FRUTA", "JALEA", "NINGUNO").
   - Resumen y Previsualización:
     * Card lateral o inferior que resuma el costo teórico proyectado de la fórmula consultando las tarifas referenciales de los insumos seleccionados.
     * Botón Guardar que envíe el payload anidado (`Receta -> etapas -> detalles`) al endpoint `POST /recipes` o `PATCH /recipes/:id`.

VALIDACIÓN
- Comprobar que `pnpm --filter web build` compile con código 0 sin errores de imports o estilos.

FORMATO DE CIERRE
Entregar exclusivamente:

FASE 2 RECETAS V2 (FRONTEND) — CIERRE
• Estado: COMPLETADO / ERROR
• Selector interactivo de productos: SÍ / NO
• Selectores interactivos de insumos: SÍ / NO
• Constructor de etapas dinámico con tolerancias: SÍ / NO
• Clasificación de insumos y variantes integrada: SÍ / NO
• Previsualización / resumen funcional: SÍ / NO
• JavaScript nativo: OK
• TypeScript introducido: NO
• CSS Modules: OK
• Build: OK / ERROR
• Archivos modificados: [lista]
• Bloqueos: NINGUNO / [Detalle]