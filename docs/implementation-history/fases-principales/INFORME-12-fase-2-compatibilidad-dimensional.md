# INFORME-12: FASE 2 — COMPATIBILIDAD DIMENSIONAL

> **Documento:** Auditoría Exhaustiva de Compatibilidad Dimensional, Clasificadores y Magnitudes Físicas  
> **Directiva base:** `apps/prompts/implememtacion/backend/auditorias/tareas/fase-2-compatibilidad-dimensional/TASK-03-FASE-2-COMPATIBILIDAD-DIMENSIONAL.md`  
> **Estado:** Fase 2 completada al 100%. Código intacto (auditoría de solo lectura).

---

## 1. Inventario de Clasificadores Dimensionales (T1)

| Sistema Clasificador | Archivo | Líneas | Categorías Manejadas | Unidades Cubiertas |
| :--- | :--- | :--- | :--- | :--- |
| **`UnitConverter`** | `apps/api/src/common/utils/unit-converter.js` | L7-57 | MASA (`G`, `KG`, `MG`), VOLUMEN (`ML`, `L`, `OZ`), UNIDADES (`UND`, `PAQ`) | `G`, `GR`, `GRS`, `GRAMO`, `GRAMOS`, `KG`, `KGS`, `KILO`, `KILOGRAMO`, `KILOGRAMOS`, `MG`, `MILIGRAMO`, `MILIGRAMOS`, `ML`, `MILILITRO`, `MILILITROS`, `L`, `LT`, `LTS`, `LITRO`, `LITROS`, `OZ`, `ONZA`, `ONZAS`, `UND`, `UNID`, `UNIDAD`, `UNIDADES`, `PZA`, `PIEZA`, `PAQUETE`, `PAQ`. |
| **`unitNormalizer` (Frontend)** | `apps/web/src/utils/unitNormalizer.js` | L1-37 | MASA (`g`, `kg`), VOLUMEN (`ml`, `l`), UNIDADES (`und`) | `g`, `gr`, `grs`, `gramo`, `gramos`, `kg`, `kgs`, `kilo`, `kilos`, `kilogramo`, `kilogramos`, `ml`, `mls`, `mililitro`, `mililitros`, `cc`, `l`, `lt`, `lts`, `litro`, `litros`, `und`, `unidad`, `unidades`, `pza`, `piezas`. *(Omite totalmente `oz` y `mg`)*. |
| **`extractCanonicalUnit`** | `apps/api/src/recipes/recipes.service.js` | L19-38 | VOLUMEN (`LITROS`, `MILILITROS`), MASA (`KILOGRAMOS`, `GRAMOS`), CONTEO (`UNIDADES`), ANGLOSAJÓN (`ONZAS`) | `LITRO`, `LITROS`, `LT`, `LTS`, `L`, `MILILITRO`, `MILILITROS`, `ML`, `KILOGRAMO`, `KILOGRAMOS`, `KG`, `KGS`, `KILO`, `KILOS`, `GRAMO`, `GRAMOS`, `G`, `GR`, `GRS`, `UNIDAD`, `UNIDADES`, `UND`, `UNDS`, `PZA`, `PZAS`, `UNID`, `UNIDS`, `ONZA`, `ONZAS`, `OZ`. |
| **`areUnitsCompatible`** | `apps/api/src/recipes/recipes.service.js` | L46-63 | Coincidencia exacta o igualdad estricta de string tras `extractCanonicalUnit`. | No maneja magnitudes abstractas; exige que la etiqueta canónica sea idéntica. |
| **`UNIDADES_DISCRETAS`** | `apps/api/src/production/production.repository.js` | L18 | Discretas / Indivisibles (fuerza `Math.ceil`) | `UNIDAD`, `UNIDADES`, `UND`, `PZA`, `PIEZA`, `VASO`, `BOTELLA`, `TAPA`, `ETIQUETA`. |
| **`isReqSmallUnit` / `isLoteInLiters`** | `apps/api/src/production/production.repository.js` | L195-212 | Heurística ad-hoc inline | `g`, `ml`, `gramos`, `litros`, `l`. |

---

## 2. Auditoría de `areUnitsCompatible` (T2)

### Implementación Literal (`apps/api/src/recipes/recipes.service.js` L46-63)
```javascript
function areUnitsCompatible(unitA, unitB) {
  if (!unitA || !unitB) return false;
  const a = String(unitA).trim().toUpperCase();
  const b = String(unitB).trim().toUpperCase();

  if (a === b) return true;

  const canA = extractCanonicalUnit(a);
  const canB = extractCanonicalUnit(b);

  if (canA && canB && canA === canB) {
    return true;
  }

  return false;
}
```

