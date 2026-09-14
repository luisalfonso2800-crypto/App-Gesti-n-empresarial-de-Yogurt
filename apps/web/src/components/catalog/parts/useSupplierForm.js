/**
 * @file useSupplierForm.js
 * @module components/catalog/parts
 * @description Hook de estado, formateo de NIT/Teléfono y persistencia para SupplierModal.
 * @responsibility Manejar la interacción con la API, validaciones Poka-Yoke y limpieza de inputs.
 * @usedBy apps/web/src/components/catalog/SupplierModal.jsx
 * @dependencies react, @/lib/api-client
 */
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

const INITIAL_FORM = {
  razonSocial: '',
  nit: '',
  nombreContacto: '',
  telefono: '',
  email: '',
  direccion: '',
  observaciones: '',
  activo: true
};

export function useSupplierForm({ isOpen, editingItem, initialData = {}, onSuccess, onClose }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const formatNitCedula = (value) => {
    if (!value) return '';
    let cleaned = value.toString().replace(/[^0-9-]/g, '');
    const parts = cleaned.split('-');
    let main = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    if (parts.length > 1) {
      return main + '-' + parts[1].substring(0, 1);
    }
    return main;
  };

  const formatPhone = (value) => {
    if (!value) return '';
    const digits = value.toString().replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  };

  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        setFormData({
          razonSocial: editingItem.razonSocial || editingItem.nombre || '',
          nit: formatNitCedula(editingItem.nit || editingItem.nitCedula || ''),
          nombreContacto: editingItem.nombreContacto || '',
          telefono: formatPhone(editingItem.telefono || ''),
          email: editingItem.email || '',
          direccion: editingItem.direccion || '',
          observaciones: editingItem.observaciones || '',
          activo: editingItem.activo ?? true
        });
      } else {
        setFormData({
          razonSocial: initialData.razonSocial || initialData.nombre || '', 
          nit: formatNitCedula(initialData.nit || initialData.nitCedula || ''),
          nombreContacto: '',
          telefono: formatPhone(initialData.telefono || ''),
          email: '',
          direccion: '',
          observaciones: '',
          activo: true
        });
      }
      setErrorMessage('');
    }
  }, [isOpen, editingItem, initialData]);

  const handleChange = (e) => {
    setErrorMessage('');
    const { name, value, type, checked } = e.target;
    let parsedValue = value;
    if (type === 'checkbox') {
      parsedValue = checked;
    } else if (['razonSocial', 'nombreContacto', 'direccion', 'observaciones'].includes(name)) {
      parsedValue = value.toUpperCase();
    } else if (name === 'email') {
      parsedValue = value.toLowerCase().trim();
    } else if (name === 'nit') {
      parsedValue = formatNitCedula(value);
    } else if (name === 'telefono') {
      parsedValue = formatPhone(value); 
    }

    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const isDirty = !!formData.razonSocial || !!formData.nit;

  const rawNit = (formData.nit || '').trim();
  const isNitError = !rawNit || /[^0-9.\- ]/.test(rawNit) || rawNit.replace(/\D/g, '').length === 0;

  const telefonoDigits = (formData.telefono || '').replace(/\D/g, '');
  const isTelefonoError = telefonoDigits.length < 10;

  const emailVal = (formData.email || '').trim();
  const isEmailError = Boolean(emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal));

  const errorList = [];
  if (!formData.razonSocial?.trim()) errorList.push('Razón Social (*) requerida');
  if (isNitError) errorList.push('NIT o Cédula requerido');
  if (isTelefonoError) errorList.push('El celular debe tener 10 dígitos');
  if (!formData.direccion?.trim()) errorList.push('Dirección (*) requerida');
  if (isEmailError) errorList.push('Ingrese un correo electrónico válido');

  const hasErrors = errorList.length > 0;
  const isSubmitDisabled = hasErrors || isSubmitting;
  const submitTitle = hasErrors ? `Campos faltantes o inválidos: ${errorList.join(', ')}` : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitDisabled) return;
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const payload = {
        nombre: formData.razonSocial.trim(),
        nitCedula: formData.nit.replace(/\./g, '').trim(),
        nombreContacto: formData.nombreContacto?.trim() || null,
        telefono: formData.telefono.replace(/\D/g, '').trim(),
        email: formData.email?.trim() || null,
        direccion: formData.direccion.trim(),
        observaciones: formData.observaciones?.trim() || '',
        activo: formData.activo
      };
      let result;
      if (editingItem) {
        result = await apiClient.patch(`/suppliers/${editingItem.id}`, payload);
      } else {
        result = await apiClient.post('/suppliers', payload);
      }
      onClose();
      if (onSuccess) onSuccess(result || payload);
    } catch (err) {
      let textoFinal = err.response?.data?.message || err.message || '';
      if (!textoFinal || textoFinal.trim().endsWith('este') || textoFinal.trim().endsWith('este.') || textoFinal.length < 10 || textoFinal === 'Error al guardar el proveedor') {
        textoFinal = 'Ya existe un proveedor registrado con este NIT / Cédula o Razón Social.';
      }
      setErrorMessage(textoFinal);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    errorMessage,
    isDirty,
    isNitError,
    isTelefonoError,
    isEmailError,
    isSubmitDisabled,
    submitTitle,
    handleChange,
    handleSubmit
  };
}
