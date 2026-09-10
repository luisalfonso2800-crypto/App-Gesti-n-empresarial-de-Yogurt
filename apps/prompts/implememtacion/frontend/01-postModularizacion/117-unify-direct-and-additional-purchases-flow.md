> Parametriza FormPhase para soportar navegación, textos y persistencia dual ("Compra Directa" vs "Compras Adicionales / Imprevistos"):

1. DIAGNÓSTICO:
   - Actualmente `/operations/purchases/new?manual=true` asume exclusivamente el contexto de "Compras Adicionales", mostrando siempre:
     * Botón "← Volver a Checklist" (inválido si el usuario no proviene de una lista en ruta).
     * Título "Registro de Compras Adicionales (En Ruta) — En curso".
     * Botón de guardado "Confirmar e Incorporar a la Orden".
   - El botón principal "Nueva Compra Directa" (en `/operations/purchases`) debe reutilizar exactamente el mismo formulario dinámico (FormPhase, alta rápida de insumos/proveedores, cálculo de fletes y LIFO), pero operando de forma autónoma: sin depender de una orden activa previa, con retorno directo a la vista de compras y guardando la compra de forma definitiva.

2. ACCIÓN EN apps/web/src/app/operations/purchases/page.jsx (Vista Principal):
   - Configura el botón "Nueva Compra Directa" para navegar enviando el parámetro explícito:
     ```javascript
     router.push('/operations/purchases/new?mode=direct');
     ```

3. ACCIÓN EN apps/web/src/app/operations/purchases/new/ (page.jsx y components/FormPhase.jsx):
   - Extrae el modo de operación mediante `searchParams` y el contexto:
     ```javascript
     const searchParams = useSearchParams();
     const isDirectPurchase = searchParams.get('mode') === 'direct' || (!activeOrder && searchParams.get('manual') === 'true');
     ```
   - Renderizado condicional del encabezado y acciones en FormPhase:
     * **Botón de retorno (izquierda):**
       - Si `isDirectPurchase`: `<button onClick={() => router.push('/operations/purchases')}>← Volver a Compras</button>`.
       - Si es compra adicional: `<button onClick={onBackToChecklist}>← Volver a Checklist</button>`.
     * **Título central:**
       - Si `isDirectPurchase`: "Nueva Compra Directa".
       - Si es compra adicional: "Registro de Compras Adicionales (En Ruta) — En curso".
     * **Botón de guardado (derecha):**
       - Si `isDirectPurchase`: Etiqueta "Guardar y Registrar Compra". Al confirmar, envía el payload para crear y registrar la compra directamente en el backend (creando su propia orden/registro de compra cerrado) y al finalizar redirige a `/operations/purchases` con notificación de éxito.
       - Si es compra adicional: Etiqueta "Confirmar e Incorporar a la Orden". Mantiene la lógica actual de adjuntar las filas a la orden activa en el Checklist.

4. VALIDACIÓN:
   - **Caso 1 (Compra Directa):** Clic en "Nueva Compra Directa" desde `/operations/purchases` -> Formulario inicia limpio, título "Nueva Compra Directa", botón "← Volver a Compras" regresa al listado general, y "Guardar y Registrar Compra" persiste la compra independiente y vuelve a compras.
   - **Caso 2 (Compra Adicional):** Clic en "+ Registrar Compras Adicionales / Imprevistos" dentro del Checklist de una orden -> Título "Registro de Compras Adicionales (En Ruta) — En curso", botón "← Volver a Checklist" retorna al checklist sin perder datos, y "Confirmar e Incorporar a la Orden" añade los ítems a dicha orden.
   - Valida la sintaxis:
     node --check apps/web/src/app/operations/purchases/page.jsx
     node --check apps/web/src/app/operations/purchases/new/page.jsx
     node --check apps/web/src/app/operations/purchases/new/components/FormPhase.jsx