/**
 * @file RecipeBalanceFooter.jsx
 * @module catalog/recipes/components/modal-parts
 * @description Barra horizontal de balance de materiales, costeo unitario y semáforo financiero.
 * @responsibility Presentar el balance general y métricas financieras de la receta sin estilos inline.
 * @usedBy apps/web/src/app/catalog/recipes/components/RecipeModal.jsx
 * @dependencies react, @/lib/formatters, ../recipe-modal.module.css
 */

import React, { useState } from 'react';
import { formatCurrency } from '@/lib/formatters';
import styles from '../recipe-modal.module.css';
import { ChevronUp, ChevronDown } from 'lucide-react';

export function RecipeBalanceFooter({
  formData,
  totalMateriasPrimas = 0,
  totalBasesWip = 0,
  activeStagesCount = 0,
  costPerUnit = 0,
  totalCost = 0,
  costRawSupplies = 0,
  costWipBases = 0,
  hasWipFallback = false,
  selectedProduct,
  isInternoOrBulk = false,
  costoTopePermitido = 0,
  onCancel,
  onSummarize,
  isButtonReady = false
}) {
  const [isBalanceCollapsed, setIsBalanceCollapsed] = useState(false);

  return (
    <div className={`${styles.balanceBar} ${isBalanceCollapsed ? styles.balanceBarCollapsed : ''}`}>
      {!isBalanceCollapsed && (
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

          <div className={styles.balanceCostBreakdownRow}>
            <span>
              Materias primas/empaques: <strong className={styles.breakdownBadgeRaw}>{formatCurrency(costRawSupplies)}</strong>
            </span>
            <span>•</span>
            <span>
              Bases intermedias (WIP): <strong className={styles.breakdownBadgeWip}>{formatCurrency(costWipBases)}</strong>
            </span>
            {hasWipFallback && (
              <span className={styles.balanceWarningBadge} title="Una o más bases WIP no cuentan con costo configurado ni receta activa calculada.">
                ⚠️ Base láctea sin costo — Requerida para costeo real
              </span>
            )}
          </div>
        </div>
      )}

      <div className={styles.balanceMetricsRow}>
        <button
          type="button"
          onClick={() => setIsBalanceCollapsed(!isBalanceCollapsed)}
          className={styles.collapseToggleBtn}
          title={isBalanceCollapsed ? 'Desplegar balance' : 'Contraer balance'}
        >
          {isBalanceCollapsed ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {!isBalanceCollapsed && (
          <div className={styles.balanceMetricBlock}>
            <div className={styles.balanceMetricLabel}>
              Costo Unitario Proyectado
            </div>
            <div className={styles.balanceMetricValueUnit}>
              {formatCurrency(costPerUnit)} <span className={styles.balanceMetricUnitSpan}>/ {formData.unidadRendimiento || 'Und'}</span>
            </div>
          </div>
        )}

        <div className={`${styles.balanceMetricBlockWithBorder} ${isBalanceCollapsed ? styles.collapsedNoBorder : ''}`}>
          <div className={styles.balanceMetricLabel}>
            Costo Total Batch
          </div>
          <div className={styles.balanceMetricValueTotal}>
            {formatCurrency(totalCost)}
          </div>
        </div>

        {!isBalanceCollapsed && selectedProduct && (
          <div>
            {isInternoOrBulk ? (
              <span className={styles.profitBadgeInternal}>⚙️ Costo Interno</span>
            ) : costoTopePermitido > 0 && costPerUnit <= costoTopePermitido ? (
              <span className={styles.profitBadgeProfitable}>🟢 Rentable (Tope: {formatCurrency(costoTopePermitido)})</span>
            ) : costoTopePermitido > 0 && costPerUnit > costoTopePermitido ? (
              <span className={styles.profitBadgeOvercost}>🔴 Sobrecosto (+{formatCurrency(costPerUnit - costoTopePermitido)})</span>
            ) : null}
          </div>
        )}

        {(onCancel || onSummarize) && (
          <div className={styles.headerActions}>
            {onCancel && (<button type="button" className={styles.btnCancelHeader} onClick={onCancel}>Cancelar</button>)}
            {onSummarize && (
              <button
                type="button"
                className={`${styles.btnSummarizeHeader} ${isButtonReady ? styles.btnSummarizeHeaderEnabled : styles.btnSummarizeHeaderDisabled}`}
                onClick={onSummarize}
                disabled={!isButtonReady}
              >
                <span>📋</span> Finalizar y Resumir
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

