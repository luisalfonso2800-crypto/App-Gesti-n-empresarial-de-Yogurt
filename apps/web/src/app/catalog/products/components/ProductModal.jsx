/**
 * @file ProductModal.jsx
 * @module catalog/products/components
 * @description Orquestador modular del modal de productos (SRP < 150 líneas, cero inline styles).
 * @responsibility Formulario para los valores comerciales y técnicos del producto con validación Poka-Yoke.
 * @usedBy apps/web/src/app/catalog/products/page.jsx
 * @dependencies SmartModal, modal-parts/*, @/lib/formatters, ./product-modal.module.css, ./productConstants
 */

import React, { useEffect } from 'react';
import SmartModal, { SubmitButton } from '@/components/ui/SmartModal';
import { cleanCurrency, formatCurrency } from '@/lib/formatters';
import { PRESETS } from '@/lib/presetImages';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from './product-modal.module.css';
import { ProductBasicFields } from './modal-parts/ProductBasicFields';
import { ProductImageAndDescriptionFields } from './modal-parts/ProductImageAndDescriptionFields';
import { ProductPricingAndMarginFields } from './modal-parts/ProductPricingAndMarginFields';
import {
  CATEGORIAS_WIP, HINTS_CATEGORIA_WIP,
  CATEGORIAS_COMERCIALES, CANALES_VENTA, HINTS_CANAL_VENTA
} from './productConstants';

import { ProductModalActions } from './modal-parts/ProductModalActions';

