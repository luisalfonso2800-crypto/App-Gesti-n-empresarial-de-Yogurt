OBJETIVO: Modificar exclusivamente `apps/web/src/components/catalog/SupplierModal.jsx`. Prohibido tocar backend, CSS o crear otros archivos. Sin TypeScript.

CAMBIOS:
1. Mayúsculas: En `razonSocial`, `nombreContacto`, `direccion` y `observaciones`, aplicar `.toUpperCase()` en `onChange` y añadir `style={{ textTransform: 'uppercase' }}` a los inputs.
2. Email: Opcional. Aplicar `.toLowerCase().trim()`. Si contiene texto, validar con `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
3. Validación y botón:
   - Requerir obligatorios (con `.trim()`): `razonSocial`, `nit`, `telefono`, `direccion`.
   - Si falta algún obligatorio, el email es inválido o `loading`: deshabilitar botón submit (`disabled`, `opacity: 0.5`, `cursor: 'not-allowed'`) y añadir `title` contextual ('Ingrese un correo electrónico válido' o 'Complete los campos obligatorios (*)').
4. Resumen Poka-Yoke: Encima de la botonera/banner, si existe `formData.razonSocial`, mostrar:
   `<div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '6px', fontSize: '0.76rem', color: '#166534' }}><strong>Resumen:</strong> Se registrará el proveedor <strong>{formData.razonSocial}</strong>{formData.nit ? <> identificado con NIT/C.C. <strong>{formData.nit}</strong></> : null}.</div>`

VERIFICACIÓN: Ejecutar `node --check apps/web/src/components/catalog/SupplierModal.jsx`.

SALIDA: Únicamente reporte conciso: Archivo modificado, líneas intervenidas y resultado del check sintáctico. Sin explicaciones adicionales.