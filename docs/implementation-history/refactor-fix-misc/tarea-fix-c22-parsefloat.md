# FIX CRÍTICO — parseFloat || 1 convierte 0 en 1 (HAL-F11-05)

## ⚠️ REGLAS
1. Modelo: Gemini Flash (Low).
2. LÍMITES: 10 lecturas, 3 ediciones.
3. SÍ tocar código de producción.
4. DETENERSE al terminar.

## Contexto
La auditoría forense de C22 encontró un bug CRÍTICO de producción:
Archivo: `apps/web/src/app/operations/purchases/new/components/parts/FormPhaseRowItem.jsx`
Línea: 22

```javascript
const contNetoNum = parseFloat(row.contenidoNeto) || 1;
```

Cuando `row.contenidoNeto === '0'`, `parseFloat('0')` retorna `0`. En JavaScript `0 || 1` evalúa a `1`, convirtiendo el 0 en 1 y produciendo cálculos erróneos (ej. 5 empaques x 0 = 5 kg en vez de 0).

## Tarea
Corregir la derivación de `contNetoNum` en producción para que respete el 0 numérico y solo use fallback 1 si el valor es NaN o indefinido.
