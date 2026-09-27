/**
 * @file SupplierPricesMetrics.jsx
 * @module catalog/supplier-prices/components
 * @description Tarjetas métricas e informativas de resumen global de precios proveedores (SRP < 120 líneas).
 * @responsibility Renderizar KPIs clave (Total cotizaciones, Proveedores activos, Insumos cubiertos, Oportunidades comparativas).
 * @usedBy apps/web/src/app/catalog/supplier-prices/page.jsx
 * @dependencies react, lucide-react, ../supplier-prices.module.css
 */
'use client';

import React from 'react';
import { FileSpreadsheet, Truck, Boxes, TrendingDown } from 'lucide-react';
import styles from '../supplier-prices.module.css';

export function SupplierPricesMetrics({ metrics, loading, onCardClick }) {
  if (loading || !metrics) return null;

  const {
    totalTarifas = 0,
    activasCount = 0,
    totalProveedores = 0,
    totalInsumosCotizados = 0,
    multiCotizadosCount = 0
  } = metrics;

  return (
    <div className={styles.metricsGrid} role="region" aria-label="Métricas de Precios y Cotizaciones">
      {/* 1. Total Cotizaciones */}
      <button 
        type="button" 
        className={styles.metricCardInteractive} 
        onClick={() => onCardClick && onCardClick('tarifas')}
        title="Ver desglose de tarifas"
      >
        <div className={styles.metricIconWrapper}>
          <FileSpreadsheet size={20} className={styles.metricIconForest} />
        </div>
        <div className={styles.metricInfo}>
          <span className={styles.metricLabel}>Total Cotizaciones</span>
          <div className={styles.metricValueRow}>
            <span className={styles.metricValue}>{totalTarifas}</span>
            <span className={styles.metricBadge}>{activasCount} activas</span>
          </div>
          <span className={styles.metricHint}>Ver desglose →</span>
        </div>
      </button>

      {/* 2. Proveedores Vinculados */}
      <button 
        type="button" 
        className={styles.metricCardInteractive} 
        onClick={() => onCardClick && onCardClick('proveedores')}
        title="Ver proveedores activos"
      >
        <div className={styles.metricIconWrapper}>
          <Truck size={20} className={styles.metricIconForest} />
        </div>
        <div className={styles.metricInfo}>
          <span className={styles.metricLabel}>Proveedores Activos</span>
          <div className={styles.metricValueRow}>
            <span className={styles.metricValue}>{totalProveedores}</span>
            <span className={styles.metricBadgeSuccess}>Suministro</span>
          </div>
          <span className={styles.metricHint}>Ver lista →</span>
        </div>
      </button>

      {/* 3. Insumos Coberturados */}
      <button 
        type="button" 
        className={styles.metricCardInteractive} 
        onClick={() => onCardClick && onCardClick('insumos')}
        title="Ver insumos cotizados"
      >
        <div className={styles.metricIconWrapper}>
          <Boxes size={20} className={styles.metricIconForest} />
        </div>
        <div className={styles.metricInfo}>
          <span className={styles.metricLabel}>Insumos Cotizados</span>
          <div className={styles.metricValueRow}>
            <span className={styles.metricValue}>{totalInsumosCotizados}</span>
            <span className={styles.metricBadge}>Materias primas</span>
          </div>
          <span className={styles.metricHint}>Ver detalle →</span>
        </div>
      </button>

      {/* 4. Opciones Comparativas */}
      <button 
        type="button" 
        className={styles.metricCardInteractive} 
        onClick={() => onCardClick && onCardClick('ahorro')}
        title="Ver opciones de ahorro comparativo"
      >
        <div className={styles.metricIconWrapper}>
          <TrendingDown size={20} className={styles.metricIconGold} />
        </div>
        <div className={styles.metricInfo}>
          <span className={styles.metricLabel}>Opciones Competitivas</span>
          <div className={styles.metricValueRow}>
            <span className={styles.metricValue}>{multiCotizadosCount}</span>
            <span className={styles.metricBadgeGold}>Multi-proveedor</span>
          </div>
          <span className={styles.metricHint}>Ver ahorros →</span>
        </div>
      </button>
    </div>
  );
}
