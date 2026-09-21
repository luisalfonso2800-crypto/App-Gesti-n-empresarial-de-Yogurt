TAREA CONTROLADA — AUDITORÍA LIGERA Y PLAN MAESTRO DE MODULARIZACIÓN (BAJO CONSUMO DE TOKENS)

OBJETIVO TÉCNICO
Generar el plan maestro de modularización integral para `apps/web` optimizando el consumo de cuota/tokens.
PROHIBIDO VOLCAR ARCHIVOS COMPLETOS EN EL CONTEXTO. 
La IA debe apoyarse en inspección de metadatos mediante scripts rápidos de Node.js o comandos de terminal para inventariar métricas sin saturar la ventana de contexto.

REGLAS DE BAJO CONSUMO (AHORRO DE TOKENS)
1. NO leer código fuente entero de componentes no prioritarios.
2. Para inventariar tamaños de archivo y líneas de código, ejecutar un script rápido de node que mida `lineCount` de cada `page.jsx` en `apps/web/src/app`.
3. Solo inspeccionar imports/exports (cabeceras) para mapear dependencias cruzadas.
4. MODO DE SOLO LECTURA: PROHIBIDO crear, editar o eliminar archivos de código (.jsx, .js, .css).
5. Salida requerida: redactar el informe estructurado directamente en `docs/arquitectura/PLAN_MAESTRO_MODULARIZACION_FRONTEND.md`.

MÉTODO DE INSPECCIÓN EFICIENTE (EJEMPLO VIA TERMINAL/NODE)
Ejecutar un runner rápido en consola para obtener métricas sin cargar texto al prompt:
`node -e "const fs = require('fs'), path = require('path'); function walk(d){ let res=[]; fs.readdirSync(d).forEach(f=>{ let p=path.join(d,f); if(fs.statSync(p).isDirectory()) res.push(...walk(p)); else if(f.endsWith('.jsx')) res.push({file: p, lines: fs.readFileSync(p,'utf8').split('\n').length}); }); return res; } console.log(walk('apps/web/src/app').filter(x => x.lines > 120).sort((a,b)=>b.lines-a.lines));"`

CONTENIDO DEL INFORME REQUERIDO

1. Matriz de Auditoría (Resumen Tabular):
   - Ruta de cada `page.jsx`.
   - Cantidad de líneas actuales.
   - Diagnóstico rápido de responsabilidades mezcladas (UI, Fetch, Form State, Modales).

2. Catálogo de Lógica Duplicada Identificada:
   - Detección de funciones redundantes (manejadores de carritos, formateadores de moneda, lógica de toasts, diálogos modales repetidos).

3. Estándar de Modularización Atómica:
   - Definición del patrón arquitectural de 3 capas por pantalla:
     * `page.jsx`: Orquestador (< 100 líneas).
     * `hooks/`: Extracción de lógica (`use...Data.js`, `use...Actions.js`).
     * `components/`: Componentes atómicos de presentación.

4. Estándar JSDoc de Trazabilidad Cruzada:
   - Plantilla obligatoria con `@file`, `@module`, `@description`, `@responsibility`, `@usedBy`, `@dependencies`.

5. Roadmap de Refactorización Progresiva (Fases):
   - Fase 1: Operaciones (`purchases`, `inventory`, `production`, `batches`).
   - Fase 2: Catálogos (`supplier-prices`, `supplies`, `suppliers`, `recipes`, `products`).
   - Fase 3: Comercial (`sales`, `customers`, `payments`, `expenses`).
   - Fase 4: Shell y Componentes Compartidos (`Header`, `Sidebar`, UI).

FORMATO DE ENTREGA
Crear exclusivamente el archivo:
`docs/arquitectura/PLAN_MAESTRO_MODULARIZACION_FRONTEND.md`
Reportar un resumen de la matriz de archivos críticos detectados.