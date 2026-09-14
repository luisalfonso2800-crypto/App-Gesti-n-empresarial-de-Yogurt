/**
 * @file RecipeOperationalSummaryModal.jsx
 * @module catalog/recipes/components/modal-parts
 * @description Modal de auditoría técnica y confirmación de 2 pasos "Hoja de Ruta Operativa de Planta" (SRP < 150 líneas).
 * @responsibility Presentar ficha técnica de producto, narrativa cronológica paso a paso de planta, balance financiero y botones de decisión.
 * @usedBy apps/web/src/app/catalog/recipes/components/RecipeModal.jsx
 * @dependencies react, @/lib/formatters, ./SummaryTechHeader, ./SummaryStagesNarrativeList, ../recipe-modal.module.css
 */

import React from 'react';
import { formatCurrency } from '@/lib/formatters';
import { SummaryTechHeader } from './SummaryTechHeader';
import { SummaryStagesNarrativeList } from './SummaryStagesNarrativeList';
import styles from '../recipe-modal.module.css';

export function RecipeOperationalSummaryModal({
  isOpen,
  isSubmitting,
  formData,
  selectedProduct,
  activeStages = [],
  totalProductionTimeMins = 0,
  costPerUnit = 0,
  totalCost = 0,
  isInternoOrBulk = false,
  costoTopePermitido = 0,
  canSubmit = false,
  supplies = [],
  products = [],
  generateStageSummaryText,
  formatMinutesToDigitalClock,
  onClose,
  onDiscard,
  onPublish
}) {
  if (!isOpen) return null;

  return (
    <div 
      className={styles.modalBackdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="summary-modal-title"
    >
      <div className={styles.summaryModalCard}>
        {/* Header del Modal */}
        <div className={styles.summaryModalHeader}>
          <div>
            <h2 id="summary-modal-title" className={styles.summaryModalTitle}>
              <span>📜</span> Hoja de Ruta Operativa de Planta
            </h2>
            <p className={styles.summaryModalSubtitle}>
              Protocolo paso a paso para la elaboración del lote en piso de producción
              {selectedProduct ? ` — ${selectedProduct.nombre} (${formData.rendimientoBase} ${formData.unidadRendimiento || 'Und'})` : ''}
            </p>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            disabled={isSubmitting}
            className={styles.summaryModalCloseBtn}
            title="Cerrar y volver a edición"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        {/* Cuerpo del Modal con Scroll Suave */}
        <div className={styles.summaryModalBody}>
          <SummaryTechHeader
            selectedProduct={selectedProduct}
            formData={formData}
            totalProductionTimeMins={totalProductionTimeMins}
            activeStagesCount={activeStages.length}
            formatMinutesToDigitalClock={formatMinutesToDigitalClock}
          />

          <SummaryStagesNarrativeList
            activeStages={activeStages}
            supplies={supplies}
            products={products}
            generateStageSummaryText={generateStageSummaryText}
          />

          {/* Balance Resumido de Costos y Rentabilidad */}
          <div className={styles.balanceBar} style={{ margin: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ fontSize: '1.25rem' }}>💰</div>
              <div>
                <div className={styles.balanceTitle}>Balance Económico Proyectado</div>
                <div style={{ fontSize: '0.8rem', color: '#57534E' }}>Costeo dinámico basado en materias primas y bases WIP</div>
              </div>
            </div>

            <div className={styles.balanceMetricsRow}>
              <div className={styles.balanceMetricBlock}>
                <div className={styles.balanceMetricLabel}>Costo Unitario</div>
                <div className={styles.balanceMetricValueUnit}>
                  {formatCurrency(costPerUnit)} <span className={styles.balanceMetricUnitSpan}>/ {formData.unidadRendimiento || 'Und'}</span>
                </div>
              </div>

              <div className={styles.balanceMetricBlockWithBorder}>
                <div className={styles.balanceMetricLabel}>Costo Total Lote</div>
                <div className={styles.balanceMetricValueTotal}>{formatCurrency(totalCost)}</div>
              </div>

              {selectedProduct && (
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
            </div>
          </div>
        </div>

        {/* Pie de Acciones (Footer) */}
        <div className={styles.summaryModalFooter}>
          <button type="button" onClick={onDiscard} disabled={isSubmitting} className={styles.btnDiscardRecipe} title="Descarta la receta completa y sale del editor sin guardar">
            <span>✕</span> Descartar Receta Completa
          </button>

          <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
            <button type="button" onClick={onClose} disabled={isSubmitting} className={styles.btnContinueEditing} title="Cerrar resumen y volver al formulario para realizar ajustes">
              <span>✏️</span> Corregir / Seguir Editando
            </button>

            <button type="button" onClick={onPublish} disabled={isSubmitting || !canSubmit} className={styles.btnPublishRecipe} title="Confirma y publica la receta en la base de datos">
              {isSubmitting ? <>Guardando...</> : <><span>✓</span> Guardar y Publicar Receta</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
