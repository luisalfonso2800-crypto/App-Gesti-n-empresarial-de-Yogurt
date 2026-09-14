/**
 * @file ExpenseFormModal.jsx
 * @module commercial/expenses/components
 * @description Modal y formulario para captura de gastos operativos (SRP + CSS Modules).
 * @responsibility Presentar campos de periodo, categoría, valor en pesos con desglose y persistencia.
 * @usedBy apps/web/src/app/commercial/expenses/page.jsx
 * @dependencies react, @/components/ui/SmartModal, @/components/ui/inputs/SmartSelect, @/lib/formatters, @/utils/numberToWords
 */
import React from 'react';
import SmartModal, { SubmitButton } from '@/components/ui/SmartModal';
import SmartSelect from '@/components/ui/inputs/SmartSelect';
import { formatCurrency } from '@/lib/formatters';
import { montoATextoPesos } from '@/utils/numberToWords';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../expenses.module.css';

const CATEGORIAS_GASTOS = [
  { id: 'SERVICIOS_PUBLICOS', label: 'Servicios Públicos' },
  { id: 'NOMINA', label: 'Nómina' },
  { id: 'MANTENIMIENTO', label: 'Mantenimiento' },
  { id: 'ALQUILER', label: 'Alquiler' },
  { id: 'TRANSPORTE', label: 'Transporte / Fletes' },
  { id: 'OTROS', label: 'Otros Gastos' }
];

const TIPOS_GASTO = [
  { id: 'OPERATIVO', label: 'Operativo' },
  { id: 'ADMINISTRATIVO', label: 'Administrativo' },
  { id: 'VENTAS', label: 'Ventas y Marketing' },
  { id: 'FINANCIERO', label: 'Financiero' }
];

export default function ExpenseFormModal({
  isOpen,
  onClose,
  formData,
  isSubmitting,
  submitError,
  isDirty,
  isSubmitDisabled,
  submitTitle,
  handleChange,
  handleSubmit
}) {
  const cleanNumericVal = formData.valor ? parseInt(String(formData.valor).replace(/\D/g, ''), 10) : 0;

  return (
    <SmartModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Nuevo Gasto"
      isDirty={isDirty}
      isSubmitting={isSubmitting}
    >
      {submitError && (
        <div className={styles.errorMessage}>
          <span>⚠️</span>
          <span>{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={modalStyles.twoColumns}>
          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.label}>
              Fecha <span className={styles.requiredAsterisk}>*</span>
            </label>
            <input 
              name="fecha" 
              type="date"
              value={formData.fecha} 
              onChange={handleChange} 
              className={modalStyles.input} 
              required 
            />
          </div>
          
          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.label}>
              Periodo <span className={styles.requiredAsterisk}>*</span>
            </label>
            <input 
              name="periodo" 
              value={formData.periodo} 
              onChange={handleChange} 
              placeholder="Ej: ENERO 2026"
              className={`${modalStyles.input} ${styles.uppercaseInput}`} 
              required 
            />
          </div>
        </div>

        <div className={modalStyles.twoColumns}>
          <SmartSelect
            label="Categoría"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            options={CATEGORIAS_GASTOS}
            required
            placeholder="Seleccione categoría"
          />
          
          <SmartSelect
            label="Tipo de Gasto"
            name="tipoGasto"
            value={formData.tipoGasto}
            onChange={handleChange}
            options={TIPOS_GASTO}
            required
          />
        </div>

        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>
            Descripción <span className={styles.requiredAsterisk}>*</span>
          </label>
          <input 
            name="descripcion" 
            value={formData.descripcion} 
            onChange={handleChange} 
            placeholder="DESCRIPCIÓN DEL GASTO"
            className={`${modalStyles.input} ${styles.uppercaseInput}`} 
            required 
          />
        </div>

        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>
            Valor ($) <span className={styles.requiredAsterisk}>*</span>
          </label>
          <input
            name="valor"
            type="text"
            inputMode="numeric"
            min="0"
            placeholder="0"
            value={formData.valor ? String(formData.valor).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, '');
              handleChange({ target: { name: 'valor', value: raw } });
            }}
            onKeyDown={(e) => {
              if (e.key === '-') e.preventDefault();
            }}
            className={modalStyles.input}
            required
          />
          {cleanNumericVal > 0 && (
            <span className={styles.amountWordsBadge}>
              ✦ {montoATextoPesos(cleanNumericVal)}
            </span>
          )}
        </div>

        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>Observaciones</label>
          <textarea 
            name="observaciones" 
            value={formData.observaciones} 
            onChange={handleChange} 
            className={`${modalStyles.input} ${styles.textareaObservations}`} 
          />
        </div>

        {formData.categoria && formData.descripcion && formData.valor && (
          <div className={styles.summaryBanner}>
            <strong>Resumen:</strong> Se registrará un gasto de <strong>{formData.categoria.replace('_', ' ')}</strong> por un valor de <strong>{formatCurrency(formData.valor)}</strong>, clasificado como gasto <strong>{formData.tipoGasto ? formData.tipoGasto.toLowerCase() : 'operativo'}</strong> para el periodo de <strong>{formData.periodo || 'no especificado'}</strong>.
          </div>
        )}

        <div className={modalStyles.actions}>
          <button 
            type="button" 
            onClick={onClose}
            className={modalStyles.btnCancel}
          >
            Cancelar
          </button>
          <SubmitButton 
            isSubmitting={isSubmitting} 
            text="Guardar Gasto"
            disabled={isSubmitDisabled}
            title={submitTitle}
            className={isSubmitDisabled ? styles.btnSubmitDisabled : ''}
          />
        </div>
      </form>
    </SmartModal>
  );
}
