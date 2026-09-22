import React from 'react';
import SmartSelect from '@/components/ui/inputs/SmartSelect';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../supply-modal.module.css';
import { CATEGORIAS_INSUMOS, EMPAQUE_OPTIONS, UNIDAD_BASE_OPTIONS, UNIT_NAMES } from './supplyConstants';
import { SupplyCostAndNotesFields } from './SupplyCostAndNotesFields';
export default function SupplyFormFields({
  formData,
  handleChange,
  rawCostoBase,
  minStockNum,
  isNombreError,
  isCategoriaError,
  isMarcaError,
  isUnidadBaseError,
  isStockMinimoError,
  brands = []
}) {
  const selectedUnitName = UNIT_NAMES[formData.unidadBase] || formData.unidadBase;
  return (
    <>
      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>
          Nombre del Insumo <span className={styles.requiredAsterisk}>*</span>
        </label>
        <input 
          name="nombre" 
          value={formData.nombre ?? ''} 
          onChange={handleChange} 
          placeholder="Ej: LECHE ENTERA"
          className={`${modalStyles.input} ${styles.uppercaseInput} ${isNombreError ? styles.inputErrorBorder : ''}`} 
        />
        {isNombreError && (
          <span className={styles.fieldErrorText}>Este campo es requerido</span>
        )}
      </div>
      <div className={modalStyles.twoColumns}>
        <div>
          <SmartSelect
            label="Categoría"
            name="categoria"
            value={formData.categoria ?? ''}
            onChange={handleChange}
            options={Object.entries(CATEGORIAS_INSUMOS).map(([key, val]) => ({ id: key, label: val.label }))}
            placeholder="Seleccione categoría"
            className={isCategoriaError ? styles.inputErrorBorder : ''}
          />
          {isCategoriaError && (
            <span className={styles.fieldErrorText}>Este campo es requerido</span>
          )}
        </div>
        <SmartSelect label="Subcategora" name="subcategoria" value={formData.subcategoria ?? ''} onChange={handleChange} options={(CATEGORIAS_INSUMOS[formData.categoria]?.subcategorias || []).map(s => ({ id: s, label: s }))} placeholder="Seleccione subcategora" disabled={!formData.categoria} />
      </div>
      <div className={modalStyles.twoColumns}>
        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>
            Marca <span className={styles.requiredAsterisk}>*</span>
          </label>
          <input 
            name="marca" 
            value={formData.marca ?? ''} 
            onChange={handleChange} 
            className={`${modalStyles.input} ${styles.uppercaseInput} ${isMarcaError ? styles.inputErrorBorder : ''}`} 
            list="brands-list"
          />
          <datalist id="brands-list">
            {brands.map(b => (
              <option key={b} value={b} />
            ))}
          </datalist>
          {isMarcaError && (
            <span className={styles.fieldErrorText}>Este campo es requerido</span>
          )}
        </div>
        <SmartSelect label="Empaque" name="empaque" value={formData.empaque ?? ''} onChange={handleChange} options={EMPAQUE_OPTIONS} placeholder="Seleccione empaque" />
        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>
            Contenido por Empaque / Presentacin
          </label>
          <div className={styles.costBaseContainer}>
            <input 
              name="contenidoReferencial" 
              type="number"
              min="0.01"
              step="any"
              value={formData.contenidoReferencial ?? ''} 
              onChange={handleChange} 
              placeholder="Ej: 1000"
              className={`${modalStyles.input} ${styles.numberRightInput}`} 
            />
            {formData.unidadBase && (
              <span className={`${styles.costBaseBadge} ${styles.badgePadded}`}>
                {formData.unidadBase}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className={modalStyles.twoColumns}>
        <div>
          <SmartSelect
            label="Unidad Base"
            name="unidadBase"
            value={formData.unidadBase ?? ''}
            onChange={handleChange}
            options={UNIDAD_BASE_OPTIONS}
            placeholder="Seleccione unidad"
            className={isUnidadBaseError ? styles.inputErrorBorder : ''}
          />
          {isUnidadBaseError && (
            <span className={styles.fieldErrorText}>Este campo es requerido</span>
          )}
        </div>
        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>
            Stock Mínimo <span className={styles.requiredAsterisk}>*</span>
          </label>
          <input 
            name="stockMinimo" 
            value={formData.stockMinimo ?? ''} 
            onChange={handleChange} 
            placeholder="0"
            className={`${modalStyles.input} ${styles.numberRightInput} ${isStockMinimoError ? styles.inputErrorBorder : ''}`} 
          />
          {isStockMinimoError && (
            <span className={styles.fieldErrorText}>Este campo es requerido</span>
          )}
          {formData.stockMinimo && formData.unidadBase && (
            <span className={styles.stockHelperText}>
              *El mínimo {minStockNum === 1 ? 'es' : 'son'} {formData.stockMinimo} {selectedUnitName} para emitir alertas de reabastecimiento.*
            </span>
          )}
        </div>
      </div>
      <SupplyCostAndNotesFields 
        formData={formData} 
        handleChange={handleChange} 
        rawCostoBase={rawCostoBase} 
      />
    </>
  );
}