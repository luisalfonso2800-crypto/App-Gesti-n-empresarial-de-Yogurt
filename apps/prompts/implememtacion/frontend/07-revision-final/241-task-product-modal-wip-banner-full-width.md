OBJETIVO:
Reorganizar el banner informativo de "Producto Semielaborado / Base en Tanque" en `apps/web/src/app/catalog/products/components/ProductModal.jsx` para que abarque el ancho completo (de extremo a extremo, `gridColumn: '1 / -1'`) debajo de los campos NOMBRE y PRESENTACIÓN, eliminando el apiñamiento en la columna derecha.

FUENTE DE VERDAD:
- `apps/web/src/app/catalog/products/components/ProductModal.jsx`
- `AGENTS.md` (Reglas 0, 2, 13.1, 16.1, 38, 70, 71)

ARCHIVOS A MODIFICAR:
- `apps/web/src/app/catalog/products/components/ProductModal.jsx`

INSTRUCCIONES:

1. REUBICACIÓN A ANCHO COMPLETO (`gridColumn: '1 / -1'`):
   - Ubicar el bloque condicional del badge/banner de presentación "A GRANEL" que actualmente se encuentra dentro de la columna derecha de `PRESENTACIÓN`.
   - Extraerlo de la columna individual y posicionarlo como un elemento de fila completa que abarque ambas columnas (`gridColumn: '1 / -1'`) inmediatamente debajo de los inputs de `NOMBRE` y `PRESENTACIÓN`.
   - Si el formulario ya está mostrando el banner superior de bienvenida del onboarding ("Paso Clave: Crear Producto Base"), evitar mostrar dos cajas azules redundantes pegadas: unificar el mensaje en una sola tarjeta de extremo a extremo con diseño MANNÁ.

2. ESTILIZACIÓN DE LA TARJETA COMPLETA:
   - Contenedor a todo lo ancho (`width: '100%'`, `marginTop: '0.6rem'`, `padding: '0.65rem 0.9rem'`, `backgroundColor: '#EFF6FF'`, `border: '1px solid #BFDBFE'`, `borderRadius: '8px'`):
     ```jsx
     <div style={{
       gridColumn: '1 / -1',
       width: '100%',
       backgroundColor: '#EFF6FF',
       border: '1px solid #BFDBFE',
       borderRadius: '8px',
       padding: '0.65rem 0.95rem',
       marginTop: '0.5rem',
       display: 'flex',
       alignItems: 'flex-start',
       gap: '0.6rem'
     }}>
       <span style={{ fontSize: '1.05rem', lineHeight: 1 }}>💡</span>
       <div style={{ fontSize: '0.76rem', color: '#1E40AF', lineHeight: '1.35' }}>
         <strong>Producto Semielaborado / Base en Tanque:</strong> Este producto se formulará y fabricará a granel (litros/kilos) en tanque o marmita. Una vez producido, su stock quedará disponible automáticamente como ingrediente base para elaborar los yogures, jaleas y postres comerciales de la planta.
       </div>
     </div>
     ```

3. PRESERVACIÓN:
   - Mantener intactas las validaciones de guardado y los inputs de nombre y presentación.

VERIFICACIÓN:
`pnpm --filter web exec next lint --file src/app/catalog/products/components/ProductModal.jsx`

SALIDA: Reporte breve con la reubicación aplicada, confirmación visual de extremo a extremo y lint con código 0.
```[cite: 2, 3]

---

**Comando para ejecutar en Antigravity:**

```text
> ejecuta la tarea @[apps/prompts/implememtacion/frontend/08-modales/241-task-product-modal-wip-banner-full-width.md]