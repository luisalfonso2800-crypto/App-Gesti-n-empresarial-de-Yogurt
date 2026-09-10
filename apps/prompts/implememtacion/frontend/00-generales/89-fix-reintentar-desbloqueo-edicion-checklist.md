TAREA CONTROLADA — HABILITAR EDICIÓN DE CANTIDAD/PRECIO Y DESBLOQUEO AL REINTENTAR EN CHECKLIST

OBJETIVO TÉCNICO EXACTO
En `apps/web/src/app/operations/purchases/new/page.jsx`:
1. Desbloquear los inputs de "Cant. Solicitada" y "Precio Empaque ($)" en las tarjetas del Checklist (eliminar `readOnly` o `disabled`), permitiendo que el operario modifique la cantidad real adquirida o el precio pactado en el momento.
2. Asegurar que al cambiar Cantidad o Precio se recalculen al vuelo:
   - `Subtotal = Cantidad * Precio Empaque`
   - `Total neto a bodega = Cantidad * Contenido Neto de la presentación`
   - `Costo unitario real = Subtotal / Total neto a bodega`
3. Corregir el botón "Reintentar" de la sección de Pendientes:
   - Remover el ítem de `pendingItems`.
   - Regresarlo al checklist principal activo con estado normal (cerrar el bloque de "Motivo por el cual no se consiguió").
   - Dejar todos los campos listos y editables para que el usuario pueda registrar la compra ("Conseguido").
4. MODO RÁPIDO: PROHIBIDO ejecutar `pnpm build` o borrar `.next`. Validar únicamente con `node --check`.

FUENTES DE VERDAD OBLIGATORIAS
- apps/web/src/app/operations/purchases/new/page.jsx
- apps/web/src/app/operations/purchases/new/new-purchase.module.css
- apps/web/src/components/ui/icons.jsx
- docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md

REGLAS DE ARQUITECTURA
1. Exclusivamente JavaScript/React nativo (.jsx, .js). PROHIBIDO TypeScript.
2. CSS Modules exclusivo (.module.css). PROHIBIDO Tailwind.
3. Usar iconos de `apps/web/src/components/ui/icons.jsx`.
4. Ninguna dependencia de `window.alert`. Notificar la acción de reintentar con el Toast (`showNotification('Insumo devuelto al checklist para reintento.', 'info')`).

ESPECIFICACIÓN PUNTUAL

1. Inputs Editables en Tarjetas (`page.jsx`):
   - Localizar los inputs de "Cant. Solicitada" y "Precio Empaque ($)".
   - Retirar los atributos `disabled`, `readOnly` o equivalentes.
   - Conectar sus manejadores `onChange` para actualizar el estado del ítem en el checklist:
     ```jsx
     <input
       type="number"
       min="0.01"
       step="any"
       value={item.cantidadSolicitada}
       onChange={(e) => handleChecklistFieldChange(item.id, 'cantidadSolicitada', parseFloat(e.target.value) || 0)}
       className={styles.inputField}
     />
     ```
   - Realizar lo mismo para el precio de empaque, actualizando los cálculos matemáticos visibles en la tarjeta.

2. Lógica del Botón "Reintentar" (`handleRetryPending`):
   - Recibir el `itemId`.
   - Extraer el ítem de `pendingItems`.
   - Limpiar las propiedades temporales de no consecución (`motivoNoConseguido`, `showingMotivo: false`, etc.).
   - Añadirlo de nuevo a la lista visible del checklist (`checklistItems`).
   - Mostrar un Toast informativo confirmando el reingreso al flujo de compra.

3. Estilos de Inputs Editables (`new-purchase.module.css`):
   - Asegurar que los inputs tengan fondo blanco, borde visible y cursor de texto (`cursor: text;`) para que el usuario perciba de inmediato que son modificables.

VALIDACIÓN LIGERA (SIN BUILD)
- Revisar sintaxis con `node --check apps/web/src/app/operations/purchases/new/page.jsx`.
- Comprobar que en la interfaz los campos permitan escribir números libremente y que pulsar "Reintentar" devuelva la tarjeta al checklist activa y limpia.

FORMATO DE REPORTE
Entregar únicamente el reporte estándar indicando inputs desbloqueados, flujo de recálculo y confirmación de sintaxis sin build.