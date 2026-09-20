/**
 * @file ShoppingChecklistHeader.jsx
 * @module operations/purchases/new/components
 * @description Cabecera y barra de acciones institucional del Checklist de Compras MANNÁ (<125 líneas, SRP).
 * @usedBy apps/web/src/app/operations/purchases/new/components/ChecklistPhase.jsx
 */
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Tag, Calendar, Printer, PlusCircle, Receipt } from 'lucide-react';
import styles from '../new-purchase.module.css';

export default function ShoppingChecklistHeader({
  activeOrder,
  onPrint,
  onAddPending,
  onProceedToForm
}) {
  const orderCode = activeOrder?.codigo || 'ORD-PENDIENTE';
  const orderDate = activeOrder?.fechaCreacion
    ? new Date(activeOrder.fechaCreacion).toLocaleDateString('es-CO')
    : new Date().toLocaleDateString('es-CO');
  const orderStatus = activeOrder?.estado || 'PENDIENTE';

  return (
    <div className={styles.headerContainer}>
      <div>
        <Link href="/operations/purchases" className={styles.backLinkBtn}>
          <ArrowLeft size={16} />
          <span>Volver a Compras</span>
        </Link>
      </div>

      <div className={styles.titleSection}>
        <h1 className={styles.phaseTitle}>Checklist de Adquisición y Abastecimiento</h1>
        <p className={styles.phaseSubtitle}>
          Gestión física de compras en planta, verificación de unidades por empaque y control de recepción en bodega.
        </p>
      </div>

      <div className={styles.orderMetaBar}>
        <span className={styles.codeBadge}>
          <Tag size={13} /> {orderCode}
        </span>
        <span className={styles.metaDivider}>•</span>
        <span className={styles.metaOrigin}>
          Abastecimiento por Faltante de Producción
        </span>
        <span className={styles.metaDivider}>•</span>
        <span className={styles.metaDate}>
          <Calendar size={13} /> {orderDate}
        </span>
        <span className={styles.metaDivider}>•</span>
        <span className={`${styles.orderStatusBadge} ${
          orderStatus === 'COMPLETADA' ? styles.statusCompleted :
          orderStatus === 'EN_PROCESO' ? styles.statusInProgress : styles.statusPending
        }`}>
          {orderStatus}
        </span>
      </div>

      <div className={styles.actionsRow}>
        <button
          type="button"
          onClick={onPrint}
          className={`${styles.btnAction} ${styles.btnActionPrint}`}
        >
          <Printer size={15} />
          <span>Imprimir Checklist</span>
        </button>

        <button
          type="button"
          onClick={onAddPending}
          className={`${styles.btnAction} ${styles.btnActionPending}`}
        >
          <PlusCircle size={15} />
          <span>Añadir Pendiente</span>
        </button>

        <button
          type="button"
          onClick={onProceedToForm}
          className={`${styles.btnAction} ${styles.btnActionRegister}`}
        >
          <Receipt size={15} />
          <span>Registrar Compras / Imprevistos</span>
        </button>
      </div>
    </div>
  );
}
