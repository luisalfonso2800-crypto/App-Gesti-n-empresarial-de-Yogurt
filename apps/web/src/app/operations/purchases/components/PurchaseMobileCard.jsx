/**
 * @file PurchaseMobileCard.jsx
 * @module operations/purchases/components
 * @description Tarjeta fluida para visualización de compra/orden en pantallas móviles (MAN-UI-002, SRP < 120 líneas).
 * @responsibility Renderizar cabecera, montos, fecha, estado y acordeón expandible con touch targets >= 40px.
 * @usedBy apps/web/src/app/operations/purchases/components/PurchasesHistoryTable.jsx
 * @dependencies react, lucide-react, @/components/ui/Badge, ./PurchasesAccordionDetails, ../purchases.module.css
 */
'use client';

import React from 'react';
import { ChevronDown, ChevronUp, ShoppingBag, Calendar, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import PurchasesAccordionDetails from './PurchasesAccordionDetails';
import styles from '../purchases.module.css';

export function PurchaseMobileCard({
  group,
  isExpanded,
  onToggle
}) {
  const orden = group.orden;
  const title = group.isGrouped && orden
    ? `${orden.codigo} - ${orden.nombre}`
    : `Compra Directa - ${new Date(group.fechaCompra).toLocaleDateString()}`;

  const conseguidosCount = group.detalles.length;
  let faltantesCount = 0;
  let isCompleted = true;

  if (group.isGrouped && orden) {
    const totalItemsInOrder = orden.items ? orden.items.length : 0;
    faltantesCount = Math.max(0, totalItemsInOrder - conseguidosCount);
    if (faltantesCount > 0) {
      isCompleted = false;
    }
  }

  return (
    <div className={`${styles.mobileCard} ${isExpanded ? styles.mobileCardExpanded : ''}`}>
      <div className={styles.mobileCardHeader} onClick={onToggle} role="button" tabIndex={0} aria-expanded={isExpanded}>
        <div className={styles.mobileCardLeft}>
          <div className={styles.mobileCardIconBox}>
            <ShoppingBag size={18} className={styles.mobileCardIconForest} />
          </div>
          <div className={styles.mobileProductInfo}>
            <span className={styles.mobileProductTitle}>{title}</span>
            <div className={styles.mobileCardMetaRow}>
              <span className={styles.mobileCardMetaItem}>
                <Calendar size={12} /> {new Date(group.fechaCompra).toLocaleDateString()}
              </span>
              <span className={styles.mobileCardMetaItem}>
                <Layers size={12} /> {conseguidosCount} ítems {faltantesCount > 0 ? `(${faltantesCount} faltantes)` : ''}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.mobileCardRight}>
          <Badge status={isCompleted ? 'active' : 'warning'}>
            {isCompleted ? 'Completada' : 'En Ruta'}
          </Badge>
          <span className={styles.mobileToggleIcon}>
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </span>
        </div>
      </div>

      <div className={styles.mobileCardBody}>
        <div className={styles.mobileDataRow}>
          <span className={styles.mobileDataLabel}>Total Inversión:</span>
          <span className={styles.mobilePriceValue}>${Number(group.total).toLocaleString('es-CO')}</span>
        </div>
      </div>

      {isExpanded && (
        <div className={styles.mobileAccordionWrapper}>
          <PurchasesAccordionDetails group={group} isCompleted={isCompleted} />
        </div>
      )}
    </div>
  );
}
