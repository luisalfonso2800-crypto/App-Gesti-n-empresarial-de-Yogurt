/**
 * @file SaleGeneralFields.jsx
 * @module commercial/sales/components/modal-parts
 * @description Campos generales de cabecera para la venta: Cliente, Fecha, Canal y Tipo de Pago.
 * @responsibility Renderizar los selectores principales de la transacción comercial.
 * @usedBy apps/web/src/app/commercial/sales/components/SaleModal.jsx
 * @dependencies react, @/components/ui/inputs/SmartSelect, @/components/ui/SmartModal.module.css
 */
import React from 'react';
import SmartSelect from '@/components/ui/inputs/SmartSelect';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../sale-modal.module.css';

const CANAL_OPTIONS = [
  { id: 'DIRECTO', label: 'Venta Directa' },
  { id: 'DISTRIBUIDOR', label: 'Distribuidor' },
  { id: 'INSTITUCIONAL', label: 'Institucional' },
];

const TIPO_PAGO_OPTIONS = [
  { id: 'CONTADO', label: 'Contado' },
  { id: 'CREDITO', label: 'Crédito' },
];

export default function SaleGeneralFields({
  formData,
  handleChange,
  clients,
  hasSubmitted = false,
  isClienteMissing = false,
  isFechaMissing = false
}) {
  return (
    <div className={modalStyles.twoColumns}>
      <SmartSelect
        label="Cliente"
        name="idCliente"
        value={formData.idCliente ?? ''}
        onChange={handleChange}
        required
        options={clients.map(c => ({ id: c.id, label: c.nombre, subtext: c.documento }))}
        error={hasSubmitted && isClienteMissing ? 'Seleccione un cliente para la venta' : undefined}
      />
      
      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>
          Fecha Venta <span className={styles.requiredAsterisk}>*</span>
        </label>
        <input 
          name="fechaVenta" 
          type="date" 
          value={formData.fechaVenta ?? ''} 
          onChange={handleChange} 
          className={`${modalStyles.input} ${hasSubmitted && isFechaMissing ? styles.inputErrorBorder : ''}`} 
          required 
        />
        {hasSubmitted && isFechaMissing && (
          <span className={styles.fieldErrorText}>La fecha de venta es obligatoria</span>
        )}
      </div>

      <SmartSelect
        label="Canal"
        name="canalVenta"
        value={formData.canalVenta ?? ''}
        onChange={handleChange}
        options={CANAL_OPTIONS}
      />

      <SmartSelect
        label="Tipo de Pago"
        name="tipoPago"
        value={formData.tipoPago ?? ''}
        onChange={handleChange}
        options={TIPO_PAGO_OPTIONS}
      />
    </div>
  );
}
