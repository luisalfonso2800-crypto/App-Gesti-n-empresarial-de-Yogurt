/**
 * @file useSupplierPriceForm.js
 * @module catalog/supplier-prices/components/modal-parts
 * @description Hook de estado, cálculo reactivo del costo unitario y validación Poka-Yoke para SupplierPriceModal.
 * @responsibility Administrar el ciclo de vida del formulario de precios de proveedor, normalización de datos y cálculo inverso.
 * @usedBy apps/web/src/app/catalog/supplier-prices/components/SupplierPriceModal.jsx
 * @dependencies react, @/lib/formatters
 */
import { useState, useEffect } from 'react';
import { cleanCurrency } from '@/lib/formatters';

const INITIAL_STATE = {
  idInsumo: '',
  idProveedor: '',
  presentacionCompra: '',
  cantidadPresentacion: '',
  unidadPresentacion: '',
  cantidadEquivalenteBase: '',
  precioCompra: '',
  costoUnidadBase: '',
  costoBaseSinIva: '',
  tieneIva: true,
  porcentajeIva: '19',
  precioIncluyeIva: true,
  montoIvaCalculado: 0,
  observaciones: '',
  activo: true
};

export function useSupplierPriceForm({ isOpen, editingItem, onSubmit, onClose, allInsumos, allProveedores }) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (editingItem) {
      setFormData({
        ...editingItem,
        tieneIva: editingItem.tieneIva !== undefined ? Boolean(editingItem.tieneIva) : true,
        porcentajeIva: editingItem.porcentajeIva !== undefined ? String(editingItem.porcentajeIva) : '19',
        precioIncluyeIva: editingItem.precioIncluyeIva !== undefined ? Boolean(editingItem.precioIncluyeIva) : true,
        precioCompra: editingItem.precioCompra || '',
        cantidadPresentacion: editingItem.cantidadPresentacion || '',
        cantidadEquivalenteBase: editingItem.cantidadEquivalenteBase || ''
      });
    } else {
      setFormData(INITIAL_STATE);
    }
    setErrorMsg('');
  }, [editingItem, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let parsedValue = value;
    if (type === 'checkbox') parsedValue = checked;
    if (['presentacionCompra', 'observaciones'].includes(name)) {
      parsedValue = value.toUpperCase();
    }
    if (name === 'tieneIva') {
      if (!checked) {
        setFormData(prev => ({
          ...prev,
          tieneIva: false,
          porcentajeIva: 0,
          precioIncluyeIva: true
        }));
        return;
      } else {
        setFormData(prev => ({
          ...prev,
          tieneIva: true,
          porcentajeIva: prev.porcentajeIva && Number(prev.porcentajeIva) > 0 ? prev.porcentajeIva : '19'
        }));
        return;
      }
    }
    // Cascada Poka-Yoke: si se limpia proveedor
    if (name === 'idProveedor' && !value) {
      setFormData(prev => ({
        ...prev,
        idProveedor: '',
        presentacionCompra: '',
        unidadPresentacion: '',
        cantidadPresentacion: '',
        cantidadEquivalenteBase: '',
        precioCompra: '',
        costoUnidadBase: '',
        costoBaseSinIva: '',
        montoIvaCalculado: 0
      }));
      return;
    }
    // Cascada Poka-Yoke: si se limpia presentación
    if (name === 'presentacionCompra' && !value) {
      setFormData(prev => ({
        ...prev,
        presentacionCompra: '',
        unidadPresentacion: '',
        cantidadPresentacion: '',
        cantidadEquivalenteBase: '',
        precioCompra: '',
        costoUnidadBase: '',
        costoBaseSinIva: '',
        montoIvaCalculado: 0
      }));
      return;
    }
    // Cascada Poka-Yoke: unidad de medida
    if (name === 'unidadPresentacion') {
      if (!value) {
        setFormData(prev => ({
          ...prev,
          unidadPresentacion: '',
          cantidadPresentacion: '',
          cantidadEquivalenteBase: '',
          precioCompra: '',
          costoUnidadBase: '',
          costoBaseSinIva: '',
          montoIvaCalculado: 0
        }));
        return;
      }
      // Al cambiar la unidad, NO borrar la cantidad: recalcular la equivalencia base con la cantidad que ya tiene puesta
      setFormData(prev => {
        const qty = Number(prev.cantidadPresentacion) || 0;
        let factor = qty;
        const uLower = value.toLowerCase();
        if (uLower === 'kg' || uLower === 'l') factor = qty * 1000;
        return {
          ...prev,
          unidadPresentacion: value,
          cantidadEquivalenteBase: factor > 0 ? factor : prev.cantidadEquivalenteBase
        };
      });
      return;
    }
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  // Cálculo inverso y fiscal automático del costo base
  useEffect(() => {
    const pc = cleanCurrency(formData.precioCompra);
    const cb = Number(formData.cantidadEquivalenteBase);
    const tieneIva = Boolean(formData.tieneIva);
    const pct = Number(formData.porcentajeIva || 0);
    const incluye = Boolean(formData.precioIncluyeIva);

    if (pc > 0) {
      let baseSinIva = pc;
      let totalConIva = pc;
      let ivaMonto = 0;

      if (tieneIva && pct > 0) {
        const factor = 1 + (pct / 100);
        if (incluye) {
          baseSinIva = pc / factor;
          totalConIva = pc;
          ivaMonto = totalConIva - baseSinIva;
        } else {
          baseSinIva = pc;
          ivaMonto = pc * (pct / 100);
          totalConIva = baseSinIva + ivaMonto;
        }
      }

      const costoUndSinIva = cb > 0 ? baseSinIva / cb : 0;
      const costoUndConIva = cb > 0 ? totalConIva / cb : 0;

      setFormData(prev => ({
        ...prev,
        costoBaseSinIva: baseSinIva,
        montoIvaCalculado: ivaMonto,
        costoUnitarioSinIva: costoUndSinIva,
        costoUnitarioConIva: costoUndConIva,
        costoUnidadBase: costoUndConIva
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        costoBaseSinIva: 0,
        montoIvaCalculado: 0,
        costoUnitarioSinIva: 0,
        costoUnitarioConIva: 0,
        costoUnidadBase: ''
      }));
    }
  }, [formData.precioCompra, formData.cantidadEquivalenteBase, formData.tieneIva, formData.porcentajeIva, formData.precioIncluyeIva]);

  const isDirty = !!formData.idInsumo || !!formData.idProveedor || !!formData.precioCompra;

  const insumoName = allInsumos.find(x => String(x.id) === String(formData.idInsumo))?.nombre || 'desconocido';
  const proveedorName = allProveedores.find(x => String(x.id) === String(formData.idProveedor))?.nombre || 'desconocido';

  const missingFields = [];
  if (!formData.idInsumo) missingFields.push('Insumo');
  if (!formData.idProveedor) missingFields.push('Proveedor');
  if (!formData.presentacionCompra?.trim()) missingFields.push('Presentación de compra');
  if (!formData.cantidadPresentacion || Number(formData.cantidadPresentacion) <= 0) missingFields.push('Cantidad presentación');
  if (!formData.unidadPresentacion?.trim()) missingFields.push('Unidad');
  if (!formData.cantidadEquivalenteBase || Number(formData.cantidadEquivalenteBase) <= 0) missingFields.push('Equivalente unidad base');
  if (!formData.precioCompra) missingFields.push('Precio de compra');
  if (!formData.costoUnidadBase) missingFields.push('Costo base');

  const isSubmitDisabled = missingFields.length > 0 || isSubmitting;
  const submitTitle = missingFields.length > 0
    ? `Complete los campos obligatorios: ${missingFields.join(', ')}`
    : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitDisabled) return;
    setIsSubmitting(true);
    setErrorMsg('');
    
    try {
      const pc = cleanCurrency(formData.precioCompra);
      const payload = {
        ...formData,
        presentacionCompra: (formData.presentacionCompra || '').trim().toUpperCase(),
        unidadPresentacion: (formData.unidadPresentacion || '').trim().toUpperCase(),
        observaciones: (formData.observaciones || '').trim().toUpperCase(),
        cantidadPresentacion: Number(formData.cantidadPresentacion),
        cantidadEquivalenteBase: Number(formData.cantidadEquivalenteBase),
        precioCompra: pc,
        costoUnidadBase: Number(formData.costoUnidadBase)
      };
      
      await onSubmit(payload, editingItem);
      onClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Error al guardar');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    errorMsg,
    isDirty,
    insumoName,
    proveedorName,
    isSubmitDisabled,
    submitTitle,
    handleChange,
    handleSubmit
  };
}
