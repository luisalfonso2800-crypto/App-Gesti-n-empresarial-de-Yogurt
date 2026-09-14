/**
 * @file ChecklistItemRowMotivos.jsx
 * @module operations/purchases/new/parts
 * @description Bloque de selección y especificación de motivos cuando un ítem no es conseguido.
 * @responsibility Captura de motivo de fallo en adquisición, reintento o descarte de ítem.
 * @usedBy apps/web/src/app/operations/purchases/new/components/ChecklistItemRow.jsx
 * @dependencies React, ../../new-purchase.module.css
 */
import React from 'react';
import styles from '../../new-purchase.module.css';

export default function ChecklistItemRowMotivos({
  item,
  updateChecklistItem,
  handleMantenerEnLista,
  handleDescartarItem
}) {
  return (
    <div className={styles.motivosBar}>
      <label className={`${styles.label} ${styles.motivoLabel}`}>Motivo por el cual no se consiguió:</label>
      <select 
        className={`${styles.select} ${styles.motivoSelect}`}
        value={item.motivoNoConseguido || ''}
        onChange={(e) => updateChecklistItem(item._id, 'motivoNoConseguido', e.target.value)}
      >
        <option value="">-- Seleccione un motivo --</option>
        <option value="Agotado en punto de venta">Agotado en punto de venta</option>
        <option value="Proveedor ya no distribuye este insumo">Proveedor ya no distribuye este insumo</option>
        <option value="Precio fuera de presupuesto">Precio fuera de presupuesto</option>
        <option value="Presentación o calidad no aceptable">Presentación o calidad no aceptable</option>
        <option value="Otro motivo (especificar)">Otro motivo (especificar)</option>
      </select>
      {item.motivoNoConseguido === 'Otro motivo (especificar)' && (
        <input 
          type="text" 
          className={`${styles.input} ${styles.motivoInput}`} 
          placeholder="Especifique el motivo..."
          value={item.detalleMotivoNoConseguido || ''}
          onChange={(e) => updateChecklistItem(item._id, 'detalleMotivoNoConseguido', e.target.value)}
        />
      )}
      <div className={styles.motivoActionsRow}>
        <button 
          type="button" 
          className={styles.cancelBtn} 
          onClick={handleMantenerEnLista}
        >
          Registrar motivo y mantener en lista
        </button>
        <button 
          type="button" 
          className={`${styles.cancelBtn} ${styles.discardBtn}`}
          onClick={handleDescartarItem}
        >
          Registrar motivo y descartar
        </button>
      </div>
    </div>
  );
}
