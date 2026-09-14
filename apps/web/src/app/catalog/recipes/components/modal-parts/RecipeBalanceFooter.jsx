/**
 * @file RecipeBalanceFooter.jsx
 * @module catalog/recipes/components/modal-parts
 * @description Barra horizontal de balance de materiales, costeo unitario y semáforo financiero.
 * @responsibility Presentar el balance general y métricas financieras de la receta sin estilos inline.
 * @usedBy apps/web/src/app/catalog/recipes/components/RecipeModal.jsx
 * @dependencies react, @/lib/formatters, ../recipe-modal.module.css
 */

import React from 'react';
import { formatCurrency } from '@/lib/formatters';
import styles from '../recipe-modal.module.css';

export function RecipeBalanceFooter({
  formData,
  totalMateriasPrimas = 0,
  totalBasesWip = 0,
  activeStagesCount = 0,
  costPerUnit = 0,
  totalCost = 0,
  selectedProduct,
  isInternoOrBulk = false,
  costoTopePermitido = 0
}) {
  return (
    <div className={styles.balanceBar}>
      {/* Lado Izquierdo: Resumen de insumos y rendimiento */}
      <div className={styles.balanceInfoCol}>
        <strong className={styles.balanceTitle}>
          Balance General de Materiales y Costos
        </strong>
        <div className={styles.balanceSubtextRow}>
          <span>
            <strong>Rendimiento:</strong> {formData.rendimientoBase || 0} {formData.unidadRendimiento || 'Litros'}
          </span>
          <span>•</span>
          <span>
            <strong>Composición:</strong> {totalMateriasPrimas} materias primas/empaques
            {totalBasesWip > 0 ? ` + ${totalBasesWip} bases WIP` : ''}
          </span>
          <span>•</span>
          <span>
            <strong>Etapas activas:</strong> {activeStagesCount}
          </span>
        </div>
      </div>

      {/* Lado Derecho: Valores destacados y Semáforo Financiero */}
      <div className={styles.balanceMetricsRow}>
        <div className={styles.balanceMetricBlock}>
          <div className={styles.balanceMetricLabel}>
            Costo Unitario Proyectado
          </div>
          <div className={styles.balanceMetricValueUnit}>
            {formatCurrency(costPerUnit)} <span className={styles.balanceMetricUnitSpan}>/ {formData.unidadRendimiento || 'Und'}</span>
          </div>
        </div>

        <div className={styles.balanceMetricBlockWithBorder}>
          <div className={styles.balanceMetricLabel}>
            Costo Total Batch
          </div>
          <div className={styles.balanceMetricValueTotal}>
            {formatCurrency(totalCost)}
          </div>
        </div>

        {/* Semáforo Financiero Compacto */}
        {selectedProduct && (
          <div>
            {isInternoOrBulk ? (
              <span className={styles.profitBadgeInternal}>
                ⚙️ Costo Interno
              </span>
            ) : costoTopePermitido > 0 && costPerUnit <= costoTopePermitido ? (
              <span className={styles.profitBadgeProfitable}>
                🟢 Rentable (Tope: {formatCurrency(costoTopePermitido)})
              </span>
            ) : costoTopePermitido > 0 && costPerUnit > costoTopePermitido ? (
              <span className={styles.profitBadgeOvercost}>
                🔴 Sobrecosto (+{formatCurrency(costPerUnit - costoTopePermitido)})
              </span>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
