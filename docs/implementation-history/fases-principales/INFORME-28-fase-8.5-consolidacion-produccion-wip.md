# INFORME-28: FASE 8.5 — CONSOLIDACIÓN DE PRODUCCIÓN Y WIP

> **Documento:** Consolidación de Lotes y Recetas, Formalización de Ambigüedad de Unidades y Cuadre de Conteo  
> **Directiva base:** `TASK-09.1-FASE-8.5-CONSOLIDACION-PRODUCCION-Y-WIP.md`  
> **Estado:** Fase 8 cerrada formalmente. Fase 9 habilitada.

---

## 1. Reformulación Integral de HAL-F3-02 (T1)

### **HAL-F3-02 (CRÍTICO Maestro): Desconexión Estructural de Unidades en Generación de Lotes**
En `production.repository.js` L945 (`unidadLote = esIntermedio ? 'Litros' : 'UNIDAD'`), se consolida definitivamente absorbiendo el síntoma de hardcoding (`HAL-F1-02`) y la omisión de receta (`HAL-F8-03`), documentando sus **dos causas raíz simultáneas**:
1. **Omisión de `Presentacion.unidadMedida` (Causa Raíz Comercial):** Un producto empacado (ej. Vaso 500g) ignora su unidad física (`g`/`ml`) y se fuerza a `'UNIDAD'`.
2. **Omisión de `Receta.unidadRendimiento` (Causa Raíz de Ingeniería):** Un semielaborado formulado en `Gramos` o `Kilogramos` se fuerza ciegamente a `'Litros'` por ser categoría `INTERMEDIO_WIP`.
- *Resultado:* **No se crea `HAL-F8-03`** como ID independiente; queda unificado en este hallazgo maestro.

---

## 2. Formalización de HAL-F8-04: Polimorfismo Ambiguo de Producción (T2)

| ID | Severidad | Módulo / Ubicación | Problema Técnico Detectado | Impacto Cuantificado Demostrado |
| :--- | :--- | :--- | :--- | :--- |
| **HAL-F8-04** | **ALTO** | `schema.prisma` (`Produccion`) / `production.repository.js` | La tabla `Produccion` carece de columna de unidad de medida. La semántica física de `cantidadPlanificada` y `cantidadProducidaReal` depende exclusivamente del condicional dinámico en runtime `producto.categoria === 'INTERMEDIO_WIP'`. | Si un producto intermedio se reclasifica o consulta históricamente, el sistema reinterpreta 100 Litros de base láctea como 100 Unidades discretas ($100\text{ L} \to 100\text{ und}$), corrompiendo la trazabilidad histórica de planta y el cálculo de rendimientos. |

---

## 3. Nota Técnica de Acoplamiento: HAL-F4-03 $\leftrightarrow$ HAL-F8-02 (T3)

Ambos hallazgos representan la **ausencia de Poka-Yoke matemático en el motor de explosión de recetas** (`production.repository.js`):
- **`HAL-F4-03`:** Enmascara la división por cero (`rendimientoBase = 0`) cayendo en `|| 1`, inflando el BOM por $100\times$.
- **`HAL-F8-02`:** Omite validación de rango físico en merma ($0 \le m < 100$), permitiendo mermas negativas o expansiones absurdas ($>100\%$).
- *Dictamen:* Se mantienen con IDs separados por requerir validaciones distintas (Diferenciación: validación de cabecera vs validación de ingrediente).

---

## 4. Conteo Consolidado Actualizado (T4)

- **Fase 8 Aporta:**
  - **CRÍTICO:** 1 (`HAL-F8-01` - factor 1000x en transferencia de costo WIP).
  - **ALTO:** 2 (`HAL-F8-02` - merma sin rango, `HAL-F8-04` - polimorfismo sin unidad).
  - **MEDIO:** 0.
- **Acumulado Transversal Único (Fases 1 a 8):**
  - **CRÍTICO:** 15 *(14 previos + HAL-F8-01)*
  - **ALTO:** 14 *(12 previos + HAL-F8-02 + HAL-F8-04)*
  - **MEDIO:** 3 *(HAL-F4-06, HAL-F6-03, HAL-F7-04)*
  - **Total Oficial:** **32 hallazgos únicos consolidados**.

---
**FASE 8 COMPLETADA Y CONSOLIDADA. DETENIDO SEGÚN REGLA. LISTO PARA FASE 9.**
