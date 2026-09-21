/**
 * @file ExpensePeriodAndCategoryFields.jsx
 * @module commercial/expenses/components/modal-parts
 * @description Campos de Fecha, Periodo, Categoría y Tipo de Gasto con validación Poka-Yoke.
 * @responsibility Renderizar los selectores y entradas de clasificación temporal y contable del gasto.
 * @usedBy apps/web/src/app/commercial/expenses/components/ExpenseFormModal.jsx
 * @dependencies react, @/components/ui/inputs/SmartSelect, @/components/ui/SmartModal.module.css
 */
import React from 'react';
import SmartSelect from '@/components/ui/inputs/SmartSelect';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../../expenses.module.css';

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

export default function ExpensePeriodAndCategoryFields({
  formData,
  handleChange,
  hasSubmitted = false
}) {
  const isFechaInvalid = hasSubmitted && !formData.fecha;
  const isPeriodoInvalid = hasSubmitted && !formData.periodo?.trim();
  const isCategoriaInvalid = hasSubmitted && !formData.categoria;
  const isTipoGastoInvalid = hasSubmitted && !formData.tipoGasto;

  return (
    <>
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
            className={`${modalStyles.input} ${isFechaInvalid ? styles.inputErrorBorder : ''}`} 
            required 
          />
          {isFechaInvalid && (
            <span className={styles.fieldErrorText}>La fecha del gasto es requerida</span>
          )}
        </div>
        
        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>
            Periodo Contable <span className={styles.requiredAsterisk}>*</span>
          </label>
          <input 
            name="periodo" 
            value={formData.periodo} 
            onChange={handleChange} 
            placeholder="SELECCIONE FECHA"
            className={`${modalStyles.input} ${styles.uppercaseInput} ${isPeriodoInvalid ? styles.inputErrorBorder : ''}`} 
            required 
            readOnly
            title="Autocalculado a partir de la fecha seleccionada"
          />
          {isPeriodoInvalid && (
            <span className={styles.fieldErrorText}>El periodo es requerido</span>
          )}
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
          error={isCategoriaInvalid ? 'Seleccione una categoría' : undefined}
        />
        
        <SmartSelect
          label="Tipo de Gasto"
          name="tipoGasto"
          value={formData.tipoGasto}
          onChange={handleChange}
          options={TIPOS_GASTO}
          required
          error={isTipoGastoInvalid ? 'Seleccione el tipo de gasto' : undefined}
        />
      </div>
    </>
  );
}
