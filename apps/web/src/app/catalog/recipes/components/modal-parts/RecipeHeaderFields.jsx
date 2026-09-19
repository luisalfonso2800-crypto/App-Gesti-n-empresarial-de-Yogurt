/**
 * @file RecipeHeaderFields.jsx
 * @module catalog/recipes/components/modal-parts
 * @description Campos de cabecera de la receta con tarjeta visual unificada e imagen en 1/6 a la derecha.
 * @responsibility Renderizar controles de cabecera y miniatura lateral derecha con flujo causa-efecto.
 * @usedBy apps/web/src/app/catalog/recipes/components/RecipeModal.jsx
 * @dependencies react, lucide-react, @/components/ui/ProductAvatar, ./RecipeHeaderWarnings
 */
import React, { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import ProductAvatar from '@/components/ui/ProductAvatar';
import { resolveProductImage } from '@/lib/presetImages';
import { RecipeHeaderWarnings } from './RecipeHeaderWarnings';
import styles from '../recipe-modal.module.css';

export function RecipeHeaderFields({ formData, products = [], onChange, isCommercialWithoutBulk, isMissingCommercialPackaging }) {
  const selectedProduct = products.find(p => String(p.id) === String(formData.idProducto));
  const [showNotes, setShowNotes] = useState(Boolean(formData.observaciones && formData.observaciones.trim()));

  useEffect(() => {
    if (formData.observaciones && formData.observaciones.trim()) setShowNotes(true);
  }, [formData.observaciones]);

  return (
    <div className={styles.headerCard}>
      <div className={styles.headerMainLayout}>
        {/* Lado Izquierdo (5/6): Campos del formulario de cabecera */}
        <div className={styles.headerFieldsArea}>
          <div className={styles.grid2}>
            <div>
              <label className={styles.label}>PRODUCTO A FABRICAR *</label>
              <select 
                className={styles.select} 
                name="idProducto" 
                value={formData.idProducto} 
                onChange={onChange} 
                required
              >
                <option value="">Seleccione el producto a fabricar...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre} ({p.presentacion?.nombre || 'A GRANEL'})</option>
                ))}
              </select>
            </div>
            <div>
              <label className={styles.label}>NOMBRE TÉCNICO DE LA RECETA *</label>
              <input 
                className={styles.input} 
                name="nombre" 
                value={formData.nombre} 
                onChange={onChange} 
                required 
                placeholder="Ej: Fórmula Maestra - Yogur Tradicional Fresa 1L" 
              />
            </div>
          </div>

          <div className={styles.grid2}>
            <div>
              <label className={styles.label}>CANTIDAD RENDIMIENTO BASE *</label>
              <input 
                className={styles.input} type="number" step="0.01" min="0.01" 
                name="rendimientoBase" value={formData.rendimientoBase} 
                placeholder="Ej: 100" onChange={onChange} required 
              />
            </div>
            <div>
              <label className={styles.label}>UNIDAD DE MEDIDA *</label>
              <select 
                className={styles.select} 
                name="unidadRendimiento" 
                value={formData.unidadRendimiento || 'Litros'} 
                onChange={onChange}
              >
                <option value="Litros">Litros (L)</option>
                <option value="Kilogramos">Kilogramos (kg)</option>
                <option value="Gramos">Gramos (g)</option>
                <option value="Mililitros">Mililitros (ml)</option>
                <option value="Unidades">Unidades (und)</option>
              </select>
              <span className={styles.inputHelperText}>Sugerida según el producto; editable según necesidad de planta</span>
            </div>
          </div>

          <div className={styles.notesContainer}>
            {!showNotes ? (
              <button type="button" onClick={() => setShowNotes(true)} className={styles.notesToggleBtn}>
                <span>📝 + Agregar notas u observaciones técnicas de planta</span>
              </button>
            ) : (
              <div>
                <div className={styles.notesHeaderRow}>
                  <label className={styles.label}>OBSERVACIONES TÉCNICAS O NOTAS DE PLANTA</label>
                  <button type="button" onClick={() => setShowNotes(false)} className={styles.notesHideBtn}>Ocultar campo</button>
                </div>
                <input 
                  className={styles.input} 
                  name="observaciones" 
                  value={formData.observaciones || ''} 
                  onChange={onChange} 
                  placeholder="Notas operativas, especificaciones de textura, temperatura de envasado, etc. (Opcional)" 
                />
              </div>
            )}
          </div>
        </div>

        {/* Lado Derecho (1/6): Imagen grande ocupando todo el contenedor */}
        <div className={styles.productSidePreview}>
          {selectedProduct ? (
            <ProductAvatar
              src={resolveProductImage(selectedProduct)}
              alt={selectedProduct.nombre}
              name={selectedProduct.nombre}
              fluid
              className={styles.productSideAvatar}
            />
          ) : (
            <div className={styles.productPreviewPlaceholder}>
              <Package size={40} />
              <span className={styles.productPreviewPlaceholderText}>Sin foto</span>
            </div>
          )}
        </div>
      </div>

      <RecipeHeaderWarnings
        isCommercialWithoutBulk={isCommercialWithoutBulk}
        isMissingCommercialPackaging={isMissingCommercialPackaging}
      />
    </div>
  );
}


