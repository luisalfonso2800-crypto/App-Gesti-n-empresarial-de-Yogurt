/**
 * @file GlobalInventoryAdjustmentModal.jsx
 * @module operations/inventory/components
 * @description Modal declarativo para carga de saldo inicial y ajustes globales de inventario en frío (SRP + CSS Modules).
 * @responsibility Orquestar el diálogo visual y delegar estados en useInventoryAdjustmentForm y subcomponentes.
 * @usedBy apps/web/src/app/operations/inventory/page.jsx
 * @dependencies react, @/components/ui/SmartModal, @/components/ui/inputs/SmartSelect, ./modal-parts/InventoryAdjustmentFields, ./modal-parts/useInventoryAdjustmentForm
 */
import React from 'react';
import SmartModal, { SubmitButton } from '@/components/ui/SmartModal';
import SmartSelect from '@/components/ui/inputs/SmartSelect';
import { formatCurrency } from '@/lib/formatters';
import { montoATextoPesos } from '@/utils/numberToWords';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from './adjustment-modal.module.css';
import InventoryAdjustmentFields from './modal-parts/InventoryAdjustmentFields';
import { useInventoryAdjustmentForm } from './modal-parts/useInventoryAdjustmentForm';

const TIPO_LABEL_MAP = {
  CARGA_INICIAL: 'Saldo Inicial (+)',
  AJUSTE_POSITIVO: 'Ajuste Positivo (+)',
  AJUSTE_NEGATIVO: 'Ajuste Negativo (-)',
  MERMA_DESPERDICIO: 'Merma / Desperdicio (-)'
};

export function GlobalInventoryAdjustmentModal({ isOpen, onClose, onSuccess }) {
  const {
    supplies,
    loadingSupplies,
    idInsumo,
    setIdInsumo,
    tipo,
    setTipo,
    cantidad,
    setCantidad,
    costoUnitario,
    setCostoUnitario,
    motivo,
    setMotivo,
    isSubmitting,
    errorMessage,
    selectedInsumo,
    unidadBase,
    isCostRequired,
    numericQty,
    numericCost,
    isDirty,
    isSubmitDisabled,
    submitTitle,
    handleSubmit,
    hasSubmitted,
    isInsumoMissing,
    isCantidadMissing,
    isCostoMissing,
    isMotivoMissing
  } = useInventoryAdjustmentForm({ isOpen, onClose, onSuccess });

  return (
    <SmartModal
      isOpen={isOpen}
      onClose={onClose}
      title="Saldo Inicial / Ajuste Global de Inventario"
      isDirty={isDirty}
      isSubmitting={isSubmitting}
    >
      {errorMessage && (
        <div className={styles.errorMessage}>
          <span>⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <SmartSelect
          label="Insumo a Ajustar"
          name="idInsumo"
          value={idInsumo}
          onChange={(e) => setIdInsumo(e.target.value)}
          options={supplies.map(s => ({
            id: s.id,
            label: s.nombre,
            subtext: `${s.unidadBase}${s.categoria ? ` - ${s.categoria}` : ''}`
          }))}
          required
          placeholder={loadingSupplies ? 'Cargando insumos...' : 'Seleccione un insumo del catálogo'}
          error={hasSubmitted && isInsumoMissing ? 'Seleccione un insumo del catálogo' : undefined}
        />

        <InventoryAdjustmentFields
          tipo={tipo}
          setTipo={setTipo}
          cantidad={cantidad}
          setCantidad={setCantidad}
          costoUnitario={costoUnitario}
          setCostoUnitario={setCostoUnitario}
          motivo={motivo}
          setMotivo={setMotivo}
          selectedInsumo={selectedInsumo}
          unidadBase={unidadBase}
          isCostRequired={isCostRequired}
          hasSubmitted={hasSubmitted}
          isCantidadMissing={isCantidadMissing}
          isCostoMissing={isCostoMissing}
          isMotivoMissing={isMotivoMissing}
        />

        {selectedInsumo && numericQty > 0 && (
          <div className={styles.summaryBox}>
            <strong>Resumen:</strong> Se registrarán <strong>{numericQty} {unidadBase}</strong> de <strong>{selectedInsumo.nombre}</strong>
            {isCostRequired && numericCost > 0 ? (
              <> con costo unitario de <strong>{formatCurrency(numericCost)}</strong> ({montoATextoPesos(numericCost)})</>
            ) : null} bajo el concepto de <strong>{TIPO_LABEL_MAP[tipo] || tipo}</strong>.
          </div>
        )}

        <div className={styles.actionsRow}>
          <button
            type="button"
            onClick={onClose}
            className={modalStyles.btnCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <SubmitButton
            isSubmitting={isSubmitting}
            text="Guardar Ajuste"
            disabled={isSubmitDisabled}
            title={submitTitle}
            className={isSubmitDisabled ? styles.btnSubmitDisabled : ''}
          />
        </div>
      </form>
    </SmartModal>
  );
}
