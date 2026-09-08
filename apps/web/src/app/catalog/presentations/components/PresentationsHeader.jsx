/**
 * @file PresentationsHeader.jsx
 * @module catalog/presentations/components
 * @description Cabecera de la vista de presentaciones.
 * @responsibility Mostrar título y banner conceptual del módulo.
 * @usedBy apps/web/src/app/catalog/presentations/page.jsx
 * @dependencies @/components/ui/Button, @/components/ui/ContextBanner
 */
import React from 'react';
import { Button } from '@/components/ui/Button';
import { ContextBanner } from '@/components/ui/ContextBanner';
import styles from '../presentations.module.css';

export function PresentationsHeader({ onNew }) {
  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>Presentaciones</h1>
          <p className={styles.subtitle}>Formatos comerciales y tamaños de empaque final en los que se distribuyen los productos terminados.</p>
        </div>
        <Button onClick={onNew}>Nueva Presentación</Button>
      </div>
      <ContextBanner title="Concepto Técnico" description="Aquí se define la estructura y tamaño físico del producto (como el envase y volumen), sin incluir precio o sabor. Es el 'molde' base para envasar el producto terminado." />
    </div>
  );
}
