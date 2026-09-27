/**
 * @file ProductsMetrics.jsx
 * @module catalog/products/components
 * @description Tarjetas métricas interactivas superiores del catálogo de productos (SRP < 120 líneas).
 * @responsibility Renderizar KPIs clave (Total catálogo, Comerciales vs WIP, Listos para venta, Cobertura de receta).
 * @usedBy apps/web/src/app/catalog/products/page.jsx
 * @dependencies react, lucide-react, ../products.module.css
 */
'use client';

import React from 'react';
import { Package, ShoppingBag, Factory, AlertCircle, CheckCircle2, ChefHat } from 'lucide-react';
import styles from '../products.module.css';

export function ProductsMetrics({ metrics, loading, onCardClick }) {
  if (loading || !metrics) return null;

  const {
    totalProducts = 0,
    activeCount = 0,
    commercialCount = 0,
    wipCount = 0,
    readyCount = 0,
    incompleteCount = 0,
    withRecipeCount = 0
  } = metrics;

  return (
    <div className={styles.metricsGrid} role="region" aria-label="Métricas de Productos Terminados">
      {/* 1. Total Productos */}
      <button
        type="button"
        className={styles.metricCardInteractive}
        onClick={() => onCardClick && onCardClick('total')}
        title="Ver desglose general de catálogo"
      >
        <div className={styles.metricIconWrapper}>
          <Package size={20} className={styles.metricIconForest} />
        </div>
        <div className={styles.metricInfo}>
          <span className={styles.metricLabel}>Total Productos</span>
          <div className={styles.metricValueRow}>
            <span className={styles.metricValue}>{totalProducts}</span>
            <span className={styles.metricBadge}>{activeCount} activos</span>
          </div>
          <span className={styles.metricHint}>Ver catálogo →</span>
        </div>
      </button>

      {/* 2. Comerciales vs WIP */}
      <button
        type="button"
        className={styles.metricCardInteractive}
        onClick={() => onCardClick && onCardClick('canales')}
        title="Ver comerciales y bases de planta"
      >
        <div className={styles.metricIconWrapper}>
          <ShoppingBag size={20} className={styles.metricIconForest} />
        </div>
        <div className={styles.metricInfo}>
          <span className={styles.metricLabel}>Canal de Venta</span>
          <div className={styles.metricValueRow}>
            <span className={styles.metricValue}>{commercialCount}</span>
            <span className={styles.metricBadgeSuccess}>{wipCount} WIP Planta</span>
          </div>
          <span className={styles.metricHint}>Ver por canal →</span>
        </div>
      </button>

      {/* 3. Completos vs Incompletos */}
      <button
        type="button"
        className={styles.metricCardInteractive}
        onClick={() => onCardClick && onCardClick('estados')}
        title="Ver productos listos e incompletos"
      >
        <div className={styles.metricIconWrapper}>
          {incompleteCount > 0 ? (
            <AlertCircle size={20} className={styles.metricIconGold} />
          ) : (
            <CheckCircle2 size={20} className={styles.metricIconForest} />
          )}
        </div>
        <div className={styles.metricInfo}>
          <span className={styles.metricLabel}>Estado de Ficha</span>
          <div className={styles.metricValueRow}>
            <span className={styles.metricValue}>{readyCount}</span>
            {incompleteCount > 0 ? (
              <span className={styles.metricBadgeGold}>{incompleteCount} pendientes</span>
            ) : (
              <span className={styles.metricBadgeSuccess}>100% listos</span>
            )}
          </div>
          <span className={styles.metricHint}>Revisar pendientes →</span>
        </div>
      </button>

      {/* 4. Con Receta Vinculada */}
      <button
        type="button"
        className={styles.metricCardInteractive}
        onClick={() => onCardClick && onCardClick('recetas')}
        title="Ver cobertura de formulaciones y recetas"
      >
        <div className={styles.metricIconWrapper}>
          <ChefHat size={20} className={styles.metricIconForest} />
        </div>
        <div className={styles.metricInfo}>
          <span className={styles.metricLabel}>Con Receta</span>
          <div className={styles.metricValueRow}>
            <span className={styles.metricValue}>{withRecipeCount}</span>
            <span className={styles.metricBadge}>Formulaciones</span>
          </div>
          <span className={styles.metricHint}>Ver cobertura →</span>
        </div>
      </button>
    </div>
  );
}
