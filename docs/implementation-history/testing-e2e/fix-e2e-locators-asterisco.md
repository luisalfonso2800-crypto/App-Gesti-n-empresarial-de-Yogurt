# FIX E2E — LOCATORS DE CAMPOS CON ASTERISCO

## ⚠️ REGLAS
1. Modelo: Gemini Flash (Low).
2. NO ejecutar Playwright.
3. LÍMITES: 5 lecturas, 3 ediciones.
4. NO tocar código de producción.
5. DETENERSE al terminar.

## Contexto
Los tests T05-T07, T25-T35, T44 fallan con timeout de 20s.
El Trace Viewer mostró antes que se cuelgan al interactuar con
campos del formulario.

Causa raíz probable: los labels reales tienen asterisco
(por ejemplo, "MARCA *" o "STOCK MÍNIMO *"), y
getByLabel(/marca/i) no matchea porque el asterisco
está en el mismo nodo.

Fix: añadir fallback a input[name="..."] con .or().

## Tarea

### Paso 1 — Corregir locators en helpers/supply-modal.js

Buscar:
```javascript
brandInput: page.getByLabel(/marca/i),
stockInput: page.getByLabel(/stock m[ií]nimo/i),
densityInput: page.getByLabel(/densidad/i),
costInput: page.getByLabel(/costo base referencial/i),