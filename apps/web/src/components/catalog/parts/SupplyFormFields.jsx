/**
 * @file SupplyFormFields.jsx
 * @module components/catalog/parts
 * @description Orquestador de campos del formulario con flujo en cascada Poka-Yoke (< 140 líneas).
 */
import React from 'react';
import SmartSelect from '@/components/ui/inputs/SmartSelect';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../supply-modal.module.css';
import { CATEGORIAS_INSUMOS, EMPAQUE_OPTIONS, UNIT_NAMES } from './supplyConstants';
import { SupplyPackagingFields } from './SupplyPackagingFields';
import { SupplyStockAndCostFields } from './SupplyStockAndCostFields';
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
  const isNombreOk = Boolean(formData.nombre?.trim());
  const isCategoriaOk = Boolean(formData.categoria);
  const isSubcategoriaOk = Boolean(formData.subcategoria);
  const isEmpaqueOk = Boolean(formData.empaque);
  const isUnidadBaseOk = Boolean(formData.unidadBase);
  const isContenidoOk = Boolean(formData.contenidoReferencial && parseFloat(formData.contenidoReferencial) > 0);

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
        {isNombreError && <span className={styles.fieldErrorText}>Este campo es requerido</span>}
      </div>

      <div className={modalStyles.twoColumns}>
        <div className={!isNombreOk ? styles.fieldDisabled : ''}>
          <SmartSelect
            label="Categoría"
            name="categoria"
            value={formData.categoria ?? ''}
            onChange={handleChange}
            options={Object.entries(CATEGORIAS_INSUMOS).map(([key, val]) => ({ id: key, label: val.label }))}
            placeholder="Seleccione categoría"
            disabled={!isNombreOk}
            className={isCategoriaError ? styles.inputErrorBorder : ''}
          />
          {isCategoriaError && <span className={styles.fieldErrorText}>Este campo es requerido</span>}
        </div>
        <div className={!isCategoriaOk ? styles.fieldDisabled : ''}>
          <SmartSelect
            label="Subcategoría"
            name="subcategoria"
            value={formData.subcategoria ?? ''}
            onChange={handleChange}
            options={(CATEGORIAS_INSUMOS[formData.categoria]?.subcategorias || []).map(s => ({ id: s, label: s }))}
            placeholder="Seleccione subcategoría"
            disabled={!isCategoriaOk}
          />
        </div>
      </div>

      <div className={modalStyles.twoColumns}>
        <div className={`${modalStyles.inputGroup} ${!isSubcategoriaOk ? styles.fieldDisabled : ''}`}>
          <label className={modalStyles.label}>
            Marca <span className={styles.requiredAsterisk}>*</span>
          </label>
          <input 
            name="marca" 
            value={formData.marca ?? ''} 
            onChange={handleChange} 
            disabled={!isSubcategoriaOk}
            className={`${modalStyles.input} ${styles.uppercaseInput} ${isMarcaError ? styles.inputErrorBorder : ''}`} 
            list="brands-list"
          />
          <datalist id="brands-list">
            {brands.map(b => (<option key={b} value={b} />))}
          </datalist>
          {isMarcaError && <span className={styles.fieldErrorText}>Este campo es requerido</span>}
        </div>
        <div className={!isSubcategoriaOk ? styles.fieldDisabled : ''}>
          <SmartSelect
            label="Empaque"
            name="empaque"
            value={formData.empaque ?? ''}
            onChange={handleChange}
            options={EMPAQUE_OPTIONS}
            placeholder="Seleccione empaque"
            disabled={!isSubcategoriaOk}
          />
        </div>
      </div>

      <SupplyPackagingFields
        formData={formData}
        handleChange={handleChange}
        isEmpaqueOk={isEmpaqueOk}
        isUnidadBaseOk={isUnidadBaseOk}
        isUnidadBaseError={isUnidadBaseError}
      />

      <SupplyStockAndCostFields
        formData={formData}
        handleChange={handleChange}
        rawCostoBase={rawCostoBase}
        minStockNum={minStockNum}
        selectedUnitName={selectedUnitName}
        isStockMinimoError={isStockMinimoError}
        isContenidoOk={isContenidoOk}
      />

      <div className={!isContenidoOk ? styles.fieldDisabled : ''}>
        <SupplyCostAndNotesFields 
          formData={formData} 
          handleChange={handleChange} 
          disabled={!isContenidoOk}
        />
      </div>
    </>
  );
}