import React from 'react';
import { Button } from '@/components/ui/Button';
import { toCanonicalUnit } from '@/utils/unitNormalizer';
import styles from '../recipes.module.css';

export function IngredientsFormSection({ etapa, etapaIndex, supplies = [], products = [], currentRecipeProductId = null, onAdd, onUpdate, onRemove }) {
  const activeDetalles = etapa.detalles?.filter(d => d.activo !== false) || [];
  const availableWipProducts = products.filter(p => p.id !== currentRecipeProductId);

  return (
    <div className={styles.bomSection}>
      <div className={styles.bomHeader}>
        <h4 className={styles.bomTitle}>BOM (Lista de Materiales y Fórmula)</h4>
        <Button type="button" variant="secondary" onClick={() => onAdd(etapaIndex)}>+ Agregar Insumo / Base</Button>
      </div>
      <p className={styles.bomHint}>💡 Puedes mezclar materias primas de bodega con bases previamente cocinadas en planta.</p>
      
      {activeDetalles.length > 0 && (
        <table className={styles.bomTable}>
          <thead>
            <tr>
              <th>Ingrediente / Base</th>
              <th>Cant. Requerida & Unidad</th>
              <th>Merma %</th>
              <th>Tipo Insumo</th>
              <th>Grupo Variante</th>
              <th>Opcional</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {etapa.detalles.map((det, dIdx) => {
              if (det.activo === false) return null;
              const selectedValue = det.idProductoIntermedio ? `PROD:${det.idProductoIntermedio}` : det.idInsumo ? `INS:${det.idInsumo}` : '';
              const isWip = Boolean(det.idProductoIntermedio);
              const isPackaging = det.tipoInsumo === 'EMPAQUE_BASE' || det.tipoInsumo === 'EMPAQUE_COMPLEMENTO';
              const isComplement = det.tipoInsumo === 'COMPLEMENTO';

              return (
                <tr key={dIdx}>
                  <td>
                    <select className={styles.select} value={selectedValue} onChange={e => onUpdate(etapaIndex, dIdx, 'resourceSelector', e.target.value)} required>
                      <option value="">Seleccione ingrediente o base...</option>
                      <optgroup label="Materias Primas y Empaques (Insumos)">
                        {supplies.map(s => <option key={s.id} value={`INS:${s.id}`}>{s.nombre} ({s.unidadBase})</option>)}
                      </optgroup>
                      <optgroup label="Bases y Semielaborados en Planta (WIP)">
                        {availableWipProducts.map(p => <option key={p.id} value={`PROD:${p.id}`}>{p.nombre} ({p.presentacion?.nombre || 'A GRANEL'})</option>)}
                      </optgroup>
                    </select>
                  </td>
                  <td>
                    <div className={styles.bomInputRow}>
                      <input className={`${styles.input} ${styles.bomInputSmall}`} type="number" step="0.0001" min="0" value={det.cantidadRequerida === '' ? '' : det.cantidadRequerida} placeholder="0" onChange={e => onUpdate(etapaIndex, dIdx, 'cantidadRequerida', e.target.value === '' ? '' : parseFloat(e.target.value))} required />
                      <span className={styles.bomUnitBadge}>{det.unidad ? toCanonicalUnit(det.unidad) : '-'}</span>
                    </div>
                  </td>
                  <td>
                    <input className={styles.input} type="number" step="0.1" min="0" max="100" value={det.mermaPorcentaje === '' ? '' : det.mermaPorcentaje} placeholder="0" onChange={e => onUpdate(etapaIndex, dIdx, 'mermaPorcentaje', e.target.value === '' ? '' : parseFloat(e.target.value))} />
                  </td>
                  <td>
                    <div className={styles.bomBadgeCol}>
                      <div>
                        {isWip ? <span className={styles.badgeWip}>Base Láctea (WIP)</span> : isPackaging ? <span className={styles.badgePkg}>📦 Empaque</span> : isComplement ? <span className={styles.badgeComp}>Complemento</span> : <span className={styles.badgeRaw}>Materia Prima</span>}
                      </div>
                      <select className={styles.select} value={det.tipoInsumo || (det.idProductoIntermedio ? 'INTERMEDIO_WIP' : 'BASE')} onChange={e => onUpdate(etapaIndex, dIdx, 'tipoInsumo', e.target.value)}>
                        <option value="BASE">BASE</option>
                        <option value="INTERMEDIO_WIP">INTERMEDIO WIP</option>
                        <option value="COMPLEMENTO">COMPLEMENTO</option>
                        <option value="EMPAQUE_BASE">EMPAQUE BASE</option>
                        <option value="EMPAQUE_COMPLEMENTO">EMPAQUE COMPLEMENTO</option>
                      </select>
                    </div>
                  </td>
                  <td>
                    <select className={styles.select} value={det.grupoVariante || 'NINGUNO'} onChange={e => onUpdate(etapaIndex, dIdx, 'grupoVariante', e.target.value)}>
                      <option value="NINGUNO">NINGUNO</option>
                      <option value="CEREAL">CEREAL</option>
                      <option value="FRUTA">FRUTA</option>
                      <option value="JALEA">JALEA</option>
                      <option value="SABOR">SABOR</option>
                      <option value="OTRO">OTRO</option>
                    </select>
                  </td>
                  <td className={styles.textCenter}>
                    <input type="checkbox" checked={Boolean(det.esOpcional)} onChange={e => onUpdate(etapaIndex, dIdx, 'esOpcional', e.target.checked)} />
                  </td>
                  <td>
                    <Button type="button" variant="danger" onClick={() => onRemove(etapaIndex, dIdx)}>X</Button>
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
