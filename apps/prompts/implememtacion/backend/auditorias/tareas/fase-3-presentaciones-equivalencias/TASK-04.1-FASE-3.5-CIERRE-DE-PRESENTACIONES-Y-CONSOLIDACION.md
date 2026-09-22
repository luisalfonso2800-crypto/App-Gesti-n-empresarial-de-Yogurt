# FASE 3.5 — CIERRE DE PRESENTACIONES Y CONSOLIDACIÓN

## Reglas
- NO modificar código.
- NO avanzar a Fase 4.
- Máximo 300 palabras. Solo tabla + aclaraciones.

## Tareas

### T1. Aclarar duplicidad HAL-F1-02 ↔ HAL-F3-02
Añadir nota a HAL-F3-02:
"HAL-F1-02 es el síntoma (hardcoding en producción L945).
HAL-F3-02 es la causa raíz (unidadMedida no se propaga).
Consolidar como un único hallazgo CRÍTICO en informe final."

### T2. Reclasificar HAL-F3-03 de MEDIO a CRÍTICO
Ejemplo numérico:
Tanque granel 500 L → inyección forzada 1000 ml → error 500x (99.8%).
Impacto: costoUnidadBase subestimado 99.8% en todas las presentaciones
derivadas del granel.

### T3. Formalizar HAL-F3-05
Problema: cantidadOz asume densidad 1.0 en presentaciones de masa.
Ejemplo: Vaso 500g → cantidadOz: 16.9 (asume 500 ml).
Si densidad real = 1.03 (yogur) → volumen real = 485 ml → oz correctas = 16.4.
Error: 3% en presentación de masa.
Severidad: ALTO.
Conexión: HAL-F1-01 (dualidad oz) + HAL-F2-03 (densidad leche).

### T4. Cuantificar conexión con HAL-F1-04
Ejemplo: Cantina 40 L → no escala en compras (espera 'Lt'/'Lts').
Ingresan 40 al stock en vez de 40.000 ml. Factor error 1000.

### T5. Actualizar conteo
Fase 3: CRÍTICO 2, ALTO 3, MEDIO 0. Total 5.
Acumulado: 9 CRÍTICOS + 7 ALTOS = 16 (15 distintos tras consolidar F1-02/F3-02).

## Entrega
- Tabla final Fase 3 con HAL-F3-01 a HAL-F3-05.
- Nota de duplicidad F1-02 ↔ F3-02.
- Conteo actualizado.
- Máximo 300 palabras.
- DETENERSE. Listo para autorizar Fase 4.