TAREA:
Implementar desglose de cálculo y confirmación textual inteligente para empaque y contenido en compra directa

OBJETIVO:
Mejorar la usabilidad de la fila de compra en `apps/web/src/app/operations/purchases/new/page.jsx` (o sus componentes hijos en `components/`) para que el operador comprenda con claridad la relación entre cantidad de empaques y contenido unitario:
1. Renombrar y clarificar los inputs del bloque "Empaque / Contenido" (especificando que es el contenido de CADA unidad/empaque).
2. Mostrar el desglose aritmético explícito debajo de "INGRESO NETO" (ej: "12 bolsas × 900 ml").
3. Agregar una cápsula de confirmación en lenguaje natural en el pie de la tarjeta con el resumen completo del ítem.

FUENTE DE VERDAD:
- `apps/web/src/app/operations/purchases/new/page.jsx`
- `apps/web/src/app/operations/purchases/new/components/FormPhase.jsx` (o componente de fila correspondiente)

REGLA DE CONSULTA:
Consulta únicamente los archivos que componen la vista de Compra Directa. No explores el backend ni otros módulos.

ALCANCE:

LEER:
- `apps/web/src/app/operations/purchases/new/page.jsx`
- Componentes de fila/tabla en `apps/web/src/app/operations/purchases/new/components/`

CREAR:
- ningún archivo.

MODIFICAR:
- Archivo del formulario o fila de compra directa (`FormPhase.jsx` o `page.jsx`).

NO MODIFICAR:
- Endpoints del backend (`apps/api/`).
- Hojas de estilos `.module.css`.

INSTRUCCIONES:

1. CLARIFICACIÓN DE ETIQUETAS Y PLACEHOLDER:
   - Cambia el encabezado del grupo de empaque por:
     `Empaque / Contenido por unidad`
   - En el input numérico del contenido unitario, agrega un tooltip o placeholder dinámico según el empaque seleccionado:
     `placeholder="Contenido c/u"`

2. DESGLOSE MATEMÁTICO EN 'INGRESO NETO':
   - Debajo del total de ingreso neto (ej. `10.800 ml`), añade un subtítulo en texto tenue (`#78716C`, tamaño `0.72rem`):
     ```jsx
     <span style={{ display: 'block', fontSize: '0.70rem', color: '#78716C', marginTop: '2px' }}>
       {fila.cantidad && fila.contenidoUnitario 
         ? `(${fila.cantidad} ${fila.empaque || 'empaques'} × ${Number(fila.contenidoUnitario).toLocaleString('es-CO')} ${fila.unidadMedida || 'ml'})` 
         : ''}
     </span>
     ```

3. CÁPSULA DINÁMICA DE CONFIRMACIÓN EN EL PIE DE LA TARJETA:
   - Al pie de la fila o tarjeta del ítem (justo antes del botón de eliminar o en la parte inferior de la fila), renderiza un mensaje en lenguaje natural cuando se haya seleccionado insumo y cantidad mayor a cero:
     ```jsx
     <div style={{
       marginTop: '0.5rem',
       padding: '0.4rem 0.75rem',
       backgroundColor: '#F7F4EE',
       borderRadius: '6px',
       border: '1px solid #E5DFD5',
       fontSize: '0.76rem',
       color: '#182622'
     }}>
       ✦ <strong>Resumen:</strong> Comprando <strong>{fila.cantidad || 0} {fila.empaque?.toLowerCase() || 'unidades'}</strong> de <strong>{Number(fila.contenidoUnitario || 1).toLocaleString('es-CO')} {fila.unidadMedida || 'ml'}</strong> cada una. Ingresarán <strong>{Number((fila.cantidad || 0) * (fila.contenidoUnitario || 1)).toLocaleString('es-CO')} {fila.unidadMedida || 'ml'}</strong> de <em>{fila.nombreInsumo || 'insumo'}</em> a bodega por <strong>${Number(fila.subtotal || 0).toLocaleString('es-CO')}</strong>.
     </div>
     ```

4. RESPETAR VALORES EDITABLES:
   - Mantén el input de contenido unitario totalmente editable para que el operador pueda cambiar `1` por `900`, `1000`, etc.
   - Si el insumo registrado ya cuenta con un tipo de empaque por defecto (ej. `BOLSA`), precárgalo al seleccionar el insumo.

NO HACER:
- No romper los cálculos de flete global ni el subtotal monetario.
- No alterar la integración con `montoATextoPesos`.
- No crear scripts temporales (`patch*.js`, `fix*.js`).
- No ejecutar `git checkout`.

CRITERIO DE FINALIZACIÓN:
La tarea termina cuando:
- La fila de compra muestra explícitamente el cálculo `(X empaques × Y ml)` bajo el ingreso neto.
- Aparece el mensaje en lenguaje natural resumiendo cuántas unidades/empaques entran y cuántos ml/g ingresan a bodega en total.
- La compilación del frontend concluye sin errores.

VERIFICACIÓN:
Comprueba ejecutando:
pnpm --filter web build --no-lint

DETENCIÓN:
Al cumplir el criterio de finalización, DETENTE. No continúes con ninguna otra tarea.

SALIDA:
Entrega únicamente:
- Archivo modificado:
- Líneas intervenidas:
- Resultado de compilación:
- Estado: