/**
 * @file RecipeHeaderWarnings.jsx
 * @module catalog/recipes/components/modal-parts
 * @description Banners Poka-Yoke de advertencia y orientación para la cabecera de recetas.
 * @responsibility Renderizar alertas de producto base comercial sin granel y empaque comercial obligatorio.
 * @usedBy apps/web/src/app/catalog/recipes/components/modal-parts/RecipeHeaderFields.jsx
 * @dependencies react, next/link, lucide-react, ../recipe-modal.module.css
 */
import React from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import styles from '../recipe-modal.module.css';

export function RecipeHeaderWarnings({ isCommercialWithoutBulk, isMissingCommercialPackaging }) {
  return (
    <>
      {isCommercialWithoutBulk && (
        <div className={styles.bulkWarningBanner}>
          <div className={styles.bulkWarningText}>
            ⚠️ <strong>Secuencia de Planta:</strong> Estás formulando un producto comercial envasado. Para una elaboración láctea estándar, debes registrar primero el producto base (ej. &apos;Base Blanca de Yogurt&apos; con presentación A GRANEL) antes de formular el producto envasado.
          </div>
          <Link href="/catalog/products" className={styles.bulkWarningLink}>+ Registrar Producto A GRANEL</Link>
        </div>
      )}

      {isMissingCommercialPackaging && (
        <div className={styles.packagingWarningBanner}>
          <AlertTriangle size={18} className={styles.warningIcon} />
          <div className={styles.warningContent}>
            <strong>Atención de Planta:</strong> Este producto requiere al menos un insumo de empaque primario (vaso, botella o tapa) para poder guardarse y descontarse de bodega.
          </div>
        </div>
      )}
    </>
  );
}

