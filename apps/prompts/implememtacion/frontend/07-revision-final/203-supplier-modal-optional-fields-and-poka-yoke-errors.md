TAREA:
Hacer opcionales contacto/email en proveedores, tipificar errores de unicidad (NIT/Cédula) y estandarizar banner de error en modales y AGENTS.md

OBJETIVO:
1. En `SupplierModal.jsx`: Retirar la obligatoriedad (`*`) de los campos "NOMBRE DE CONTACTO" e "EMAIL" (adecuándolos a compras en almacenes de cadena como D1, ARA, Éxito donde no hay asesor asignado ni correo corporativo).
2. En Backend (`suppliers.service.js` / `suppliers.controller.js`): Capturar excepciones de unicidad de Prisma (`P2002` en `nit` o número de documento) y responder con status 409 y mensaje explícito en lenguaje natural: `"Ya existe un proveedor registrado con el NIT/Cédula [VALOR]"`.
3. En Frontend (Modales): Implementar un banner de error visible en la parte inferior del modal (encima de los botones de acción) que renderice el mensaje devuelto por la API en lugar de mensajes genéricos como "Error en la petición".
4. En `AGENTS.md`: Registrar como norma mandatoria que el contacto/email de proveedores son opcionales y que todos los modales deben reportar la causa exacta del fallo al usuario.

FUENTE DE VERDAD:
- `apps/api/prisma/schema.prisma`
- Módulo de proveedores en backend (`apps/api/src/modules/suppliers/` o ruta correspondiente)
- `apps/web/src/components/catalog/SupplierModal.jsx` (o modal de proveedor correspondiente)
- `AGENTS.md`

REGLA DE CONSULTA:
Lee exclusivamente los archivos del módulo de proveedores en API y Web, `schema.prisma` y `AGENTS.md`. No explores ventas, SCADA ni producción.

ALCANCE:

LEER:
- `apps/api/prisma/schema.prisma` (modelo `Supplier` o `Proveedor`)
- Archivos de proveedores en `apps/api/src/` (controller, service, DTOs)
- `apps/web/src/components/catalog/SupplierModal.jsx` (o modal equivalente en compras/catálogo)
- `AGENTS.md`

CREAR:
- ningún archivo.

MODIFICAR:
- `apps/api/prisma/schema.prisma` (únicamente si email o contacto están marcados como obligatorios)
- Controlador y servicio de proveedores en `apps/api/src/`
- Modal de Proveedor en `apps/web/`
- `AGENTS.md`

NO MODIFICAR:
- Clases globales `.module.css`.
- Endpoints ni controladores de compras o insumos.

INSTRUCCIONES:

1. FLEXIBILIZACIÓN EN BACKEND Y SCHEMA (`apps/api/`):
   - En `apps/api/prisma/schema.prisma`:
     - Asegura que en el modelo de proveedor (`Supplier` / `Proveedor`), los campos `email` y `nombreContacto` (o `contacto`) sean opcionales (`String?`).
     - Si se modificó el esquema, ejecuta:
       `pnpm --filter api exec prisma db push`
       `pnpm --filter api exec prisma generate`
   - En el servicio de creación/actualización de proveedores:
     - Envuelve la persistencia en captura de excepciones Prisma.
     - Si el error corresponde a restricción única violada (`code === 'P2002'`):
       - Identifica si el campo en conflicto es `nit`, `documento` o similar.
       - Emite una excepción HTTP 409 (Conflict) con mensaje claro:
         `"Ya existe un proveedor registrado con el NIT/Cédula ${data.nit || data.numeroDocumento}".`
       - Si el campo único duplicado es otro (ej. email o razón social), indícalo puntualmente: `"Ya existe un proveedor registrado con este [Campo]"`.

