'use client';

/**
 * @file RecipeStageBomTable.jsx
 * @module catalog/recipes/components/parts
 * @description Subtabla ágil de insumos y bases intermedias (BOM) asignadas a la etapa activa.
 * @responsibility Renderizar los renglones de ingredientes, merma y tipo sin estilos inline (< 120 líneas).
 * @usedBy RecipeStageEditor.jsx
 */

import React from 'react';
import { getPackagingPhysicalLimit } from '../recipeHelpers';
import styles from './recipe-stages.module.css';

export function RecipeStageBomTable({
  etapa,
  stageIndex,
  supplies = [],
  products = [],
  currentRecipeProductId = null,
  rendimientoBase = 0,
  onAddDetalle,
  onUpdateDetalle,
  onRemoveDetalle
}) {
  const activeDetalles = etapa?.detalles?.filter(d => d.activo !== false) || [];
  const availableWipProducts = products.filter(p => 
    p.tipoItem === 'INOCULO_WIP' || p.idItem?.startsWith('INOCULO:') || p.id !== currentRecipeProductId
  );
  const currentProduct = products.find(p => String(p.id) === String(currentRecipeProductId));
  const limitInfo = getPackagingPhysicalLimit(currentProduct, rendimientoBase);

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
        <div className={styles.bomTableResponsive}>
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
              const isInoculoDet = det.idProductoIntermedio && (det.unidad === 'g' || det.unidad === 'GRAMOS' || det.unidad === 'ml');
              const selectedValue = det.idProductoIntermedio 
                ? (isInoculoDet ? `INOCULO:${det.idProductoIntermedio}` : `BASE:${det.idProductoIntermedio}`) 
                : (det.idInsumo ? `INS:${det.idInsumo}` : '');
              const isWip = Boolean(det.idProductoIntermedio);
              const isPackaging = det.tipoInsumo === 'EMPAQUE_BASE' || det.tipoInsumo === 'EMPAQUE_COMPLEMENTO';
              const isComplement = det.tipoInsumo === 'COMPLEMENTO';

              const unidadDet = String(det.unidad || '').toLowerCase();
              const isLiquid = unidadDet === 'l' || unidadDet === 'litros' || Boolean(det.idProductoIntermedio);
              const valNum = Number(det.cantidadRequerida) || 0;
              const isOverCapacity = Boolean(limitInfo?.maxLitrosPermitidos && isLiquid && valNum > limitInfo.maxLitrosPermitidos);

              return (
                <tr key={dIdx}>
                  <td>
                    <select className={styles.select} value={selectedValue} onChange={e => onUpdateDetalle(stageIndex, dIdx, 'resourceSelector', e.target.value)} required>
                      <option value="">Seleccione ingrediente o base...</option>
                      <optgroup label="Materias Primas y Empaques (Insumos)">
                        {supplies.map(s => (<option key={`insumo-opt-${s.id}`} value={`INS:${s.id}`}>{s.nombre} ({s.unidadBase})</option>))}
                      </optgroup>
                      <optgroup label="🧫 Iniciadores y Cepas (Inóculo WIP)">
                        {availableWipProducts.filter(p => p.tipoItem === 'INOCULO_WIP' || p.displayLabel?.includes('INÓCULO') || p.idItem?.startsWith('INOCULO:')).map(p => (
                          <option key={`inoculo-opt-${p.idItem || p.id}`} value={p.idItem || `INOCULO:${p.id}`}>
                            {p.displayLabel || p.nombre}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="🥛 Bases Lácteas a Granel (WIP)">
                        {availableWipProducts.filter(p => p.tipoItem !== 'INOCULO_WIP' && !p.displayLabel?.includes('INÓCULO')).map(p => (
                          <option key={`base-opt-${p.idItem || p.id}`} value={p.idItem || `BASE:${p.id}`}>
                            {p.displayLabel || p.nombre}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </td>
                  <td>
                    <div className={styles.qtyWrapper}>
                      <input className={`${styles.input} ${isOverCapacity ? styles.inputErrorBorder : ''}`} type="number" step={String(det.unidad || '').toLowerCase().includes('und') || String(det.unidad || '').toLowerCase().includes('unidades') ? '1' : '0.1'} min="0" value={det.cantidadRequerida === '' ? '' : det.cantidadRequerida} placeholder="0" onChange={e => onUpdateDetalle(stageIndex, dIdx, 'cantidadRequerida', e.target.value === '' ? '' : parseFloat(e.target.value))} required />
                      <span className={styles.unitBadge}>{det.unidad || '-'}</span>
                    </div>
                    {isOverCapacity && (
                      <span className={styles.packagingOverflowError}>
                        ❌ Excede la capacidad física: El contenedor admite máx {(limitInfo.capacidadUnitariaLts * 1000).toFixed(0)} ml por envase (máx {limitInfo.maxLitrosPermitidos.toFixed(2)} L para {limitInfo.rendimientoUnidades} unds). Revisa si quisiste ingresar {(valNum / 10).toFixed(1)} L.
                      </span>
                    )}
                  </td>
                  <td>
                    <input
                      className={`${styles.input} ${Number(det.mermaPorcentaje) >= 100 ? styles.inputErrorBorder : ''}`}
                      type="number"
                      step="0.1"
                      min="0"
                      max="99.9"
                      value={det.mermaPorcentaje === '' ? '' : det.mermaPorcentaje}
                      placeholder="0"
                      onChange={e => onUpdateDetalle(stageIndex, dIdx, 'mermaPorcentaje', e.target.value === '' ? '' : parseFloat(e.target.value))}
                    />
                    {Number(det.mermaPorcentaje) >= 100 && (
                      <span className={styles.packagingOverflowError}>
                        ⚠️ La merma debe ser menor a 100%
                      </span>
                    )}
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
        </div>
      )}
    </div>
  );
}
