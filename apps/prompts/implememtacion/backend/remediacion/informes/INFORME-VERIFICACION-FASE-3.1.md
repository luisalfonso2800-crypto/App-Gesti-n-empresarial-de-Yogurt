# INFORME-VERIFICACION-FASE-3.1: RESOLUCIÓN DE AMBIGÜEDADES POST-BLOQUE 3

## 1. Verificación de HAL-F2-03 en `production.repository.js` (T1)
- **Inspección de L210-212 y L425-429:**
  En `production.repository.js`, las líneas `if (detUnidad === 'g' || detUnidad === 'ml' ...)` aplican división por 1000 entre unidades pequeñas y base (Lts).
- **Dictamen:** **PARCIALMENTE RESUELTO**. Se creó y testeó la herramienta canónica `convertVolumeToMass(qty, density)` en `unit-registry.js`, pero `production.repository.js` sigue utilizando el factor 1000 directo al no existir el campo `densidad` en la entidad `Insumo` o `Producto`.

## 2. Convención de Inventario (T2)
- **Evidencia en Código:** En `Insumo` (`schema.prisma` L34-37), el catálogo define `unidadBase` (ej. `kg`, `l`, `g`, `ml`). Sin embargo, en compras (`purchases.repository.js` L173) y kardex, el stock se almacena históricamente normalizado en **unidades mínimas continuas** (`g` o `ml`) cuando la unidad base es `kg` o `l`.
- **Compatibilidad de `HAL-F1-04`:** El fix con `getFactor(currentInsumo.unidadBase, 'g') || getFactor(currentInsumo.unidadBase, 'ml') || 1` respeta con exactitud esta convención de escala a gramos/mililitros sin depender de comparaciones de cadenas rígidas.

## 3. Simetría de Conversión con Densidad (T3)
- `convertVolumeToMass(volume, density)` convierte $V \times \rho \to M$.
- La conversión inversa ($M / \rho \to V$) se realiza algebraicamente dividiendo por la densidad: $\text{volumen} = \text{masa} / \text{densidad}$. Queda documentada la recomendación de exportar `convertMassToVolume(mass, density)`.

## 4. Smoke Test de Frontend (T4)
- Con `apps/web/src/utils/unitNormalizer.js` sincronizado con el registro canónico y `recipes.service.js` usando `areCompatible`, recetas con ingredientes en `kg`, `g`, `ml`, `l`, `oz` y `mg` validan y se guardan sin `BadRequestException`.

## 5. Estado Declarado
- **`HAL-F1-04`:** **RESUELTO**.
- **`HAL-F2-03`:** **PARCIALMENTE RESUELTO** (herramienta creada, consumo pendiente de campo densidad en BD).
