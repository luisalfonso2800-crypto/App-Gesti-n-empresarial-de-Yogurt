> Implementa de forma integral y en fases el Módulo de Inventario Avanzado, Reactivo, Empresarial y de Estilo Vintage:

OBJETIVO GENERAL:
Transformar el módulo de inventario actual en un sistema integral de control de stock físico y valorización financiera con estética industrial/vintage limpia (estilo bitácora técnica, bordes definidos, acentos ámbar/esmeralda, tipografía nítida y tarjetas métricas sólidas). El módulo debe cubrir tanto Materia Prima/Insumos como Producto Terminado, incluir Kárdex de movimientos, semáforo de reposición, soporte de mermas/ajustes manuales y trazabilidad de lotes.

─────────────────────────────────────────────────────────────────────────────
FASE 1: AMPLIACIÓN DE ARQUITECTURA DE DATOS (apps/api/prisma/schema.prisma)
─────────────────────────────────────────────────────────────────────────────
1. Modelo Inventario / InventarioProducto:
   - Permite que el sistema gestione stock tanto de Insumos como de Productos terminados (Yogurt):
     * Opción recomendada: Agregar modelo `InventarioProducto` con relación 1:1 a `Producto`:
       ```prisma
       model InventarioProducto {
         id                  String   @id @default(uuid())
         idProducto          String   @unique
         cantidadActual      Decimal  @default(0)
         costoPromedio       Decimal  @default(0)
         fechaActualizacion  DateTime @updatedAt
         producto            Producto @relation(fields: [idProducto], references: [id], onDelete: Cascade)
       }
       ```
     * Y enlazar la relación inversa en el modelo `Producto`.
2. Enriquecer `MovimientoInventario`:
   - Asegurar campos para auditoría y trazabilidad:
     * `tipoMovimiento`: String (ej: 'ENTRADA_COMPRA', 'SALIDA_PRODUCCION', 'ENTRADA_PRODUCCION', 'SALIDA_VENTA', 'AJUSTE_POSITIVO', 'AJUSTE_NEGATIVO', 'MERMA_DESPERDICIO').
     * `idLote`: String? (opcional, para trazabilidad de lote cuando aplique).
     * `motivo`: String? (justificación obligatoria en ajustes manuales o mermas).
     * `stockAnterior`: Decimal?
     * `stockNuevo`: Decimal?
     * `costoUnitario`: Decimal?
3. Sincronización Prisma:
   - Ejecutar:
     pnpm --filter api exec prisma db push
     pnpm --filter api exec prisma generate

─────────────────────────────────────────────────────────────────────────────
FASE 2: ENDPOINTS Y LÓGICA DE NEGOCIO EN BACKEND (apps/api/src/inventory/)
─────────────────────────────────────────────────────────────────────────────
1. `GET /api/v1/inventory`:
   - Retornar el inventario de Insumos con relación `insumo` resuelta (`nombre`, `categoria`, `unidadBase`, `stockMinimo`).
   - Calcular y añadir por cada ítem:
     * `valorTotal`: `cantidadActual * costoPromedio`.
     * `estado`: 'CRITICO' (stock <= 0), 'BAJO' (stock <= stockMinimo), 'OPTIMO' (stock > stockMinimo).
   - Incluir resumen consolidado en metadata:
     * `valorTotalBodega`: suma total del dinero inmovilizado.
     * `totalCriticos`: conteo de insumos en 0 o negativo.
     * `totalBajoMinimo`: conteo de insumos bajo stock mínimo.
     * `totalReferencias`: conteo total de insumos activos.
2. `GET /api/v1/inventory/finished-products`:
   - Retornar el inventario de Productos Terminados enlazado con `Producto` (`nombre`, `presentacion`, `precioVenta`).
3. `GET /api/v1/inventory/movements`:
   - Parámetros opcionales: `?idInsumo=...&tipo=...&limit=50`.
   - Retornar historial cronológico ordenado por `fecha` DESC con datos del insumo o producto y documento de origen.
