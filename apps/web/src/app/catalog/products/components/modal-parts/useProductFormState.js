/**
 * @file useProductFormState.js
 * @module catalog/products/components/modal-parts
 * @description Hook de gestión de estado, tipo de producto y validaciones Poka-Yoke para ProductModal.
 * @responsibility Aislar el cálculo de validación y sincronización de tipo de producto respetando SRP < 150.
 */
import { useState, useEffect } from 'react';
import { cleanCurrency } from '@/lib/formatters';
import { CATEGORIAS_WIP, CATEGORIAS_COMERCIALES } from '../productConstants';

export function useProductFormState({
  isOpen,
  formData,
  handleChange,
  handleSubmit,
  presentations = [],
  isSubmitting,
  isBaseIntermedia = false
}) {
  const [productType, setProductType] = useState(isBaseIntermedia ? 'WIP' : 'COMERCIAL');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setProductType(isBaseIntermedia ? 'WIP' : 'COMERCIAL');
      setHasSubmitted(false);
    }
  }, [isOpen, isBaseIntermedia]);

  const isWipMode = productType === 'WIP';
  const filteredPresentations = presentations.filter((pres) => {
    const tipo = pres.tipoEnvase?.toUpperCase() || '';
    const nombre = pres.nombre?.toUpperCase() || '';
    const esGranel = tipo === 'BALDE' || tipo === 'TANQUE_GRANEL' || nombre.includes('GRANEL');
    const esAuxiliarWip = tipo === 'PORCIONADO_WIP' || nombre.includes('WIP') || nombre.includes('CEREAL');

    if (isWipMode) {
      return esGranel || esAuxiliarWip;
    } else {
      // En modo comercial, solo envases de venta terminada
      return !esGranel;
    }
  });

  const selectedPres = presentations.find(p => String(p.id) === String(formData.idPresentacion));
  const isGranel = productType === 'WIP' || selectedPres?.tipoEnvase === 'TANQUE_GRANEL' || selectedPres?.tipoEnvase === 'BALDE' || selectedPres?.nombre?.toUpperCase().includes('GRANEL');
  const availableCategories = isGranel ? CATEGORIAS_WIP : CATEGORIAS_COMERCIALES;

  const handleToggleProductType = (type) => {
    setProductType(type);
    if (type === 'WIP') {
      const granelPres = presentations.find(p => p.tipoEnvase === 'TANQUE_GRANEL' || p.tipoEnvase === 'BALDE' || p.nombre?.toUpperCase().includes('GRANEL') || p.tipoEnvase === 'PORCIONADO_WIP');
      if (granelPres) {
        handleChange({ target: { name: 'idPresentacion', value: String(granelPres.id) } });
      }
      handleChange({ target: { name: 'categoria', value: 'INSUMO_BASE_WIP' } });
      handleChange({ target: { name: 'canalVenta', value: 'USO_INTERNO' } });
      handleChange({ target: { name: 'precioVenta', value: 0 } });
      handleChange({ target: { name: 'margenObjetivo', value: 0 } });
    } else {
      const comPres = presentations.find(p => p.tipoEnvase !== 'BALDE' && p.tipoEnvase !== 'TANQUE_GRANEL' && !p.nombre?.toUpperCase().includes('GRANEL'));
      if (comPres) {
        handleChange({ target: { name: 'idPresentacion', value: String(comPres.id) } });
      }
      handleChange({ target: { name: 'categoria', value: 'LACTEOS' } });
      handleChange({ target: { name: 'canalVenta', value: 'AMBOS' } });
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    if (formData.idPresentacion && filteredPresentations.length > 0) {
      const exists = filteredPresentations.some(p => String(p.id) === String(formData.idPresentacion));
      if (!exists) {
        handleChange({ target: { name: 'idPresentacion', value: String(filteredPresentations[0]?.id || '') } });
      }
    }
  }, [isOpen, productType, filteredPresentations, formData.idPresentacion]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name === 'nombre' || name === 'descripcion' || name === 'observaciones' ? { target: { name, value: value.toUpperCase() } } : e);
  };

  const isNombreInvalid = !formData.nombre?.trim();
  const isPresentacionInvalid = !formData.idPresentacion;
  const isDescripcionInvalid = !formData.descripcion?.trim();
  const isPrecioVentaInvalid = !isGranel && (!formData.precioVenta && formData.precioVenta !== 0);
  const isMargenObjetivoInvalid = !isGranel && (formData.margenObjetivo === '' || formData.margenObjetivo === null || formData.margenObjetivo === undefined);

  const missingFields = [];
  if (isNombreInvalid) missingFields.push('Nombre');
  if (isPresentacionInvalid) missingFields.push('Presentación');
  if (!formData.categoria) missingFields.push('Categoría');
  if (!formData.canalVenta) missingFields.push('Canal de venta');
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

  return {
    productType,
    handleToggleProductType,
    isGranel,
    availableCategories,
    handleInputChange,
    hasSubmitted,
    isNombreInvalid,
    isPresentacionInvalid,
    isDescripcionInvalid,
    isPrecioVentaInvalid,
    isMargenObjetivoInvalid,
    isSubmitDisabled,
    submitTitle,
    onSubmit,
    precioVentaNum,
    margenObjetivoNum,
    costoMaximoPermitido,
    gananciaEsperada,
    filteredPresentations
  };
}
