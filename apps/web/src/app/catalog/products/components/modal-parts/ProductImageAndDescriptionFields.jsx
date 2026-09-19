/**
 * @file ProductImageAndDescriptionFields.jsx
 * @module catalog/products/components/modal-parts
 * @description Campos de carga de imagen comercial y descripción del producto.
 * @responsibility Gestionar carga de imagen local/URL y entrada de descripción/observaciones.
 * @usedBy apps/web/src/app/catalog/products/components/ProductModal.jsx
 * @dependencies react, ../../SmartModal.module.css, ../product-modal.module.css
 */

import React, { useRef } from 'react';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../product-modal.module.css';

export function ProductImageAndDescriptionFields({
  formData,
  handleChange,
  handleInputChange
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

  const handleRemoveImage = () => {
    handleChange({ target: { name: 'imagenUrl', value: '' } });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <div className={styles.imageSectionContainer}>
        <div className={styles.imageActionsCol}>
          <label className={styles.imageLabel}>FOTO COMERCIAL DEL PRODUCTO</label>
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            className={styles.btnUploadLocalImage}
          >
            📁 Subir Imagen desde el Equipo
          </button>
          {formData.imagenUrl && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className={styles.btnRemoveImage}
            >
              🗑 Quitar Imagen
            </button>
          )}
          <p className={styles.imageHelpText}>
            Formatos: PNG, JPG, WebP. Resolución óptima recomendada: 400x400 o superior.
          </p>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            className={styles.hiddenFileInput} 
            onChange={handleImageUpload} 
          />
        </div>

        <div className={styles.imagePreviewBox}>
          {formData.imagenUrl ? (
            <img 
              src={formData.imagenUrl} 
              alt="Previsualización del producto" 
              className={styles.productImageLarge} 
            />
          ) : (
            <div className={styles.imagePlaceholder}>
              <span className={styles.placeholderIcon}>🥛</span>
              <span className={styles.placeholderText}>Sin imagen comercial asignada</span>
            </div>
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