### Mecanismo de Falla y Falsos Negativos
`areUnitsCompatible` **NO compara dimensiones físicas (masa/volumen/conteo)**. Compara si el token resultante de `extractCanonicalUnit` es idéntico:
1. `extractCanonicalUnit('OZ')` $\to$ `'ONZAS'`
2. `extractCanonicalUnit('ML')` $\to$ `'MILILITROS'`
3. `extractCanonicalUnit('L')` $\to$ `'LITROS'`
4. `extractCanonicalUnit('G')` $\to$ `'GRAMOS'`
5. `extractCanonicalUnit('KG')` $\to$ `'KILOGRAMOS'`

Como `'ONZAS'` $\neq$ `'MILILITROS'`, `'MILILITROS'` $\neq$ `'LITROS'`, y `'GRAMOS'` $\neq$ `'KILOGRAMOS'`, la función **retorna `FALSE` para unidades de la misma dimensión física**:

| Par Evaluado | Dimensión Física Real | Retorno de `areUnitsCompatible` | Esperado | Efecto en Planta |
| :--- | :--- | :--- | :--- | :--- |
| `oz` vs `ml` | VOLUMEN | ❌ **`false`** | `true` | Bloquea guardado de receta con `BadRequestException`. |
| `oz` vs `l` | VOLUMEN | ❌ **`false`** | `true` | Bloquea guardado de receta con `BadRequestException`. |
| `l` vs `ml` | VOLUMEN | ❌ **`false`** | `true` | Si insumo es `Litros` y receta pide `ml`, ¡rechaza la receta! |
| `kg` vs `g` | MASA | ❌ **`false`** | `true` | Si insumo es `Kilogramos` y receta pide `g`, ¡rechaza la receta! |
| `und` vs `pza` | CONTEO | ✅ `true` | `true` | Coinciden en `'UNIDADES'`. |
| `vaso` vs `und`| CONTEO | ❌ **`false`** | `true` | `vaso` no está en `extractCanonicalUnit` $\to$ rechazo. |

---

## 3. Matriz de Coherencia Cruzada entre Clasificadores (T3)

| Unidad Evaluada | `UnitConverter` (API) | `unitNormalizer` (Web) | `extractCanonicalUnit` (API) | `UNIDADES_DISCRETAS` (Repo) | Divergencia / Dictamen |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`g`** | MASA (`G`, factor 1) | MASA (`g`) | MASA (`GRAMOS`) | No aplica | Homogéneo en Masa. |
| **`kg`** | MASA (`KG`, factor 1000) | MASA (`kg`) | MASA (`KILOGRAMOS`) | No aplica | Homogéneo en Masa. |
| **`mg`** | MASA (`MG`, factor 0.001) | ❌ *No soportado* | ❌ *No mapeado* (queda `MG`) | No aplica | **Grave fractura dimensional**. |
| **`ml`** | VOLUMEN (`ML`, factor 1) | VOLUMEN (`ml`) | VOLUMEN (`MILILITROS`) | No aplica | Homogéneo en Volumen. |
| **`l` / `lt`** | VOLUMEN (`L`, factor 1000) | VOLUMEN (`l`) | VOLUMEN (`LITROS`) | No aplica | Homogéneo en Volumen. |
| **`oz`** | VOLUMEN (`OZ`, factor 29.57) | ❌ *Factor 1 neutro* | ANGLOSAJÓN (`ONZAS`) | No aplica | **CRÍTICO: Dualidad y bloqueo**. |
| **`und`** | CONTEO (`UND`) | CONTEO (`und`) | CONTEO (`UNIDADES`) | CONTEO (`UND`) | Homogéneo. |
| **`vaso`** | ❌ *Sinónimo ausente* | ❌ *No soportado* | ❌ *No mapeado* | CONTEO (`VASO`) | **Fractura en validación**. |
| **`tapa`** | ❌ *Sinónimo ausente* | ❌ *No soportado* | ❌ *No mapeado* | CONTEO (`TAPA`) | **Fractura en validación**. |
| **`etiqueta`** | ❌ *Sinónimo ausente* | ❌ *No soportado* | ❌ *No mapeado* | CONTEO (`ETIQUETA`) | **Fractura en validación**. |
| **`paq`** | CONTEO (`PAQ`) | ❌ *No soportado* | ❌ *No mapeado* | ❌ *No listado* | Sin soporte transversal. |

---

## 4. Auditoría de Conversiones Masa ↔ Volumen y Densidad (T4)

