/**
 * @file SuppliersHeader.jsx
 * @module catalog/suppliers/components
 * @description Cabecera de la lista de proveedores.
 * @responsibility Mostrar título, banner informativo y botón de acción principal.
 * @usedBy apps/web/src/app/catalog/suppliers/page.jsx
 * @dependencies @/components/ui/Button, @/components/ui/ContextBanner
 */
import React from 'react';
import { Button } from '@/components/ui/Button';
import { ContextBanner } from '@/components/ui/ContextBanner';
import styles from '../suppliers.module.css';

export function SuppliersHeader({ onNew }) {
  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>Proveedores</h1>
          <p className={styles.subtitle}>Directorio de fabricantes y distribuidores autorizados de insumos, empaques y servicios.</p>
        </div>
        <Button onClick={onNew}>Nuevo Registro</Button>
      </div>
      <ContextBanner title="Concepto Técnico" description="Directorio de todas las personas y empresas que nos venden los insumos necesarios para operar. Funciona como un directorio centralizado de compras." />
    </div>
  );
}
