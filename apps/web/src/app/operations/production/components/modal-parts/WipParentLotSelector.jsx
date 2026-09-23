/**
 * @file WipParentLotSelector.jsx
 * @module operations/production/components/modal-parts
 * @description Selector de lote padre WIP (Base en Tanque) para recetas que requieren materia prima intermedia.
 * @responsibility Mostrar el requerimiento WIP, listar lotes disponibles y validar stock suficiente.
 */

import React from 'react';
import { AlertCircle, Layers } from 'lucide-react';
import baseStyles from '../production.module.css';
import styles from '../production-modal.module.css';

/**
 * @param {object} props
 * @param {object} props.currentWipItem - Item WIP requerido por la receta
 * @param {Array} props.availableParentLots - Lotes de base disponibles
 * @param {string} props.selectedParentLotId - ID del lote padre seleccionado
 * @param {Function} props.setSelectedParentLotId - Setter del lote padre
 * @param {object|null} props.selectedParentLot - Lote padre seleccionado completo
 * @param {boolean} props.wipSufficient - Si el lote tiene stock suficiente
 * @param {boolean} props.parentLotsLoading - Estado de carga de lotes disponibles
 */
export function WipParentLotSelector({ currentWipItem, availableParentLots, selectedParentLotId, setSelectedParentLotId, selectedParentLot, wipSufficient, parentLotsLoading }) {
  return (
    <div className={styles.wipParentLotCard}>
      <div className={styles.wipHeader}>
        <Layers size={18} className={styles.wipIcon} />
        <h4 className={styles.wipTitle}>ORIGEN DE MATERIA PRIMA INTERMEDIA (BASE EN TANQUE)</h4>
      </div>
      <p className={styles.wipRequirementText}>
        Esta receta requiere <strong>{Number(currentWipItem.requeridoTeorico).toFixed(2)} {currentWipItem.unidad}</strong> de base semielaborada ({currentWipItem.nombreInsumo}).
      </p>
      <p className={styles.wipHelperText}>
        Indica el lote o tanque de donde se extraerá físicamente la base líquida o jalea elaborada en planta.
      </p>

      {parentLotsLoading ? (
        <p className={styles.wipLoadingText}>Consultando tanques y cavas de base...</p>
      ) : availableParentLots.length === 0 ? (
        <div className={styles.wipEmptyAlert}>
          <AlertCircle size={16} />
          <span>Stock insuficiente de Base Blanca en planta. Debe fabricar primero un lote de base.</span>
        </div>
      ) : (
        <div className={styles.wipSelectContainer}>
          <label className={styles.wipSelectLabel}>Seleccionar Tanque / Lote Padre Activo:</label>
          <select className={baseStyles.select} value={selectedParentLotId} onChange={e => setSelectedParentLotId(e.target.value)} required>
            {availableParentLots.map(l => (
              <option key={l.id} value={l.id}>
                Lote: {l.codigoLote || l.id.split('-')[0].toUpperCase()} — Saldo en planta: {Number(l.cantidadDisponible).toFixed(2)} {l.unidad} (Fabricado: {new Date(l.fechaProduccion).toLocaleDateString()})
              </option>
            ))}
          </select>
          {!wipSufficient && selectedParentLot && (
            <span className={styles.wipErrorInsufficient}>
              El lote seleccionado solo tiene {Number(selectedParentLot.cantidadDisponible).toFixed(2)} {selectedParentLot.unidad} y se requieren {Number(currentWipItem.requeridoTeorico).toFixed(2)} {currentWipItem.unidad}.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