- **Búsqueda exhaustiva:** Ningún archivo de backend, frontend o schema Prisma define `densidad`, `density` ni gravedad específica.
- **Asunciones y Violación de la Precondición 2:**
  1. En `apps/api/src/production/production.repository.js` L195-212 y L425-429:
     ```javascript
     const isReqSmallUnit = detUnidad === 'g' || detUnidad === 'ml' || detUnidad === 'gramos';
     // ...
     if (isReqSmallUnit && isLoteInLiters) {
       qtyConvertida = rawLoteQty * 1000;
     } else if (!isReqSmallUnit && (loteUnidad === 'g' || loteUnidad === 'ml')) {
       qtyConvertida = rawLoteQty / 1000;
     }
     ```
     Trata indistintamente `'g'` y `'ml'`, y los equipara con un factor directo de $1000$ a `'litros'`.
  2. **Impacto en Leche y Base Láctea:** La leche entera fluida tiene una densidad de $1.032\text{ g/ml}$.
     - $1\text{ Litro}$ de leche pesa $1032\text{ g}$.
     - El sistema calcula: $1\text{ L} = 1000\text{ g}$.
     - **Error sistemático:** $\mathbf{3.2\%}$ de pérdida de masa en formulación y balance de materia por cada batch.
  3. En `apps/api/src/recipes/recipes.service.js` L294-296:
     Para productos a granel/intermedios WIP se permite indiscriminadamente: `['Litros', 'Kilogramos', 'Gramos', 'Mililitros']`.

---

## 5. Operaciones Directas entre Magnitudes Incompatibles (T5)

1. **Deducción de Inventario en Consumo Real (`production.repository.js` L732-745):**
   ```javascript
   const stockActual = Number(insumo.inventario.cantidadActual) || 0;
   const stockFinal = Math.max(0, stockActual - qtyReal);
   ```
   `qtyReal` proviene de `det.cantidadRealUtilizada` en la unidad formulada (`det.unidad`). Si el insumo está registrado en stock en `Kilogramos` y la receta formuló en `Gramos` (ej. 500 g), **resta directamente 500 al stock de kilogramos** en lugar de $0.5\text{ kg}$, dejando el stock en saldo negativo masivo o forzado a cero por `Math.max(0, ...)`.

---

## 6. Hallazgos Formalizados de la Fase 2

| ID | Severidad | Módulo | Archivo | Línea | Unidades | Problema Técnico | Impacto Demostrado | Condición |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **HAL-F2-01** | **CRÍTICO** | Recetas / Validación | `recipes.service.js` | L46-63 | `l`-`ml`, `kg`-`g`, `oz`-`ml` | `areUnitsCompatible` rechaza escalas de la misma magnitud (exige igualdad canónica de string). | Receta con insumo base en `Litros` rechaza formulación en `ml` (`BadRequestException`). | Guardar receta con submúltiplos del insumo. |
| **HAL-F2-02** | **CRÍTICO** | Producción / Kardex | `production.repository.js` | L735 | Stock insumo vs `det.unidad` | `stockFinal = stockActual - qtyReal` sin normalizar a `insumo.unidadBase`. | Stock en `Kg` (10 kg); consumo real 500 `g`. Resta $10 - 500 \to 0\text{ kg}$ (pérdida de 9.5 kg en kardex). | Receta consumida en unidad distinta a la base del catálogo. |
| **HAL-F2-03** | **ALTO** | Producción / WIP | `production.repository.js` | L196-210 | `Litros` $\leftrightarrow$ `g`/`ml` | Equivalencia directa $1\text{ L} = 1000\text{ g}$ sin densidad en producto intermedio lácteo. | 1000 L de leche procesados equivalen a 1032 kg; el sistema computa 1000 kg (error de 32 kg / 3.2%). | Producción con lotes intermedios lácteos. |
| **HAL-F2-04** | **ALTO** | Catálogo / Recetas | `recipes.service.js` vs `production.repository.js` | L32 / L18 | `VASO`, `TAPA`, `ETIQUETA` | Insumos de empaque reconocidos en producción pero rechazados en `extractCanonicalUnit`. | Al validar receta, insumos con unidad `VASO` o `TAPA` no normalizan a `UNIDADES`. | Receta con unidad física de empaque nominal. |

---

## 7. Conteo Final por Severidad (Fase 2)

- **CRÍTICO:** 2 (`HAL-F2-01`, `HAL-F2-02`)
- **ALTO:** 2 (`HAL-F2-03`, `HAL-F2-04`)
- **MEDIO:** 0
- **BAJO:** 0  
**Total Hallazgos Fase 2:** **4**

---

## 8. Lista de `NO VERIFICADO`
- `Ninguno`: Todos los falsos negativos de `areUnitsCompatible`, la ausencia de campos de densidad en base de datos y la resta directa sin conversión en `production.repository.js` fueron verificados y demostrados directamente en el código fuente.

---
**DETENIDO SEGÚN REGLA. FASE 2 FINALIZADA AL 100%. NO SE AVANZA A FASE 3.**
