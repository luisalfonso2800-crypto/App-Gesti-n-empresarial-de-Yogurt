/**
 * @file ProductionModal.jsx
 * @module operations/production/components
 * @description Vistas de creación y cerrado de órdenes de producción con proyección de vencimiento y trazabilidad de Lote Padre WIP.
 * @responsibility Mostrar form correspondiente (simulación BOM, selección de lote padre semielaborado y reporte físico).
 * @usedBy apps/web/src/app/operations/production/page.jsx
 * @dependencies @/components/ui/Button, styles local, lucide-react
 */
import React from 'react';
import { Button } from '@/components/ui/Button';
import { AlertCircle, CheckCircle2, Layers } from 'lucide-react';
import styles from '../production.module.css';

export function ProductionModal({
  view,
  recipes = [],
  selectedRecipeId = '',
  setSelectedRecipeId,
  selectedRecipe = null,
  cantidadPlanificada = 1,
  setCantidadPlanificada,
  fechaProduccion = '',
  setFechaProduccion,
  fechaVencimiento = '',
  setFechaVencimiento,
  completeFechaVencimiento = '',
  setCompleteFechaVencimiento,
  variantGroups = [],
  selectedVariants = {},
  handleVariantChange,
  bomSimulado = [],
  completeDetalles = [],
  setCompleteDetalles,
  onSubmitCreate,
  onSubmitComplete,
  onClose,
  // Parent lot props
  availableParentLots = [],
  selectedParentLotId = '',
  setSelectedParentLotId,
  selectedParentLot = null,
  currentWipItem = null,
  parentLotsLoading = false,
  completeSelectedParentLotId = '',
  setCompleteSelectedParentLotId
}) {
  // Validación preventiva: fechaVencimiento no puede ser anterior ni igual a la fechaProduccion
  const isVencimientoValid = Boolean(
    fechaProduccion &&
    fechaVencimiento &&
    new Date(fechaVencimiento).getTime() > new Date(fechaProduccion).getTime()
  );

  // Validación de stock de Base Blanca WIP si aplica
  const hasWipRequirement = Boolean(currentWipItem);
  const wipSufficient = hasWipRequirement
    ? Boolean(selectedParentLot && Number(selectedParentLot.cantidadDisponible) >= Number(currentWipItem.requeridoTeorico))
    : true;

  const isFormValid = Boolean(
    selectedRecipeId &&
    Number(cantidadPlanificada) > 0 &&
    isVencimientoValid &&
    bomSimulado.length > 0 &&
    !bomSimulado.some(b => !b.ok) &&
    (!hasWipRequirement || (selectedParentLotId && wipSufficient))
  );

  // Formateo humano de fecha de vencimiento para la cápsula Poka-Yoke
  const fechaVencimientoFormateada = fechaVencimiento
    ? new Date(fechaVencimiento + 'T00:00:00').toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    : '';

  const productoNombre = selectedRecipe?.producto?.nombre || selectedRecipe?.nombre || 'Producto';
  const unidadMedida = selectedRecipe?.unidadRendimiento || 'und';

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
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#57534e', marginBottom: '0.5rem' }}>
                Receta a Producir
              </label>
              <select className={styles.select} value={selectedRecipeId} onChange={e => setSelectedRecipeId(e.target.value)} required>
                <option value="">Seleccione una receta...</option>
                {recipes.filter(r => r.activo).map(r => (
                  <option key={r.id} value={r.id}>{r.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#57534e', marginBottom: '0.5rem' }}>
                Cantidad a Producir (Unidades Finales)
              </label>
              <input 
                className={styles.input} 
                type="number" 
                step="0.01" 
                min="0.01"
                placeholder="0.00"
                value={cantidadPlanificada} 
                onChange={e => setCantidadPlanificada(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className={styles.grid2}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#57534e', marginBottom: '0.5rem' }}>
                Fecha de Fabricación Programada
              </label>
              <input 
                className={styles.input} 
                type="date" 
                value={fechaProduccion} 
                onChange={e => setFechaProduccion(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#57534e', marginBottom: '0.5rem' }}>
                FECHA DE VENCIMIENTO DEL LOTE
              </label>
              <input 
                className={styles.input} 
                type="date" 
                min={fechaProduccion || undefined}
                value={fechaVencimiento} 
                onChange={e => setFechaVencimiento(e.target.value)} 
                required 
              />
              {!isVencimientoValid && fechaVencimiento && (
                <span style={{ display: 'block', marginTop: '0.25rem', fontSize: '0.75rem', color: '#dc2626', fontWeight: 500 }}>
                  La fecha de vencimiento debe ser posterior a la fecha de fabricación.
                </span>
              )}
            </div>
          </div>

          {/* Subsección de Lote Padre WIP si la receta consume producto semielaborado */}
          {hasWipRequirement && (
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Layers size={18} style={{ color: '#0369a1' }} />
                <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0369a1', fontWeight: 600 }}>
                  ORIGEN DE MATERIA PRIMA INTERMEDIA (BASE EN TANQUE)
                </h4>
              </div>
              <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.825rem', color: '#64748b' }}>
                Esta receta requiere <strong>{Number(currentWipItem.requeridoTeorico).toFixed(2)} {currentWipItem.unidad}</strong> de base semielaborada ({currentWipItem.nombreInsumo}).
              </p>

              {parentLotsLoading ? (
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Consultando tanques y cavas de base...</p>
              ) : availableParentLots.length === 0 ? (
                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px', padding: '0.75rem', color: '#991b1b', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={16} />
                  <span>Stock insuficiente de Base Blanca en planta. Debe fabricar primero un lote de base.</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                    Seleccionar Tanque / Lote Padre Activo:
                  </label>
                  <select 
                    className={styles.select} 
                    value={selectedParentLotId} 
                    onChange={e => setSelectedParentLotId(e.target.value)}
                    required
                  >
                    {availableParentLots.map(l => (
                      <option key={l.id} value={l.id}>
                        Lote: {l.id.split('-')[0].toUpperCase()} — Disponible: {Number(l.cantidadDisponible).toFixed(2)} {l.unidad} (Fabricado: {new Date(l.fechaProduccion).toLocaleDateString()})
                      </option>
                    ))}
                  </select>

                  {!wipSufficient && selectedParentLot && (
                    <span style={{ fontSize: '0.775rem', color: '#dc2626', fontWeight: 600 }}>
                      El lote seleccionado solo tiene {Number(selectedParentLot.cantidadDisponible).toFixed(2)} {selectedParentLot.unidad} y se requieren {Number(currentWipItem.requeridoTeorico).toFixed(2)} {currentWipItem.unidad}.
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Cápsula Resumen Poka-Yoke */}
          {selectedRecipe && isVencimientoValid && (
            <div className={styles.pokaYokeCapsule}>
              <CheckCircle2 size={20} style={{ flexShrink: 0, color: '#16a34a' }} />
              <div>
                <strong>Resumen de Control: </strong>
                <span>
                  Se programará la producción de {Number(cantidadPlanificada)} {unidadMedida} de {productoNombre} con lote proyectado a vencer el {fechaVencimientoFormateada}.
                </span>
                {hasWipRequirement && selectedParentLot && (
                  <div style={{ marginTop: '0.25rem', fontSize: '0.85rem', color: '#15803d' }}>
                    Se consumirán {Number(currentWipItem.requeridoTeorico).toFixed(2)} {currentWipItem.unidad} del lote padre {selectedParentLot.id.split('-')[0].toUpperCase()}.
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedRecipe && !isVencimientoValid && fechaVencimiento && (
            <div className={styles.pokaYokeAlert}>
              <AlertCircle size={20} style={{ flexShrink: 0, color: '#dc2626' }} />
              <div>
                <strong>Bloqueo Preventivo: </strong>
                <span>
                  La fecha de vencimiento asignada ({fechaVencimiento}) no es válida para la fecha de fabricación programada ({fechaProduccion}).
                </span>
              </div>
            </div>
          )}

          {variantGroups.length > 0 && (
            <div>
              <h3 className={styles.sectionTitle}>Variantes Opcionales</h3>
              <div className={styles.grid3}>
                {variantGroups.map(vg => (
                  <div key={vg}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
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
                    <th>Insumo / Semielaborado</th>
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
                      <td>
                        <strong>{b.nombreInsumo}</strong>
                        {b.esProductoIntermedio && (
                          <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                            WIP
                          </span>
                        )}
                      </td>
                      <td>{Number(b.requeridoTeorico).toFixed(2)} {b.unidad}</td>
                      <td>{Number(b.stockActual).toFixed(2)} {b.unidad}</td>
                      <td className={b.faltante > 0 ? styles.missingText : ''}>{Number(b.faltante).toFixed(2)}</td>
                      <td className={b.ok ? styles.okText : styles.missingText}>{b.ok ? 'OK' : 'FALTANTE'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className={styles.formActions}>
            <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button 
              type="submit" 
              disabled={!isFormValid}
              style={{
                opacity: !isFormValid ? 0.5 : 1,
                cursor: !isFormValid ? 'not-allowed' : 'pointer'
              }}
            >
              Registrar Orden y Tomar Snapshot
            </Button>
          </div>
        </form>
      </div>
    );
  }

  if (view === 'complete') {
    const intermediateDetail = completeDetalles.find(d => d.idProductoIntermedio);

    return (
      <div className={styles.editorContainer}>
        <div className={styles.headerTitle}>
          <h2 className={styles.title}>Cierre de Producción</h2>
          <p className={styles.subtitle}>Reporte el consumo real de materiales. El inventario se descontará con base en el consumo físico reportado.</p>
          <Button variant="secondary" onClick={onClose} style={{ width: 'fit-content', marginTop: '1rem' }}>Volver</Button>
        </div>

        <form onSubmit={onSubmitComplete}>
          <div style={{ marginBottom: '1.5rem', maxWidth: '400px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#57534e', marginBottom: '0.5rem' }}>
              FECHA DE VENCIMIENTO CONFIRMADA DEL LOTE
            </label>
            <input 
              className={styles.input} 
              type="date" 
              value={completeFechaVencimiento} 
              onChange={e => setCompleteFechaVencimiento(e.target.value)} 
              required 
            />
          </div>

          {intermediateDetail && availableParentLots.length > 0 && (
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '1rem', marginBottom: '1.5rem', maxWidth: '500px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#166534', marginBottom: '0.5rem' }}>
                CONFIRMAR LOTE PADRE DE BASE BLANCA (WIP):
              </label>
              <select 
                className={styles.select} 
                value={completeSelectedParentLotId} 
                onChange={e => setCompleteSelectedParentLotId(e.target.value)}
                required
              >
                {availableParentLots.map(l => (
                  <option key={l.id} value={l.id}>
                    Lote: {l.id.split('-')[0].toUpperCase()} — Saldo: {Number(l.cantidadDisponible).toFixed(2)} {l.unidad}
                  </option>
                ))}
              </select>
            </div>
          )}

          <table className={styles.bomTable}>
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
                if (diff > 0) diffClass = styles.mermaDanger;
                else if (diff < 0) diffClass = styles.mermaSuccess;
                else diffClass = styles.okText;

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
