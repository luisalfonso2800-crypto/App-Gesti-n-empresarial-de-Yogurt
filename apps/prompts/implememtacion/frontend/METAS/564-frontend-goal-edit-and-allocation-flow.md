TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 5 ARCHIVOS EN FRONTEND - CERO BUCLES DE LECTURA):
Actualizar la interfaz de "Rumbo MANNÁ" en `apps/web/src/app/commercial/goals/` para incorporar:
1. Botón de Editar (icono lápiz) en cada tarjeta `GoalCard` junto al icono de eliminar.
2. Botón "+ Sembrar Fondos" en sueños personales con estrategia MANUAL y modal `ContributeModal` para aportar dinero real a la alcancía llamando a `POST /goals/:id/contribute`.
3. Selector de Estrategia de Asignación (MANUAL / Alcancía, PORCENTAJE % de flujo, CASCADA por prioridad) y campo de prioridad en `GoalFormModal`, con soporte completo tanto para CREAR como para EDITAR (`PUT /goals/:id` o actualización equivalente).
4. Badge visible en la tarjeta que indique la estrategia activa (`🏺 Alcancía Manual`, `📊 % Flujo`, `🌊 Cascada #P`).
5. Barra o tarjeta con el total de "Fondos Disponibles para Asignar" consumiendo `GET /goals/available-funds`.

ARCHIVOS A INTERVENIR:
1. `apps/web/src/app/commercial/goals/page.jsx` (Orquestador principal < 120 líneas)
2. `apps/web/src/app/commercial/goals/components/GoalCard.jsx` (Icono Editar, botón Sembrar Fondos, badge estrategia < 125 líneas)
3. `apps/web/src/app/commercial/goals/components/GoalFormModal.jsx` (Modo edición + campos de estrategia y prioridad < 125 líneas)
4. `apps/web/src/app/commercial/goals/components/ContributeModal.jsx` (CREAR - Modal de alcancía < 110 líneas)
5. `apps/web/src/app/commercial/goals/goals.module.css` (Estilos visuales MANNÁ sin estilos inline)

INSTRUCCIONES TÉCNICAS:

1. Tarjeta (`GoalCard.jsx` < 125 líneas):
   - En la esquina superior derecha, junto al botón de eliminar, agregar el icono de edición (`Pencil` de Lucide) que dispare `onEdit(goal)`.
   - Mostrar el badge de estrategia activa:
     * Si `estrategiaAsignacion === 'MANUAL'`: `🏺 Alcancía Manual`
     * Si `estrategiaAsignacion === 'PORCENTAJE'`: `📊 ${porcentajeFlujo}% de Flujo`
     * Si `estrategiaAsignacion === 'CASCADA'`: `🌊 Cascada Prioridad #${ordenPrioridad || 1}`
   - Si la meta es `PERSONAL_FAMILIAR` y estrategia `MANUAL`, mostrar botón prominente: `+ Sembrar Fondos`, que invoque `onOpenContribute(goal)`.
   - Mantener intactas las 5 preguntas cuantitativas y los badges botánicos.

2. Modal de Aporte / Alcancía (`ContributeModal.jsx` < 110 líneas):
   - Modal con fondo pergamino y acentos verde bosque.
   - Muestra el título de la meta y el monto faltante para cumplirla.
   - Input de monto formateado en COP y campo de texto opcional para nota ("Ej. Ganancia de feria dominical").
   - Al confirmar, invoca `POST /goals/:id/contribute` con `{ monto, nota }`, cierra el modal y recarga el listado.

3. Modal de Formulario (`GoalFormModal.jsx` < 125 líneas):
   - Soportar `goalToEdit`: precargar los datos si existe para edición, o iniciar en blanco si es nuevo.
   - Si `ambito === 'PERSONAL_FAMILIAR'`, desplegar selector de `estrategiaAsignacion`:
     * `MANUAL`: Sin campos adicionales.
     * `PORCENTAJE`: Input numérico `% de Flujo` (1-100%).
     * `CASCADA`: Input numérico `Turno de Prioridad` (1, 2, 3...).
   - Botón de submit dinámico: "Sembrar Objetivo" o "Guardar Cambios".

4. Orquestador (`page.jsx` < 120 líneas):
   - Consultar `GET /goals/available-funds` para mostrar el indicador de fondo disponible real no comprometido.
   - Orquestar los estados de modal (`isFormOpen`, `goalToEdit`, `contributeGoal`).
   - Cumplir estrictamente con SRP (< 130 líneas por archivo).

VERIFICACIÓN:
1. `node .agents/scripts/verify-srp.js`
2. `pnpm --filter web build`

CRITERIO DE FINALIZACIÓN:
- Cada tarjeta muestra el icono de editar y funciona la edición.
- En metas personales manuales aparece el botón "+ Sembrar Fondos" y se pueden ingresar abonos.
- Se visualiza la estrategia de asignación en cada tarjeta.
- 0 infracciones de SRP y build limpio (código 0).

DETENCIÓN:
Al validar sintaxis y verificar compilación limpia, DETENTE inmediatamente.