/**
 * @file PurchasesMetricsDetailModal.jsx
 * @module operations/purchases/components
 * @description Modal interactivo al pulsar tarjetas métricas de compras (SRP < 150 líneas).
 * @responsibility Mostrar desglose y permitir filtrar rápidamente el historial o crear nuevas compras.
 * @usedBy apps/web/src/app/operations/purchases/page.jsx
 * @dependencies SmartModal, lucide-react, ../purchases.module.css
 */
'use client';

import React from 'react';
import SmartModal from '@/components/ui/SmartModal';
import { ShoppingCart, DollarSign, Truck, Users, ArrowRight } from 'lucide-react';
import styles from '../purchases.module.css';

const TITLES = {
  total: { title: 'Historial General de Compras', subtitle: 'Listas procesadas y compras directas a proveedores', icon: ShoppingCart },
  inversion: { title: 'Balance Consolidado de Inversión', subtitle: 'Resumen financiero de compras de materias primas', icon: DollarSign },
  en_ruta: { title: 'Órdenes de Compra en Ruta', subtitle: 'Listas preparadas pendientes por recibir y completar', icon: Truck },
  proveedores: { title: 'Proveedores Abastecedores', subtitle: 'Aliados comerciales con transacciones registradas', icon: Users }
};

export function PurchasesMetricsDetailModal({
  isOpen, onClose, detailType, metrics, suppliersList = [],
  onFilterBySupplier, onFilterByStatus, onNewPurchase, onNewOrder
}) {
  if (!isOpen || !detailType) return null;
  const currentMeta = TITLES[detailType] || TITLES.total;

  return (
    <SmartModal isOpen={isOpen} onClose={onClose} title={currentMeta.title} subtitle={currentMeta.subtitle} icon={currentMeta.icon}>
      <div className={styles.modalDetailContainer}>
        {detailType === 'total' && (
          <div className={styles.detailSection}>
            <div className={styles.detailStatsRow}>
              <div className={styles.detailStatBox}>
                <span className={styles.detailStatNum}>{metrics?.totalPurchases || 0}</span>
                <span className={styles.detailStatLabel}>Compras Totales</span>
              </div>
              <div className={styles.detailStatBox}>
                <span className={styles.detailStatNumSuccess}>{metrics?.completedPurchasesCount || 0}</span>
                <span className={styles.detailStatLabel}>Completadas</span>
              </div>
            </div>
            <div className={styles.detailModalActions}>
              <button type="button" className={styles.detailActionBtnPrimary} onClick={() => { onClose(); onNewPurchase(); }}>
                + Nueva Compra Directa
              </button>
            </div>
          </div>
        )}

        {detailType === 'inversion' && (
          <div className={styles.detailSection}>
            <div className={styles.detailStatsRow}>
              <div className={styles.detailStatBox}>
                <span className={styles.detailStatNumSuccess}>
                  ${Number(metrics?.totalSpent || 0).toLocaleString('es-CO')}
                </span>
                <span className={styles.detailStatLabel}>Inversión Total Acumulada</span>
              </div>
            </div>
            <p className={styles.detailExplanation}>
              Este monto contempla el subtotal de materias primas, insumos de empaque, impuestos IVA facturados y fletes de transporte asociados.
            </p>
          </div>
        )}

        {detailType === 'en_ruta' && (
          <div className={styles.detailSection}>
            <div className={styles.detailStatsRow}>
              <div className={styles.detailStatBox}>
                <span className={metrics?.activeOrdersCount > 0 ? styles.detailStatNumGold : styles.detailStatNumSuccess}>
                  {metrics?.activeOrdersCount || 0}
                </span>
                <span className={styles.detailStatLabel}>Listas en Ruta</span>
              </div>
            </div>
            <p className={styles.detailExplanation}>
              Las listas en ruta representan compras cotizadas o despachadas desde proveedores que están en espera de ingreso formal a bodega.
            </p>
            <div className={styles.detailModalActions}>
              <button type="button" className={styles.detailActionBtnPrimary} onClick={() => { onClose(); onNewOrder(); }}>
                + Crear Lista desde Precios
              </button>
            </div>
          </div>
        )}

        {detailType === 'proveedores' && (
          <div className={styles.detailList}>
            <div className={styles.detailListHeader}>Filtrar compras por proveedor abastecedor:</div>
            {suppliersList.map((sup, idx) => (
              <button
                key={`${sup.id || sup.nombre}-${idx}`}
                type="button"
                className={styles.detailListItemBtn}
                onClick={() => { onFilterBySupplier(sup.nombre); onClose(); }}
              >
                <div className={styles.detailItemText}>
                  <span className={styles.detailItemTitle}>{sup.nombre}</span>
                  <span className={styles.detailItemSub}>{sup.nit ? `NIT: ${sup.nit}` : 'Proveedor registrado'}</span>
                </div>
                <ArrowRight size={16} className={styles.detailArrow} />
              </button>
            ))}
            <button
              type="button"
              className={styles.detailListItemBtn}
              onClick={() => { onFilterBySupplier(''); onClose(); }}
            >
              <div className={styles.detailItemText}>
                <span className={styles.detailItemTitle}>Ver Todos los Proveedores</span>
                <span className={styles.detailItemSub}>Quitar filtro de proveedor</span>
              </div>
              <ArrowRight size={16} className={styles.detailArrow} />
            </button>
          </div>
        )}
      </div>
    </SmartModal>
  );
}
