/**
 * @file SummaryStagesNarrativeList.jsx
 * @module catalog/recipes/components/modal-parts
 * @description Lista de tarjetas narrativas cronológicas para el modal Hoja de Ruta Operativa de Planta.
 * @responsibility Renderizar las etapas paso a paso en lenguaje de planta con sus badges.
 * @usedBy apps/web/src/app/catalog/recipes/components/modal-parts/RecipeOperationalSummaryModal.jsx
 * @dependencies react, ../recipe-modal.module.css
 */

import React from 'react';
import styles from '../recipe-modal.module.css';

export function SummaryStagesNarrativeList({
  activeStages = [],
  supplies = [],
  products = [],
  generateStageSummaryText
}) {
  return (
    <div className={styles.summaryStagesContainer}>
      <div className={styles.balanceMetricLabel}>
        Secuencia Cronológica de Proceso (Paso a Paso)
      </div>

      {activeStages.length === 0 ? (
        <div className={styles.emptyStateCard}>
          ⚠️ No hay etapas registradas en esta receta. Regrese al editor para añadir etapas.
        </div>
      ) : (
        activeStages.map((etapa, idx) => {
          const narrative = generateStageSummaryText(etapa, supplies, products);
          const tEst = Number(etapa.tiempoEstandarMin) || 0;
          const tempMin = etapa.tempMinimaGrados !== '' && etapa.tempMinimaGrados !== null && etapa.tempMinimaGrados !== undefined ? Number(etapa.tempMinimaGrados) : null;
          const tempMax = etapa.tempMaximaGrados !== '' && etapa.tempMaximaGrados !== null && etapa.tempMaximaGrados !== undefined ? Number(etapa.tempMaximaGrados) : null;

          return (
            <div key={idx} className={styles.summaryStageCard}>
              <div className={styles.summaryStageHead}>
                <div className={styles.summaryStageTitleRow}>
                  <span className={styles.summaryStageStepBadge}>
                    Paso {etapa.orden || idx + 1}
                  </span>
                  <span className={styles.summaryStageTitle}>
                    {etapa.nombre || 'Etapa sin denominación'}
                  </span>
                </div>

                <div className={styles.collapsedBadgesRow}>
                  {tEst > 0 && (
                    <span className={`${styles.collapsedBadge} ${styles.collapsedBadgeLight}`}>
                      ⏱️ {tEst}m
                    </span>
                  )}
                  {(tempMin !== null || tempMax !== null) && (
                    <span className={`${styles.collapsedBadge} ${styles.collapsedBadgeLight}`}>
                      🌡️ {tempMin ?? 0}°C - {tempMax ?? 0}°C
                    </span>
                  )}
                </div>
              </div>

              <p className={styles.summaryStageText}>
                {narrative}
              </p>
            </div>
          );
        })
      )}
    </div>
  );
}
