/**
 * @file useProductFormState.js
 * @module catalog/products/components/modal-parts
 * @description Hook de gestión de estado, tipo de producto y validaciones Poka-Yoke para ProductModal.
 * @responsibility Aislar el cálculo de validación y sincronización de tipo de producto respetando SRP < 150.
 */
import { useState, useEffect, useMemo, useRef } from 'react';
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
  const isEditingWip = Boolean(
    formData?.tipo === 'INTERMEDIO_WIP' ||
    formData?.categoria === 'BASES_LACTEAS' ||
    formData?.categoria === 'PREMEZCLAS_PLANTA' ||
    formData?.categoria === 'INSUMO_BASE_WIP' ||
    formData?.canalVenta === 'USO_INTERNO' ||
    formData?.canalVenta === 'PLANTA' ||
    formData?.presentacion?.nombre?.toUpperCase().includes('GRANEL')
  );

  const initialWipMode = isBaseIntermedia || isEditingWip;
  const [productType, setProductType] = useState(initialWipMode ? 'WIP' : 'COMERCIAL');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const prevFormId = useRef(formData?.id);

  const prevIsOpen = useRef(false);

  useEffect(() => {
    if (isOpen && (!prevIsOpen.current || formData?.id !== prevFormId.current)) {
      setProductType(initialWipMode ? 'WIP' : 'COMERCIAL');
      setHasSubmitted(false);
    }
    prevIsOpen.current = isOpen;
    prevFormId.current = formData?.id;
  }, [isOpen, formData?.id]);

  const isWipMode = productType === 'WIP';
  
  const filteredPresentations = useMemo(() => {
    return presentations.filter((pres) => {
      const tipo = pres.tipoEnvase?.toUpperCase() || '';
      const nombre = pres.nombre?.toUpperCase() || '';
      const esGranel = tipo === 'BALDE' || tipo === 'TANQUE_GRANEL' || nombre.includes('GRANEL');
      const esAuxiliarWip = tipo === 'PORCIONADO_WIP' || nombre.includes('WIP') || nombre.includes('CEREAL');

      if (isWipMode) {
        return esGranel || esAuxiliarWip;
      } else {
        return !esGranel;
      }
    });
  }, [presentations, isWipMode]);

  const selectedPres = presentations.find(p => String(p.id) === String(formData.idPresentacion));
  const isGranel = productType === 'WIP' || selectedPres?.tipoEnvase === 'TANQUE_GRANEL' || selectedPres?.tipoEnvase === 'BALDE' || selectedPres?.nombre?.toUpperCase().includes('GRANEL');
  const availableCategories = isGranel ? CATEGORIAS_WIP : CATEGORIAS_COMERCIALES;

  const canalesConPrecio = ['MIXTO', 'B2B', 'B2C', 'COMERCIAL_COMPLETO', 'AMBOS'];
  const showPricingFields = 
    productType === 'COMERCIAL' || 
    canalesConPrecio.includes(formData.canalVenta) ||
    !isGranel;

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
      const validWipCategories = ['BASES_LACTEAS', 'DULCES_JALEAS', 'TOPPING_CEREAL', 'INSUMO_BASE_WIP', 'PREMEZCLAS_PLANTA'];
      if (!formData.categoria || !validWipCategories.includes(formData.categoria)) {
        handleChange({ target: { name: 'categoria', value: 'INSUMO_BASE_WIP' } });
      }
      if (formData.canalVenta === 'USO_INTERNO' || formData.canalVenta === 'PLANTA') {
        if (formData.precioVenta !== 0 && formData.precioVenta !== '0') {
          handleChange({ target: { name: 'precioVenta', value: 0 } });
        }
        if (formData.margenObjetivo !== 0 && formData.margenObjetivo !== '0') {
          handleChange({ target: { name: 'margenObjetivo', value: 0 } });
        }
      }
    } else {
      if (!formData.categoria || ['INSUMO_BASE_WIP', 'BASES_LACTEAS', 'DULCES_JALEAS', 'TOPPING_CEREAL', 'PREMEZCLAS_PLANTA'].includes(formData.categoria)) {
        handleChange({ target: { name: 'categoria', value: 'LACTEOS' } });
      }
      if (formData.canalVenta === 'USO_INTERNO') {
        handleChange({ target: { name: 'canalVenta', value: 'AMBOS' } });
      }
    }
  }, [isGranel, isOpen, formData.canalVenta]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'nombre' || name === 'descripcion' || name === 'observaciones') {
      handleChange({ target: { name, value: value.toUpperCase() } });
    } else {
      handleChange(e);
    }
  };

  const isNombreInvalid = !formData.nombre?.trim();
  const isPresentacionInvalid = !formData.idPresentacion;
  const isDescripcionInvalid = false; // M6: Borrador laxo
  const isPrecioVentaInvalid = false; // M6: Permite 0 para borrador inicial
  const isMargenObjetivoInvalid = false;

  const missingFields = [];
  if (isNombreInvalid) missingFields.push('Nombre');
  if (isPresentacionInvalid) missingFields.push('Presentación');

  const hasErrors = missingFields.length > 0;
  const isSubmitDisabled = isSubmitting || hasErrors;
  const submitTitle = hasSubmitted && hasErrors ? `Complete los campos obligatorios: ${missingFields.join(', ')}` : '';

  // Cálculos matemáticos reactivos (M3, M4)
  const precioVentaNum = Number(String(formData.precioVenta || '').replace(/\D/g, '')) || 0;
  const margenObjetivoNum = Number(formData.margenObjetivo) || 0;
  const costoEstimadoNum = Number(String(formData.costoEstimado || '').replace(/\D/g, '')) || 0;

  // M3: Margen real calculado si hay costo estimado manual y precio de venta
  const margenRealCalculado = precioVentaNum > 0 && costoEstimadoNum > 0 
    ? Math.round(((precioVentaNum - costoEstimadoNum) / precioVentaNum) * 100) 
    : margenObjetivoNum;

  // M4: Precio sugerido automático basado en costo estimado y margen objetivo
  const precioSugeridoCalculado = costoEstimadoNum > 0 && margenObjetivoNum > 0 && margenObjetivoNum < 100
    ? Math.round(costoEstimadoNum / (1 - (margenObjetivoNum / 100)))
    : 0;

  const costoMaximoPermitido = precioVentaNum > 0 && margenObjetivoNum > 0 ? Math.round(precioVentaNum * (1 - (margenObjetivoNum / 100))) : 0;
  const gananciaEsperada = precioVentaNum > 0 && margenObjetivoNum > 0 ? precioVentaNum - costoMaximoPermitido : 0;

  // M1: Código corto auto-generado si el usuario no especifica uno personalizado
  const codigoCortoGenerado = useMemo(() => {
    if (formData.codigo?.trim()) return formData.codigo.trim().toUpperCase();
    const nombreClean = (formData.nombre || '').trim().replace(/[^a-zA-Z0-9]/g, ' ').toUpperCase();
    const partes = nombreClean.split(/\s+/).filter(Boolean);
    const prefijo = partes.slice(0, 2).map(p => p.slice(0, 3)).join('-');
    const presNombre = (selectedPres?.nombre || '').replace(/\D/g, '');
    return prefijo ? `${prefijo}${presNombre ? `-${presNombre}` : ''}` : '';
  }, [formData.codigo, formData.nombre, selectedPres]);

  const onSubmit = (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    if (hasErrors || isSubmitDisabled) return;
    const { presentacion, ...restFormData } = formData;
    handleSubmit(e, {
      ...restFormData,
      codigo: codigoCortoGenerado || null,
      costoEstimado: costoEstimadoNum > 0 ? costoEstimadoNum : null,
      unidadVenta: formData.unidadVenta || 'UND',
      stockMinimo: Number(formData.stockMinimo) >= 0 ? Number(formData.stockMinimo) : 0,
      idPresentacion: String(formData.idPresentacion || presentacion?.id || ''),
      nombre: (formData.nombre || '').trim().toUpperCase(),
      descripcion: (formData.descripcion || '').trim().toUpperCase(),
      observaciones: (formData.observaciones || '').trim().toUpperCase(),
      canalVenta: formData.canalVenta || (isGranel ? 'USO_INTERNO' : 'AMBOS'),
      precioVenta: !showPricingFields ? 0 : cleanCurrency(formData.precioVenta),
      margenObjetivo: !showPricingFields ? 0 : Number(formData.margenObjetivo || 30),
      precioMayorista: !showPricingFields || !formData.precioMayorista ? null : cleanCurrency(formData.precioMayorista),
      cantidadMinimaMayorista: !showPricingFields ? 12 : (Number(formData.cantidadMinimaMayorista) || 12),
      descuentoMayoristaPorcentaje: !showPricingFields || !formData.descuentoMayoristaPorcentaje ? null : Number(formData.descuentoMayoristaPorcentaje),
      tipoImpuesto: formData.tipoImpuesto || 'GRAVADO',
      tarifaIva: formData.tipoImpuesto === 'EXCLUIDO' || formData.tipoImpuesto === 'EXENTO' ? 0 : (Number(formData.tarifaIva) || 19),
      precioIncluyeIva: formData.precioIncluyeIva ?? true
    });
  };

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
    costoEstimadoNum,
    margenRealCalculado,
    precioSugeridoCalculado,
    codigoCortoGenerado,
    costoMaximoPermitido,
    gananciaEsperada,
    filteredPresentations,
    showPricingFields
  };
}
