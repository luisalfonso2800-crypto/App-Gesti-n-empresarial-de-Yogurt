TAREA:
Corregir truncamiento del mensaje de error P2002 de Prisma y mapear nombres de restricciones a lenguaje natural

OBJETIVO:
Resolver el error que produce el mensaje incompleto `"Ya existe un proveedor registrado con este "` en el banner de error. Asegurar que el filtro global de excepciones (`GlobalExceptionFilter` o `PrismaClientExceptionFilter`) y el servicio de proveedores capturen el nombre de la restricción o campo devuelto por Prisma (`exception.meta.target`) y construyan siempre una oración gramaticalmente completa y explicativa para el usuario (ej. `"Ya existe un proveedor registrado con este NIT / Cédula."`).

FUENTE DE VERDAD:
- `apps/api/src/common/filters/prisma-exception.filter.js` (o filtro global registrado en `main.js`)
- `apps/api/src/modules/suppliers/` (controlador y servicio de proveedores)
- `apps/web/src/components/catalog/SupplierModal.jsx`

REGLA DE CONSULTA:
Lee exclusivamente los archivos del filtro global de excepciones, el módulo de proveedores en API y `SupplierModal.jsx`. No audites otros módulos.

ALCANCE:

LEER:
- `apps/api/src/common/filters/prisma-exception.filter.js` (o archivo donde resida la captura de P2002)
- `apps/api/src/modules/suppliers/suppliers.service.js`
- `apps/web/src/components/catalog/SupplierModal.jsx`

CREAR:
- ningún archivo.

MODIFICAR:
- Filtro de excepciones en `apps/api/src/`
- `apps/web/src/components/catalog/SupplierModal.jsx` (si requiere fallback seguro)

NO MODIFICAR:
- `schema.prisma`.
- Módulos de compras, inventario ni ventas.

INSTRUCCIONES:

1. DIAGNÓSTICO DEL TRUNCAMIENTO EN BACKEND:
   - En PostgreSQL con Prisma, `exception.meta.target` frecuentemente devuelve el nombre de la restricción de base de datos (ej. `Supplier_nit_key`, `suppliers_nit_key` o un arreglo `['Supplier_nit_key']`) en lugar del nombre plano de la propiedad del modelo.
   - Si el código utiliza un mapa estático como `{ nit: 'NIT' }[target]`, al no coincidir la clave retorna `undefined` o cadena vacía, dejando la frase cortada: `"Ya existe un proveedor registrado con este "`.

2. PARSEO ROBUSTO DE RESTRICCIONES EN EL FILTRO GLOBAL:
   - Reemplaza la lógica de mapeo del error `P2002` en el filtro de excepciones por una detección por coincidencia de subcadenas insensible a mayúsculas:
     ```javascript
     case 'P2002': {
       const rawTarget = Array.isArray(exception.meta?.target)
         ? exception.meta.target.join(' ')
         : String(exception.meta?.target || '');
       
       const targetLower = rawTarget.toLowerCase();
       let campoLegible = 'documento o dato de identificación';

       if (targetLower.includes('nit') || targetLower.includes('cedula') || targetLower.includes('documento')) {
         campoLegible = 'NIT / Cédula';
       } else if (targetLower.includes('razon') || targetLower.includes('nombre')) {
         campoLegible = 'Nombre / Razón Social';
       } else if (targetLower.includes('email') || targetLower.includes('correo')) {
         campoLegible = 'Correo Electrónico';
       } else if (targetLower.includes('telefono') || targetLower.includes('celular')) {
         campoLegible = 'Teléfono / Celular';
       } else if (rawTarget) {
         campoLegible = rawTarget;
       }

       status = HttpStatus.CONFLICT;
       message = `Ya existe un proveedor registrado con este ${campoLegible}. Por favor verifique el valor ingresado.`;
       break;
     }
     ```

3. RESPALDO Y FALLBACK EN EL FRONTEND (`SupplierModal.jsx`):
   - Asegura que el banner de error nunca renderice frases truncadas. Si el mensaje recibido de la API termina en `"este "` o mide menos de 10 caracteres, muestra un mensaje de contingencia completo:
     ```javascript
     let textoFinal = err.response?.data?.message || err.message || '';
     if (!textoFinal || textoFinal.trim().endsWith('este')) {
       textoFinal = 'Ya existe un proveedor registrado con este NIT / Cédula o Razón Social.';
     }
     setErrorMessage(textoFinal);
     ```

NO HACER:
- Prohibido usar `npx`.
- Prohibido usar TypeScript (`.ts`, `.tsx`); mantener JavaScript nativo.
- No dejar frases incompletas ni depender de coincidencia exacta de strings para `exception.meta.target`.
- No alterar las clases de diseño visual ni los campos opcionales ya configurados.
- No crear scripts temporales (`patch*.js`, `fix*.js`).
- No ejecutar `git checkout`.

CRITERIO DE FINALIZACIÓN:
La tarea termina cuando:
- Al intentar registrar un proveedor con un NIT/Cédula que ya existe en el sistema, el banner inferior despliega la frase completa:
  `⚠️ Ya existe un proveedor registrado con este NIT / Cédula. Por favor verifique el valor ingresado.`
- En caso de duplicidad de Razón Social o Email, el mensaje especifica exactamente el campo correspondiente sin cortarse.
- Las compilaciones de backend y frontend concluyen sin errores.

VERIFICACIÓN:
Comprueba ejecutando:
pnpm --filter api build
pnpm --filter web build --no-lint

DETENCIÓN:
Al cumplir el criterio de finalización, DETENTE. No continúes con ninguna otra tarea.

SALIDA:
Entrega únicamente:
- Archivo y función del filtro intervenidos:
- Lógica implementada para resolver `exception.meta.target`:
- Resultado de compilación:
- Estado: