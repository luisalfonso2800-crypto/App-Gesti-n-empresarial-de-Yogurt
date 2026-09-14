/**
 * @file SupplyFormFields.jsx
 * @module components/catalog/parts
 * @description Campos del formulario de insumo (nombre, categoría, marca, empaque, unidad base, stock y costo).
 * @responsibility Renderizar los controles de entrada con clases de CSS Modules sin estilos en línea.
 * @usedBy apps/web/src/components/catalog/SupplyModal.jsx
 * @dependencies react, @/components/ui/inputs/SmartSelect, @/utils/numberToWords
 */
import React from 'react';
import SmartSelect from '@/components/ui/inputs/SmartSelect';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../supply-modal.module.css';
import { CATEGORIAS_INSUMOS, EMPAQUE_OPTIONS, UNIDAD_BASE_OPTIONS, UNIT_NAMES } from './supplyConstants';
import { montoATextoPesos } from '@/utils/numberToWords';

export default function SupplyFormFields({ formData, handleChange, rawCostoBase, minStockNum }) {
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
          className={`${modalStyles.input} ${styles.uppercaseInput}`} 
          required 
        />
      </div>

      <div className={modalStyles.twoColumns}>
        <SmartSelect
          label="Categoría"
          name="categoria"
          value={formData.categoria ?? ''}
          onChange={handleChange}
          options={Object.entries(CATEGORIAS_INSUMOS).map(([key, val]) => ({ id: key, label: val.label }))}
          required
          placeholder="Seleccione categoría"
        />
        
        <SmartSelect
          label="Subcategoría"
          name="subcategoria"
          value={formData.subcategoria ?? ''}
          onChange={handleChange}
          options={(CATEGORIAS_INSUMOS[formData.categoria]?.subcategorias || []).map(s => ({ id: s, label: s }))}
          required
          placeholder="Seleccione subcategoría"
          disabled={!formData.categoria}
        />
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
            className={`${modalStyles.input} ${styles.uppercaseInput}`} 
            required 
          />
        </div>

        <SmartSelect
          label="Empaque"
          name="empaque"
          value={formData.empaque ?? ''}
          onChange={handleChange}
          options={EMPAQUE_OPTIONS}
          placeholder="Seleccione empaque"
        />
      </div>

      <div className={modalStyles.twoColumns}>
        <SmartSelect
          label="Unidad Base"
          name="unidadBase"
          value={formData.unidadBase ?? ''}
          onChange={handleChange}
          options={UNIDAD_BASE_OPTIONS}
          required
          placeholder="Seleccione unidad"
        />

        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>
            Stock Mínimo <span className={styles.requiredAsterisk}>*</span>
          </label>
          <input 
            name="stockMinimo" 
            value={formData.stockMinimo ?? ''} 
            onChange={handleChange} 
            placeholder="0"
            className={`${modalStyles.input} ${styles.numberRightInput}`} 
            required 
          />
          {formData.stockMinimo && formData.unidadBase && (
            <span className={styles.stockHelperText}>
              *El mínimo {minStockNum === 1 ? 'es' : 'son'} {formData.stockMinimo} {selectedUnitName} para emitir alertas de reabastecimiento.*
            </span>
          )}
        </div>
      </div>

      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>Costo Base Referencial ($)</label>
        <div className={styles.costBaseContainer}>
          <input 
            name="costoBase" 
            value={formData.costoBase ?? ''} 
            onChange={handleChange} 
            placeholder="0"
            className={`${modalStyles.input} ${styles.numberRightInput}`} 
          />
          {rawCostoBase > 0 && (
            <span className={styles.costBaseBadge}>
              ✦ {montoATextoPesos(rawCostoBase)}
            </span>
          )}
        </div>
      </div>

      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>Observaciones</label>
        <input 
          name="observaciones" 
          value={formData.observaciones ?? ''} 
          onChange={handleChange} 
          className={`${modalStyles.input} ${styles.uppercaseInput}`} 
        />
      </div>

      <label className={styles.checkboxLabel}>
        <input 
          type="checkbox" 
          name="activo" 
          checked={formData.activo} 
          onChange={handleChange} 
        />
        <span className={styles.checkboxText}>Insumo Activo</span>
      </label>
    </>
  );
}
