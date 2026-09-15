/**
 * @file ProductPageNotices.jsx
 * @module catalog/products/components
 * @description Banners de prerrequisitos, alertas de acción y errores del catálogo de productos.
 * @responsibility Modularizar avisos superiores de page.jsx para mantener la página < 105 líneas.
 * @usedBy apps/web/src/app/catalog/products/page.jsx
 * @dependencies React, next/link, ../products.module.css
 */
import React from 'react';
import Link from 'next/link';
import styles from '../products.module.css';

export function ProductPageNotices({
  loadingPresentations,
  hasPresentations,
  actionNotice,
  clearActionNotice,
  error
}) {
  const isInfo = actionNotice?.includes('abrieron');

  return (
    <>
      {!loadingPresentations && !hasPresentations && (
        <div className={styles.prereqBanner}>
          <div>
            <strong>Prerrequisito requerido:</strong> Para registrar productos terminados debe configurar primero los formatos de envase.
          </div>
          <Link href="/catalog/presentations" className={styles.prereqLink}>
            Configurar Presentaciones
          </Link>
        </div>
      )}

      {actionNotice && (
        <div className={isInfo ? styles.toastInfo : styles.toastAlert}>
          <span>{isInfo ? 'ℹ️' : '⚠️'} {actionNotice}</span>
          <button
            className={isInfo ? styles.toastCloseInfo : styles.toastClose}
            onClick={clearActionNotice}
            aria-label="Cerrar aviso"
          >
            &times;
          </button>
        </div>
      )}

      {Boolean(error) && (
        <div className={styles.errorMessage}>
          {typeof error === 'string' ? error : error?.message || 'Error al cargar datos'}
        </div>
      )}
    </>
  );
}
