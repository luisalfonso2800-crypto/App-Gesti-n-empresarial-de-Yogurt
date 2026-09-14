/**
 * @file ProductionCreateForm.jsx
 * @module operations/production/components/modal-parts
 * @description Formulario para crear una nueva orden de producción con simulación BOM y trazabilidad WIP.
 * @responsibility Renderizar campos de receta, cantidad, fechas, lote padre WIP y BOM simulado.
 * @usedBy apps/web/src/app/operations/production/components/ProductionModal.jsx
 * @dependencies react, lucide-react, @/components/ui/Button, ../production.module.css, ../production-modal.module.css
 */

import React from 'react';
import { Button } from '@/components/ui/Button';
import { AlertCircle, CheckCircle2, Layers } from 'lucide-react';
import baseStyles from '../production.module.css';
import styles from '../production-modal.module.css';

export function ProductionCreateForm({
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
  variantGroups = [],
  selectedVariants = {},
  handleVariantChange,
  bomSimulado = [],
  onSubmitCreate,
  onClose,
  availableParentLots = [],
  selectedParentLotId = '',
  setSelectedParentLotId,
  selectedParentLot = null,
  currentWipItem = null,
  parentLotsLoading = false
}) {
  const isVencimientoValid = Boolean(
    fechaProduccion &&
    fechaVencimiento &&
    new Date(fechaVencimiento).getTime() > new Date(fechaProduccion).getTime()
  );

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

  const fechaVencimientoFormateada = fechaVencimiento
    ? new Date(fechaVencimiento + 'T00:00:00').toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    : '';

  const productoNombre = selectedRecipe?.producto?.nombre || selectedRecipe?.nombre || 'Producto';
  const unidadMedida = selectedRecipe?.unidadRendimiento || 'und';

  return (
    <div className={baseStyles.editorContainer}>
      <div className={baseStyles.headerTitle}>
        <h2 className={baseStyles.title}>Nueva Orden de Producción</h2>
        <Button variant="secondary" onClick={onClose} className={styles.btnReturn}>Volver</Button>
      </div>
      
      <form onSubmit={onSubmitCreate} className={styles.formFlexColumn}>
        <div className={baseStyles.grid2}>
          <div>
            <label className={styles.label}>Receta a Producir</label>
            <select className={baseStyles.select} value={selectedRecipeId} onChange={e => setSelectedRecipeId(e.target.value)} required>
              <option value="">Seleccione una receta...</option>
              {recipes.filter(r => r.activo).map(r => (
                <option key={r.id} value={r.id}>{r.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={styles.label}>Cantidad a Producir (Unidades Finales)</label>
            <input 
              className={baseStyles.input} 
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

        <div className={baseStyles.grid2}>
          <div>
            <label className={styles.label}>Fecha de Fabricación Programada</label>
            <input 
              className={baseStyles.input} 
              type="date" 
              value={fechaProduccion} 
              onChange={e => setFechaProduccion(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className={styles.label}>FECHA DE VENCIMIENTO DEL LOTE</label>
            <input 
              className={baseStyles.input} 
              type="date" 
              min={fechaProduccion || undefined}
              value={fechaVencimiento} 
              onChange={e => setFechaVencimiento(e.target.value)} 
              required 
            />
            {!isVencimientoValid && fechaVencimiento && (
              <span className={styles.dateErrorText}>
                La fecha de vencimiento debe ser posterior a la fecha de fabricación.
              </span>
            )}
          </div>
        </div>

        {/* Lote Padre WIP */}
        {hasWipRequirement && (
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
        )}

        {/* Cápsula Resumen Poka-Yoke */}
        {selectedRecipe && isVencimientoValid && (
          <div className={baseStyles.pokaYokeCapsule}>
            <CheckCircle2 size={20} className={styles.pokaYokeIconSuccess} />
            <div>
              <strong>Resumen de Control: </strong>
              <span>
                Se programará la producción de {Number(cantidadPlanificada)} {unidadMedida} de {productoNombre} con lote proyectado a vencer el {fechaVencimientoFormateada}.
              </span>
              {hasWipRequirement && selectedParentLot && (
                <div className={styles.pokaYokeWipConsumeInfo}>
                  Se consumirán {Number(currentWipItem.requeridoTeorico).toFixed(2)} {currentWipItem.unidad} del lote padre {selectedParentLot.id.split('-')[0].toUpperCase()}.
                </div>
              )}
            </div>
          </div>
        )}

        {selectedRecipe && !isVencimientoValid && fechaVencimiento && (
          <div className={baseStyles.pokaYokeAlert}>
            <AlertCircle size={20} className={styles.pokaYokeIconError} />
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
            <h3 className={baseStyles.sectionTitle}>Variantes Opcionales</h3>
            <div className={baseStyles.grid3}>
              {variantGroups.map(vg => (
                <div key={vg}>
                  <label className={styles.variantLabel}>
                    <input type="checkbox" checked={!!selectedVariants[vg]} onChange={e => handleVariantChange(vg, e.target.checked)} /> Iniciar con Variante: {vg}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {bomSimulado.length > 0 && (
          <div>
            <h3 className={baseStyles.sectionTitle}>BOM (Lista de Materiales) Escalonado y Disponibilidad</h3>
            <table className={baseStyles.bomTable}>
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
                  <tr key={i} className={b.ok ? baseStyles.okRow : baseStyles.missingRow}>
                    <td>{b.etapa}</td>
                    <td>
                      <strong>{b.nombreInsumo}</strong>
                      {b.esProductoIntermedio && <span className={styles.bomWipBadge}>WIP</span>}
                    </td>
                    <td>{Number(b.requeridoTeorico).toFixed(2)} {b.unidad}</td>
                    <td>{Number(b.stockActual).toFixed(2)} {b.unidad}</td>
                    <td className={b.faltante > 0 ? baseStyles.missingText : ''}>{Number(b.faltante).toFixed(2)}</td>
                    <td className={b.ok ? baseStyles.okText : baseStyles.missingText}>{b.ok ? 'OK' : 'FALTANTE'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className={baseStyles.formActions}>
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={!isFormValid} className={isFormValid ? styles.btnSubmitCreateEnabled : styles.btnSubmitCreateDisabled}>
            Registrar Orden y Tomar Snapshot
          </Button>
        </div>
      </form>
    </div>
  );
}