export function ProductModal({ 
  isOpen, onClose, editingItem, formData, handleChange, handleSubmit, 
  presentations = [], isSubmitting, errorMsg, isBaseIntermedia = false 
}) {
  const selectedPres = presentations.find(p => String(p.id) === String(formData.idPresentacion));
  const isGranel = selectedPres?.tipoEnvase === 'TANQUE_GRANEL' || selectedPres?.nombre?.toUpperCase().includes('GRANEL');
  const availableCategories = isGranel ? CATEGORIAS_WIP : CATEGORIAS_COMERCIALES;

  useEffect(() => {
    if (!isOpen) return;
    if (isGranel) {
      if (!formData.categoria || ['LACTEOS', 'POSTRES', 'BEBIDAS'].includes(formData.categoria)) {
        handleChange({ target: { name: 'categoria', value: 'INSUMO_BASE_WIP' } });
      }
      if (formData.canalVenta !== 'USO_INTERNO' && formData.canalVenta !== 'MIXTO') {
        handleChange({ target: { name: 'canalVenta', value: 'USO_INTERNO' } });
      }
      if (formData.precioVenta !== 0 && formData.precioVenta !== '0') {
        handleChange({ target: { name: 'precioVenta', value: 0 } });
      }
      if (formData.margenObjetivo !== 0 && formData.margenObjetivo !== '0') {
        handleChange({ target: { name: 'margenObjetivo', value: 0 } });
      }
    } else {
      if (!formData.categoria || ['INSUMO_BASE_WIP', 'BASES_LACTEAS', 'DULCES_JALEAS', 'TOPPING_CEREAL'].includes(formData.categoria)) {
        handleChange({ target: { name: 'categoria', value: 'LACTEOS' } });
      }
      if (formData.canalVenta === 'USO_INTERNO') {
        handleChange({ target: { name: 'canalVenta', value: 'AMBOS' } });
      }
    }
  }, [isGranel, isOpen]);

  const [hasSubmitted, setHasSubmitted] = React.useState(false);

  useEffect(() => {
    if (!isOpen) setHasSubmitted(false);
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name === 'nombre' || name === 'descripcion' || name === 'observaciones' ? { target: { name, value: value.toUpperCase() } } : e);
  };

  const isNombreInvalid = !formData.nombre?.trim();
  const isPresentacionInvalid = !formData.idPresentacion;
  const isCategoriaInvalid = !formData.categoria;
  const isCanalVentaInvalid = !formData.canalVenta;
  const isDescripcionInvalid = !formData.descripcion?.trim();
  const isPrecioVentaInvalid = !isGranel && (!formData.precioVenta && formData.precioVenta !== 0);
  const isMargenObjetivoInvalid = !isGranel && (formData.margenObjetivo === '' || formData.margenObjetivo === null || formData.margenObjetivo === undefined);

  const missingFields = [];
  if (isNombreInvalid) missingFields.push('Nombre');
  if (isPresentacionInvalid) missingFields.push('Presentación');
  if (isCategoriaInvalid) missingFields.push('Categoría');
  if (isCanalVentaInvalid) missingFields.push('Canal de venta');
  if (isDescripcionInvalid) missingFields.push('Descripción');
  if (isPrecioVentaInvalid) missingFields.push('Precio de venta');
  if (isMargenObjetivoInvalid) missingFields.push('Margen objetivo');

  const hasErrors = missingFields.length > 0;
  const isSubmitDisabled = isSubmitting;
  const submitTitle = hasSubmitted && hasErrors ? `Complete los campos obligatorios: ${missingFields.join(', ')}` : '';

  const onSubmit = (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    if (hasErrors || isSubmitDisabled) return;
    const { presentacion, ...restFormData } = formData;
    handleSubmit(e, {
      ...restFormData,
      idPresentacion: String(formData.idPresentacion || presentacion?.id || ''),
      nombre: (formData.nombre || '').trim().toUpperCase(),
      descripcion: (formData.descripcion || '').trim().toUpperCase(),
      observaciones: (formData.observaciones || '').trim().toUpperCase(),
      canalVenta: isGranel ? (formData.canalVenta || 'USO_INTERNO') : formData.canalVenta,
      precioVenta: isGranel ? 0 : cleanCurrency(formData.precioVenta),
      margenObjetivo: isGranel ? 0 : Number(formData.margenObjetivo)
    });
  };

  const precioVentaNum = Number(String(formData.precioVenta || '').replace(/\D/g, '')) || 0;
  const margenObjetivoNum = Number(formData.margenObjetivo) || 0;
  const costoMaximoPermitido = precioVentaNum > 0 && margenObjetivoNum > 0 ? Math.round(precioVentaNum * (1 - (margenObjetivoNum / 100))) : 0;
  const gananciaEsperada = precioVentaNum > 0 && margenObjetivoNum > 0 ? precioVentaNum - costoMaximoPermitido : 0;

  return (
    <SmartModal isOpen={isOpen} onClose={onClose} title={editingItem ? 'Editar Producto' : 'Nuevo Producto'} isDirty={Boolean(formData.nombre || formData.idPresentacion)} isSubmitting={isSubmitting}>
      {errorMsg && <div className={styles.errorMessage}><span>⚠️</span><span>{errorMsg}</span></div>}

      <form onSubmit={onSubmit} className={styles.formContainer}>
        <ProductBasicFields 
          formData={formData} handleInputChange={handleInputChange} handleChange={handleChange} 
          presentations={presentations} availableCategories={availableCategories} canalesVenta={CANALES_VENTA} 
          hintsCategoriaWip={HINTS_CATEGORIA_WIP} hintsCanalVenta={HINTS_CANAL_VENTA} isGranel={isGranel} isBaseIntermedia={isBaseIntermedia}
          isNombreError={hasSubmitted && isNombreInvalid} isPresentacionError={hasSubmitted && isPresentacionInvalid}
        />
        <ProductImageAndDescriptionFields formData={formData} handleChange={handleChange} handleInputChange={handleInputChange} presets={PRESETS} isDescripcionError={hasSubmitted && isDescripcionInvalid} />
        <ProductPricingAndMarginFields 
          isGranel={isGranel} formData={formData} handleChange={handleChange} precioVentaNum={precioVentaNum} margenObjetivoNum={margenObjetivoNum} 
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
