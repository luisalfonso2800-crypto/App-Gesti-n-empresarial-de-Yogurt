'use client';

import React from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { RecipeTimelineCard } from './RecipeTimelineCard';
import styles from './recipe-stages.module.css';

export function RecipeStagesTimeline({
  etapas = [], selectedIndex = 0, isCommercial = false, isSidebarOpen = true,
  onToggleSidebar, onSelectStage, onAddEtapa, onApplyTemplate, onMoveEtapa, onRemoveEtapa
}) {
  const activeStages = etapas.filter(e => e.activo !== false);

  if (!isSidebarOpen) {
    return (
      <div className={`${styles.timelineCol} ${styles.timelineColCollapsed}`}>
        <button type="button" className={styles.sidebarToggleBtnCollapsed} onClick={onToggleSidebar} title="Desplegar panel de etapas">
          <PanelLeftOpen size={20} />
        </button>
        <div className={styles.collapsedVerticalIndicator} onClick={onToggleSidebar}>
          <span className={styles.collapsedBadge}>{activeStages.length}</span>
          <span className={styles.collapsedText}>Etapas</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.timelineCol}>
      <div className={styles.timelineHeaderBar}>
        <button type="button" className={styles.sidebarToggleBtn} onClick={onToggleSidebar} title="Plegar panel de etapas">
          <PanelLeftClose size={18} /><span>Ocultar Panel</span>
        </button>
      </div>

      <div className={styles.sidebarTemplatesCard}>
        <span className={styles.sidebarSectionTitle}>💡 Plantillas Rápidas</span>
        <p className={styles.sidebarSectionSubtitle}>Carga secuencias estándar predefinidas:</p>
        <div className={styles.timelineToolbar}>
          <div className={styles.timelineTemplateGroup}>
            <button type="button" className={styles.templateBtn} onClick={() => onApplyTemplate?.('BASE_TANQUE')}>🥛 Base Láctea (WIP)</button>
            <button type="button" className={styles.templateBtn} onClick={() => onApplyTemplate?.('ENVASADO_COMERCIAL')}>📦 Empaque Comercial</button>
            <button type="button" className={styles.templateBtn} onClick={() => onApplyTemplate?.('JALEA_FRUTA')}>🍓 Cocción Fruta</button>
          </div>
        </div>
      </div>

      <div className={styles.sidebarStagesCard}>
        <span className={styles.sidebarSectionTitle}>📋 Secuencia de Etapas</span>
        <p className={styles.sidebarSectionSubtitle}>Organiza, reordena o añade las fases del proceso:</p>

        {activeStages.length === 0 ? (
          <div className={styles.emptyTimeline}>
            <p className={styles.emptyTimelineTitle}>{isCommercial ? 'Base requerida' : 'Sin etapas aún'}</p>
            <p className={styles.emptyTimelineText}>{isCommercial ? 'Inicie con la incorporación de base láctea desde tanque.' : 'Usa una plantilla o agrega la primera etapa.'}</p>
            {isCommercial && (
              <div className={styles.commercialSuggestionBox}>
                <button type="button" className={styles.commercialSuggestionBtn} onClick={() => onApplyTemplate?.('INCORPORACION_BASE')}>🥛 + 1° Incorporación Base</button>
              </div>
            )}
          </div>
        ) : (
          etapas.map((etapa, idx) => {
            if (etapa.activo === false) return null;
            return (
              <RecipeTimelineCard
                key={idx} etapa={etapa} idx={idx} totalStages={etapas.length}
                isSelected={selectedIndex === idx} onSelectStage={onSelectStage}
                onMoveEtapa={onMoveEtapa} onDeleteEtapa={onRemoveEtapa}
              />
            );
          })
        )}

        <button type="button" className={styles.addStageBtn} onClick={() => onAddEtapa?.()} title="Crear una nueva etapa vacía">
          <span>+</span> Agregar Etapa
        </button>
      </div>
    </div>
  );
}
