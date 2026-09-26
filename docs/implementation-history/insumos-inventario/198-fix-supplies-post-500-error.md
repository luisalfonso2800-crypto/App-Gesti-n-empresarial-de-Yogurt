TAREA:
Corregir error 500 Internal Server Error en POST /api/v1/supplies y alinear contrato con el modal de insumos

OBJETIVO:
Diagnosticar la causa raíz del error 500 en `POST /api/v1/supplies`, sanitizar el payload saliente en el frontend (`SupplyModal`) para asegurar tipos numéricos puros (sin puntos de miles) y actualizar el controlador/servicio/schema en la API para persistir correctamente los campos de insumo (`nombre`, `categoria`, `subcategoria`, `marca`, `empaque`, `unidadBase`, `stockMinimo`, `costoBase` / `costoReferencial`).

FUENTE DE VERDAD:
- `apps/api/prisma/schema.prisma`
- Controlador y servicio de Insumos (`apps/api/src/modules/supplies/` o ruta correspondiente de la API)
- Modal de insumos en `apps/web/src/` (componente `SupplyModal.jsx` o modal invocado en compras/catálogo)

REGLA DE CONSULTA:
Lee exclusivamente los archivos del endpoint `supplies` en `apps/api/` y el componente de frontend del modal. No realices auditorías en otros módulos ni explores rutas no relacionadas.

ALCANCE:

LEER:
- `apps/api/prisma/schema.prisma` (modelo `Supply` o `Insumo`)
- Archivos del módulo `supplies` en `apps/api/src/` (Controller, Service, Repository o DTOs)
- Componente del modal de nuevo insumo en `apps/web/`

CREAR:
- ningún archivo.

MODIFICAR:
- Controlador / Servicio de supplies en `apps/api/` (mapeo seguro de campos y manejo de errores)
- `apps/api/prisma/schema.prisma` (únicamente si faltan campos indispensables como `subcategoria` o `marca`)
- Componente del modal de insumos en `apps/web/` (sanitización de datos previa al envío)

NO MODIFICAR:
- Ningún módulo de producción, ventas, dashboard ni autenticación.
- Ningún archivo de configuración fuera de los paquetes intervenidos.

INSTRUCCIONES:

1. DIAGNÓSTICO EN BACKEND (`apps/api/`):
   - Revisa el log de error de la API en la terminal o intercepta el stack trace del fallo 500.
   - Identifica si el fallo es:
     a) Argumentos desconocidos en Prisma (`Unknown argument 'subcategoria'`, `Unknown argument 'marca'`).
     b) Fallo de tipo de datos (Prisma esperando `Int`/`Float` y recibiendo `String` con puntos como `"2.700"` o `"3.090"`).
     c) Violación de restricción única o enumeraciones no coincidentes (`unidadBase`, `categoria`).

2. SANITIZACIÓN DEL PAYLOAD EN FRONTEND (`SupplyModal`):
   - En la función que prepara el objeto para el POST:
     - `stockMinimo`: debe convertirse a número entero o decimal limpio (`Number(String(stockMinimo).replace(/\./g, '')) || 0`).
     - `costoBase` / `costoReferencial`: debe convertirse a número entero sin puntos (`Number(String(costoBase).replace(/\./g, '')) || 0`).
     - `unidadBase`: asegurar que envíe el código de unidad requerido (ej. `'ml'` en lugar del label extendido `'Mililitro (ml)'`).
     - Verificar que no se envíen claves nulas o `undefined`.

3. ALINEACIÓN EN BACKEND Y PERSISTENCIA:
   - Si los campos `marca`, `subcategoria`, `empaque` o `costoBase` / `costoReferencial` están en `schema.prisma`, asegúrate de que el DTO / Servicio de la API los extraiga explícitamente y los asigne al objeto `data` de Prisma.
   - Si `schema.prisma` no contiene alguno de estos campos y se requiere su persistencia:
     - Agrega los campos opcionales al modelo `Supply` en `apps/api/prisma/schema.prisma`.
     - Sincroniza la base de datos usando estrictamente:
       `pnpm --filter api exec prisma db push`
       `pnpm --filter api exec prisma generate`
   - Si algún campo de la UI no es persistible por diseño actual, sálvalo en una columna JSON de metadatos o descártalo limpiamente antes del `prisma.supply.create` para no reventar la consulta.

4. MANEJO DE ERROR RESILIENTE:
   - El controlador de la API debe atrapar excepciones y responder con código y mensaje descriptivo en formato JSON (evitando excepciones 500 no controladas).

NO HACER:
- Prohibido usar `npx`. Usa exclusivamente `pnpm --filter api exec ...` para Prisma.
- Prohibido introducir código o archivos TypeScript (`.ts`, `.tsx`); usar únicamente JavaScript nativo.
- No ejecutar `pnpm build` ni purgar `.next` para verificaciones rápidas; utiliza `node --check` sobre los archivos modificados.
- No crear scripts temporales (`fix*.js`, `patch*.js`).
- No ejecutar `git checkout`.

CRITERIO DE FINALIZACIÓN:
La tarea termina cuando:
- El formulario envía los valores numéricos limpios y códigos de unidad correctos.
- `POST /api/v1/supplies` responde con status `200` o `201` y el insumo se guarda en PostgreSQL.
- El modal se cierra exitosamente tras la creación y la vista actualiza el catálogo.
- La verificación sintáctica con `node --check` pasa limpia en backend y frontend.

VERIFICACIÓN:
Comprueba mediante:
node --check apps/web/src/.../SupplyModal.jsx
node --check apps/api/src/.../supplies.service.js

DETENCIÓN:
Al cumplir el criterio de finalización, DETENTE. No continúes con ninguna otra tarea.

SALIDA:
Entrega únicamente:
- Causa raíz identificada del error 500:
- Archivos modificados en API y Web:
- Si se modificó schema.prisma, confirmación de sincronización ejecutada:
- Estado: