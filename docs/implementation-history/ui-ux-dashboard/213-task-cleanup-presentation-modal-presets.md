OBJETIVO: Eliminar presets gráficos, evitar warning de inputs no controlados y prevenir errores de serialización en presentaciones. Prohibido tocar backend, CSS globales o usar TypeScript.

ARCHIVOS A MODIFICAR:
- `apps/web/src/app/catalog/presentations/components/PresentationModal.jsx`
- `apps/web/src/app/catalog/presentations/hooks/usePresentationForm.js`

CAMBIOS:

1. `PresentationModal.jsx` (Eliminación de presets y envío seguro):
   - Eliminar por completo el bloque visual de los presets gráficos (los 4 iconos de envase), sus arreglos/constantes asociadas e imports en desuso.
   - Renombrar el encabezado de sección a "IMAGEN DEL ENVASE". Conservar exclusivamente: botón `[ Subir Imagen Local ]`, input file oculto, previsualización y botón de desvincular/limpiar (`imagenUrl: ''`).
   - Retirar cualquier `onClick` del botón submit primario. El envío debe manejarse únicamente mediante `<form onSubmit={handleSubmit}>` asegurando `e.preventDefault()`.
   - En `handleSubmit`: sanitizar payload a primitivos estrictos (`nombre.trim().toUpperCase()`, números parseados, `tipoEnvase` en mayúsculas, `imagenUrl` limpio o null, y booleano `activo`). En bloque `catch`, extraer texto plano (`err.response?.data?.message || err.message`).

2. `usePresentationForm.js` (Eliminar inputs no controlados):
   - Inicializar `initialFormData` asegurando que ninguna clave sea `undefined`: `nombre: ''`, `cantidadOz: ''`, `cantidadMl: ''`, `tipoEnvase: 'ENVASE'`, `imagenUrl: ''`, `observaciones: ''`, `activo: true`.
   - Al cargar datos existentes para edición, usar operadores de respaldo (`?? ''` o `|| ''`) para garantizar siempre strings primitivos en los inputs.

VERIFICACIÓN:
`pnpm --filter web exec next lint --file src/app/catalog/presentations/components/PresentationModal.jsx`

SALIDA: Reporte exclusivo y breve indicando: archivos modificados, confirmación de eliminación de presets gráficos y resultado del comando lint. Sin explicaciones adicionales.
```[cite: 1, 2]