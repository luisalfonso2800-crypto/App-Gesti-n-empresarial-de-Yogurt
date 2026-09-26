TAREA:
Implementar filtro global de excepciones para errores de base de datos/DTO en NestJS y propagar mensajes exactos en modales de frontend

OBJETIVO:
1. Resolver la causa del texto genérico "Error en la petición" en el modal de Nuevo Proveedor y en todos los modales del sistema.
2. Crear/configurar un filtro global de excepciones en NestJS (`PrismaClientExceptionFilter` o `GlobalExceptionFilter`) que traduzca automáticamente errores de base de datos (Prisma P2002, P2003, P2025) y validaciones a mensajes en lenguaje natural claro (ej. "Ya existe un proveedor registrado con el NIT/Cédula 5.252.542-5").
3. Garantizar que `api-client.js` en frontend extraiga el mensaje exacto enviado por el backend (`response.data.message`) y lo exponga en el objeto de error.
4. Ajustar el banner de error en `SupplierModal.jsx` para mostrar el mensaje real devuelto por el servidor y diagnosticar el payload que originó el fallo actual.

FUENTE DE VERDAD:
- `apps/api/src/main.js`
- `apps/api/prisma/schema.prisma`
- Módulo de proveedores (`apps/api/src/modules/suppliers/` o similar)
- `apps/web/src/lib/api-client.js`
- `apps/web/src/components/catalog/SupplierModal.jsx`

REGLA DE CONSULTA:
Lee exclusivamente la configuración del servidor NestJS (`main.js`), el módulo de proveedores, el cliente HTTP del frontend y `SupplierModal.jsx`. No audites ventas, compras directas ni SCADA.

ALCANCE:

LEER:
- `apps/api/src/main.js`
- `apps/api/prisma/schema.prisma` (modelo `Supplier` / `Proveedor`)
- `apps/api/src/modules/suppliers/` (controller, service, DTOs)
- `apps/web/src/lib/api-client.js`
- `apps/web/src/components/catalog/SupplierModal.jsx`

CREAR:
- `apps/api/src/common/filters/prisma-exception.filter.js` (si no existe un filtro de Prisma centralizado)

MODIFICAR:
- `apps/api/src/main.js` (registro del filtro global)
- `apps/web/src/lib/api-client.js` (propagación limpia de `error.response.data.message`)
- `apps/web/src/components/catalog/SupplierModal.jsx` (consumo del mensaje y limpieza de fallback estático)

NO MODIFICAR:
- Rutas ni lógica de inventario, compras ni SCADA.
- Hojas de estilos CSS existentes.

INSTRUCCIONES:

1. FILTRO CENTRALIZADO DE EXCEPCIONES EN BACKEND (NestJS):
   - Crea o ajusta `apps/api/src/common/filters/prisma-exception.filter.js` capturando instancias de `PrismaClientKnownRequestError` y `HttpException`:
     ```javascript
     import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common';
     import { Prisma } from '@prisma/client';

     @Catch()
     export class GlobalExceptionFilter {
       catch(exception, host) {
         const ctx = host.switchToHttp();
         const response = ctx.getResponse();

         let status = HttpStatus.INTERNAL_SERVER_ERROR;
         let message = 'Ocurrió un error inesperado al procesar la solicitud.';

         // Errores conocidos de Prisma
         if (exception instanceof Prisma.PrismaClientKnownRequestError) {
           switch (exception.code) {
             case 'P2002': {
               const targets = exception.meta?.target || [];
               const campo = Array.isArray(targets) ? targets.join(', ') : targets;
               status = HttpStatus.CONFLICT;
               message = `Ya existe un registro con el valor ingresado para: ${campo}. Verifique que no esté duplicado.`;
               break;
             }
             case 'P2025':
               status = HttpStatus.NOT_FOUND;
               message = 'El registro solicitado no fue encontrado o ya fue eliminado.';
               break;
             case 'P2003':
               status = HttpStatus.BAD_REQUEST;
               message = 'No se puede completar la acción porque este registro está vinculado con otros datos del sistema.';
               break;
             default:
               status = HttpStatus.BAD_REQUEST;
               message = `Error en base de datos (${exception.code}): ${exception.message.split('\n').pop()}`;
           }
         } else if (exception instanceof HttpException) {
           status = exception.getStatus();
           const res = exception.getResponse();
           message = typeof res === 'object' && res.message
             ? (Array.isArray(res.message) ? res.message.join('. ') : res.message)
             : (res || exception.message);
         } else if (exception.message) {
           message = exception.message;
         }

         response.status(status).json({
           statusCode: status,
           message: message,
           timestamp: new Date().toISOString()
         });
       }
     }
     ```
   - Registra el filtro globalmente en `apps/api/src/main.js`:
     ```javascript
     app.useGlobalFilters(new GlobalExceptionFilter());
     ```

