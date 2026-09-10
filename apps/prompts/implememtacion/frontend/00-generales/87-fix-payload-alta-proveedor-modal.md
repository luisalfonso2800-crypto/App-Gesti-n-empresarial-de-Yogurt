TAREA CONTROLADA — CORRECCIÓN DE NOMBRES DE ATRIBUTOS (PAYLOAD) EN MODAL DE PROVEEDORES

OBJETIVO TÉCNICO EXACTO
Resolver el error HTTP 500 al registrar un proveedor desde el modal de compras:
1. En `apps/web/src/app/operations/purchases/new/page.jsx`, corregir el mapeo de campos enviados a la API:
   - Cambiar `personaContacto` por `nombreContacto` para alinearlo estrictamente con `schema.prisma`.
2. Sanitizar cadenas vacías para que no viajen como `""` sino como `null` si son campos opcionales.
3. Capturar posibles errores del backend en `try/catch` para mostrar mensajes en pantalla si el NIT ya existe, en lugar de romper el cliente.
4. MODO RÁPIDO: PROHIBIDO ejecutar `pnpm build` o borrar `.next`.

FUENTES DE VERDAD OBLIGATORIAS
- apps/api/prisma/schema.prisma (modelo Proveedor)
- apps/web/src/app/operations/purchases/new/page.jsx

REGLAS DE ARQUITECTURA
1. Exclusivamente JavaScript/React nativo (.jsx, .js). PROHIBIDO TypeScript.
2. CSS Modules exclusivo.
3. No compilar en modo producción. Validación estática rápida (`node --check`).

ESPECIFICACIÓN PUNTUAL

1. Corrección del Payload en `handleCreateProv`:
   Asegurar que el objeto enviado mediante `apiClient.post('/suppliers', payload)` tenga esta estructura literal:
   ```javascript
   const payload = {
     nombre: modalForm.nombre?.trim(),
     nitCedula: modalForm.nitCedula?.trim(),
     nombreContacto: modalForm.personaContacto?.trim() || modalForm.nombreContacto?.trim() || null,
     telefono: modalForm.telefono?.trim() || null,
     email: modalForm.email?.trim() || null,
     direccion: modalForm.direccion?.trim() || null,
     observaciones: modalForm.observaciones?.trim() || null,
     activo: modalForm.activo !== undefined ? modalForm.activo : true,
   };