4. `POST /api/v1/inventory/adjustments`:
   - Endpoint transaccional para ajustes manuales y mermas:
     * Payload: `{ idInsumo?: string, idProducto?: string, cantidadAjuste: number, tipo: 'AJUSTE_POSITIVO' | 'AJUSTE_NEGATIVO' | 'MERMA_DESPERDICIO', motivo: string }`.
     * Ejecuta dentro de `$transaction`:
       - Lee stock anterior.
       - Aplica incremento o decremento en `Inventario` (o `InventarioProducto`).
       - Registra `MovimientoInventario` con `stockAnterior`, `stockNuevo`, `motivo`, fecha actual y tipo.

─────────────────────────────────────────────────────────────────────────────
FASE 3: VISTA DE USUARIO VINTAGE EMPRESARIAL (apps/web/src/app/operations/inventory/)
─────────────────────────────────────────────────────────────────────────────
1. Estética Visual:
   - Look & Feel: Panel industrial/vintage estructurado (tarjetas con bordes sólidos `border-slate-200`, sombras sutiles, detalles en tonos ámbar, oliva/esmeralda para estados óptimos, borgoña/vino para alertas críticas, fuentes monoespaciadas para cifras numéricas).
2. Pestañas Principales (Tab Navigation):
   - **Pestaña 1: Materias Primas e Insumos (Bodega Seca / Fría)**
   - **Pestaña 2: Producto Terminado (Cava de Yogures)**
   - **Pestaña 3: Kárdex y Auditoría de Movimientos**
3. Componentes de la Pestaña 1 (Insumos):
   - **4 Tarjetas de Métricas (KPIs):**
     * *Valor Total en Bodega ($)* (icono banco/bóveda, moneda formateada).
     * *Alertas de Reposición* (contador rojo con botón de filtro rápido).
     * *Insumos Agotados* (contador ámbar).
     * *Referencias Activas* (total insumos).
   - **Barra de Control:**
     * Buscador reactivo por texto (nombre, categoría o marca).
     * Selector de Categoría (Lácteos, Frutas, Endulzantes, Empaques, etc.).
     * Selector de Semáforo (Todos, Solo Críticos/Bajos, Óptimos).
     * Botón de acción: `[+ Registrar Ajuste / Merma]`.
   - **Tabla Reactiva:**
     * Columnas: `Código / Insumo`, `Categoría`, `Stock Actual` (con unidad base formateada, ej: `5.000 g`), `Stock Mínimo`, `Semáforo` (Badge con pulso o color nítido), `Costo Promedio Unit.`, `Valorización Total ($)`, `Acciones`.
     * Acciones por fila:
       - Botón *Kárdex* (abre Drawer o Modal con los movimientos específicos de ese ítem).
       - Botón *Reorden / Comprar* (si el stock está bajo o crítico, redirige o agrega al carrito/lista de compra activa).
4. Componentes de la Pestaña 2 (Producto Terminado):
   - Vista de existencias de yogurt embotellado/empacado listo para despacho a ventas.
   - Columnas: `Producto / Sabor`, `Presentación`, `Stock en Cava`, `Precio Venta Estimado`, `Valor Total Comercial`.
5. Componentes de la Pestaña 3 (Kárdex Global):
   - Tabla cronológica de entradas y salidas: `Fecha/Hora`, `Ítem`, `Tipo de Movimiento` (Badge con color según Entrada/Salida/Ajuste), `Impacto` (+ / -), `Stock Resultante`, `Motivo / Doc. Origen`.
6. Modal de Ajuste de Inventario / Merma:
   - Formulario reactivo para registrar conteos físicos o descartes por vencimiento/rotura.
   - Valida que `motivo` sea obligatorio cuando se registren mermas o ajustes negativos.

─────────────────────────────────────────────────────────────────────────────
FASE 4: VALIDACIÓN Y VERIFICACIÓN TÉCNICA
─────────────────────────────────────────────────────────────────────────────
1. Verificar que no existan errores de compilación ni de sintaxis en frontend y backend:
   node --check apps/api/src/inventory/inventory.controller.js
   node --check apps/web/src/app/operations/inventory/page.jsx
2. Comprobar que en `/operations/inventory` desaparezcan los IDs en crudo y se muestren los nombres reales de los insumos con sus unidades base y valores económicos.
3. Probar la ejecución de un ajuste manual y verificar que impacte el inventario y genere el registro en el Kárdex en tiempo real.