2. AJUSTES EN EL MODAL DE PROVEEDOR (`apps/web/`):
   - Campos No Obligatorios:
     - En las etiquetas de "NOMBRE DE CONTACTO" e "EMAIL", elimina el asterisco rojo `*`.
     - En la validación previa al submit, retira cualquier validación que bloquee el guardado si estos campos vienen vacíos.
     - Envía `null` o cadena vacía si el usuario no los diligencia.
   - Banner de Error Inferior (Poka-Yoke):
     - Declara un estado local de error: `const [errorMessage, setErrorMessage] = useState('')`.
     - En el bloque `catch` del envío:
       - Extrae el mensaje específico retornado por la API (`err.response?.data?.message || err.message`).
       - Asigna dicho mensaje al estado `errorMessage`.
     - Renderiza el banner de error en la parte inferior del modal, justo arriba de los botones "Cancelar" y "Guardar":
       ```jsx
       {errorMessage && (
         <div style={{
           marginTop: '0.75rem',
           padding: '0.6rem 0.85rem',
           backgroundColor: '#FEF2F2',
           border: '1px solid #F87171',
           borderRadius: '6px',
           color: '#991B1B',
           fontSize: '0.8rem',
           display: 'flex',
           alignItems: 'center',
           gap: '0.5rem'
         }}>
           <span>⚠️</span>
           <span>{errorMessage}</span>
         </div>
       )}
       ```
     - Al volver a escribir en cualquier input o reintentar el guardado, limpia automáticamente el `errorMessage`.

3. ACTUALIZACIÓN NORMATIVA EN `AGENTS.md`:
   - Agrega en `AGENTS.md` bajo las directrices de diseño y negocio:
     a) **Regla de Flexibilidad en Proveedores:**
        - *"En entidades proveedoras, `nombreContacto` y `email` son estrictamente opcionales. El sistema interactúa con almacenes de cadena y compras de mostrador (D1, ARA, supermercados locales) donde no existe un contacto individual ni buzón asignado."*
     b) **Regla de Retroalimentación de Errores en Modales (Poka-Yoke):**
        - *"Queda estrictamente prohibido emitir alertas genéricas ('Error en la petición') o fallar en silencio sin retroalimentación visual. Todo modal debe capturar la respuesta del backend y proyectar un banner de advertencia inferior (`#FEF2F2`, borde `#F87171`) explicando en lenguaje natural y comprensible la causa raíz (ej. duplicidad de NIT/Cédula, nombre ya registrado o código inválido)."*

NO HACER:
- Prohibido usar `npx`. Usa exclusivamente `pnpm --filter api exec ...`.
- Prohibido introducir TypeScript (`.ts`, `.tsx`); mantener JavaScript nativo.
- No ocultar el modal ni bloquear la interfaz si ocurre un error; el modal debe permanecer abierto para que el operador corrija el campo en conflicto sin perder los datos ya digitados.
- No crear scripts temporales (`patch*.js`, `fix*.js`).
- No ejecutar `git checkout`.

CRITERIO DE FINALIZACIÓN:
La tarea termina cuando:
- El modal permite guardar proveedores sin diligenciar contacto ni email.
- Si se ingresa un NIT/Cédula existente, el backend responde status 409 con el texto explicativo y el modal muestra el banner inferior: *"Ya existe un proveedor registrado con el NIT/Cédula [VALOR]"*.
- El modal permanece abierto con los datos digitados intactos.
- `AGENTS.md` incluye las dos nuevas directrices mandatorias.
- Las compilaciones en API y Web pasan limpias.

VERIFICACIÓN:
Comprueba ejecutando:
pnpm --filter api build
pnpm --filter web build --no-lint

DETENCIÓN:
Al cumplir el criterio de finalización, DETENTE. No continúes con ninguna otra tarea.

SALIDA:
Entrega únicamente:
- Archivos modificados en API, Web y Documentación:
- Manejo de excepción P2002 implementado:
- Secciones añadidas en AGENTS.md:
- Resultado de compilación:
- Estado: