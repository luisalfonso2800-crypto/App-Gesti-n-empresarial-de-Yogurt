# FASE 3 — PRESENTACIONES Y EQUIVALENCIAS BASE (PENDIENTE DE ESPECIFICACIÓN)
# FASE 3 — PRESENTACIONES Y EQUIVALENCIAS BASE

## Reglas heredadas
- NO modificar código.
- NO asumir que un campo existe porque su nombre lo sugiere.
- Si no se puede demostrar, marcar NO VERIFICADO.
- Máximo 1500 palabras. Tablas > prosa.
- DETENERSE al terminar. No avanzar a Fase 4.

## Contexto heredado (11 hallazgos previos)
Fase 1 (unidades):
- HAL-F1-01: dualidad normalizadores oz
- HAL-F1-02: hardcoding 'UNIDAD'/'Litros' en lotes
- HAL-F1-03: heurística costoUnitario > 100
- HAL-F1-04: escalado ['Lt','Lts','Kg','Kgs'] en compras
- HAL-F1-05: extractCanonicalUnit tercer normalizador
- HAL-F1-06: areUnitsCompatible('oz','ml') = false

Fase 2 (dimensional):
- HAL-F2-01: areUnitsCompatible rechaza misma magnitud distinta escala
- HAL-F2-02: descuento stock sin normalizar + Math.max(0,...) oculta error
- HAL-F2-03: 1 L = 1000 g asumido sin densidad (leche 3.2% error)
- HAL-F2-04: extractCanonicalUnit no reconoce VASO/TAPA/ETIQUETA (CRÍTICO)
- HAL-F2-05: mg no soportado en clasificadores

## Tareas

### T1. Inventario de campos de presentación
Buscar en schema.prisma y DTOs:
- cantidadPresentacion
- cantidadEquivalenteBase
- cantidadOz
- cantidadMl
- unidadMedida
- presentacion.unidad
Para cada uno: tipo, escala, semántica inferida, uso.

### T2. Trazar equivalencia 1 presentación = X unidad base
Elegir 4 presentaciones reales de seed-test-data.js (ej. Vaso 150 g,
Botella 500 ml, Lata 3.5 oz, Caja 12 und).
Para cada una:
- cantidadPresentacion declarada
- cantidadEquivalenteBase esperada
- cantidadEquivalenteBase real en código
- ¿Se respeta en compra? ¿En inventario? ¿En producción? ¿En venta?
- Ejemplo numérico: 1 presentación → X unidad base, verificado.

### T3. Auditoría específica de cantidadOz
- ¿Qué significa cantidadOz en el schema?
- ¿Es volumen (fl oz = 29.5735 ml) o masa (oz av = 28.3495 g)?
- ¿Cómo se relaciona con cantidadEquivalenteBase?
- Si presentación es "Vaso 3.5 oz", ¿qué valor tiene cantidadEquivalenteBase?
- ¿Hay contradicción con HAL-F1-01?

### T4. Consistencia presentación ↔ inventario ↔ venta
- ¿La unidad de inventario del insumo/producto coincide con la
  unidad base de la presentación?
- Si presentación = "Caja 12 und", ¿el inventario trackea 12 und o 1 caja?
- Al vender 1 unidad, ¿se descuenta 1/12 de la caja?

### T5. Buscar conversiones ad-hoc de presentación
Grep por patterns: cantidadPresentacion *, cantidadEquivalenteBase *,
.unidadMedida, factorConversion, presentacion.*cantidad.
Documentar dónde se hace la conversión y si es consistente.

### T6. Relación con Fase 1 y Fase 2
¿Los hallazgos de presentación amplifican HAL-F1-04 (escalado compras)
o HAL-F2-02 (descuento stock)?

## Formato de hallazgos
ID: HAL-F3-XX
Severidad | Archivo | Línea | Campo | Problema |
Fórmula/lógica actual | Comportamiento esperado |
Ejemplo numérico | Impacto | Condición que lo dispara.

## Entrega
- Inventario de campos de presentación (T1)
- Tabla de equivalencias (T2)
- Auditoría cantidadOz (T3)
- Consistencia presentación↔inventario↔venta (T4)
- Conversiones ad-hoc (T5)
- Conteo por severidad
- NO VERIFICADO
- Máximo 1500 palabras
- DETENERSE