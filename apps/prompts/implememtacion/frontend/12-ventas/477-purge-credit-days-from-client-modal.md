TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Eliminar por completo el campo "DÍAS DE CRÉDITO" del formulario y JSX de ClientFormModal, y asegurar que el botón Guardar Cliente se habilite con los datos comerciales básicos:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez `ClientFormModal.jsx` (y/o sus submódulos en `modal-parts/` donde esté el input de días de crédito) y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/commercial/clients/components/ClientFormModal.jsx` (o componente que renderiza los inputs del cliente)

INSTRUCCIONES TÉCNICAS:

1. Extirpación Total de Días de Crédito del Modal:
   - Eliminar completamente del JSX:
     * El contenedor `<div>` con `<label>DÍAS DE CRÉDITO *</label>` y su `<input ... />`.
     * No mostrar toggles ni inputs de crédito en este modal.
   - En la tarjeta de Resumen inferior:
     * Cambiar el texto a:
       `"Resumen: Se registrará el cliente ${nombre} clasificado como ${tipo} para el canal ${canal}."` (eliminar la frase de "0 días de crédito").

2. Regla de Validación del Botón Guardar:
   - Validar únicamente:
     ```javascript
     const isFormValid = Boolean(
       formData.nombre?.trim() && 
       formData.tipoCliente && 
       formData.canal
     );
     ```
   - El payload que se envía al guardar debe asignar por defecto `diasCredito: 0` o no enviarlo, sin bloquear la creación.
   - Con Razón Social, Tipo, Canal y Teléfono llenos, el botón "Guardar Cliente" debe estar habilitado y activo.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/commercial/clients/...`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La fila "DÍAS DE CRÉDITO *" ya no existe visualmente en el modal de cliente.
- Con los datos de la captura (Daniel Mercado, Minorista, Venta Directa, Teléfono), el botón "Guardar Cliente" se muestra activo y permite registrar al cliente.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.