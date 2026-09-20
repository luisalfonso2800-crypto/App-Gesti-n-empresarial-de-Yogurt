/**
 * @file ProductModal.jsx
 * @module catalog/products/components
 * @description Orquestador modular del modal de productos (SRP < 150 líneas, cero inline styles).
 * @responsibility Formulario para los valores comerciales y técnicos del producto con validación Poka-Yoke.
 * @usedBy apps/web/src/app/catalog/products/page.jsx
 * @dependencies SmartModal, modal-parts/*, @/lib/formatters, ./product-modal.module.css, ./productConstants
 */

import React from 'react';
import SmartModal from '@/components/ui/SmartModal';
import styles from './product-modal.module.css';
import { ProductBasicFields } from './modal-parts/ProductBasicFields';
import { ProductImageAndDescriptionFields } from './modal-parts/ProductImageAndDescriptionFields';
import { ProductPricingAndMarginFields } from './modal-parts/ProductPricingAndMarginFields';
import { ProductModalActions } from './modal-parts/ProductModalActions';
import { useProductFormState } from './modal-parts/useProductFormState';
import {
  HINTS_CATEGORIA_WIP, CANALES_VENTA, HINTS_CANAL_VENTA
} from './productConstants';

export function ProductModal({ 
  isOpen, onClose, editingItem, formData, handleChange, handleSubmit, 
  presentations = [], isSubmitting, errorMsg, isBaseIntermedia = false 
}) {
  const {
    productType, handleToggleProductType, isGranel, availableCategories,
    handleInputChange, hasSubmitted, isNombreInvalid, isPresentacionInvalid,
    isDescripcionInvalid, isPrecioVentaInvalid, isMargenObjetivoInvalid,
    isSubmitDisabled, submitTitle, onSubmit,
    precioVentaNum, margenObjetivoNum, costoMaximoPermitido, gananciaEsperada,
    filteredPresentations, showPricingFields
  } = useProductFormState({
    isOpen, formData, handleChange, handleSubmit,
    presentations, isSubmitting, isBaseIntermedia
  });

  return (
    <SmartModal isOpen={isOpen} onClose={onClose} title={editingItem ? 'Editar Producto' : 'Nuevo Producto'} isDirty={Boolean(formData.nombre || formData.idPresentacion)} isSubmitting={isSubmitting}>
      {errorMsg && <div className={styles.errorMessage}><span>⚠️</span><span>{errorMsg}</span></div>}

      <form onSubmit={onSubmit} className={styles.formContainer}>
        <div className={styles.productTypeToggle}>
          <button
            type="button"
            className={`${styles.toggleBtn} ${productType === 'COMERCIAL' ? styles.toggleBtnActive : ''}`}
            onClick={() => handleToggleProductType('COMERCIAL')}
          >
            🥛 Producto Comercial Envasado
          </button>
          <button
            type="button"
            className={`${styles.toggleBtn} ${productType === 'WIP' ? styles.toggleBtnActive : ''}`}
            onClick={() => handleToggleProductType('WIP')}
          >
            🏭 Base Intermedia / Tanque (WIP)
          </button>
        </div>

        <ProductBasicFields 
          formData={formData} handleInputChange={handleInputChange} handleChange={handleChange} 
          presentations={filteredPresentations} availableCategories={availableCategories} canalesVenta={CANALES_VENTA} 
          hintsCategoriaWip={HINTS_CATEGORIA_WIP} hintsCanalVenta={HINTS_CANAL_VENTA} isGranel={isGranel} isBaseIntermedia={isBaseIntermedia}
          isNombreError={hasSubmitted && isNombreInvalid} isPresentacionError={hasSubmitted && isPresentacionInvalid}
          isWipMode={productType === 'WIP'} onClose={onClose}
        />
        <ProductImageAndDescriptionFields formData={formData} handleChange={handleChange} handleInputChange={handleInputChange} isDescripcionError={hasSubmitted && isDescripcionInvalid} />
        <ProductPricingAndMarginFields 
          isGranel={isGranel} showPricingFields={showPricingFields} formData={formData} handleChange={handleChange} precioVentaNum={precioVentaNum} margenObjetivoNum={margenObjetivoNum} 
          costoMaximoPermitido={costoMaximoPermitido} gananciaEsperada={gananciaEsperada}
          isPrecioVentaError={hasSubmitted && isPrecioVentaInvalid} isMargenObjetivoError={hasSubmitted && isMargenObjetivoInvalid}
        />
        <ProductModalActions 
          editingItem={editingItem} formData={formData} presentations={presentations} precioVentaNum={precioVentaNum} 
          isSubmitDisabled={isSubmitDisabled} submitTitle={submitTitle} isSubmitting={isSubmitting} onClose={onClose} 
        />
      </form>
    </SmartModal>
  );
}
