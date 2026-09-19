/**
 * @file PresentationCapacityFields.jsx
 * @module catalog/presentations/components/modal-parts
 * @description Campos de capacidad (Oz, Ml) y tipo de envase con validación Poka-Yoke.
 * @responsibility Renderizar campos numéricos y select de envase con bordes rojos y microtextos.
 */
import React from 'react';
import SmartSelect from '@/components/ui/inputs/SmartSelect';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../presentation-modal.module.css';

export const TIPO_ENVASE_OPTIONS = [
  { id: 'ENVASE', label: 'ENVASE (Pote / Contenedor Plástico)' },
  { id: 'BOTELLA', label: 'BOTELLA (Bebible)' },
  { id: 'BOLSA', label: 'BOLSA (Flexible / Sachet)' },
  { id: 'VASO', label: 'VASO (Porción individual)' },
  { id: 'BALDE', label: 'BALDE (Granel / Mayorista)' },
  { id: 'PORCIONADO_WIP', label: 'COPITA / POTE AUXILIAR (Semielaborado / Cereal WIP)' },
  { id: 'OTRO', label: 'OTRO' }
];

export function PresentationCapacityFields({
  formData,
  handleChange,
  hasSubmitted,
  isCantidadOzInvalid,
  isCantidadMlInvalid,
  isTipoEnvaseInvalid
}) {
  const isGranel = formData.tipoEnvase === 'BALDE' || formData.tipoEnvase === 'TANQUE_GRANEL';

  return (
    <>
      <div>
        <SmartSelect 
          label="Tipo de Envase" 
          name="tipoEnvase" 
          value={formData.tipoEnvase ?? 'ENVASE'} 
          onChange={handleChange} 
          options={TIPO_ENVASE_OPTIONS} 
          required 
          placeholder="Seleccione envase" 
          className={hasSubmitted && isTipoEnvaseInvalid ? styles.inputErrorBorder : ''} 
        />
        {hasSubmitted && isTipoEnvaseInvalid && <span className={styles.fieldErrorText}>Este campo es requerido</span>}
      </div>
      {formData.tipoEnvase === 'PORCIONADO_WIP' ? (
        <p className={styles.helperText}>💡 Usa este envase auxiliar para copitas de cereal, toppings o cucharitas que la planta prepara antes del envasado final.</p>
      ) : (
        <p className={styles.helperText}>Elige la forma física del producto. Aparecerá en las órdenes de producción y etiquetas de venta.</p>
      )}

      {isGranel ? (
        <>
          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.label}>Unidad de Medida Base</label>
            <select
              name="unidadMedida"
              value={formData.unidadMedida ?? 'L'}
              onChange={handleChange}
              className={modalStyles.input}
            >
              <option value="L">Litros (L) - Bases Líquidas / Tanque</option>
              <option value="kg">Kilogramos (kg) - Jaleas / Dulces / Marmita</option>
              <option value="g">Gramos (g) - Porcionados / Copitas</option>
              <option value="und">Unidades (und) - Piezas / Empaques auxiliares</option>
            </select>
          </div>
          <div className={styles.bulkInfoCard}>
            <span className={styles.bulkInfoIcon}>💡</span>
            <div className={styles.bulkInfoContent}>
              <strong>Formato a Granel / Tanque:</strong> La capacidad se controlará en <strong>{formData.unidadMedida === 'kg' ? 'Kilogramos (kg)' : formData.unidadMedida === 'g' ? 'Gramos (g)' : formData.unidadMedida === 'und' ? 'Unidades (und)' : 'Litros (L)'}</strong> en cada bache de producción.
            </div>
          </div>
        </>
      ) : (
        <div className={modalStyles.twoColumns}>
          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.label}>Cantidad (Oz) <span className={styles.requiredAsterisk}>*</span></label>
            <input 
              name="cantidadOz" 
              type="text" 
              inputMode="decimal" 
              value={formData.cantidadOz ? String(formData.cantidadOz).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''} 
              onChange={e => handleChange({ target: { name: 'cantidadOz', value: e.target.value.replace(/\D/g, '') } })} 
              onKeyDown={e => e.key === '-' && e.preventDefault()} 
              placeholder="0" 
              className={`${modalStyles.input} ${hasSubmitted && isCantidadOzInvalid ? styles.inputErrorBorder : ''}`} 
              required 
            />
            {hasSubmitted && isCantidadOzInvalid && <span className={styles.fieldErrorText}>Este campo es requerido</span>}
          </div>
          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.label}>Cantidad (Ml) <span className={styles.requiredAsterisk}>*</span></label>
            <input 
              name="cantidadMl" 
              type="text" 
              inputMode="decimal" 
              value={formData.cantidadMl ? String(formData.cantidadMl).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''} 
              onChange={e => handleChange({ target: { name: 'cantidadMl', value: e.target.value.replace(/\D/g, '') } })} 
              onKeyDown={e => e.key === '-' && e.preventDefault()} 
              placeholder="0" 
              className={`${modalStyles.input} ${hasSubmitted && isCantidadMlInvalid ? styles.inputErrorBorder : ''}`} 
              required 
            />
            {hasSubmitted && isCantidadMlInvalid && <span className={styles.fieldErrorText}>Este campo es requerido</span>}
          </div>
        </div>
      )}
    </>
  );
}
