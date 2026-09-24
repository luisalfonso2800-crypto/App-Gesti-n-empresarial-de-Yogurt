/**
 * @file SalesHeader.jsx
 * @module commercial/sales/components
 * @description Componente header de visualización de ventas.
 * @responsibility Título y disparador de acción para registrar facturas.
 * @usedBy apps/web/src/app/commercial/sales/page.jsx
 * @dependencies @/components/ui/Button
 */
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Eye, EyeOff } from 'lucide-react';
import styles from '../sales.module.css';

export function SalesHeader({ onNew, mostrarCifras, onTogglePrivacy }) {
  return (
    <div className={styles.header}>
      <div />
      <div className={styles.headerActions}>
        <button
          type="button"
          onClick={onTogglePrivacy}
          title={mostrarCifras ? "Ocultar cifras financieras" : "Mostrar cifras financieras"}
          aria-label={mostrarCifras ? "Ocultar cifras financieras" : "Mostrar cifras financieras"}
          className={styles.privacyToggleBtn}
        >
          {mostrarCifras ? (
            <Eye size={18} className={styles.privacyIconOpen} />
          ) : (
            <EyeOff size={18} className={styles.privacyIconClosed} />
          )}
          <span className={styles.privacyBtnText}>
            {mostrarCifras ? "Ocultar Cifras" : "Ver Cifras"}
          </span>
        </button>
        <Button onClick={onNew}>Nueva Venta</Button>
      </div>
    </div>
  );
}
