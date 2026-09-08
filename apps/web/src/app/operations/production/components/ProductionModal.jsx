/**
 * @file ProductionModal.jsx
 * @module operations/production/components
 * @description Vistas de creación y cerrado de órdenes de producción.
 * @responsibility Mostrar form correspondiente (simulación BOM o reporte físico).
 * @usedBy apps/web/src/app/operations/production/page.jsx
 * @dependencies @/components/ui/Button, styles local
 */
import React from 'react';
import { Button } from '@/components/ui/Button';
import styles from '../production.module.css';

export function ProductionModal({
  view, recipes, selectedRecipeId, setSelectedRecipeId,
  cantidadPlanificada, setCantidadPlanificada, variantGroups,
  selectedVariants, handleVariantChange, bomSimulado,
  completeDetalles, setCompleteDetalles,
  onSubmitCreate, onSubmitComplete, onClose
}) {
  if (view === 'create') {
    return (
      <div className={styles.editorContainer}>
        <div className={styles.headerTitle}>
          <h2 className={styles.title}>Nueva Orden de Producción</h2>
          <Button variant="secondary" onClick={onClose} style={{ width: 'fit-content', marginTop: '1rem' }}>Volver</Button>
        </div>
        
        <form onSubmit={onSubmitCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className={styles.grid2}>
            <div>
              <label>Receta a Producir</label>
              <select className={styles.select} value={selectedRecipeId} onChange={e => setSelectedRecipeId(e.target.value)} required>
                <option value="">Seleccione una receta...</option>
                {recipes.filter(r => r.activo).map(r => (
                  <option key={r.id} value={r.id}>{r.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Cantidad a Producir (Unidades Finales)</label>
              <input className={styles.input} type="number" step="0.01" value={cantidadPlanificada} onChange={e => setCantidadPlanificada(e.target.value)} required />
            </div>
          </div>

          {variantGroups.length > 0 && (
            <div>
              <h3 className={styles.sectionTitle}>Variantes Opcionales</h3>
              <div className={styles.grid3}>
                {variantGroups.map(vg => (
                  <div key={vg}>
                    <label>
                      <input 
                        type="checkbox" 
                        checked={!!selectedVariants[vg]} 
                        onChange={e => handleVariantChange(vg, e.target.checked)} 
                      /> Iniciar con Variante: {vg}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {bomSimulado.length > 0 && (
            <div>
              <h3 className={styles.sectionTitle}>BOM Escalonado y Disponibilidad</h3>
              <table className={styles.bomTable}>
                <thead>
                  <tr>
                    <th>Etapa</th>
                    <th>Insumo</th>
                    <th>Requerido (Teórico)</th>
                    <th>Stock Actual</th>
                    <th>Faltante</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {bomSimulado.map((b, i) => (
                    <tr key={i} className={b.ok ? styles.okRow : styles.missingRow}>
                      <td>{b.etapa}</td>
                      <td>{b.nombreInsumo}</td>
                      <td>{b.requeridoTeorico.toFixed(2)} {b.unidad}</td>
                      <td>{b.stockActual.toFixed(2)} {b.unidad}</td>
                      <td className={b.faltante > 0 ? styles.missingText : ''}>{b.faltante.toFixed(2)}</td>
                      <td className={b.ok ? styles.okText : styles.missingText}>{b.ok ? 'OK' : 'FALTANTE'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className={styles.formActions}>
            <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={!selectedRecipeId || bomSimulado.some(b => !b.ok)}>
              Registrar Orden y Tomar Snapshot
            </Button>
          </div>
        </form>
      </div>
    );
  }

  if (view === 'complete') {
    return (
      <div className={styles.editorContainer}>
        <div className={styles.headerTitle}>
          <h2 className={styles.title}>Cierre de Producción</h2>
          <p className={styles.subtitle}>Reporte el consumo real de materiales. El inventario se descontará con base en el consumo físico reportado.</p>
          <Button variant="secondary" onClick={onClose} style={{ width: 'fit-content', marginTop: '1rem' }}>Volver</Button>
        </div>

        <form onSubmit={onSubmitComplete}>
          <table className={styles.bomTable}>
            <thead>
              <tr>
                <th>ID Insumo</th>
                <th>Consumo Teórico</th>
                <th>Consumo Real Físico</th>
                <th>Variación / Merma Extra</th>
              </tr>
            </thead>
            <tbody>
              {completeDetalles.map((d, idx) => {
                const diff = d.cantidadRealUtilizada - d.cantidadTeorica;
                let diffClass = '';
                if (diff > 0) diffClass = styles.mermaDanger;
                else if (diff < 0) diffClass = styles.mermaSuccess;
                else diffClass = styles.okText;

                return (
                  <tr key={d.id}>
                    <td>{d.idInsumo}</td>
                    <td>{Number(d.cantidadTeorica).toFixed(2)} {d.unidad}</td>
                    <td>
                      <input 
                        className={styles.input} 
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
          <div className={styles.formActions}>
             <Button type="submit">Completar y Descontar Inventario</Button>
          </div>
        </form>
      </div>
    );
  }

  return null;
}
