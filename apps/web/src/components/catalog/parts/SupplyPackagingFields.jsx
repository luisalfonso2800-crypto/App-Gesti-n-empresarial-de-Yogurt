/**
 * @file SupplyPackagingFields.jsx
 * @module components/catalog/parts
 * @description Bloque de selección de Unidad Base y Contenido por Empaque con pleca divisoria (< 140 líneas).
 */
import React from 'react';
import SmartSelect from '@/components/ui/inputs/SmartSelect';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../supply-modal.module.css';
import { UNIDAD_BASE_OPTIONS, UNIT_NAMES } from './supplyConstants';

export function SupplyPackagingFields({
  formData,
  handleChange,
  isEmpaqueOk,
  isUnidadBaseOk,
  isUnidadBaseError
}) {
  const formatContenidoValue = (val) => {
    if (!val) return '';
    const parts = String(val).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join(',');
  };

  const handleContenidoChange = (e) => {
    let clean = e.target.value.replace(/[^0-9,.]/g, '').replace(/,/g, '.');
    const dotCount = (clean.match(/\./g) || []).length;
    if (dotCount > 1) {
      const parts = clean.split('.');
      clean = parts[0] + '.' + parts.slice(1).join('');
    }
    handleChange({ target: { name: 'contenidoReferencial', value: clean } });
  };

  const isFemeninaUnidad = ['und', 'oz'].includes(formData.unidadBase);
  const cuantasPrefix = isFemeninaUnidad ? '¿Cuántas' : '¿Cuántos';
  const nombreCompletoUnidad = UNIT_NAMES[formData.unidadBase] || (formData.unidadBase ? `${formData.unidadBase}s` : 'unidades');

  const empaqueLower = (formData.empaque || '').toLowerCase();
  const esFemeninoEmpaque = ['bolsa', 'caja', 'botella', 'canastilla'].some(e => empaqueLower.includes(e));
  const articuloEmpaque = esFemeninoEmpaque ? 'la' : 'el';
  const empaqueTexto = formData.empaque || 'empaque';

  return (
    <div className={modalStyles.twoColumns}>
      <div className={!isEmpaqueOk ? styles.fieldDisabled : ''}>
        <SmartSelect
          label="Unidad Base"
          name="unidadBase"
          value={formData.unidadBase ?? ''}
          onChange={handleChange}
          options={UNIDAD_BASE_OPTIONS}
          placeholder="Seleccione unidad"
          disabled={!isEmpaqueOk}
          className={isUnidadBaseError ? styles.inputErrorBorder : ''}
        />
        {isUnidadBaseError && <span className={styles.fieldErrorText}>Este campo es requerido</span>}
      </div>

      <div className={`${modalStyles.inputGroup} ${!isUnidadBaseOk ? styles.fieldDisabled : ''}`}>
        <label className={modalStyles.label}>
          {cuantasPrefix} {nombreCompletoUnidad} tiene {articuloEmpaque} {empaqueTexto}? <span className={styles.requiredAsterisk}>*</span>
        </label>
        <div className={`${styles.contentWithUnitContainer} ${!isUnidadBaseOk ? styles.fieldDisabled : ''}`}>
          <input 
            name="contenidoReferencial" 
            type="text"
            value={formatContenidoValue(formData.contenidoReferencial)} 
            onChange={handleContenidoChange} 
            disabled={!isUnidadBaseOk}
            placeholder="Ej: 1.000"
            className={`${modalStyles.input} ${styles.numberRightInput} ${styles.contentWithUnitInput}`} 
          />
          <span className={styles.unitPlecaBadge}>| {formData.unidadBase || 'ud'}</span>
        </div>
      </div>
    </div>
  );
}
