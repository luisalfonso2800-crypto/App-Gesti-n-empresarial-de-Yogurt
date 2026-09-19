/**
 * @file PresentationImageUploader.jsx
 * @module catalog/presentations/components/modal-parts
 * @description Manejo de selección, previsualización y eliminación de la imagen del envase.
 * @responsibility Gestionar el archivo de imagen, subida multipart y visualización limpia sin inline styles.
 * @usedBy apps/web/src/app/catalog/presentations/components/PresentationModal.jsx
 * @dependencies react, lucide-react, ../presentation-modal.module.css, ../../SmartModal.module.css
 */

import React, { useRef } from 'react';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../presentation-modal.module.css';

export function PresentationImageUploader({
  activeDisplayImage,
  isUploading,
  onFileChange,
  onClearImage
}) {
  const fileInputRef = useRef(null);

  const handleTriggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={modalStyles.inputGroup}>
      <label className={modalStyles.label}>IMAGEN DEL ENVASE</label>
      
      <div className={styles.imageSectionRow}>
        <div className={styles.imageActionsCol}>
          <input 
            type="file"
            ref={fileInputRef}
            onChange={onFileChange}
            accept="image/*"
            className={styles.hiddenFileInput}
          />

          <button
            type="button"
            onClick={handleTriggerFileSelect}
            disabled={isUploading}
            className={styles.btnUploadLocal}
          >
            <Upload size={15} />
            <span>{isUploading ? 'Subiendo...' : 'Subir Imagen Local'}</span>
          </button>

          {activeDisplayImage && (
            <button
              type="button"
              onClick={onClearImage}
              title="Eliminar imagen actual"
              className={styles.btnClearImage}
            >
              <Trash2 size={15} />
              <span>Eliminar Imagen</span>
            </button>
          )}
        </div>

        <div className={styles.imageViewerBox}>
          {activeDisplayImage ? (
            <img 
              src={activeDisplayImage} 
              alt="Previsualización del envase" 
              className={styles.imageViewerImg} 
            />
          ) : (
            <div className={styles.imageViewerEmpty}>
              <ImageIcon size={28} strokeWidth={1.5} />
              <span className={styles.imageViewerEmptyText}>Sin imagen asignada</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
