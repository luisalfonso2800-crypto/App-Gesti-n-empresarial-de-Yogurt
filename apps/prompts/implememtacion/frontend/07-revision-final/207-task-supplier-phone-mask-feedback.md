OBJETIVO: Modificar únicamente `apps/web/src/components/catalog/SupplierModal.jsx`. Prohibido crear archivos, usar TypeScript o alterar backend/CSS globales.

CAMBIOS:
1. Máscara de teléfono: Extraer solo dígitos (máximo 10). Formatear en tiempo real con patrón `XXX XXX XXXX` (espacios automáticos en índices 3 y 6). Guardar en el payload los 10 dígitos limpios.
2. Feedback de error por input (aplicar borde `1px solid #EF4444` y mensaje inferior `<span style={{ color: '#DC2626', fontSize: '0.72rem', display: 'block', marginTop: '3px' }}>`):
   - `telefono`: "El celular debe tener 10 dígitos" si tiene menos de 10 números.
   - `nit`: "NIT o Cédula requerido" si está vacío o contiene caracteres inválidos.
   - `email`: "Ingrese un correo electrónico válido (ej. contacto@empresa.com)" si contiene texto y no cumple `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
   - Limpiar el estado visual de error en tiempo real en cuanto el usuario corrija el campo.
3. Botón guardar: Deshabilitar (`disabled`, `opacity: 0.5`, `cursor: 'not-allowed'`) y agregar atributo `title` indicando campos faltantes o inválidos mientras existan errores.

VERIFICACIÓN: Ejecutar `node --check apps/web/src/components/catalog/SupplierModal.jsx`.

SALIDA: Exclusivamente reporte conciso: Archivo modificado, líneas intervenidas y resultado sintáctico. Sin introducciones ni conclusiones.