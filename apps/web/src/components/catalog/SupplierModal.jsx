/**
 * @file SupplierModal.jsx
 * @module components/catalog
 * @description Modal de creación/edición de proveedor (CSS Modules + SmartModal) con validaciones MANNÁ.
 * @responsibility Renderizar el formulario asociado a los proveedores con validaciones Poka-Yoke y formatos DIAN.
 * @dependencies @/components/ui/SmartModal
 */
'use client';

import React, { useState, useEffect } from 'react';
import SmartModal, { SubmitButton } from '@/components/ui/SmartModal';
import styles from '@/components/ui/SmartModal.module.css';
import { apiClient } from '@/lib/api-client';

export function SupplierModal({ isOpen, onClose, editingItem, onSuccess, initialData = {} }) {
  const [formData, setFormData] = useState({
    razonSocial: '',
    nit: '',
    nombreContacto: '',
    telefono: '',
    email: '',
    direccion: '',
    observaciones: '',
    activo: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const formatNitCedula = (value) => {
    if (!value) return '';
    let cleaned = value.toString().replace(/[^0-9-]/g, '');
    const parts = cleaned.split('-');
    let main = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
        const response = await apiClient.patch(`/suppliers/${editingItem.id}`, payload);
        result = response;
      } else {
        const response = await apiClient.post('/suppliers', payload);
        result = response;
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

  const submitTitle = hasErrors
    ? `Campos faltantes o inválidos: ${errorList.join(', ')}`
    : '';

  return (
    <SmartModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={editingItem ? 'Editar Proveedor' : 'Nuevo Proveedor'}
      isDirty={isDirty}
      isSubmitting={isSubmitting}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Razón Social / Nombre <span style={{color: '#e11d48'}}>*</span></label>
          <input 
            name="razonSocial" 
            value={formData.razonSocial ?? ''} 
            onChange={handleChange} 
            placeholder="Ej: LÁCTEOS XYZ S.A.S"
            className={styles.input} 
            style={{ textTransform: 'uppercase' }}
            required 
          />
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>NIT / Cédula <span style={{color: '#e11d48'}}>*</span></label>
            <input 
              name="nit"
              value={formData.nit ?? ''}
              onChange={handleChange}
              placeholder="Ej: 900.123.456-7"
              className={styles.input}
              style={isNitError ? { border: '1px solid #EF4444' } : {}}
              required
            />
            {isNitError && (
              <span style={{ color: '#DC2626', fontSize: '0.72rem', display: 'block', marginTop: '3px' }}>
                NIT o Cédula requerido
              </span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Nombre de Contacto</label>
            <input 
              name="nombreContacto" 
              value={formData.nombreContacto ?? ''} 
              onChange={handleChange} 
              className={styles.input} 
              style={{ textTransform: 'uppercase' }}
            />
          </div>
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Teléfono / Celular <span style={{color: '#e11d48'}}>*</span></label>
            <input 
              name="telefono"
              value={formData.telefono ?? ''}
              onChange={handleChange}
              placeholder="Ej: 300 123 4567"
              className={styles.input}
              style={isTelefonoError ? { border: '1px solid #EF4444' } : {}}
              required
            />
            {isTelefonoError && (
              <span style={{ color: '#DC2626', fontSize: '0.72rem', display: 'block', marginTop: '3px' }}>
                El celular debe tener 10 dígitos
              </span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <input 
              type="email"
              name="email" 
              value={formData.email ?? ''} 
              onChange={handleChange} 
              className={styles.input} 
              style={isEmailError ? { border: '1px solid #EF4444' } : {}}
            />
            {isEmailError && (
              <span style={{ color: '#DC2626', fontSize: '0.72rem', display: 'block', marginTop: '3px' }}>
                Ingrese un correo electrónico válido (ej. contacto@empresa.com)
              </span>
            )}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Dirección <span style={{color: '#e11d48'}}>*</span></label>
          <input 
            name="direccion" 
            value={formData.direccion ?? ''} 
            onChange={handleChange} 
            className={styles.input} 
            style={{ textTransform: 'uppercase' }}
            required 
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Observaciones</label>
          <textarea 
            name="observaciones" 
            value={formData.observaciones ?? ''} 
            onChange={handleChange} 
            className={styles.input} 
            style={{ minHeight: '80px', resize: 'vertical', textTransform: 'uppercase' }}
          />
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', userSelect: 'none' }}>
          <input 
            type="checkbox" 
            name="activo" 
            checked={formData.activo} 
            onChange={handleChange}
          />
          <span style={{ fontSize: '0.875rem', color: '#1c1917' }}>Proveedor Activo</span>
        </label>

        {formData.razonSocial && (
          <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '6px', fontSize: '0.76rem', color: '#166534' }}><strong>Resumen:</strong> Se registrará el proveedor <strong>{formData.razonSocial}</strong>{formData.nit ? <> identificado con NIT/C.C. <strong>{formData.nit}</strong></> : null}.</div>
        )}

        {errorMessage && (
          <div style={{
            marginTop: '0.75rem',
            padding: '0.6rem 0.85rem',
            backgroundColor: '#FEF2F2',
            border: '1px solid #F87171',
            borderRadius: '6px',
            color: '#991B1B',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <div className={styles.actions}>
          <button 
            type="button" 
            onClick={onClose}
            className={styles.btnCancel}
          >
            Cancelar
          </button>
          <SubmitButton 
            isSubmitting={isSubmitting} 
            text="Guardar Proveedor"
            disabled={isSubmitDisabled}
            title={submitTitle}
            style={isSubmitDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          />
        </div>
      </form>
    </SmartModal>
  );
}
