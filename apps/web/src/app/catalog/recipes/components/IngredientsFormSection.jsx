/**
 * @file IngredientsFormSection.jsx
 * @module catalog/recipes/components
 * @description Sub-formulario dinámico para agregar insumos y productos intermedios (WIP).
 * @responsibility Manejar la Lista de Materiales (BOM) para una etapa con selector agrupado, insignias de clasificación y protección anti-recursión.
 * @usedBy apps/web/src/app/catalog/recipes/components/RecipeModal.jsx
 * @dependencies @/components/ui/Button, styles local
 */

import React from 'react';
import { Button } from '@/components/ui/Button';
import styles from '../recipes.module.css';

export function IngredientsFormSection({
  etapa,
  etapaIndex,
  supplies = [],
  products = [],
  currentRecipeProductId = null,
  onAdd,
  onUpdate,
  onRemove
}) {
  const activeDetalles = etapa.detalles?.filter(d => d.activo !== false) || [];

  // Poka-Yoke Anti-Recursión: Excluir el producto que se está formulando actualmente
  const availableWipProducts = products.filter(p => p.id !== currentRecipeProductId);

  return (
    <div style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0 }}>Lista de Materiales (BOM)</h4>
        <Button type="button" variant="secondary" onClick={() => onAdd(etapaIndex)}>+ Agregar Insumo / Base</Button>
      </div>
      <p style={{ margin: '4px 0 8px 0', color: '#6B7280', fontSize: '0.75rem', fontStyle: 'italic' }}>
        💡 Puedes mezclar materias primas de bodega (leche, azúcar, fruta) con bases previamente cocinadas en planta (Base Blanca, Jalea de Frutos).
      </p>
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

              // Resolver el valor agrupado del selector ('INS:id' o 'PROD:id')
              const selectedValue = det.idProductoIntermedio
                ? `PROD:${det.idProductoIntermedio}`
                : det.idInsumo
                  ? `INS:${det.idInsumo}`
                  : '';

              const isWip = Boolean(det.idProductoIntermedio);
              const isPackaging = det.tipoInsumo === 'EMPAQUE_BASE' || det.tipoInsumo === 'EMPAQUE_COMPLEMENTO';
              const isComplement = det.tipoInsumo === 'COMPLEMENTO';

              return (
                <tr key={dIdx}>
                  <td>
                    <select
                      className={styles.select}
                      value={selectedValue}
                      onChange={e => onUpdate(etapaIndex, dIdx, 'resourceSelector', e.target.value)}
                      required
                    >
                      <option value="">Seleccione ingrediente o base...</option>
                      <optgroup label="Materias Primas y Empaques (Insumos)">
                        {supplies.map(s => (
                          <option key={s.id} value={`INS:${s.id}`}>
                            {s.nombre} ({s.unidadBase})
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Bases y Semielaborados en Planta (WIP)">
                        {availableWipProducts.map(p => (
                          <option key={p.id} value={`PROD:${p.id}`}>
                            {p.nombre} ({p.presentacion?.nombre || 'A GRANEL'})
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <input
                        className={styles.input}
                        type="number"
                        step="0.0001"
                        min="0"
                        value={det.cantidadRequerida === '' ? '' : det.cantidadRequerida}
                        placeholder="0"
                        onChange={e => onUpdate(etapaIndex, dIdx, 'cantidadRequerida', e.target.value === '' ? '' : parseFloat(e.target.value))}
                        required
                        style={{ minWidth: '70px' }}
                      />
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4B5563', whiteSpace: 'nowrap' }}>
                        {det.unidad || '-'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <input
                      className={styles.input}
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={det.mermaPorcentaje === '' ? '' : det.mermaPorcentaje}
                      placeholder="0"
                      onChange={e => onUpdate(etapaIndex, dIdx, 'mermaPorcentaje', e.target.value === '' ? '' : parseFloat(e.target.value))}
                    />
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div>
                        {isWip ? (
                          <span style={{ display: 'inline-block', padding: '0.12rem 0.45rem', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 600, backgroundColor: '#DBEAFE', color: '#1E40AF' }}>
                            Base Láctea (WIP)
                          </span>
                        ) : isPackaging ? (
                          <span style={{ display: 'inline-block', padding: '0.12rem 0.45rem', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 600, backgroundColor: '#FEF3C7', color: '#92400E' }}>
                            📦 Empaque
                          </span>
                        ) : isComplement ? (
                          <span style={{ display: 'inline-block', padding: '0.12rem 0.45rem', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 600, backgroundColor: '#F3E8FF', color: '#6B21A8' }}>
                            Complemento
                          </span>
                        ) : (
                          <span style={{ display: 'inline-block', padding: '0.12rem 0.45rem', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 600, backgroundColor: '#F3F4F6', color: '#374151' }}>
                            Materia Prima
                          </span>
                        )}
                      </div>
                      <select
                        className={styles.select}
                        value={det.tipoInsumo || (det.idProductoIntermedio ? 'INTERMEDIO_WIP' : 'BASE')}
                        onChange={e => onUpdate(etapaIndex, dIdx, 'tipoInsumo', e.target.value)}
                      >
                        <option value="BASE">BASE</option>
                        <option value="INTERMEDIO_WIP">INTERMEDIO WIP</option>
                        <option value="COMPLEMENTO">COMPLEMENTO</option>
                        <option value="EMPAQUE_BASE">EMPAQUE BASE</option>
                        <option value="EMPAQUE_COMPLEMENTO">EMPAQUE COMPLEMENTO</option>
                      </select>
                    </div>
                  </td>
                  <td>
                    <select
                      className={styles.select}
                      value={det.grupoVariante || 'NINGUNO'}
                      onChange={e => onUpdate(etapaIndex, dIdx, 'grupoVariante', e.target.value)}
                    >
                      <option value="NINGUNO">NINGUNO</option>
                      <option value="CEREAL">CEREAL</option>
                      <option value="FRUTA">FRUTA</option>
                      <option value="JALEA">JALEA</option>
                      <option value="SABOR">SABOR</option>
                      <option value="OTRO">OTRO</option>
                    </select>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(det.esOpcional)}
                      onChange={e => onUpdate(etapaIndex, dIdx, 'esOpcional', e.target.checked)}
                    />
                  </td>
                  <td>
                    <Button type="button" variant="danger" onClick={() => onRemove(etapaIndex, dIdx)}>
                      X
                    </Button>
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
