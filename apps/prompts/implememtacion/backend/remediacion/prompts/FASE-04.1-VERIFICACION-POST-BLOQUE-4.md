# VERIFICACIÓN POST-BLOQUE 4

## Tarea única
Grep en apps/api/src/production/production.repository.js:
- Buscar `densidad` en el archivo.
- Buscar `convertVolumeToMass`.
- Buscar `factor 1000` o `* 1000` o `/ 1000` en las líneas
  originalmente afectadas (L210-212, L425-429).

Resultado esperado:
- Si el código usa `densidad` y `convertVolumeToMass`: HAL-F2-03 RESUELTO.
- Si el código sigue usando `* 1000` directo: HAL-F2-03 PARCIAL.

## Entrega
- Cita literal de las líneas relevantes de production.repository.js.
- Dictamen: RESUELTO / PARCIAL.
- Si es PARCIAL: indicar qué falta y si se resuelve aquí o en Bloque 5.
- Máximo 150 palabras.
- DETENERSE.