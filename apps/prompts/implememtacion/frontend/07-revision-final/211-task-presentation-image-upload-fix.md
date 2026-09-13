OBJETIVO: Corregir error circular JSON en `PresentationModal.jsx` e implementar subida/gestión de imágenes locales fullstack. Prohibido tocar módulos ajenos (ventas/compras), hojas CSS globales o usar TypeScript.

1. FIX ERROR CIRCULAR JSON (PresentationModal.jsx):
   - Asegurar que los botones de presets usen `type="button"` y callbacks explícitos `onClick={() => handlePresetSelect(preset.url || preset.id)}` para evitar inyectar el evento sintético (`HTMLButtonElement`) al estado.
   - En bloque `catch (err)`, extraer texto plano seguro: `err.response?.data?.message || err.message || 'Error al procesar'`.

2. BACKEND (apps/api/):
   - En `schema.prisma`, verificar `imagenUrl String?` en el modelo de presentaciones. Si no existe, agregarlo y correr sincronización Prisma.
   - Habilitar servicio de archivos estáticos en Express/Nest para la ruta `/uploads/presentations`.
   - Crear endpoint `POST /api/v1/uploads/presentations` (con multer o interceptor, validando tipo `image/*`, máx 3 MB, renombrado con hash/timestamp y retorno `{ url: '/uploads/presentations/...' }`).
   - Soportar remoción física del archivo en disco al actualizar o desvincular imagen.

3. FRONTEND (PresentationModal.jsx):
   - En sección de imagen, incorporar input oculto `<input type="file" accept="image/*" />` con botón disparador y previsualización inmediata (`URL.createObjectURL`).
   - Al cargar archivo, enviar `FormData` al endpoint de uploads y asignar la URL al formulario.
   - Añadir botón para eliminar/limpiar imagen activa (`imagenUrl: ''`).
   - Mantener coexistencia con presets gráficos, inputs en `UPPERCASE` y botón submit contextual deshabilitado si faltan requeridos.

VERIFICACIÓN:
1. `pnpm --filter api build`
2. `pnpm --filter web build --no-lint`

SALIDA: Reporte exclusivo y conciso: Causa del error circular corregido, endpoints/archivos creados en backend, líneas modificadas en modal y estado de los builds.
```[cite: 2]