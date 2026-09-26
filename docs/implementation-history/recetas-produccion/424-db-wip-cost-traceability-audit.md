# TAREA 424: AUDITORÍA DE TRAZABILIDAD Y COSTEO DE INTERMEDIOS WIP EN BASE DE DATOS

## OBJETIVO
Auditar la persistencia y trazabilidad de costos del producto base intermediario ("YOGURT BASE"), sus lotes de producción semielaborados WIP y el cálculo dinámico del inóculo/cepa en el árbol de recetas (BOM), garantizando coherencia matemática en inventario y catálogos.

## ALCANCE TÉCNICO
1. **Verificación de Datos en Base de Datos**:
   - `Producto`: `YOGURT BASE` (ID: `718008d9-51d2-49ce-a31b-5d1c6dc6a943`).
   - `InventarioProducto`: Costo promedio sincronizado en `$4.390 COP/Litro`.
   - `Lote` (WIP/Semielaborado): Lote `fad038d5-fff1-4dfb-9ddc-4cfe9757e658` con `costoUnitario: 4390 COP`.
2. **Repositorio de Productos (`findIntermediates`)**:
   - Inyección de datos de costo real desde el lote más reciente o el inventario promedio.
   - Cálculo automático para `INOCULO_WIP` a razón de `$4,39 COP/gramo` ($4.390 / 1.000).
   - Generación de opciones estructuradas (`INOCULO_WIP`, `BASE_GRANEL`, `PRODUCTO_ENVASADO`).
3. **Cálculo en Frontend / BOM**:
   - Para 125 g de inóculo: $125 \times 4,39 \approx \$548$ COP.

## CRITERIO DE VERIFICACIÓN
- Script de corrección/auditoría ejecutado con código de salida 0.
- Repositorio probado y coherente con el modelo Prisma y NestJS.
- Organización documental de la carpeta `docs/` consolidada.
