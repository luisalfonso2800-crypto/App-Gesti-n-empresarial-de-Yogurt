OBJETIVO: Sincronizar el contrato del ID de presentación entre frontend y backend para eliminar el error de ID undefined al editar. Prohibido alterar la estructura de base de datos (`schema.prisma`), tocar otros módulos o usar TypeScript.

CAMBIOS:

1. BACKEND (`apps/api/src/presentations/`):
   - Consultar el identificador exacto de clave primaria en `apps/api/prisma/schema.prisma` (`id` o `idPresentacion`).
   - En `presentations.controller.js`: validar que `@Param('id')` en PATCH/PUT no sea la cadena literal `'undefined'` ni valor vacío; lanzar `BadRequestException('El identificador de la presentación es requerido.')`.
   - En `presentations.service.js`: asegurar que las consultas Prisma (`where`) apunten al nombre real del campo en el modelo y estandarizar `NotFoundException` en español: "La presentación con ID ... no fue encontrada".

2. FRONTEND (`apps/web/src/app/catalog/presentations/`):
   - En `usePresentationForm.js` (y `page.jsx` si suministra las props): extraer y preservar el ID tolerante a ambos nombres (`presentation?.idPresentacion || presentation?.id || null`).
   - En `handleSubmit`: validar la existencia de dicho ID antes de la petición. Si es nulo o `'undefined'`, impedir el envío y registrar el mensaje de error visual sin disparar la llamada HTTP.

VERIFICACIÓN:
1. `node --check apps/api/src/presentations/presentations.controller.js`
2. `pnpm --filter web exec next lint --file src/app/catalog/presentations/hooks/usePresentationForm.js`

SALIDA: Reporte exclusivo y breve: Clave primaria identificada en Prisma, archivos modificados y confirmación de sintaxis/lint. Sin texto introductorio ni conclusiones.
```[cite: 1]