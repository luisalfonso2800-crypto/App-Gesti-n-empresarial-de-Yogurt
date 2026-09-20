TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Permitir que el 100% del volumen real obtenido de una producción pueda reservarse como inóculo (cultivo madre exclusivo), ajustando la validación y evitando la creación innecesaria de lote comercial de 0 L:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez el modal de liquidación (`ProductionOrderCompleteModal.jsx` o componente donde reside la validación del volumen) y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/operations/production/components/ProductionOrderCompleteModal.jsx` (y/o `production.repository.js` si valida en backend)

INSTRUCCIONES TÉCNICAS:

1. Frontend (`ProductionOrderCompleteModal.jsx`):
   - Modificar la regla de validación de `litrosAReservar`:
     * Permitir valores desde `> 0` hasta `<= volumenReal`:
       `const esInvalido = reservaInoculo && (Number(litrosAReservar) <= 0 || Number(litrosAReservar) > Number(volumenReal));`
     * Actualizar el mensaje de error:
       `"La reserva debe ser mayor a 0 y menor o igual al volumen total (" + volumenReal + " Litros)."`
   - Si `Number(litrosAReservar) === Number(volumenReal)`:
     * Ocultar o deshabilitar opcionalmente el campo de "Fecha de Vencimiento (Lote Comercial)" indicando: "Tanda 100% destinada a reserva de inóculo / cultivo madre".

2. Backend (`production.repository.js` en `completeProduction`):
   - Validar:
     `const cantComercial = Math.max(0, Number(volumenReal) - Number(litrosAReservar));`
   - Si `cantComercial === 0`:
     * NO crear registro de lote comercial ni alterar inventario en cava con saldo 0.
     * Crear únicamente el lote en `Lote` (`tipoLote: 'SEMIELABORADO_WIP'`) con la totalidad de los litros.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/production/components/ProductionOrderCompleteModal.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Con 10 Litros obtenidos y 10 Litros a reservar no se muestra mensaje de error.
- Se habilita el botón de liquidación y la totalidad de los 10 L ingresa a la bitácora WIP.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.