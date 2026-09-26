# Auditoría Técnica Forense: Fase 1 — Mapa Transversal de Unidades

> **Documento:** Auditoría de Unidades, Cálculos y Precisión Numérica (Fase 1)  
> **Directiva base:** `apps/prompts/implememtacion/backend/auditorias/01-auditoria-transversal-unidades-calculos-precision-numerica.md`  
> **Estado:** Fase 1 completada. Fases 2 a 11 pendientes de autorización.

---

## 1. Resumen Ejecutivo y Hallazgos Principales

- **Interpretación de `oz`**: En el backend (`apps/api/src/common/utils/unit-converter.js`, L56), `OZ` se interpreta **estrictamente como volumen (onza líquida / fl oz)** con el factor:
  $$\text{1 OZ} = 29.5735\text{ ml}$$
  En `apps/api/src/recipes/recipes.service.js` (L35), `ONZAS / OZ` se clasifica bajo el comentario de *"Patrones de masa/volumen anglosajón"* sin factor de conversión numérico ni discriminación formal frente a onzas avoirdupois (masa = 28.3495 g).
- **Dualidad de Normalizadores**: Coexisten dos utilidades desacopladas en el backend:
  1. `UnitConverter` (`apps/api/src/common/utils/unit-converter.js`): Maneja `G`, `KG`, `MG`, `ML`, `L`, `OZ`, `UND`, `PAQ`.
  2. `unitNormalizer.js` (`apps/api/src/utils/unitNormalizer.js`): Maneja `g`, `kg`, `ml`, `l`, `und`, pero omite por completo `oz` y `mg`.
  3. En `apps/api/src/purchases/purchases.repository.js` (L173), existe lógica ad-hoc: `['Lt', 'Lts', 'Kg', 'Kgs'].includes(currentInsumo.unidadBase)`.

---

## 2. Matriz Transversal de Unidades Reales en Código

| Unidad Real en Código | Módulo | Rol Funcional | Archivo | Línea |
| :--- | :--- | :--- | :--- | :--- |
| `g`, `gr`, `grs`, `gramo`, `gramos` | Insumos / Producción / Recetas | Unidad Base / Consumo Masa Pequeña | `apps/api/src/utils/unitNormalizer.js` | L10-11 |
| `kg`, `kgs`, `kilo`, `kilos`, `kilogramo` | Insumos / Compras / Recetas | Unidad Base / Compra Mayorista | `apps/api/src/common/utils/unit-converter.js` | L14-18 |
| `mg`, `miligramo`, `miligramos` | Insumos / Formulación | Micro-ingredientes (Cultivos, Conservantes) | `apps/api/src/common/utils/unit-converter.js` | L19-21 |
| `ml`, `mls`, `mililitro`, `mililitros`, `cc`| Presentaciones / Recetas / Lotes | Unidad Base Volumen / Capacidad Envase | `apps/api/src/utils/unitNormalizer.js` | L13 |
| `l`, `lt`, `lts`, `litro`, `litros` | Producción / WIP / Recetas | Rendimiento Base / Volumen Granel | `apps/api/src/production/production.repository.js` | L945, L994 |
| `oz`, `onza`, `onzas` | Presentaciones / Envases | Volumen Comercial Envase ($29.5735\text{ ml}$) | `apps/api/src/common/utils/unit-converter.js` | L56 |
| `und`, `unidad`, `unidades`, `pza` | Presentaciones / Empaque / Inventario | Conteo Discreto / Unidades Físicas | `apps/api/src/production/production.repository.js` | L18 |
| `vaso`, `botella`, `tapa`, `etiqueta` | Producción / Empaque Primario | Unidades Discretas con `Math.ceil()` | `apps/api/src/production/production.repository.js` | L18 |
| `paquete`, `paq` | Insumos / Compras | Agrupación Comercial Compra | `apps/api/src/common/utils/unit-converter.js` | L43-44 |

---

## 3. Tabla de Hallazgos (Formato Estándar)

| ID | Severidad | Módulo | Archivo | Línea | Campo | Problema | Valor/unidad | Fórmula actual | Comportamiento esperado | Ejemplo numérico | Impacto | Condición que lo dispara | Evidencia | Recomendación |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **HAL-F1-01** | **ALTO** | Utilidades / Conversión | `unit-converter.js` vs `unitNormalizer.js` | L56 / L13 | Normalización de `oz` | Dualidad de normalizadores; `unitNormalizer` ignora `oz` retornando el string original sin normalizar, mientras `UnitConverter` lo toma como $29.5735\text{ ml}$. | `oz` | `toCanonicalUnit('oz') => 'oz'` (sin factor) | Normalizador único con soporte explícito y canónico de `oz` | Si entra `'4 oz'`, un normalizador da `'oz'` con factor 1 (desconocido) y el otro da factor $29.5735$ | Fórmulas que usen `unitNormalizer.js` fallan silenciosamente al convertir empaques en onzas a ml | Uso de presentación comercial en onzas con compras o fórmulas que llamen a `unitNormalizer.js` | Archivos `unit-converter.js` y `unitNormalizer.js` en paralelo | Unificar en un solo módulo de conversión canónica |
| **HAL-F1-02** | **MEDIO** | Producción | `production.repository.js` | L945 | `unidadLote` | Hardcoding de unidad en creación de lote: fuerza `'Litros'` si es intermedio o `'UNIDAD'` si es producto final, ignorando la unidad real de la presentación del producto. | `unidad` | `esIntermedio ? 'Litros' : 'UNIDAD'` | Heredar `presentacion.unidadMedida` o la unidad de rendimiento de la receta | Para un producto final empacado de $150\text{ g}$ o $250\text{ ml}$, el lote queda etiquetado como `'UNIDAD'`, perdiendo la unidad volumétrica/gravimétrica real en el registro del lote | Dificultad para cotejar balances de masa/volumen totales en inventario de cava | Cierre de orden de producción en `complete()` | Código en línea 945 de `production.repository.js` | Asignar explícitamente la unidad correspondiente a la presentación |

---

## 4. Conteo por Severidad
- **CRÍTICO:** 0
- **ALTO:** 1 (`HAL-F1-01`)
- **MEDIO:** 1 (`HAL-F1-02`)
- **BAJO:** 0

---

## 5. Lista de `NO VERIFICADO`
1. `NO VERIFICADO`: Si existe algún insumo registrado cuya unidad comercial sea onza de peso (avoirdupois, p. ej. polvos o esencias importadas) que esté siendo incorrectamente convertida como volumen ($29.5735\text{ ml}$) en lugar de masa ($28.3495\text{ g}$). Requiere auditoría de la base de datos de insumos en producción.
