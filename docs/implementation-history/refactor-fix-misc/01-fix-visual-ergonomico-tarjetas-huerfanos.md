# TAREA CONTROLADA — FIX VISUAL ERGONÓMICO EN TARJETAS DE PRODUCTOS HUÉRFANOS (CSS MODULES + JSX)

OBJETIVO:
1. Erradicar el truncamiento agresivo de nombres en las tarjetas del banner de productos huérfanos (`OrphanProductsBanner.jsx` en `/catalog/recipes`).
2. Ampliar el ancho mínimo de las tarjetas en la cuadrícula (`minmax` de 280px a 360px) para acomodar nombres compuestos sin desbordes.
3. Diferenciar visualmente los productos WIP (Base de Planta / Granel) de los Comerciales mediante borde de acento izquierdo y badge tonal MANNÁ.
4. Ocultar o sanitizar subtítulos largos tipo hash/código técnico que saturan visualmente la card.
5. CERO alteraciones a la lógica de negocio, hooks o rutas de API.

FUENTES DE VERDAD:
- `apps/web/src/app/catalog/recipes/components/OrphanProductsBanner.jsx`
- `apps/web/src/app/catalog/recipes/recipes.module.css` (o el CSS Module correspondiente del componente)

REGLAS DE CUOTA ESTRICTA (TOOL BUDGET: MÁXIMO 2 LECTURAS, EXACTAMENTE 2 EDICIONES):
- Modificar EXCLUSIVAMENTE los 2 archivos indicados.
- PROHIBIDO modificar `page.jsx`, backend (`apps/api/**`) o controladores.
- PROHIBIDO alterar el texto o comportamiento del botón `+ Crear Receta` ni su callback `onClick={() => onCreate(p)}`.
- CSS Modules puro. Prohibido el uso de estilos inline (`style={{}}`).
- Cada archivo debe mantenerse en ≤ 150 líneas (Regla SRP).

ACCIONES ESPECÍFICAS:

1. En el archivo CSS Module (`recipes.module.css` o `orphan-products.module.css`):
   - **Ajustar `.orphanGrid`**: Aumentar el tamaño base de columna para evitar compresión horizontal:
     ```css
     .orphanGrid {
       display: grid;
       grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
       gap: 0.85rem;
       margin-top: 0.75rem;
     }
     ```
   - **Ajustar contenedor de la tarjeta (`.orphanCard`)**:
     * Asegurar disposición horizontal balanceada: `display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; padding: 0.65rem 0.85rem; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0;`.
   - **Agregar variantes visuales por tipo de producto (Regla MANNÁ)**:
     ```css
     .orphanCardCommercial {
       border-left: 4px solid #166534;
     }
     .orphanCardWIP {
       border-left: 4px solid #a16207;
     }
     .orphanBadge {
       display: inline-block;
       padding: 0.1rem 0.4rem;
       border-radius: 9999px;
       font-size: 0.62rem;
       font-weight: 700;
       letter-spacing: 0.03em;
       margin-left: 0.35rem;
       vertical-align: middle;
     }
     .orphanBadgeCommercial {
       background-color: #dcfce7;
       color: #166534;
     }
     .orphanBadgeWIP {
       background-color: #fef3c7;
       color: #92400e;
     }
     ```
   - **Ajustar tipografía del título (`.orphanCardTitle` / `.orphanTitle`)**:
     * Reemplazar la elipsis estricta de una sola línea por soporte multilínea (hasta 2 líneas completas):
     ```css
     .orphanCardTitle {
       font-size: 0.82rem;
       font-weight: 700;
       color: #182622;
       line-height: 1.25;
       display: -webkit-box;
       -webkit-line-clamp: 2;
       -webkit-box-orient: vertical;
       overflow: hidden;
       word-break: break-word;
     }
     ```
   - **Subtítulo / Meta (`.orphanCardMeta`)**:
     * Si existe código o categoría limpia, renderizar en tipografía tenue de 10.5px. Ocultar si contiene prefijos internos ruidosos como `E2E_TEST_PRES_`.

2. En `OrphanProductsBanner.jsx`:
   - Definir función utilitaria pura para identificar WIP:
     ```javascript
     const isWipProduct = (p) => {
       const tipo = (p.tipoProducto || p.tipo || '').toUpperCase();
       const cat = (p.categoria || '').toUpperCase();
       return tipo.includes('WIP') || cat.includes('WIP') || cat.includes('BASE') || cat.includes('JALEA') || cat.includes('TANQUE');
     };
     ```
   - En el renderizado de la tarjeta huérfana:
     * Aplicar la clase condicional en el contenedor exterior:
       `className={`${styles.orphanCard}${isWipProduct(p) ? styles.orphanCardWIP : styles.orphanCardCommercial}`}`
     * En el bloque central de texto:
       - Renderizar el nombre del producto en `.orphanCardTitle` agregando el badge:
         `<span className={`${styles.orphanBadge}${isWipProduct(p) ? styles.orphanBadgeWIP : styles.orphanBadgeCommercial}`}>{isWipProduct(p) ? 'WIP' : 'COM'}</span>`
       - Debajo del título, si el subtítulo actual muestra un código que empieza por `E2E_TEST_PRES_` o similar, omitirlo o mostrar únicamente la categoría legible o presentación simplificada (ej. `p.presentacion?.nombre || p.categoria || ''`).
     * Mantener intacto el botón a la derecha:
       `<button className={styles.orphanCardBtn} onClick={() => onCreate(p)}>+ Crear Receta</button>`

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/OrphanProductsBanner.jsx`
2. `node apps/web/e2e/helpers/check-e2e-limits.js` (o linter local de la app)

CRITERIO DE FINALIZACIÓN:
- Nombres visibles hasta en 2 líneas sin cortarse prematuramente con puntos suspensivos.
- Tarjetas con distinción cromática (verde para Comercial, dorado para WIP) y badge rotulado.
- Botones de acción alineados y operativos.
- DETENTE inmediatamente tras reportar.

REPORTE REQUERIDO:
- Archivos modificados y líneas resultantes.
- Verificación sintáctica con código 0.
- Estado: [COMPLETADO / BLOQUEADO].
