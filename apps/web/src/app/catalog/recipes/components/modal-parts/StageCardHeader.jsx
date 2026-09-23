/**
 * @file StageCardHeader.jsx
 * @module catalog/recipes/components/modal-parts
 * @description Encabezado de la tarjeta de etapa expandida con título, badge de edición y acciones de reordenamiento.
 * @responsibility Renderizar el bloque de control superior (mover, plegar, eliminar) de una etapa en edición.
 */

import React from 'react';
import styles from '../recipe-modal.module.css';

/**
 * @param {object} props
 * @param {object} props.etapa - Datos de la etapa
 * @param {number} props.eIdx - Índice de la etapa en el array
 * @param {number} props.totalStagesCount - Total de etapas (para deshabilitar botones límite)
 * @param {Function} props.onCollapse - Callback para plegar la etapa
 * @param {Function} props.onRemoveEtapa - Callback para eliminar la etapa
 * @param {Function|null} props.onMoveEtapa - Callback para mover la etapa (UP/DOWN)
 */
export function StageCardHeader({ etapa, eIdx, totalStagesCount, onCollapse, onRemoveEtapa, onMoveEtapa }) {
  return (
    <div className={styles.stageHeader}>
      <div className={styles.stageHeaderTitleGroup}>
        <h3>Etapa {etapa.orden}: {etapa.nombre || 'Nueva Etapa'}</h3>
        <span className={styles.stageEditingBadge}>En Edición</span>
      </div>
      <div className={styles.stageHeaderActions}>
        {onMoveEtapa && (
          <div className={styles.stageMoveGroup}>
            <button
              type="button"
              disabled={eIdx === 0}
              onClick={() => onMoveEtapa(eIdx, 'UP')}
              className={styles.btnMoveStageExpanded}
              title="Subir etapa (ejecutar antes)"
            >
              ▲ Subir
            </button>
            <button
              type="button"
              disabled={eIdx === totalStagesCount - 1}
              onClick={() => onMoveEtapa(eIdx, 'DOWN')}
              className={styles.btnMoveStageExpanded}
              title="Bajar etapa (ejecutar después)"
            >
              ▼ Bajar
            </button>
          </div>
        )}
        <button type="button" onClick={onCollapse} className={styles.btnCollapseStage} title="Contraer esta etapa">
          Plegar ▲
        </button>
        <button type="button" onClick={() => onRemoveEtapa(eIdx)} className={styles.btnRemoveStage}>
          Eliminar Etapa
        </button>
      </div>
    </div>
  );
}
