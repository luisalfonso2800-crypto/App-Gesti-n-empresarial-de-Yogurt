> Garantiza que la ruta /operations/purchases/new monte inmediatamente FormPhase cuando reciba mode=direct:

1. DIAGNÓSTICO:
   - Al pulsar "Nueva Compra Directa", la URL cambia a `/operations/purchases/new?mode=direct`, pero el usuario sigue viendo el `ChecklistPhase`.
   - Causa en `apps/web/src/app/operations/purchases/new/page.jsx`: El componente principal decide renderizar `ChecklistPhase` si detecta una orden activa en el contexto (`activeOrder`), o mantiene su estado inicial en fase de checklist porque no sincroniza el parámetro `searchParams.get('mode') === 'direct'` para forzar la fase a formulario (`FormPhase`).

2. ACCIÓN EN apps/web/src/app/operations/purchases/new/page.jsx:
   - Lee `mode` de los searchParams:
     ```javascript
     const searchParams = useSearchParams();
     const isDirectMode = searchParams.get('mode') === 'direct';
     ```
   - Asegura que si `isDirectMode` es verdadero:
     * El estado de la fase activa sea inmediatamente el del formulario (por ejemplo: `phase === 'form'`, `showManualForm === true`, o la condición equivalente que use el componente para pintar `FormPhase`).
     * No ejecute redirección ni renderizado de `ChecklistPhase`, ignorando cualquier `activeOrder` residual que esté guardada en el contexto o `localStorage`.
     * En caso de limpiar el carrito o contexto para compra directa, evita sobreescribir la orden en ruta existente.
   - En el retorno o JSX principal:
     ```jsx
     if (isDirectMode) {
       return <FormPhase isDirectPurchase="{true}"/>;
     }
     ```
     *(Ajusta las props exactas que recibe FormPhase según la arquitectura modular actual).*

3. VALIDACIÓN:
   - Desde `/operations/purchases`, haz clic en "Nueva Compra Directa": la pantalla debe cargar directamente el formulario limpio ("Nueva Compra Directa") con el botón "← Volver a Compras", sin mostrar en ningún momento el Checklist.
   - Entra a una orden existente y presiona "+ Registrar Compras Adicionales / Imprevistos": debe continuar cargando el formulario en modo adicional con "← Volver a Checklist".
   - Verifica sintaxis:
     node --check apps/web/src/app/operations/purchases/new/page.jsx