/**
 * @file ProductionRecipeWarningBanner.jsx
 * @module operations/production/components
 * @description Banner industrial MANNÁ de advertencia preventiva cuando existen productos comerciales sin receta técnica formulada.
 * @responsibility Informar al operario de productos huérfanos y ofrecer acceso directo para crear su fórmula en el catálogo.
 * @usedBy apps/web/src/app/operations/production/page.jsx
 * @dependencies react, next/link, lucide-react, ../production.module.css
 */
'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, PlusCircle } from 'lucide-react';
import styles from '../production.module.css';

export default function ProductionRecipeWarningBanner({ orphanProducts = [] }) {
  if (!orphanProducts || orphanProducts.length === 0) return null;

  const firstOrphanName = orphanProducts[0]?.nombre || 'Producto Comercial';
  const hasMore = orphanProducts.length > 1;

  return (
    <div className={styles.orphanWarningBanner}>
      <div className={styles.orphanWarningContent}>
        <div className={styles.orphanWarningTitleRow}>
          <AlertTriangle size={20} className={styles.orphanWarningIcon} />
          <span className={styles.orphanWarningTitle}>
            Productos comerciales pendientes de receta técnica
          </span>
        </div>
        <p className={styles.orphanWarningDescription}>
          ⚠ Hay productos comerciales creados (ej.{' '}
          <strong className={styles.orphanProductName}>{firstOrphanName}</strong>
          {hasMore && ` y ${orphanProducts.length - 1} más`}) que aún no cuentan con receta técnica. Para planificar su producción en planta, primero debe crear su fórmula.
        </p>
      </div>

      <div className={styles.orphanWarningActions}>
        <Link href="/catalog/recipes" className={styles.btnCreateRecipeShortcut}>
          <PlusCircle size={15} />
          <span>+ Crear Receta Técnica</span>
        </Link>
      </div>
    </div>
  );
}
