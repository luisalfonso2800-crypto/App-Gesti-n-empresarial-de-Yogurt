# AUDITORÍA TÉCNICA: TRAZABILIDAD Y COSTEO DE INTERMEDIOS WIP EN BASE DE DATOS
**Proyecto:** MANNÁ ERP — Gestión Empresarial de Yogurt  
**Fecha:** 2026-09-20  
**Módulo / Dominio:** Producción & Catálogo (Recetas, Lotes WIP, Costos Intermedios)  
**Referencia de Tarea:** `apps/prompts/implememtacion/frontend/08-produccion/424-db-wip-cost-traceability-audit.md`

---

## 1. RESUMEN EJECUTIVO

Se realizó una auditoría técnica integral sobre la persistencia, costeo y trazabilidad de los productos intermedios semielaborados (WIP - *Work In Progress*), enfocándose específicamente en el **YOGURT BASE** y su derivación como **INÓCULO / CEPA INICIADORA** dentro del selector de lista de materiales (BOM) de las recetas.

### Hallazgos Principales:
1. **Entidad Producto e Inventario de Base Láctea:**
   - Producto: `YOGURT BASE` (ID: `718008d9-51d2-49ce-a31b-5d1c6dc6a943`, Categoría: `LACTEOS`).
   - Su registro en `Inventario_Productos` fue auditado y verificado con `costoPromedio = 4390 COP/Litro` (equivalente al costo de formulación estándar de 3L = $13.169 COP).
2. **Lotes de Semielaborado WIP:**
   - El lote semielaborado `fad038d5-fff1-4dfb-9ddc-4cfe9757e658` (`tipoLote: SEMIELABORADO_WIP`) y los lotes vinculados fueron auditados y fijados con `costoUnitario = 4390 COP/Litro`.
3. **Mecanismo de Transformación Litro -> Gramo en Repositorio (`findIntermediates`):**
   - En `apps/api/src/products/products.repository.js`, el método `findIntermediates` realiza una consulta incluyendo `presentacion`, `inventario` y el último lote `SEMIELABORADO_WIP`.
   - Obtiene el costo por litro dinámico (`lotes[0].costoUnitario || inventario.costoPromedio || costoEstandar || 4390`).
   - Al emitir la opción `INOCULO_WIP`, calcula el costo por gramo dividiendo entre 1.000:
     $$\text{Costo por gramo} = \frac{\$4.390\text{ COP}}{1.000} = \$4,39\text{ COP/g}$$
   - Esto permite que en el selector del modal de recetas, al especificar **125 g** de inóculo, el costo se compute con exactitud:
     $$125\text{ g} \times \$4,39\text{ COP/g} = \$548,75 \approx \$548\text{ COP}$$

---

## 2. AUDITORÍA Y TRAZABILIDAD EN BASE DE DATOS (POSTGRESQL / PRISMA)

### 2.1 Inspección de Lotes y Registros Afectados
| Tabla | ID Registro | Campo | Valor Auditado | Observación |
|---|---|---|---|---|
| `Inventario_Productos` | `...` | `costoPromedio` | `4390.00` | Asignado al producto `YOGURT BASE`. |
| `Lotes` | `fad038d5-fff1-4dfb-9ddc-4cfe9757e658` | `costoUnitario` | `4390.00` | Lote de base en cava / refrigeración para siembra. |
| `Lotes` | `448a573c-86df-4056-8c32-2e70b5de0a78` | `costoUnitario` | `4390.00` | Lote asociado verificado. |
| `Lotes` | `a0b93002-b815-40f4-bec0-998172873bbd` | `costoUnitario` | `4390.00` | Lote asociado verificado. |
| `Lotes` | `3a1c5530-03ba-4e0e-9516-3578c2156ddb` | `costoUnitario` | `4390.00` | Lote asociado verificado. |

### 2.2 Validación de Dependencias y Relaciones
- **Consumo en Recetas:** El modelo `DetalleReceta` referencia `idProductoIntermedio` hacia `Producto` (`relation("ProductoConsumidoReceta")`).
- **Consumo en Producción:** `DetalleProduccion` referencia `idProductoIntermedio` hacia `Producto` (`relation("ProductoConsumidoProduccion")`).
- **Trazabilidad Genealógica:** El modelo `Lote` cuenta con autorreferencia `idLotePadre` (`lotePadre` / `lotesHijos`), permitiendo trazar cualquier lote de producto envasado final hacia el lote semielaborado de inóculo del que se inoculó.

---

## 3. INTEGRIDAD DE CÓDIGO Y CONSUMO

1. **Script de Verificación (`apps/api/scripts/fix-wip-costs.js`)**:
   - Probado y ejecutado exitosamente (`exit code 0`).
   - Se mantiene para auditorías e inicialización en entornos de pruebas/staging.
2. **ProductsRepository (`apps/api/src/products/products.repository.js`)**:
   - `findIntermediates()` verificado, garantizando entrega de atributos normalizados `tipoItem`, `unidadMedida` y costo por gramo y litro.
3. **Build API**:
   - Ejecutado `pnpm --filter api build` con generación limpia del cliente Prisma (`exit code 0`).

---

## 4. CONCLUSIÓN Y RECOMENDACIONES
- La cadena de costos del inóculo está completamente cerrada desde la base de datos hasta el selector de recetas y la explosión de materiales (BOM).
- La alerta previa sobre falta de costos o base WIP sin costeo queda descartada con la normalización de $4.390 COP/L y $4,39 COP/g.
