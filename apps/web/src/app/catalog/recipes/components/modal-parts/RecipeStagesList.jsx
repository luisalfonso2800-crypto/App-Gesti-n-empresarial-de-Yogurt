/**
 * @file RecipeStagesList.jsx
 * @module catalog/recipes/components/modal-parts
 * @description Sección completa de etapas de producción con barra de herramientas, empty state asistido, acordeón y narrativa continua inline.
 * @responsibility Orquestar el listado de etapas de la receta, permitiendo agregar, mover, editar y previsualizar.
 * @usedBy apps/web/src/app/catalog/recipes/components/RecipeModal.jsx
 * @dependencies react, ./StageCardItem, ../recipe-modal.module.css
 */

import React, { useState } from 'react';
import { StageCardItem } from './StageCardItem';
import styles from '../recipe-modal.module.css';

export function RecipeStagesList({
  etapas = [],
  supplies = [],
  products = [],
  currentRecipeProductId,
  generateStageSummaryText,
  formatMinutesToDigitalClock,
  onApplyStageTemplate,
  onAddEtapa,
  onUpdateEtapa,
  onRemoveEtapa,
  onMoveEtapa,
  onAddDetalle,
  onUpdateDetalle,
  onRemoveDetalle
}) {
  const [expandedStageIndex, setExpandedStageIndex] = useState(0);
  const [showSummaryPanel, setShowSummaryPanel] = useState(false);

  const activeStages = etapas.filter(e => e.activo !== false);
  const activeStagesCount = activeStages.length;

  const handleApplyTemplate = (type) => {
    const currentCount = etapas.length;
    if (onApplyStageTemplate) {
      onApplyStageTemplate(type);
    } else if (onAddEtapa) {
      onAddEtapa(type);
    }
    setExpandedStageIndex(currentCount);
    setShowSummaryPanel(false);
  };

  const handleAddNewStage = () => {
    const nextIndex = etapas.length;
    if (onAddEtapa) {
      onAddEtapa();
    }
    setExpandedStageIndex(nextIndex);
    setShowSummaryPanel(false);
  };

  const handleToggleSummarize = () => {
    if (showSummaryPanel) {
      setShowSummaryPanel(false);
      setExpandedStageIndex(0);
    } else {
      setShowSummaryPanel(true);
      setExpandedStageIndex(-1);
    }
  };

  return (
    <div>
      <div className={styles.stagesSectionHeader}>
        <h2 className={styles.stagesTitle}>Etapas de Producción</h2>
        
        {activeStagesCount === 0 ? (
          <button type="button" onClick={handleAddNewStage} className={styles.addStageBtn}>
            + Agregar Etapa Manual
          </button>
        ) : (
          <div className={styles.stageToolbar}>
            <button type="button" onClick={() => handleApplyTemplate('BASE_TANQUE')} className={styles.templateBtn} title="Cargar etapas estándar de preparación de base en tanque">
              🥛 Tanque
            </button>
            <button type="button" onClick={() => handleApplyTemplate('ENVASADO_COMERCIAL')} className={styles.templateBtn} title="Cargar etapas estándar de mezcla, dosificación y sellado">
              🍓 Envasado
            </button>
            <button type="button" onClick={handleAddNewStage} className={styles.addStageBtn} title="Inserta una nueva etapa al final del listado">
              + Agregar Etapa
            </button>
            <button type="button" onClick={handleToggleSummarize} className={styles.summarizeBtn} title="Colapsa todas las etapas y activa la vista de Hoja de Ruta de Planta">
              📋 {showSummaryPanel ? 'Editar Etapas' : 'Hoja de Ruta de Planta'}
            </button>
          </div>
        )}
      </div>
      
      {activeStagesCount === 0 ? (
        <div className={styles.emptyStateCard}>
          <span className={styles.emptyStateIcon}>📋</span>
          <h4 className={styles.emptyStateTitle}>No hay etapas configuradas en esta receta</h4>
          <p className={styles.emptyStateText}>
            Usa una de las plantillas rápidas de un solo clic para cargar los tiempos y temperaturas estándar de planta, o agrega una etapa manualmente.
          </p>
          <div className={styles.emptyStateButtons}>
            <button type="button" onClick={() => handleApplyTemplate('BASE_TANQUE')} className={styles.templateBtn}>
              🥛 Cargar Etapas de Tanque (Pasteurización + Fermentación)
            </button>
            <button type="button" onClick={() => handleApplyTemplate('ENVASADO_COMERCIAL')} className={styles.templateBtn}>
              🍓 Cargar Etapas de Envasado (Mezcla + Dosificación)
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Panel de Narrativa Continua Inline */}
          {showSummaryPanel && (
            <div className={styles.inlineSummaryPanel}>
              <div className={styles.inlineSummaryHeader}>
                <span style={{ fontSize: '1.2rem' }}>📜</span>
                <div>
                  <h3 className={styles.inlineSummaryTitle}>Hoja de Ruta Operativa de Planta</h3>
                  <span className={styles.inlineSummarySubtitle}>
                    Protocolo paso a paso para la elaboración del lote en piso de producción
                  </span>
                </div>
              </div>
              <div className={styles.inlineSummaryList}>
                {etapas.map((etapa, idx) => {
                  if (etapa.activo === false) return null;
                  const summary = generateStageSummaryText(etapa, supplies, products);
                  return (
                    <div key={idx} className={styles.inlineSummaryItem}>
                      <strong>Paso {etapa.orden} ({etapa.nombre || 'Etapa sin nombre'}):</strong> {summary}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Acordeón de Etapas */}
          {etapas.map((etapa, eIdx) => {
            if (etapa.activo === false) return null;
            const isExpanded = expandedStageIndex === eIdx;
            const summaryText = generateStageSummaryText(etapa, supplies, products);

            return (
              <StageCardItem
                key={eIdx}
                etapa={etapa}
                eIdx={eIdx}
                isExpanded={isExpanded}
                summaryText={summaryText}
                totalStagesCount={etapas.length}
                supplies={supplies}
                products={products}
                currentRecipeProductId={currentRecipeProductId}
                formatMinutesToDigitalClock={formatMinutesToDigitalClock}
                onExpand={() => {
                  setExpandedStageIndex(eIdx);
                  setShowSummaryPanel(false);
                }}
                onCollapse={() => setExpandedStageIndex(-1)}
                onRemoveEtapa={onRemoveEtapa}
                onMoveEtapa={onMoveEtapa ? (idx, dir) => {
                  onMoveEtapa(idx, dir);
                  if (dir === 'UP' && expandedStageIndex === idx) setExpandedStageIndex(idx - 1);
                  if (dir === 'DOWN' && expandedStageIndex === idx) setExpandedStageIndex(idx + 1);
                } : null}
                onUpdateEtapa={onUpdateEtapa}
                onAddDetalle={onAddDetalle}
                onUpdateDetalle={onUpdateDetalle}
                onRemoveDetalle={onRemoveDetalle}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
