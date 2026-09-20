TAREA (INVESTIGACIÓN Y DIAGNÓSTICO FORENSE - LECTURA EXCLUSIVA):
Investigar en frontend y backend por qué tras liquidar el lote con reserva de inóculo:
1) El lote se guardó con 5 litros completos en lugar de dividirse (3 L envasar / 2 L inóculo).
2) El lote hijo de inóculo no aparece en la tabla de Trazabilidad de Lotes (/operations/lots) ni en el inventario.
3) La tarjeta de la Bitácora no muestra el desglose del balance de masa.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA EXCLUSIVA: PROHIBIDO EDITAR O MODIFICAR CÓDIGO.
- Lee puntualmente los 5 archivos listados abajo e inspecciona el flujo de datos exacto.

ARCHIVOS A INSPECCIONAR:
1. `apps/web/src/app/operations/production/components/ProductionOrderCompleteModal.jsx` (revisar cómo arma y emite el payload de liquidación).
2. `apps/web/src/app/operations/production/hooks/useProductionPageData.js` (revisar la función que llama a completeProduction y qué datos envía en el body).
3. `apps/api/src/production/production.controller.js` o router (revisar si valida/recibe `reservaInoculo` o si lo descarta).
4. `apps/api/src/production/production.repository.js` (revisar la función `completeProduction` línea por línea en la creación de los lotes).
5. `apps/api/src/lots/lots.repository.js` (revisar la consulta `findAll` y qué filtros `where` o `include` tiene).

PREGUNTAS QUE DEBE RESPONDER EL INFORME:
1. ¿El frontend realmente está enviando `reservaInoculo` en la petición HTTP POST/PUT?
2. ¿El backend recibe ese campo o se descarta en el controlador/validador?
3. En el repositorio de producción, ¿qué impidió que se restaran los 2 Litros del lote principal y se creara el registro del lote hijo?
4. ¿Por qué la vista `/operations/lots` no muestra el lote hijo (filtro de tipoLote, query incompleto o no existe el registro en la base de datos)?
5. ¿Qué campos exactos devuelve `GET /production` para que la tarjeta de la bitácora decida qué renderizar?

DETENCIÓN:
Entrega un diagnóstico detallado con la causa raíz exacta y el plan de solución sin modificar ningún archivo. DETENTE inmediatamente.