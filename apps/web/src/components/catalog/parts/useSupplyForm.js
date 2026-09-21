/**
 * @file useSupplyForm.js
 * @module components/catalog/parts
 * @description Hook personalizado para manejo de estado, formateo numérico y persistencia en SupplyModal.
 * @responsibility Administrar ciclo de vida del formulario de insumos, Poka-Yoke y llamadas API.
 * @usedBy apps/web/src/components/catalog/SupplyModal.jsx
 * @dependencies react, @/lib/api-client
 */
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

const INITIAL_FORM = {
  nombre: '',
  categoria: '',
  subcategoria: '',
  marca: '',
  unidadBase: '',
  empaque: '',
  stockMinimo: '',
  costoBase: '',
  observaciones: '',
  activo: true
};

export function useSupplyForm({ isOpen, editingItem, initialData = {}, onSuccess, onClose }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const formatThousands = (value) => {
    if (!value) return '';
    const numStr = value.toString().replace(/\D/g, '');
    if (!numStr) return '';
    return Number(numStr).toLocaleString('es-CO');
  };

  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        setFormData({
          ...editingItem,
          stockMinimo: formatThousands(editingItem.stockMinimo || ''),
          costoBase: formatThousands(editingItem.costoBase || '')
        });
      } else {
        setFormData({
          nombre: initialData.nombre || '', 
          categoria: initialData.categoria || '', 
          subcategoria: initialData.subcategoria || '', 
          marca: initialData.marca || '',
          unidadBase: initialData.unidadBase || '', 
          empaque: initialData.empaque || '', 
          stockMinimo: '', 
          costoBase: '', 
          observaciones: '', 
          activo: true
        });
      }
      setErrorMsg('');
    }
  }, [isOpen, editingItem, initialData.nombre, initialData.categoria, initialData.subcategoria, initialData.marca, initialData.unidadBase, initialData.empaque]);

  const [brands, setBrands] = useState([]);

  useEffect(() => {
    apiClient.get('/supplies/brands')
      .then(data => setBrands(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let parsedValue = value;
    if (type === 'checkbox') parsedValue = checked;
    if (['nombre', 'marca', 'observaciones'].includes(name)) {
      parsedValue = value.toUpperCase();
    }
    if (name === 'stockMinimo' || name === 'costoBase') {
      parsedValue = formatThousands(value);
    }

    if (name === 'categoria') {
      setFormData(prev => ({ ...prev, categoria: parsedValue, subcategoria: '' }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const isDirty = !!formData.nombre || !!formData.categoria;
  const rawCostoBase = formData.costoBase ? Number(String(formData.costoBase).replace(/\./g, '')) : 0;
  const minStockNum = formData.stockMinimo ? Number(String(formData.stockMinimo).replace(/\./g, '')) : 0;

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const isNombreInvalid = !formData.nombre?.trim();
  const isCategoriaInvalid = !formData.categoria;
  const isMarcaInvalid = !formData.marca?.trim();
  const isUnidadBaseInvalid = !formData.unidadBase;
  const isStockMinimoInvalid = !formData.stockMinimo;

  const missingFields = [];
  if (isNombreInvalid) missingFields.push('Nombre del insumo');
  if (isCategoriaInvalid) missingFields.push('Categoría');
  if (isMarcaInvalid) missingFields.push('Marca');
  if (isUnidadBaseInvalid) missingFields.push('Unidad base');
  if (isStockMinimoInvalid) missingFields.push('Stock mínimo');

  const hasErrors = missingFields.length > 0;
  const isSubmitDisabled = isSubmitting;
  const submitTitle = hasSubmitted && hasErrors
    ? `Complete los campos obligatorios: ${missingFields.join(', ')}`
    : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    if (hasErrors || isSubmitting) return;
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const payload = {
        ...formData,
        nombre: (formData.nombre || '').trim(),
        marca: (formData.marca || '').trim(),
        stockMinimo: formData.stockMinimo ? Number(String(formData.stockMinimo).replace(/\./g, '')) : 0,
        costoBase: formData.costoBase ? Number(String(formData.costoBase).replace(/\./g, '')) : null
      };

      let result;
      if (editingItem) {
        result = await apiClient.patch(`/supplies/${editingItem.id}`, payload);
      } else {
        result = await apiClient.post('/supplies', payload);
      }
      onClose();
      if (onSuccess) onSuccess(result || payload);
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
    rawCostoBase,
    minStockNum,
    isSubmitDisabled,
    submitTitle,
    hasSubmitted,
    isNombreError: hasSubmitted && isNombreInvalid,
    isCategoriaError: hasSubmitted && isCategoriaInvalid,
    isMarcaError: hasSubmitted && isMarcaInvalid,
    isUnidadBaseError: hasSubmitted && isUnidadBaseInvalid,
    isStockMinimoError: hasSubmitted && isStockMinimoInvalid,
    handleChange,
    handleSubmit,
    brands
  };
}
