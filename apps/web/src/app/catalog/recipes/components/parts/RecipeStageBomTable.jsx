'use client';

/**
 * @file RecipeStageBomTable.jsx
 * @module catalog/recipes/components/parts
 * @description Subtabla ágil de insumos y bases intermedias (BOM) asignadas a la etapa activa.
 * @responsibility Renderizar los renglones de ingredientes, merma y tipo sin estilos inline (< 120 líneas).
 * @usedBy RecipeStageEditor.jsx
 */

import React from 'react';
import styles from './recipe-stages.module.css';

export function RecipeStageBomTable({
  etapa,
  stageIndex,
  supplies = [],
  products = [],
  currentRecipeProductId = null,
  onAddDetalle,
  onUpdateDetalle,
  onRemoveDetalle
}) {
  const activeDetalles = etapa?.detalles?.filter(d => d.activo !== false) || [];
  const availableWipProducts = products.filter(p => p.id !== currentRecipeProductId);

  return (
    <div className={styles.bomSection}>
      <div className={styles.bomHeaderRow}>
        <h4 className={styles.bomTitle}>BOM (Lista de Materiales y Fórmula de la Etapa)</h4>
        <button type="button" className={styles.btnAddBom} onClick={() => onAddDetalle(stageIndex)}>
          + Agregar Insumo / Base
        </button>
      </div>

      {activeDetalles.length === 0 ? (
        <div className={styles.emptyBomNotice}>
          No se han asignado insumos ni materiales a esta fase.
        </div>
      ) : (
        <table className={styles.bomTable}>
          <thead>
            <tr>
              <th>Ingrediente / Base</th>
              <th>Cant. Requerida</th>
              <th>Merma %</th>
              <th>Clasificación</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {etapa.detalles.map((det, dIdx) => {
              if (det.activo === false) return null;
              const selectedValue = det.idProductoIntermedio ? `PROD:${det.idProductoIntermedio}` : (det.idInsumo ? `INS:${det.idInsumo}` : '');
              const isWip = Boolean(det.idProductoIntermedio);
              const isPackaging = det.tipoInsumo === 'EMPAQUE_BASE' || det.tipoInsumo === 'EMPAQUE_COMPLEMENTO';
              const isComplement = det.tipoInsumo === 'COMPLEMENTO';

              return (
                <tr key={dIdx}>
                  <td>
                    <select className={styles.select} value={selectedValue} onChange={e => onUpdateDetalle(stageIndex, dIdx, 'resourceSelector', e.target.value)} required>
                      <option value="">Seleccione ingrediente o base...</option>
                      <optgroup label="Materias Primas y Empaques (Insumos)">
                        {supplies.map(s => (<option key={s.id} value={`INS:${s.id}`}>{s.nombre} ({s.unidadBase})</option>))}
                      </optgroup>
                      <optgroup label="Bases y Semielaborados (WIP)">
                        {availableWipProducts.map(p => (<option key={p.id} value={`PROD:${p.id}`}>{p.nombre} ({p.presentacion?.nombre || 'A GRANEL'})</option>))}
                      </optgroup>
                    </select>
                  </td>
                  <td>
                    <div className={styles.qtyWrapper}>
                      <input className={styles.input} type="number" step="0.0001" min="0" value={det.cantidadRequerida === '' ? '' : det.cantidadRequerida} placeholder="0" onChange={e => onUpdateDetalle(stageIndex, dIdx, 'cantidadRequerida', e.target.value === '' ? '' : parseFloat(e.target.value))} required />
                      <span className={styles.unitBadge}>{det.unidad || '-'}</span>
                    </div>
                  </td>
                  <td>
                    <input className={styles.input} type="number" step="0.1" min="0" max="100" value={det.mermaPorcentaje === '' ? '' : det.mermaPorcentaje} placeholder="0" onChange={e => onUpdateDetalle(stageIndex, dIdx, 'mermaPorcentaje', e.target.value === '' ? '' : parseFloat(e.target.value))} />
                  </td>
                  <td>
                    {isWip ? (<span className={styles.itemTypeTagWip}>Base WIP</span>) : isPackaging ? (<span className={styles.itemTypeTagPkg}>📦 Empaque</span>) : isComplement ? (<span className={styles.itemTypeTagComplement}>Complemento</span>) : (<span className={styles.itemTypeTagRaw}>Materia Prima</span>)}
                  </td>
                  <td>
                    <button type="button" className={styles.btnRemoveRow} onClick={() => onRemoveDetalle(stageIndex, dIdx)} title="Quitar insumo">✕</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
