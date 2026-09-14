/**
 * @file ProductImageAndDescriptionFields.jsx
 * @module catalog/products/components/modal-parts
 * @description Campos de carga de imagen (presets o archivo local) y descripción del producto.
 * @responsibility Gestionar presets de imagen, canvas de compresión y entrada de descripción/observaciones.
 * @usedBy apps/web/src/app/catalog/products/components/ProductModal.jsx
 * @dependencies react, ../../SmartModal.module.css, ../product-modal.module.css
 */

import React, { useRef } from 'react';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../product-modal.module.css';

export function ProductImageAndDescriptionFields({
  formData,
  handleChange,
  handleInputChange,
  presets = []
}) {
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#FBF9F5';
        ctx.fillRect(0, 0, 400, 400);

        const scale = Math.min(400 / img.width, 400 / img.height);
        const x = (400 / 2) - (img.width / 2) * scale;
        const y = (400 / 2) - (img.height / 2) * scale;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        const dataUrl = canvas.toDataURL('image/webp', 0.8);
        handleChange({ target: { name: 'imagenUrl', value: dataUrl } });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>Imagen del Producto (URL o Preset)</label>
        <div className={styles.imagePresetsRow}>
          {presets.map(preset => (
            <img 
              key={preset.id} 
              src={preset.url} 
              alt={preset.name}
              title={preset.name}
              onClick={() => handleChange({ target: { name: 'imagenUrl', value: preset.url } })}
              className={`${styles.presetThumb} ${formData.imagenUrl === preset.url ? styles.presetThumbSelected : styles.presetThumbUnselected}`}
            />
          ))}
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            className={styles.btnUploadLocalImage}
          >
            📁 Subir Imagen desde el Equipo
          </button>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            onChange={handleImageUpload} 
          />
        </div>
        <div className={styles.imagePreviewRow}>
          <input 
            name="imagenUrl" 
            value={formData.imagenUrl ?? ''} 
            onChange={handleChange} 
            placeholder="https://... o clic en preset/subir"
            className={`${modalStyles.input} ${styles.imageInputFlex}`}
          />
          {formData.imagenUrl && (
            <img src={formData.imagenUrl} alt="Preview" className={styles.imagePreviewThumb} />
          )}
        </div>
      </div>

      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>
          Descripción <span className={styles.requiredAsterisk}>*</span>
        </label>
        <input 
          name="descripcion" 
          value={formData.descripcion ?? ''} 
          onChange={handleInputChange} 
          className={`${modalStyles.input} ${styles.uppercaseInput}`} 
          required 
        />
      </div>
    </>
  );
}
