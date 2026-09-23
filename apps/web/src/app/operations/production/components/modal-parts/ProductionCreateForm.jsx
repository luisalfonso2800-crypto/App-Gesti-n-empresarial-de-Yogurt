/**
 * @file ProductionCreateForm.jsx
 * @module operations/production/components/modal-parts
 * @description Formulario para crear una nueva orden de producción con simulación BOM y trazabilidad WIP.
 * @responsibility Orquestar subcomponentes de receta, fechas, lote WIP y BOM; gestionar validación del formulario.
 * @usedBy apps/web/src/app/operations/production/components/ProductionModal.jsx
 */

import React from 'react';
import { Button } from '@/components/ui/Button';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import baseStyles from '../production.module.css';
import styles from '../production-modal.module.css';
import { RecipeSelectorFields } from './RecipeSelectorFields';
import { DateConfigFields } from './DateConfigFields';
import { WipParentLotSelector } from './WipParentLotSelector';
import { BomSimuladoTable } from './BomSimuladoTable';

export function ProductionCreateForm({
  recipes = [], selectedRecipeId = '', setSelectedRecipeId, selectedRecipe = null,
  cantidadPlanificada = 1, setCantidadPlanificada,
  fechaProduccion = '', setFechaProduccion, fechaVencimiento = '', setFechaVencimiento,
  variantGroups = [], selectedVariants = {}, handleVariantChange,
  bomSimulado = [], onSubmitCreate, onClose,
  availableParentLots = [], selectedParentLotId = '', setSelectedParentLotId,
  selectedParentLot = null, currentWipItem = null, parentLotsLoading = false
}) {
  const isVencimientoValid = Boolean(
    fechaProduccion && fechaVencimiento &&
    new Date(fechaVencimiento).getTime() > new Date(fechaProduccion).getTime()
  );

  const hasWipRequirement = Boolean(currentWipItem);
  const wipSufficient = hasWipRequirement
    ? Boolean(selectedParentLot && Number(selectedParentLot.cantidadDisponible) >= Number(currentWipItem.requeridoTeorico))
    : true;

  const isFormValid = Boolean(
    selectedRecipeId && Number(cantidadPlanificada) > 0 && isVencimientoValid &&
    bomSimulado.length > 0 && !bomSimulado.some(b => !b.ok) &&
    (!hasWipRequirement || (selectedParentLotId && wipSufficient))
  );

  const fechaVencimientoFormateada = fechaVencimiento
    ? new Date(fechaVencimiento + 'T00:00:00').toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })
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
        <RecipeSelectorFields
          recipes={recipes} selectedRecipeId={selectedRecipeId} setSelectedRecipeId={setSelectedRecipeId}
          cantidadPlanificada={cantidadPlanificada} setCantidadPlanificada={setCantidadPlanificada}
        />

        <DateConfigFields
          fechaProduccion={fechaProduccion} setFechaProduccion={setFechaProduccion}
          fechaVencimiento={fechaVencimiento} setFechaVencimiento={setFechaVencimiento}
          isVencimientoValid={isVencimientoValid}
        />

        {hasWipRequirement && (
          <WipParentLotSelector
            currentWipItem={currentWipItem} availableParentLots={availableParentLots}
            selectedParentLotId={selectedParentLotId} setSelectedParentLotId={setSelectedParentLotId}
            selectedParentLot={selectedParentLot} wipSufficient={wipSufficient}
            parentLotsLoading={parentLotsLoading}
          />
        )}

        {/* Cápsula Resumen Poka-Yoke — éxito */}
        {selectedRecipe && isVencimientoValid && (
          <div className={baseStyles.pokaYokeCapsule}>
            <CheckCircle2 size={20} className={styles.pokaYokeIconSuccess} />
            <div>
              <strong>Resumen de Control: </strong>
              <span>Se programará la producción de {Number(cantidadPlanificada)} {unidadMedida} de {productoNombre} con lote proyectado a vencer el {fechaVencimientoFormateada}.</span>
              {hasWipRequirement && selectedParentLot && (
                <div className={styles.pokaYokeWipConsumeInfo}>
                  Se consumirán {Number(currentWipItem.requeridoTeorico).toFixed(2)} {currentWipItem.unidad} del lote padre {selectedParentLot.id.split('-')[0].toUpperCase()}.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cápsula Poka-Yoke — bloqueo por fecha inválida */}
        {selectedRecipe && !isVencimientoValid && fechaVencimiento && (
          <div className={baseStyles.pokaYokeAlert}>
            <AlertCircle size={20} className={styles.pokaYokeIconError} />
            <div>
              <strong>Bloqueo Preventivo: </strong>
              <span>La fecha de vencimiento ({fechaVencimiento}) no es válida para la fecha de fabricación programada ({fechaProduccion}).</span>
            </div>
          </div>
        )}

        {/* Variantes opcionales */}
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

        {bomSimulado.length > 0 && <BomSimuladoTable bomSimulado={bomSimulado} />}

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
