/**
 * @file SmartModal.jsx
 * @module components/ui
 * @description Contenedor modal inteligente con prevención de cierre accidental. (CSS Modules version)
 * @responsibility Proveer la estructura base de modales Poka-Yoke con validación y estados de carga.
 * @usedBy Formularios de negocio (Ventas, Pagos, Catálogos, etc.)
 * @dependencies lucide-react, SmartModal.module.css
 */

import React, { useState, useEffect } from 'react';
import { X, Loader2, Leaf } from 'lucide-react';
import styles from './SmartModal.module.css';

export default function SmartModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  isDirty = false,
  isSubmitting = false,
  icon: Icon = Leaf
}) {
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !showConfirmClose) {
        handleSafeClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showConfirmClose, isDirty]);

  if (!isOpen) return null;

  const handleSafeClose = () => {
    if (isDirty) {
      setShowConfirmClose(true);
    } else {
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleSafeClose();
    }
  };

  const confirmClose = () => {
    setShowConfirmClose(false);
    onClose();
  };

  const cancelClose = () => {
    setShowConfirmClose(false);
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modalCard}>
        {/* Header Institucional Botánico MANNÁ */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            {Icon && (
              <div className={styles.headerIconBadge}>
                <Icon size={18} className={styles.headerLeafIcon} />
              </div>
            )}
            <div className={styles.headerTitles}>
              <h2 className={styles.headerTitle}>{title}</h2>
              {subtitle && <p className={styles.headerSubtitle}>{subtitle}</p>}
            </div>
          </div>
          <button 
            onClick={handleSafeClose}
            disabled={isSubmitting}
            className={styles.closeButton}
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {children}
        </div>

        {/* Overlay Confirm Close */}
        {showConfirmClose && (
          <div className={styles.confirmOverlay}>
            <h3 className={styles.confirmTitle}>¿Deseas salir y perder los cambios?</h3>
            <p className={styles.confirmText}>Tienes datos ingresados sin guardar.</p>
            <div className={styles.confirmActions}>
              <button 
                onClick={cancelClose}
                className={styles.confirmBtnCancel}
              >
                Continuar Editando
              </button>
              <button 
                onClick={confirmClose}
                className={styles.confirmBtnDiscard}
              >
                Descartar Cambios
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * @description Botón de envío estándar para modales inteligentes
 */
export function SubmitButton({ isSubmitting, text = 'Guardar', processingText = 'Procesando...', className, ...props }) {
  return (
    <button
      disabled={isSubmitting}
      className={`${styles.btnSubmit} ${className || ''}`}
      {...props}
    >
      {isSubmitting ? (
        <>
          <Loader2 className={styles.spinIcon} size={18} />
          {processingText}
        </>
      ) : text}
    </button>
  );
}
