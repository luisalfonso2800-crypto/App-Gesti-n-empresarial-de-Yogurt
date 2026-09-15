/**
 * @file SummaryTechHeader.jsx
 * @module catalog/recipes/components/modal-parts
 * @description Ficha técnica superior de producto, rendimiento esperado y tiempo acumulado para la Hoja de Ruta.
 * @responsibility Presentar la cabecera técnica del modal de resumen.
 * @usedBy apps/web/src/app/catalog/recipes/components/modal-parts/RecipeOperationalSummaryModal.jsx
 * @dependencies react, ../recipe-modal.module.css
 */

import React from 'react';
import styles from '../recipe-modal.module.css';

export function SummaryTechHeader({
  selectedProduct,
  formData,
  totalProductionTimeMins = 0,
  activeStagesCount = 0,
  formatMinutesToDigitalClock
}) {
  return (
    <div className={styles.summaryTechHeaderCard}>
      <div>
        <div className={styles.summaryTechFieldLabel}>Producto a Elaborar</div>
        <div className={styles.summaryTechFieldValue}>
          {selectedProduct?.nombre || 'No seleccionado'}
        </div>
        <span className={styles.inputHelperText}>
          {selectedProduct?.presentacion?.nombre || 'A GRANEL'}
        </span>
      </div>

      <div>
        <div className={styles.summaryTechFieldLabel}>Rendimiento Esperado</div>
        <div className={styles.summaryTechYieldValue}>
          {formData.rendimientoBase || '0'} {formData.unidadRendimiento || 'Und'}
        </div>
        <span className={styles.inputHelperText}>
          Por lote de producción
        </span>
      </div>

      <div>
        <div className={styles.summaryTechFieldLabel}>Tiempo Acumulado Estimado</div>
        <div className={styles.summaryTechFieldValue}>
          ⏱️ {formatMinutesToDigitalClock(totalProductionTimeMins)}
        </div>
        <span className={styles.inputHelperText}>
          {activeStagesCount} {activeStagesCount === 1 ? 'etapa activa' : 'etapas activas'}
        </span>
      </div>
    </div>
  );
}
