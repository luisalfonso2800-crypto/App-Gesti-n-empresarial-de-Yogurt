# FASE 2: COMPATIBILIDAD DIMENSIONAL (PENDIENTE DE ESPECIFICACIÓN)
# FASE 2 — COMPATIBILIDAD DIMENSIONAL

## Reglas heredadas de Fase 1
- NO modificar código. NO refactorizar.
- NO asumir que una función existe o hace lo que su nombre dice.
- Si no se puede demostrar, marcar `NO VERIFICADO`.
- Máximo 1500 palabras. Tablas > prosa.
- Detenerse al terminar. No avanzar a Fase 3.

## Contexto heredado (usar como punto de partida, no como verdad)
Hallazgos activos de Fase 1:
- HAL-F1-01: dualidad de normalizadores oz (CRÍTICO)
- HAL-F1-02: hardcoding 'UNIDAD'/'Litros' en lotes (ALTO)
- HAL-F1-03: heurística costoUnitario > 100 (CRÍTICO)
- HAL-F1-04: escalado ['Lt','Lts','Kg','Kgs'] (CRÍTICO)
- HAL-F1-05: extractCanonicalUnit tercer normalizador (ALTO)
- HAL-F1-06: areUnitsCompatible('oz','ml') = false (CRÍTICO)

Precondiciones:
1. MASA y VOLUMEN son magnitudes distintas.
2. Auditoría de densidad implícita (1 L ≠ 1 kg).
3. Erradicar heurísticas de texto por enums.
4. Coherencia entre clasificadores dimensionales.
5. Resolver denegación funcional de areUnitsCompatible.

## Tareas

### T1. Inventario de clasificadores dimensionales
Identificar TODOS los sistemas que clasifican unidades por magnitud:
- UnitConverter (apps/api)
- unitNormalizer (apps/web)
- extractCanonicalUnit (recipes.service.js)
- areUnitsCompatible (¿dónde vive?)
- Cualquier otro.
Para cada uno: `archivo | línea | categorías que maneja | unidades cubiertas`.

### T2. Auditoría de areUnitsCompatible (prioridad máxima)
- Citar implementación literal.
- Determinar por qué 'ONZAS' no se clasifica como VOLUMEN.
- Enumerar TODAS las combinaciones que retornan false y no deberían.
- Candidatos a probar: oz-ml, oz-l, g-mg, kg-g, l-ml, und-pza, etc.
- Ejemplo numérico por cada falso negativo.

### T3. Verificar coherencia entre clasificadores
Matriz cruzada: para cada unidad (g, kg, mg, ml, l, oz, und, vaso,
tapa, etiqueta, paq), verificar cómo la clasifica cada uno de los
4 sistemas identificados en T1.
Divergencias → hallazgo CRÍTICO.

### T4. Buscar conversiones masa↔volumen
Grep por densidad, density, gravedad específica, kg/l, g/ml.
Si existe: documentar dónde se define y si depende del insumo.
Si no existe pero el código asume 1 L = 1 kg, documentar como
hallazgo (viola precondición 2).
Ejemplo: si el sistema trata "1 L de leche" como "1 kg de leche",
error real es ~3% (densidad leche ≈ 1.03 g/ml).

### T5. Buscar operaciones directas entre magnitudes incompatibles
Buscar patrones de suma/resta/división entre campos que puedan
ser de distinta magnitud. Ejemplo: stock (kg) - consumo (g) sin
conversión previa.

### T6. Verificar precondición 5
Además de HAL-F1-06, ¿hay otros casos donde areUnitsCompatible
bloquea combinaciones válidas?

## Formato de hallazgos
ID: HAL-F2-XX
Severidad | Archivo | Línea | Unidades involucradas |
Problema | Fórmula/lógica actual | Comportamiento esperado |
Ejemplo numérico demostrado | Impacto | Condición que lo dispara.

## Entrega
- Inventario de clasificadores (T1)
- Auditoría areUnitsCompatible (T2)
- Matriz de coherencia cruzada (T3)
- Hallazgos masa↔volumen (T4)
- Operaciones inter-magnitud (T5)
- Conteo por severidad
- NO VERIFICADO
- Máximo 1500 palabras
- DETENERSE. No avanzar a Fase 3.