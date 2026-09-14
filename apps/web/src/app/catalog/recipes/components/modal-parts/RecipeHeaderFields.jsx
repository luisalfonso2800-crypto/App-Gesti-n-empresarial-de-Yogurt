/**
 * @file RecipeHeaderFields.jsx
 * @module catalog/recipes/components/modal-parts
 * @description Campos de cabecera de la receta (Producto protagónico, nombre técnico, rendimiento base, unidad bloqueada y notas).
 * @responsibility Renderizar los controles de cabecera con flujo causa-efecto y advertencias Poka-Yoke de producto base y empaques.
 * @usedBy apps/web/src/app/catalog/recipes/components/RecipeModal.jsx
 * @dependencies react, next/link, ./recipe-modal.module.css
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../recipe-modal.module.css';

export function RecipeHeaderFields({
  formData,
  products = [],
  onChange,
  isCommercialWithoutBulk,
  isMissingCommercialPackaging
}) {
  // Estado local para revelación progresiva del campo de observaciones
  const [showNotes, setShowNotes] = useState(Boolean(formData.observaciones && formData.observaciones.trim()));

  useEffect(() => {
    if (formData.observaciones && formData.observaciones.trim()) {
      setShowNotes(true);
    }
  }, [formData.observaciones]);

  return (
    <div>
      <h2 className={styles.sectionTitle}>Cabecera de Receta</h2>
      <div className={styles.grid2}>
        {/* Columna 1: Causa Protagónica (Producto a fabricar y Nombre resultante) */}
        <div className={styles.headerFieldsColumn}>
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

        {/* Columna 2: Efecto Operativo (Rendimiento Base y Unidad Bloqueada) */}
        <div className={styles.headerFieldsColumn}>
          <div className={styles.yieldGrid}>
            <div>
              <label className={styles.label}>CANTIDAD RENDIMIENTO BASE *</label>
              <input 
                className={styles.input} 
                type="number" 
                step="0.01" 
                min="0.01" 
                name="rendimientoBase" 
                value={formData.rendimientoBase} 
                placeholder="Ej: 100" 
                onChange={onChange} 
                required 
              />
            </div>
            <div>
              <label className={styles.label}>UNIDAD DE MEDIDA</label>
              <input 
                className={styles.readOnlyInput} 
                name="unidadRendimiento" 
                value={formData.unidadRendimiento || 'Litros'} 
                readOnly 
                tabIndex={-1} 
              />
              <span className={styles.inputHelperText}>
                Definida por la presentación del producto
              </span>
            </div>
          </div>
        </div>

        {/* Compactación de Observaciones Técnicas (Revelación Progresiva) */}
        <div style={{ gridColumn: '1 / -1' }}>
          {!showNotes ? (
            <button
              type="button"
              onClick={() => setShowNotes(true)}
              className={styles.notesToggleBtn}
            >
              <span>📝 + Agregar notas u observaciones técnicas de planta</span>
            </button>
          ) : (
            <div>
              <div className={styles.notesHeaderRow}>
                <label className={styles.label}>OBSERVACIONES TÉCNICAS O NOTAS DE PLANTA</label>
                <button
                  type="button"
                  onClick={() => setShowNotes(false)}
                  className={styles.notesHideBtn}
                >
                  Ocultar campo
                </button>
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

      {/* Banner Poka-Yoke: Bloqueo y orientación para productos comerciales sin base previa */}
      {isCommercialWithoutBulk && (
        <div className={styles.bulkWarningBanner}>
          <div className={styles.bulkWarningText}>
            ⚠️ <strong>Secuencia de Planta:</strong> Estás formulando un producto comercial envasado. Para una elaboración láctea estándar, debes registrar primero el producto base (ej. &apos;Base Blanca de Yogurt&apos; con presentación A GRANEL) antes de formular el producto envasado.
          </div>
          <Link href="/catalog/products" className={styles.bulkWarningLink}>
            + Registrar Producto A GRANEL
          </Link>
        </div>
      )}

      {/* Alerta Poka-Yoke de Empaque Obligatorio en Productos Comerciales */}
      {isMissingCommercialPackaging && (
        <div className={styles.packagingWarningBanner}>
          ⚠️ <strong>Atención de Planta:</strong> Este producto requiere al menos un insumo de empaque primario (vaso, botella o tapa) para poder guardarse y descontarse de bodega.
        </div>
      )}
    </div>
  );
}