2. DIAGNÓSTICO ESPECÍFICO DEL REGISTRO DE PROVEEDOR:
   - Revisa el controlador/servicio de proveedores para verificar por qué falló el registro mostrado en la captura ("PLATICOS EXITO", NIT "5.252.542-5", teléfono "2655651262", dirección "fewfcewf", contacto vacío, email vacío).
   - Comprueba si el DTO tiene decoradores `@IsNotEmpty()` o `@IsEmail()` obligatorios sobre campos vacíos, o si el NIT/nombre ya existían previamente en la base de datos.
   - Corrige el DTO o servicio para que acepte cadenas vacías o `null` en campos opcionales.

3. DESEMPAQUETADO DEL MENSAJE EN EL CLIENTE HTTP (`apps/web/src/lib/api-client.js`):
   - Inspecciona el interceptor o función de manejo de errores de `api-client.js`.
   - Asegura que cuando la respuesta traiga `{ message: "..." }`, ese mensaje quede asignado a `error.message` o `error.detail` para que el código del frontend tenga acceso directo a la explicación devuelta por el servidor.

4. AJUSTE DEL MODAL (`SupplierModal.jsx`):
   - En el bloque `catch (err)` del formulario:
     - Extrae prioritariamente el mensaje del backend:
       ```javascript
       const textoError = err.response?.data?.message || err.message || 'No fue posible guardar el proveedor.';
       setErrorMessage(textoError);
       ```
     - Elimina la asignación fija `"Error en la petición"`.
     - El banner inferior debe renderizar dinámicamente `{errorMessage}`.

NO HACER:
- Prohibido usar `npx`.
- Prohibido usar TypeScript (`.ts`, `.tsx`); mantener JavaScript nativo.
- No dejar mensajes de error genéricos ni textos en inglés en el filtro de excepciones.
- No cerrar el modal tras un error de guardado.
- No crear scripts temporales (`patch*.js`, `fix*.js`).
- No ejecutar `git checkout`.

CRITERIO DE FINALIZACIÓN:
La tarea termina cuando:
- El filtro global de excepciones intercepta los errores en la API y devuelve mensajes en español legibles y contextualizados.
- Al intentar registrar un proveedor con NIT duplicado o datos inválidos, el banner rojo inferior del modal muestra la razón exacta (ej. `"Ya existe un registro con el valor ingresado para: nit"` o la validación correspondiente).
- El modal permite guardar proveedores exitosamente con email y contacto vacíos.
- La compilación en backend y frontend concluye sin errores.

VERIFICACIÓN:
Comprueba ejecutando:
pnpm --filter api build
pnpm --filter web build --no-lint

DETENCIÓN:
Al cumplir el criterio de finalización, DETENTE. No continúes con ninguna otra tarea.

SALIDA:
Entrega únicamente:
- Causa raíz del fallo 500/error en "PLATICOS EXITO":
- Archivo del filtro global implementado y registro en main.js:
- Ajustes en api-client y SupplierModal:
- Resultado de compilación:
- Estado: