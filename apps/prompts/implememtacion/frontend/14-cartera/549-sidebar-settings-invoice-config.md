TAREA (PRESUPUESTO ESTRICTO: MÁXIMO 4 ARCHIVOS EN FRONTEND - CERO BUCLES):
Implementar el acceso de Configuración en el menú lateral inferior (sobre "Procesos que dan vida") y desplegar un modal administrativo para parametrizar dinámicamente todos los datos legales, de contacto y editoriales del comprobante de venta, consumiéndolos reactivamente en la factura sin valores hardcodeados.

ARCHIVOS A INTERVENIR:
1. `apps/web/src/components/layout/Sidebar.jsx` (o componente del menú lateral donde reside "Procesos que dan vida")
2. `apps/web/src/components/settings/InvoiceSettingsModal.jsx` (CREAR - Modal de configuración de factura)
3. `apps/web/src/context/InvoiceConfigContext.jsx` (o hook `useInvoiceConfig.js` con persistencia en localStorage/API)
4. `apps/web/src/app/commercial/sales/components/SaleInvoicePrintModal.jsx` (Adaptar para consumir la configuración dinámica)

INSTRUCCIONES TÉCNICAS:

1. Botón de Configuración en Sidebar:
   - Localizar el pie del Sidebar en `apps/web/src/components/layout/Sidebar.jsx`.
   - En la sección inferior, inmediatamente arriba del bloque de texto *"Procesos que dan vida"*, ubicar alineado a la derecha un botón estilizado con icono de engranaje (`Settings` de Lucide):
     * Estilo sobrio y minimalista (`text-[#FAF8F5]/60 hover:text-amber-300 hover:bg-white/5 p-1.5 rounded-lg transition-colors`).
     * Al hacer clic, abre `InvoiceSettingsModal`.

2. Gestor de Configuración Dinámica (`useInvoiceConfig.js` o Context):
   - Valores iniciales por defecto (fallback):
     * `nombreComercial`: 'MANNÀ'
     * `razonSocial`: 'Alimentos Naturales S.A.S.'
     * `holding`: 'GUERRERO PRADO HOLDING COMPANY FAMILY S.A.S.'
     * `nit`: '901.234.567-8'
     * `ciudad`: 'Santa Marta, Magdalena - Colombia'
     * `telefono`: '+57 300 123 4567'
     * `correo`: 'hola@manna.com.co'
     * `web`: 'www.manna.com.co'
     * `instagram`: '@manna.alimentos'
     * `qrUrl`: 'https://manna.com.co'
     * `lemaCabecera`: 'Semilla · Tiempo · Fruto'
     * `citaEditorial`: 'Sabor que nace de lo natural. Tradición que mira al futuro.'
     * `fraseProposito`: 'Gracias por ser parte de este propósito.'
     * `piePagina`: 'SABOR QUE NACE DE LO NATURAL'
   - Persistir en `localStorage` (clave `manna_invoice_config`) con soporte para sincronización reactiva inmediata.

3. Modal de Configuración (`InvoiceSettingsModal.jsx` < 120 líneas):
   - Modal corporativo MANNÁ con formulario en pestañas o secciones compactas:
     * **Identificación Legal:** Razón Social, Holding, NIT, Ciudad.
     * **Canales de Contacto:** Teléfono, Correo, Web, Instagram, URL QR.
     * **Lemas y Textos:** Cita de cabecera, frase de agradecimiento y pie.
   - Botón `Restablecer Predeterminados` y botón `Guardar Configuración`.

4. Conexión en Comprobante (`SaleInvoicePrintModal.jsx`):
   - Reemplazar cualquier texto estático por las variables provenientes del hook/context de configuración.
   - Respetar estrictamente el límite SRP (< 130 líneas por archivo).

VERIFICACIÓN:
1. `node .agents/scripts/verify-srp.js`
2. `pnpm --filter web build`

CRITERIO DE FINALIZACIÓN:
- El icono de ajustes aparece ubicado en el sidebar inferior sobre "Procesos que dan vida".
- Al pulsar el botón se despliega el modal y permite modificar cualquier dato del comprobante.
- Al imprimir o visualizar la factura, los cambios se reflejan de inmediato.
- Compilación limpia y código 0 en verify-srp.

DETENCIÓN:
Al validar sintaxis y verificar compilación limpia, DETENTE inmediatamente.