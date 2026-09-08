/**
 * @file IngredientsFormSection.jsx
 * @module catalog/recipes/components
 * @description Sub-formulario dinámico para agregar insumos.
 * @responsibility Manejar la Lista de Materiales (BOM) para una etapa específica.
 * @usedBy apps/web/src/app/catalog/recipes/components/RecipeModal.jsx
 * @dependencies @/components/ui/Button, styles local
 */
import React from 'react';
import { Button } from '@/components/ui/Button';
import styles from '../recipes.module.css';

export function IngredientsFormSection({ etapa, etapaIndex, supplies, onAdd, onUpdate, onRemove }) {
  const activeDetalles = etapa.detalles?.filter(d => d.activo !== false) || [];

  return (
    <div style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0 }}>Lista de Materiales (BOM)</h4>
        <Button type="button" variant="secondary" onClick={() => onAdd(etapaIndex)}>+ Agregar Insumo</Button>
      </div>
      {activeDetalles.length > 0 && (
        <table className={styles.bomTable}>
          <thead>
            <tr>
              <th>Insumo</th>
              <th>Cant. Requerida</th>
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
              return (
                <tr key={dIdx}>
                  <td>
                    <select className={styles.select} value={det.idInsumo} onChange={e => onUpdate(etapaIndex, dIdx, 'idInsumo', e.target.value)} required>
                      <option value="">Seleccione...</option>
                      {supplies.map(s => (
                        <option key={s.id} value={s.id}>{s.nombre} ({s.unidadBase})</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input className={styles.input} type="number" step="0.0001" value={det.cantidadRequerida || 0} onChange={e => onUpdate(etapaIndex, dIdx, 'cantidadRequerida', parseFloat(e.target.value))} required />
                  </td>
                  <td>
                    <input className={styles.input} type="number" step="0.1" value={det.mermaPorcentaje || 0} onChange={e => onUpdate(etapaIndex, dIdx, 'mermaPorcentaje', parseFloat(e.target.value))} />
                  </td>
                  <td>
                    <select className={styles.select} value={det.tipoInsumo} onChange={e => onUpdate(etapaIndex, dIdx, 'tipoInsumo', e.target.value)}>
                      <option value="BASE">BASE</option>
                      <option value="COMPLEMENTO">COMPLEMENTO</option>
                      <option value="EMPAQUE_BASE">EMPAQUE BASE</option>
                      <option value="EMPAQUE_COMPLEMENTO">EMPAQUE COMPLEMENTO</option>
                    </select>
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
                  <td style={{ textAlign: 'center' }}>
                    <input type="checkbox" checked={det.esOpcional} onChange={e => onUpdate(etapaIndex, dIdx, 'esOpcional', e.target.checked)} />
                  </td>
                  <td>
                    <Button type="button" variant="danger" onClick={() => onRemove(etapaIndex, dIdx)}>X</Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
