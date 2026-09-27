/**
 * @file RecipesMetrics.jsx
 * @module catalog/recipes/components
 * @description Tarjetas métricas interactivas superiores del catálogo de recetas (SRP < 120 líneas).
 * @responsibility Renderizar KPIs clave (Total recetas, Activas vs Inactivas, Cobertura de productos huérfanos, Etapas promedio).
 * @usedBy apps/web/src/app/catalog/recipes/page.jsx
 * @dependencies react, lucide-react, ../recipes.module.css
 */
'use client';

import React from 'react';
import { ChefHat, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import styles from '../recipes.module.css';

export function RecipesMetrics({ metrics, loading, onCardClick }) {
  if (loading || !metrics) return null;

  const {
    totalRecipes = 0,
    activeCount = 0,
    inactiveCount = 0,
    orphanProductsCount = 0,
    averageStages = 0
  } = metrics;

  return (
    <div className={styles.metricsGrid} role="region" aria-label="Métricas de Recetas Técnicas">
      {/* 1. Total Recetas */}
      <button
        type="button"
        className={styles.metricCardInteractive}
        onClick={() => onCardClick && onCardClick('total')}
        title="Ver desglose general de recetas"
      >
        <div className={styles.metricIconWrapper}>
          <ChefHat size={20} className={styles.metricIconForest} />
        </div>
        <div className={styles.metricInfo}>
          <span className={styles.metricLabel}>Total Recetas</span>
          <div className={styles.metricValueRow}>
            <span className={styles.metricValue}>{totalRecipes}</span>
            <span className={styles.metricBadge}>{activeCount} activas</span>
          </div>
          <span className={styles.metricHint}>Ver catálogo →</span>
        </div>
      </button>

      {/* 2. Activas vs Inactivas */}
      <button
        type="button"
        className={styles.metricCardInteractive}
        onClick={() => onCardClick && onCardClick('estados')}
        title="Ver recetas por estado"
      >
        <div className={styles.metricIconWrapper}>
          <CheckCircle2 size={20} className={styles.metricIconForest} />
        </div>
        <div className={styles.metricInfo}>
          <span className={styles.metricLabel}>Disponibilidad</span>
          <div className={styles.metricValueRow}>
            <span className={styles.metricValue}>{activeCount}</span>
            {inactiveCount > 0 ? (
              <span className={styles.metricBadgeGold}>{inactiveCount} inactivas</span>
            ) : (
              <span className={styles.metricBadgeSuccess}>100% activas</span>
            )}
          </div>
          <span className={styles.metricHint}>Filtrar estado →</span>
        </div>
      </button>

      {/* 3. Cobertura de Productos (Huérfanos) */}
      <button
        type="button"
        className={styles.metricCardInteractive}
        onClick={() => onCardClick && onCardClick('cobertura')}
        title="Ver cobertura de recetas sobre catálogo de productos"
      >
        <div className={styles.metricIconWrapper}>
          {orphanProductsCount > 0 ? (
            <AlertTriangle size={20} className={styles.metricIconGold} />
          ) : (
            <CheckCircle2 size={20} className={styles.metricIconForest} />
          )}
        </div>
        <div className={styles.metricInfo}>
          <span className={styles.metricLabel}>Cobertura Catálogo</span>
          <div className={styles.metricValueRow}>
            {orphanProductsCount > 0 ? (
              <>
                <span className={styles.metricValue}>{orphanProductsCount}</span>
                <span className={styles.metricBadgeGold}>Sin receta</span>
              </>
            ) : (
              <>
                <span className={styles.metricValue}>100%</span>
                <span className={styles.metricBadgeSuccess}>Completo</span>
              </>
            )}
          </div>
          <span className={styles.metricHint}>
            {orphanProductsCount > 0 ? 'Ver huérfanos →' : 'Todo cubierto →'}
          </span>
        </div>
      </button>

      {/* 4. Complejidad / Etapas Promedio */}
      <button
        type="button"
        className={styles.metricCardInteractive}
        onClick={() => onCardClick && onCardClick('etapas')}
        title="Ver complejidad de procesos operativos"
      >
        <div className={styles.metricIconWrapper}>
          <Layers size={20} className={styles.metricIconForest} />
        </div>
        <div className={styles.metricInfo}>
          <span className={styles.metricLabel}>Etapas / Proceso</span>
          <div className={styles.metricValueRow}>
            <span className={styles.metricValue}>{averageStages}</span>
            <span className={styles.metricBadge}>por receta</span>
          </div>
          <span className={styles.metricHint}>Ver detalle →</span>
        </div>
      </button>
    </div>
  );
}
