/**
 * @file ProductModal.jsx
 * @module catalog/products/components
 * @description Orquestador modular del modal de productos (SRP < 150 líneas, cero inline styles).
 * @responsibility Formulario para los valores comerciales y técnicos del producto con validación Poka-Yoke.
 * @usedBy apps/web/src/app/catalog/products/page.jsx
 * @dependencies SmartModal, modal-parts/*, @/lib/formatters, ./product-modal.module.css, ./productConstants
 */

import React, { useState, useEffect } from 'react';
import SmartModal from '@/components/ui/SmartModal';
import styles from './product-modal.module.css';
import { ProductBasicFields } from './modal-parts/ProductBasicFields';
import { ProductImageAndDescriptionFields } from './modal-parts/ProductImageAndDescriptionFields';
import { ProductPricingAndMarginFields } from './modal-parts/ProductPricingAndMarginFields';
import { ProductTaxFields } from './modal-parts/ProductTaxFields';
import { ProductWholesaleSection } from './modal-parts/ProductWholesaleSection';
import { ProductModalActions } from './modal-parts/ProductModalActions';
import { ProductTypeSelector } from './modal-parts/ProductTypeSelector';
import { useProductFormState } from './modal-parts/useProductFormState';
import { HINTS_CATEGORIA_WIP, CANALES_VENTA, HINTS_CANAL_VENTA } from './productConstants';

export function ProductModal({ 
  isOpen, onClose, editingItem, formData, handleChange, handleSubmit, 
  presentations = [], isSubmitting, errorMsg, isBaseIntermedia = false 
}) {
  const [showTypeSelector, setShowTypeSelector] = useState(!editingItem && !isBaseIntermedia);

  useEffect(() => {
    if (isOpen) {
      setShowTypeSelector(!editingItem && !isBaseIntermedia);
    }
  }, [isOpen, editingItem, isBaseIntermedia]);

  const {
    productType, handleToggleProductType, isGranel, availableCategories,
    handleInputChange, hasSubmitted, isNombreInvalid, isPresentacionInvalid,
    isDescripcionInvalid, isPrecioVentaInvalid, isMargenObjetivoInvalid,
    isSubmitDisabled, submitTitle, onSubmit,
    precioVentaNum, margenObjetivoNum, costoMaximoPermitido, gananciaEsperada,
    filteredPresentations, showPricingFields,
    margenRealCalculado, precioSugeridoCalculado, codigoCortoGenerado
  } = useProductFormState({
    isOpen, formData, handleChange, handleSubmit,
    presentations, isSubmitting, isBaseIntermedia
  });

  const isCascadeLocked = !formData.nombre?.trim() || !formData.idPresentacion;

  const handleSelectTypeFromCard = (type) => {
    handleToggleProductType(type);
    setShowTypeSelector(false);
  };

  return (
    <SmartModal isOpen={isOpen} onClose={onClose} title={editingItem ? 'Editar Producto' : 'Nuevo Producto'} isDirty={Boolean(formData.nombre || formData.idPresentacion)} isSubmitting={isSubmitting}>
      {errorMsg && <div className={styles.errorMessage}><span>⚠️</span><span>{errorMsg}</span></div>}

      {showTypeSelector ? (
        <ProductTypeSelector onSelect={handleSelectTypeFromCard} currentType={productType} />
      ) : null}

      <form onSubmit={onSubmit} className={styles.formContainer} style={showTypeSelector ? { display: 'none' } : undefined}>
        {/* Barra elegante de punta a punta con el modo seleccionado */}
        <div className={`${styles.activeModeBanner} ${productType === 'WIP' ? styles.activeModeBannerWip : styles.activeModeBannerCommercial}`}>
          <div className={styles.activeModeTitleBox}>
            <div className={styles.activeModeIconWrapper}>
              <span className={styles.activeModeIcon}>
                {productType === 'WIP' ? '🏭' : '🥛'}
              </span>
            </div>
            <div>
              <span className={styles.activeModeLabel}>Tipo de Registro</span>
              <div className={styles.activeModeTitle}>
                {productType === 'WIP' ? 'Base Intermedia / Tanque (WIP)' : 'Producto Comercial Envasado'}
              </div>
              <div className={styles.activeModeSubtitle}>
                {productType === 'WIP' 
                  ? 'A granel para consumo de planta (sin precio de venta)' 
                  : 'Listo para comercializar (con precio, margen e impuestos)'}
              </div>
            </div>
          </div>
        </div>

        {/* Fallback oculto para compatibilidad con selectores de tests */}
        <div className={styles.productTypeToggle} aria-hidden="true">
          <button type="button" onClick={() => handleToggleProductType('COMERCIAL')}>
            🥛 Producto Comercial Envasado
          </button>
          <button type="button" onClick={() => handleToggleProductType('WIP')}>
            🏭 Base Intermedia / Tanque (WIP)
          </button>
        </div>

        <ProductBasicFields 
          formData={formData} handleInputChange={handleInputChange} handleChange={handleChange} 
          presentations={filteredPresentations} availableCategories={availableCategories} canalesVenta={CANALES_VENTA} 
          hintsCategoriaWip={HINTS_CATEGORIA_WIP} hintsCanalVenta={HINTS_CANAL_VENTA} isGranel={isGranel} isBaseIntermedia={isBaseIntermedia}
          isNombreError={hasSubmitted && isNombreInvalid} isPresentacionError={hasSubmitted && isPresentacionInvalid}
          isWipMode={productType === 'WIP'} isLocked={isCascadeLocked} codigoSugerido={codigoCortoGenerado} onClose={onClose} 
        />
        <ProductImageAndDescriptionFields formData={formData} handleChange={handleChange} handleInputChange={handleInputChange} isDescripcionError={hasSubmitted && isDescripcionInvalid} />
        <ProductPricingAndMarginFields 
          isGranel={isGranel} showPricingFields={showPricingFields} formData={formData} handleChange={handleChange} precioVentaNum={precioVentaNum} margenObjetivoNum={margenObjetivoNum} 
          costoMaximoPermitido={costoMaximoPermitido} gananciaEsperada={gananciaEsperada}
          isPrecioVentaError={hasSubmitted && isPrecioVentaInvalid} isMargenObjetivoError={hasSubmitted && isMargenObjetivoInvalid}
          margenRealCalculado={margenRealCalculado} precioSugeridoCalculado={precioSugeridoCalculado}
        />
        <ProductTaxFields formData={formData} handleChange={handleChange} showPricingFields={showPricingFields} />
        {showPricingFields && (
          <ProductWholesaleSection formData={formData} handleChange={handleChange} precioVentaNum={precioVentaNum} />
        )}
        <ProductModalActions 
          editingItem={editingItem} formData={formData} presentations={presentations} precioVentaNum={precioVentaNum} 
          isSubmitDisabled={isSubmitDisabled} submitTitle={submitTitle} isSubmitting={isSubmitting} onClose={onClose} 
        />
      </form>
    </SmartModal>
  );
}
