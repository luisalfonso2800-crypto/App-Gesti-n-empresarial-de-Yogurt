TAREA (PRESUPUESTO ESTRICTO: MÁXIMO 5 ARCHIVOS INTERVENIDOS - CERO BUCLES):
Crear la persistencia en base de datos para la configuración corporativa y editorial de la empresa (facturación/recibos), exponiendo endpoints GET y PUT en el backend y conectando el frontend (modal de configuración y comprobante de venta) a dicha fuente de verdad.

ARCHIVOS A INTERVENIR:
1. `apps/api/prisma/schema.prisma`
2. `apps/api/src/company-config/` (CREAR módulo o servicio en backend con controller/service/repository o dentro de `commercial`)
3. `apps/api/src/app.module.js` (Registrar el módulo en NestJS si aplica)
4. `apps/web/src/components/settings/InvoiceSettingsModal.jsx` (Mutar hacia la API en vez de solo localStorage)
5. `apps/web/src/app/commercial/sales/components/SaleInvoicePrintModal.jsx` (Consumir los datos desde la API)

INSTRUCCIONES TÉCNICAS:

1. Modelo Prisma (`schema.prisma`):
   - Agregar el modelo `ConfiguracionEmpresa`:
     ```prisma
     model ConfiguracionEmpresa {
       id             String   @id @default(uuid()) @map("ID_Configuracion")
       nombreComercial String  @default("MANNÀ") @map("Nombre_Comercial")
       razonSocial    String   @default("Alimentos Naturales S.A.S.") @map("Razon_Social")
       holding        String   @default("GUERRERO PRADO HOLDING COMPANY FAMILY S.A.S.") @map("Holding")
       nit            String   @default("901.234.567-8") @map("NIT")
       ciudad         String   @default("Santa Marta, Magdalena - Colombia") @map("Ciudad")
       telefono       String   @default("+57 300 123 4567") @map("Telefono")
       correo         String   @default("hola@manna.com.co") @map("Correo")
       web            String   @default("[www.manna.com](https://www.manna.com).co") @map("Web")
       instagram      String   @default("@manna.alimentos") @map("Instagram")
       qrUrl          String   @default("[https://manna.com.co](https://manna.com.co)") @map("QR_Url")
       lemaCabecera   String   @default("Semilla · Tiempo · Fruto") @map("Lema_Cabecera")
       citaEditorial  String   @default("Sabor que nace de lo natural. Tradición que mira al futuro.") @map("Cita_Editorial")
       fraseProposito String   @default("Gracias por ser parte de este propósito.") @map("Frase_Proposito")
       piePagina      String   @default("SABOR QUE NACE DE LO NATURAL") @map("Pie_Pagina")
       actualizadoEn  DateTime @updatedAt @map("Actualizado_En")

       @@map("Configuracion_Empresa")
     }
     ```
   - Sincronizar mediante shell: `pnpm --filter api exec prisma db push && pnpm --filter api exec prisma generate`.

2. Backend (`company-config`):
   - Crear endpoint `GET /company-config`:
     * Busca el primer registro con `findFirst()`.
     * Si no existe, crea automáticamente el registro inicial con los valores predeterminados y lo retorna (Upsert/Singleton).
   - Crear endpoint `PUT /company-config`:
     * Recibe los datos actualizados y realiza `upsert` o `update` sobre el registro único de configuración.

3. Frontend (`InvoiceSettingsModal.jsx` y `useInvoiceConfig`):
   - Al cargar el modal o la app, consultar `GET /company-config`.
   - Al enviar el formulario de ajustes, ejecutar `PUT /company-config` y refrescar el estado global o caché.
   - En `SaleInvoicePrintModal.jsx`, inyectar la configuración devuelta por la API para pintar la razón social, holding, lemas y teléfonos sin nada hardcodeado.
   - Cumplir SRP (< 130 líneas por archivo).

VERIFICACIÓN:
1. `pnpm --filter api build`
2. `node .agents/scripts/verify-srp.js`
3. `pnpm --filter web build`

CRITERIO DE FINALIZACIÓN:
- La tabla `Configuracion_Empresa` existe en PostgreSQL.
- Los cambios realizados desde el engranaje se guardan en BD y persisten aunque se cambie de navegador o terminal.
- El recibo/factura renderiza exactamente los datos provenientes de la base de datos.
- Código 0 en SRP y builds.

DETENCIÓN:
Al validar sintaxis y verificar compilación limpia, DETENTE inmediatamente.