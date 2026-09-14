/**
 * @file ProductionCompleteForm.jsx
 * @module operations/production/components/modal-parts
 * @description Formulario para el reporte de consumo físico real y cierre de orden de producción.
 * @responsibility Renderizar insumos con cantidad real consumida, cálculo de merma y confirmación de lote padre.
 * @usedBy apps/web/src/app/operations/production/components/ProductionModal.jsx
 * @dependencies react, @/components/ui/Button, ../production.module.css, ../production-modal.module.css
 */

import React from 'react';
import { Button } from '@/components/ui/Button';
import baseStyles from '../production.module.css';
import styles from '../production-modal.module.css';

export function ProductionCompleteForm({
  completeFechaVencimiento = '',
  setCompleteFechaVencimiento,
  completeDetalles = [],
  setCompleteDetalles,
  availableParentLots = [],
  completeSelectedParentLotId = '',
  setCompleteSelectedParentLotId,
  onSubmitComplete,
  onClose
}) {
  const intermediateDetail = completeDetalles.find(d => d.idProductoIntermedio);

  return (
    <div className={baseStyles.editorContainer}>
      <div className={baseStyles.headerTitle}>
        <h2 className={baseStyles.title}>Cierre de Producción</h2>
        <p className={baseStyles.subtitle}>Reporte el consumo real de materiales. El inventario se descontará con base en el consumo físico reportado.</p>
        <Button variant="secondary" onClick={onClose} className={styles.btnReturn}>Volver</Button>
      </div>

      <form onSubmit={onSubmitComplete}>
        <div className={styles.completeDateContainer}>
          <label className={styles.label}>
            FECHA DE VENCIMIENTO CONFIRMADA DEL LOTE
          </label>
          <input 
            className={baseStyles.input} 
            type="date" 
            value={completeFechaVencimiento} 
            onChange={e => setCompleteFechaVencimiento(e.target.value)} 
            required 
          />
        </div>

        {intermediateDetail && availableParentLots.length > 0 && (
          <div className={styles.completeParentLotBox}>
            <label className={styles.completeParentLotLabel}>
              CONFIRMAR LOTE PADRE DE BASE BLANCA (WIP):
            </label>
            <select 
              className={baseStyles.select} 
              value={completeSelectedParentLotId} 
              onChange={e => setCompleteSelectedParentLotId(e.target.value)}
              required
            >
              {availableParentLots.map(l => (
                <option key={l.id} value={l.id}>
                  Lote: {l.codigoLote || l.id.split('-')[0].toUpperCase()} — Saldo en planta: {Number(l.cantidadDisponible).toFixed(2)} {l.unidad}
                </option>
              ))}
            </select>
          </div>
        )}

        <table className={baseStyles.bomTable}>
          <thead>
            <tr>
              <th>Ingrediente / Base</th>
              <th>Consumo Teórico</th>
              <th>Consumo Real Físico</th>
              <th>Variación / Merma Extra</th>
            </tr>
          </thead>
          <tbody>
            {completeDetalles.map((d, idx) => {
              const diff = Number(d.cantidadRealUtilizada) - Number(d.cantidadTeorica);
              let diffClass = '';
              if (diff > 0) diffClass = baseStyles.mermaDanger;
              else if (diff < 0) diffClass = baseStyles.mermaSuccess;
              else diffClass = baseStyles.okText;

              const displayName = d.productoIntermedio?.nombre 
                ? `${d.productoIntermedio.nombre} (Base WIP)`
                : d.insumo?.nombre 
                  ? d.insumo.nombre 
                  : (d.idInsumo || d.idProductoIntermedio || 'Item');

              return (
                <tr key={d.id}>
                  <td>
                    <strong>{displayName}</strong>
                  </td>
                  <td>{Number(d.cantidadTeorica).toFixed(2)} {d.unidad}</td>
                  <td>
                    <input 
                      className={baseStyles.input} 
                      type="number" 
                      step="0.0001" 
                      value={d.cantidadRealUtilizada} 
                      onChange={e => {
                        const arr = [...completeDetalles];
                        arr[idx].cantidadRealUtilizada = e.target.value;
                        setCompleteDetalles(arr);
                      }}
                      required 
                    />
                  </td>
                  <td className={diffClass}>
                    {diff > 0 ? '+' : ''}{diff.toFixed(2)} {d.unidad}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className={baseStyles.formActions}>
          <Button type="submit">Completar y Descontar Inventario</Button>
        </div>
      </form>
    </div>
  );
}
