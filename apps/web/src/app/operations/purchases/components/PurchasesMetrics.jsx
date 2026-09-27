/**
 * @file PurchasesMetrics.jsx
 * @module operations/purchases/components
 * @description Tarjetas métricas interactivas superiores del módulo de compras (SRP < 120 líneas).
 * @responsibility Renderizar KPIs clave (Total Compras, Inversión Total, Listas en Ruta, Proveedores Activos).
 * @usedBy apps/web/src/app/operations/purchases/page.jsx
 * @dependencies react, lucide-react, ../purchases.module.css
 */
'use client';

import React from 'react';
import { ShoppingCart, DollarSign, Truck, Users } from 'lucide-react';
import styles from '../purchases.module.css';

export function PurchasesMetrics({ metrics, loading, onCardClick }) {
  if (loading || !metrics) return null;

  const {
    totalPurchases = 0,
    totalSpent = 0,
    activeOrdersCount = 0,
    uniqueSuppliersCount = 0
  } = metrics;

  return (
    <div className={styles.metricsGrid} role="region" aria-label="Métricas de Compras e Insumos">
      {/* 1. Total Compras Realizadas */}
      <button
        type="button"
        className={styles.metricCardInteractive}
        onClick={() => onCardClick && onCardClick('total')}
        title="Ver desglose general de compras"
      >
        <div className={styles.metricIconWrapper}>
          <ShoppingCart size={20} className={styles.metricIconForest} />
        </div>
        <div className={styles.metricInfo}>
          <span className={styles.metricLabel}>Total Compras</span>
          <div className={styles.metricValueRow}>
            <span className={styles.metricValue}>{totalPurchases}</span>
            <span className={styles.metricBadge}>Registradas</span>
          </div>
          <span className={styles.metricHint}>Ver historial →</span>
        </div>
      </button>

      {/* 2. Inversión Total Consolidada */}
      <button
        type="button"
        className={styles.metricCardInteractive}
        onClick={() => onCardClick && onCardClick('inversion')}
        title="Ver balance de inversión y gasto contable"
      >
        <div className={styles.metricIconWrapper}>
          <DollarSign size={20} className={styles.metricIconForest} />
        </div>
        <div className={styles.metricInfo}>
          <span className={styles.metricLabel}>Inversión Total</span>
          <div className={styles.metricValueRow}>
            <span className={styles.metricValue}>${(totalSpent / 1000000).toFixed(1)}M</span>
            <span className={styles.metricBadgeSuccess}>COP</span>
          </div>
          <span className={styles.metricHint}>Ver balance →</span>
        </div>
      </button>

      {/* 3. Listas en Ruta / Pendientes */}
      <button
        type="button"
        className={styles.metricCardInteractive}
        onClick={() => onCardClick && onCardClick('en_ruta')}
        title="Ver órdenes de compra activas o en ruta"
      >
        <div className={styles.metricIconWrapper}>
          <Truck size={20} className={activeOrdersCount > 0 ? styles.metricIconGold : styles.metricIconForest} />
        </div>
        <div className={styles.metricInfo}>
          <span className={styles.metricLabel}>Listas en Ruta</span>
          <div className={styles.metricValueRow}>
            <span className={styles.metricValue}>{activeOrdersCount}</span>
            {activeOrdersCount > 0 ? (
              <span className={styles.metricBadgeGold}>En proceso</span>
            ) : (
              <span className={styles.metricBadgeSuccess}>Al día</span>
            )}
          </div>
          <span className={styles.metricHint}>
            {activeOrdersCount > 0 ? 'Revisar listas →' : 'Sin órdenes →'}
          </span>
        </div>
      </button>

      {/* 4. Proveedores Abastecedores */}
      <button
        type="button"
        className={styles.metricCardInteractive}
        onClick={() => onCardClick && onCardClick('proveedores')}
        title="Ver proveedores comerciales con compras históricas"
      >
        <div className={styles.metricIconWrapper}>
          <Users size={20} className={styles.metricIconForest} />
        </div>
        <div className={styles.metricInfo}>
          <span className={styles.metricLabel}>Proveedores</span>
          <div className={styles.metricValueRow}>
            <span className={styles.metricValue}>{uniqueSuppliersCount}</span>
            <span className={styles.metricBadge}>Vinculados</span>
          </div>
          <span className={styles.metricHint}>Filtrar proveedores →</span>
        </div>
      </button>
    </div>
  );
}
