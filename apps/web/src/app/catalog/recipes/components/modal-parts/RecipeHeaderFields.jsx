/**
 * @file RecipeHeaderFields.jsx
 * @module catalog/recipes/components/modal-parts
 * @description Cabecera técnica de recetas en Split Header con soporte plegable/compacto (< 130 líneas).
 */
import React, { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import ProductAvatar from '@/components/ui/ProductAvatar';
import { resolveProductImage } from '@/lib/presetImages';
import { RecipeHeaderWarnings } from './RecipeHeaderWarnings';
import styles from '../recipe-modal.module.css';

export function RecipeHeaderFields({
  formData, products = [], onChange,
  isCommercialWithoutBulk, isMissingCommercialPackaging,
  isCollapsed = false, onToggleCollapse
}) {
  const selectedProduct = products.find(p => String(p.id) === String(formData.idProducto));
  const [showNotes, setShowNotes] = useState(Boolean(formData.observaciones && formData.observaciones.trim()));

  useEffect(() => {
    if (formData.observaciones && formData.observaciones.trim()) setShowNotes(true);
  }, [formData.observaciones]);

  if (isCollapsed) {
    return (
      <div className={styles.headerCollapsedBar}>
        <div className={styles.headerCollapsedLeft}>
          {selectedProduct ? (
            <ProductAvatar src={resolveProductImage(selectedProduct)} alt={selectedProduct.nombre} name={selectedProduct.nombre} className={styles.headerCollapsedAvatar} />
          ) : (
            <Package size={24} color="#78716C" />
          )}
          <div className={styles.headerCollapsedMeta}>
            <span className={styles.headerCollapsedTitle}>{formData.nombre || selectedProduct?.nombre || 'Receta sin título'}</span>
            <span className={styles.headerCollapsedSubtitle}>{formData.rendimientoBase || 0} {formData.unidadRendimiento || 'Litros'} · {selectedProduct ? selectedProduct.nombre : 'Sin producto'}</span>
          </div>
        </div>
        <button type="button" onClick={onToggleCollapse} className={styles.headerCollapsedToggleBtn} title="Re-desplegar cabecera técnica">
          ✏️ Modificar Cabecera ▾
        </button>
      </div>
    );
  }

  return (
    <div className={styles.headerCard}>
      <div className={styles.headerTopActionsRow}>
        <button type="button" onClick={onToggleCollapse} className={styles.headerFoldBtn} title="Plegar cabecera">▲ Plegar</button>
      </div>
      <div className={styles.headerMainLayout}>
        <div className={styles.headerFieldsArea}>
          <div className={styles.grid2}>
            <div>
              <label className={styles.label}>PRODUCTO A FABRICAR *</label>
              <select className={styles.select} name="idProducto" value={formData.idProducto} onChange={onChange} required>
                <option value="">Seleccione el producto a fabricar...</option>
                {Array.from(
                  new Map(
                    products
                      .filter(p => !p.idItem && p.tipoItem !== 'INOCULO_WIP' && p.tipoItem !== 'BASE_GRANEL')
                      .map(p => [p.id, p])
                  ).values()
                ).map((p) => {
                  const presLabel = p.presentacion?.nombre ? ` (${p.presentacion.nombre})` : '';
                  return (
                    <option key={`header-prod-${p.id}`} value={p.id}>
                      {p.nombre}{presLabel}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className={styles.label}>NOMBRE TÉCNICO DE LA RECETA *</label>
              <input className={styles.input} name="nombre" value={formData.nombre} onChange={onChange} required placeholder="Ej: Fórmula Maestra - Yogur Tradicional Fresa 1L" />
            </div>
          </div>
          <div className={styles.grid2}>
            <div>
              <label className={styles.label}>CANTIDAD BASE *</label>
              <input
                className={styles.input}
                type="number"
                step="1"
                min="1"
                name="rendimientoBase"
                value={formData.rendimientoBase ? Math.round(Number(formData.rendimientoBase)) : ''}
                placeholder="Ej: 100"
                onChange={e => {
                  const val = e.target.value === '' ? '' : String(Math.max(1, parseInt(e.target.value, 10) || 1));
                  onChange({ target: { name: 'rendimientoBase', value: val } });
                }}
                required
              />
            </div>
            <div>
              <label className={styles.label}>UNIDAD *</label>
              <select className={styles.select} name="unidadRendimiento" value={formData.unidadRendimiento || 'Litros'} onChange={onChange}>
                <option value="Litros">Litros (L)</option>
                <option value="Kilogramos">Kilogramos (kg)</option>
                <option value="Gramos">Gramos (g)</option>
                <option value="Mililitros">Mililitros (ml)</option>
                <option value="Unidades">Unidades (und)</option>
              </select>
            </div>
          </div>
          <div className={styles.notesContainer}>
            {!showNotes ? (
              <button type="button" onClick={() => setShowNotes(true)} className={styles.notesToggleBtn}><span>📝 [+ Agregar notas u observaciones técnicas]</span></button>
            ) : (
              <div>
                <div className={styles.notesHeaderRow}>
                  <label className={styles.label}>OBSERVACIONES TÉCNICAS O NOTAS DE PLANTA</label>
                  <button type="button" onClick={() => setShowNotes(false)} className={styles.notesHideBtn}>Ocultar campo</button>
                </div>
                <input className={styles.input} name="observaciones" value={formData.observaciones || ''} onChange={onChange} placeholder="Notas operativas, especificaciones de textura, temperatura de envasado, etc. (Opcional)" />
              </div>
            )}
          </div>
        </div>
        <div className={styles.productSideCard}>
          {selectedProduct ? (
            <>
              <ProductAvatar src={resolveProductImage(selectedProduct)} alt={selectedProduct.nombre} name={selectedProduct.nombre} fluid className={styles.productSideAvatar} />
              <span className={styles.productSideCodeLabel} title={selectedProduct.nombre}>{selectedProduct.codigo || selectedProduct.nombre}</span>
            </>
          ) : (
            <div className={styles.productPreviewPlaceholder}><Package size={36} /><span className={styles.productPreviewPlaceholderText}>Sin producto</span></div>
          )}
        </div>
      </div>
      <RecipeHeaderWarnings isCommercialWithoutBulk={isCommercialWithoutBulk} isMissingCommercialPackaging={isMissingCommercialPackaging} />
    </div>
  );
}


