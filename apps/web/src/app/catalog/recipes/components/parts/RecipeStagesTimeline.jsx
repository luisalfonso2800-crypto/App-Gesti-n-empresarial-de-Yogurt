'use client';

/**
 * @file RecipeStagesTimeline.jsx
 * @module catalog/recipes/components/parts
 * @description Panel izquierdo (Pipeline / Hoja de Ruta) con fichas compactas de etapa e indicadores de completitud.
 * @responsibility Renderizar la lista scrolleable fija de etapas, semáforos y plantillas rápidas (< 100 líneas).
 * @usedBy RecipeStagesMasterDetail, RecipeStagesList
 */

import React from 'react';
import { RecipeTimelineCard } from './RecipeTimelineCard';
import styles from './recipe-stages.module.css';

export function RecipeStagesTimeline({
  etapas = [],
  selectedIndex = 0,
  isCommercial = false,
  onSelectStage,
  onAddEtapa,
  onApplyTemplate,
  onMoveEtapa,
  onRemoveEtapa
}) {
  const activeStages = etapas.filter(e => e.activo !== false);

  return (
    <div className={styles.timelineCol}>
      {/* Bloque Superior: Plantillas Rápidas */}
      <div className={styles.sidebarTemplatesCard}>
        <span className={styles.sidebarSectionTitle}>💡 Plantillas Rápidas</span>
        <p className={styles.sidebarSectionSubtitle}>Carga secuencias estándar predefinidas:</p>
        <div className={styles.timelineToolbar}>
          <div className={styles.timelineTemplateGroup}>
            <button
              type="button"
              className={styles.templateBtn}
              onClick={() => onApplyTemplate && onApplyTemplate('BASE_TANQUE')}
              title="Ruta de fermentación y cultivo en tanque refrigerado"
            >
              🥛 Base Láctea (WIP)
            </button>
            <button
              type="button"
              className={styles.templateBtn}
              onClick={() => onApplyTemplate && onApplyTemplate('ENVASADO_COMERCIAL')}
              title="Asistente guiado para dosificación, jalea y sellado en envases"
            >
              📦 Empaque Comercial
            </button>
            <button
              type="button"
              className={styles.templateBtn}
              onClick={() => onApplyTemplate && onApplyTemplate('JALEA_FRUTA')}
              title="Ruta estándar para preparación de fruta y jaleas en marmita"
            >
              🍓 Cocción Fruta
            </button>
          </div>
        </div>
      </div>

      {/* Bloque Inferior: Secuencia de Etapas */}
      <div className={styles.sidebarStagesCard}>
        <span className={styles.sidebarSectionTitle}>📋 Secuencia de Etapas</span>
        <p className={styles.sidebarSectionSubtitle}>Organiza, reordena o añade las fases del proceso:</p>

        {activeStages.length === 0 ? (
          <div className={styles.emptyTimeline}>
            <p className={styles.emptyTimelineTitle}>
              {isCommercial ? 'Base requerida' : 'Sin etapas aún'}
            </p>
            <p className={styles.emptyTimelineText}>
              {isCommercial
                ? 'Inicie con la incorporación de base láctea desde tanque.'
                : 'Usa una plantilla o agrega la primera etapa.'}
            </p>
            {isCommercial && (
              <div className={styles.commercialSuggestionBox}>
                <button
                  type="button"
                  className={styles.commercialSuggestionBtn}
                  onClick={() => onApplyTemplate && onApplyTemplate('INCORPORACION_BASE')}
                  title="Inyectar Recepción y Verificación de Yogurt Base"
                >
                  🥛 + 1° Incorporación Base
                </button>
              </div>
            )}
          </div>
        ) : (
          etapas.map((etapa, idx) => {
            if (etapa.activo === false) return null;
            return (
              <RecipeTimelineCard
                key={idx}
                etapa={etapa}
                idx={idx}
                totalStages={etapas.length}
                isSelected={selectedIndex === idx}
                onSelectStage={onSelectStage}
                onMoveEtapa={onMoveEtapa}
                onDeleteEtapa={onRemoveEtapa}
              />
            );
          })
        )}

        <button
          type="button"
          className={styles.addStageBtn}
          onClick={() => onAddEtapa && onAddEtapa()}
          title="Crear una nueva etapa vacía"
        >
          <span>+</span> Agregar Etapa
        </button>
      </div>
    </div>
  );
}
