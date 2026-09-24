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
  const [imageError, setImageError] = React.useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError('');
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setImageError('Formato no válido. Use PNG, JPG o WebP.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setImageError('La imagen excede el límite máximo de 2 MB.');
      return;
    }

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
    setImageError('');
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
          {imageError && (
            <div className={styles.imageError}>⚠️ {imageError}</div>
          )}
          <p className={styles.imageHelpText}>
            Máx 2MB (PNG, JPG, WebP). 400x400 recomendado.
          </p>
          <input 
            type="file" 
            accept="image/png,image/jpeg,image/webp" 
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
          Descripción del Producto
        </label>
        <textarea 
          name="descripcion" 
          rows="2"
          value={formData.descripcion ?? ''} 
          onChange={handleInputChange} 
          placeholder="Ej: Yogurt artesanal con leche entera pasteurizada, endulzado con panela orgánica y trozos de fruta natural. Conservar refrigerado entre 2°C y 4°C."
          className={`${modalStyles.input} ${styles.uppercaseInput}`} 
        />
        <span className={styles.helperText}>Plantilla sugerida con ingredientes, sabor y conservación.</span>
      </div>
    </>
  );
}
