TAREA (PRESUPUESTO ESTRICTO: MÁXIMO 3 ARCHIVOS - CERO BUCLES DE LECTURA):
Implementar la solución arquitectural recomendada en la auditoría 526: Crear la utilidad pura `UnitConverter` e integrarla en `production.repository.js` e `inventory.service.js` para normalizar las unidades de medida y corregir la valorización distorsionada.

ARCHIVOS A INTERVENIR:
1. `apps/api/src/common/utils/unit-converter.js` (CREAR)
2. `apps/api/src/production/production.repository.js` (EDITAR)
3. `apps/api/src/inventory/inventory.service.js` (EDITAR)

INSTRUCCIONES TÉCNICAS:

1. Crear `apps/api/src/common/utils/unit-converter.js`:
   - Exportar funciones utilitarias puras:
     * `normalizeUnit(unit)`: Retorna en mayúsculas estandarizadas ('KG', 'G', 'L', 'ML', 'OZ', 'UND'). Mapear variantes como 'GRAMO', 'GRAMOS', 'KILOGRAMO', 'LITRO', 'MILILITRO', 'UNIDAD'.
     * `convert(amount, fromUnit, toUnit)`:
       - Si ambas unidades normalizadas son iguales, retornar `amount`.
       - Masa: Factor base en Gramos (`KG`: 1000, `G`: 1, `MG`: 0.001).
       - Volumen: Factor base en Mililitros (`L`: 1000, `ML`: 1, `OZ`: 29.5735).
       - Si pertenecen a la misma familia, calcular: `(amount * factorFrom) / factorTo`.
       - Si son incompatibles o no reconocidas, retornar `amount` sin distorsionar.
     * `getConversionFactor(fromUnit, toUnit)`: Retorna el multiplicador numérico entre dos unidades compatibles.

2. Modificar `apps/api/src/production/production.repository.js`:
   - Importar `UnitConverter` desde `../common/utils/unit-converter.js`.
   - En el cálculo del BOM de insumos regulares (líneas ~283-303):
     * Antes de calcular `costoTeorico` y comparar `stockFisico`, convertir la cantidad requerida de la receta a la unidad base del insumo:
       `const cantEnUnidadBase = UnitConverter.convert(reqTeorico, det.unidad, insumo.unidadBase);`
     * Utilizar `cantEnUnidadBase` para el descuento físico de stock y el cálculo de costo.

3. Modificar `apps/api/src/inventory/inventory.service.js`:
   - Importar `UnitConverter`.
   - Al mapear los ítems de inventario para calcular `valorTotal`:
     * Extraer la unidad base del insumo y la unidad del precio registrado.
     * Si el precio está registrado por Kilogramo/Litro y el stock físico está en Gramos/Mililitros, convertir el costo a la unidad base real usando `UnitConverter.getConversionFactor`.
     * `valorTotal = Number(stockActual) * Number(costoPorUnidadBase);`
     * Garantizar que `metadata.valorTotalBodega` acumule este valor correcto.

VERIFICACIÓN:
1. `node --check apps/api/src/common/utils/unit-converter.js`
2. `node --check apps/api/src/production/production.repository.js`
3. `node --check apps/api/src/inventory/inventory.service.js`
4. `pnpm --filter api build`

CRITERIO DE FINALIZACIÓN:
- La valorización de "YOGUR GRIEGO" en bodega refleja su costo real proporcional a sus 1.603 g (no multiplicado por 1.000).
- La deducción de BOM en producción respeta las unidades de receta (g, ml, L, kg).
- `pnpm build` compila con 0 errores.

DETENCIÓN:
Al validar sintaxis y verificar compilación limpia, DETENTE inmediatamente.
