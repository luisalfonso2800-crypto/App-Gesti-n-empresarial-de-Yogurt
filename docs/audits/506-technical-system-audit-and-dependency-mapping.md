TAREA: Auditoría Técnica Integral, Mapeo de Dependencias y Análisis Causa-Raíz (SOLO LECTURA).

RESTRICCIÓN CRÍTICA DE OPERACIÓN (READ-ONLY MANDATORY):
- PROHIBIDO modificar, eliminar, mover, formatear o refactorizar archivos de código fuente (`.js`, `.jsx`, `.ts`, `.tsx`, `.prisma`, `.json`, etc.).
- PROHIBIDO aplicar correcciones de errores, fallbacks temporales o mejoras de código.
- La ÚNICA salida de escritura permitida es el informe técnico en Markdown dentro del directorio de documentación.

DIRECTORIO DE SALIDA:
- Ubicar o crear el informe en: `docs/architecture/audits/INFORME_AUDITORIA_DEPENDENCIAS_Y_ACOPLAMIENTO.md` (o la carpeta equivalente preexistente bajo `docs/`).

---

### OBJETIVOS DE LA AUDITORÍA

1. Diagnosticar la causa raíz estructural del fenómeno recurrente:
   "Modificar un método de consulta, filtro o entidad rompe colateralmente otros flujos, modales o pantallas" (ej: alterar `inventory.repository.js` rompiendo la Bitácora de Inventario, o cambiar includes de Prisma en `sales` provocando errores por campos inexistentes como `costoEstandar` o `envase`).
2. Mapear la matriz de dependencias cruzadas (Frontend ↔ Backend ↔ Base de Datos).
3. Entregar un mapa de impacto accionable con diagramas Mermaid utilizable para planificaciones futuras.

---

### METODOLOGÍA DE REVISIÓN EN CUOTA MODERADA (4 FASES DE BARRIDO)

#### FASE 1: Análisis Estático de Base de Datos y Contratos Backend
1. **Schema de Prisma (`apps/api/prisma/schema.prisma`):**
   - Extraer todas las entidades, relaciones `@relation`, campos opcionales vs requeridos y enums.
   - Identificar entidades centrales ("God Entities") que concentran múltiples flujos (ej. `Producto`, `InventarioProducto`, `Lote`, `OrdenProduccion`, `Venta`, `Insumo`).
2. **Controladores y Repositorios Backend (`apps/api/src/`):**
   - Auditar los métodos de consulta (`findMany`, `update`, `upsert`) de:
     * `inventory/`
     * `production/`
     * `sales/`
     * `products/`
     * `purchases/`
   - Identificar métodos sobreutilizados o multipropósito (funciones compartidas tanto por paneles administrativos como por selectores modales).

#### FASE 2: Auditoría de Módulos Frontend y Modales (`apps/web/src/`)
1. **Rutas y Módulos (`apps/web/src/app/`):**
   - Recorrer sistemáticamente las páginas del App Router:
     * Dashboard / Puesta en Marcha (`/dashboard`)
     * Producción / Fabricación (`/production`)
     * Inventario / Cava / Bodega (`/production/inventory` o `/inventory`)
     * Comercial / Ventas (`/commercial/sales`)
     * Clientes, Compras, Pagos/Cobros (`/commercial/payments`)
     * Catálogos (Presentaciones, Insumos, Proveedores, Recetas).
2. **Catálogo de Modales y Drawers:**
   - Ubicar e inventariar cada modal/drawer (ej. `SaleCavaCatalogDrawer`, `ProductionLiquidationModal`, `ActiveBatchCard`, modales de ajuste de stock, modal de nueva venta).
   - Documentar: componentes invocadores, estado local vs global que mutan, endpoints que llaman y side-effects tras confirmación.

#### FASE 3: Mapeo de Comunicación y Estado Compartido
1. **Flujo de Consumo API:**
   - Cruzar cada llamada `fetch` o `axios` de los hooks y servicios con los endpoints reales de la API.
   - Detectar endpoints compartidos por múltiples pantallas que esperan contratos de datos incompatibles o filtros contradictorios.
2. **Manejo de Estado Global y Contextos:**
   - Auditar `apps/web/src/context/` (`PrivacyContext`, contextos de autenticación, diagnóstico, etc.) y verificar si algún estado muta o bloquea re-renders en componentes ajenos.

#### FASE 4: Detección de Inconsistencias y Redundancias
1. Nombres inconsistentes de campos entre Backend y Frontend (ej. `volumen` vs `volumenOzMl` vs `capacidad`; `unidadMedida` vs `unidadRendimiento`).
2. Duplicación de lógica de negocio en la capa visual (filtros manuales por regex o substrings en lugar de contratos tipados).
3. Dependencias circulares o imports cruzados entre módulos comerciales y de producción.

---

### ESTRUCTURA DEL INFORME FINAL (`INFORME_AUDITORIA_DEPENDENCIAS_Y_ACOPLAMIENTO.md`)

El documento debe redactarse con rigor técnico de ingeniería de software estructurado en:

1. **Resumen Ejecutivo:**
   - Diagnóstico claro de por qué el sistema es frágil frente a cambios aislados.
2. **Inventario Completo del Sistema:**
   - Tabla de Módulos (Ruta, Responsabilidad, Archivo Principal).
   - Tabla de Modales/Drawers (Nombre, Módulos que lo invocan, Mutaciones que genera, Riesgo).
   - Tabla de Repositorios y Endpoints Compartidos.
3. **Diagramas de Arquitectura y Dependencias (Mermaid):**
   - Diagrama general de relación Módulos Frontend ↔ Endpoints ↔ Entidades Prisma.
   - Flujo crítico de trazabilidad: `Insumos -> Receta -> Orden Producción -> Lote Cava -> Despacho Venta`.
4. **Puntos Críticos de Alto Acoplamiento ("Hotspots"):**
   - Archivos y métodos con excesiva responsabilidad compartida.
5. **Matriz de Impacto ("Si tocas X, afectas Y"):**
   - Tabla donde para cada servicio/modelo clave se listan las pantallas y modales que colapsan si cambia su firma o include.
6. **Hallazgos de Inconsistencias y Riesgos Detectados:**
   - Inconsistencias de contratos.
   - Lógica de negocio fuera de lugar.
   - Código muerto o rutas 404 latentes.
7. **Recomendaciones de Desacoplamiento (Sin implementar):**
   - Propuestas de arquitectura limpia (SRP, Data Transfer Objects/DTOs específicos por caso de uso, segregación de consultas de catálogo vs reportes).

---

### ENTREGABLE EN CONSOLA

Al finalizar la auditoría y generar el archivo, el agente debe reportar en su respuesta final únicamente el siguiente resumen estructurado:
- **Ruta exacta del informe generado.**
- **Módulos auditados:** (Total numérico).
- **Modales/Drawers auditados:** (Total numérico).
- **Relaciones y dependencias críticas identificadas:** (Total numérico).
- **Los 3 principales hotspots de acoplamiento.**
- **Diagnóstico del por qué se rompe B al arreglar A.**
- **Lista de zonas rojas (alto riesgo) a no tocar sin aislamiento previo.**
