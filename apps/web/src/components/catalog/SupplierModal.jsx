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
    nombre: '', nitCedula: '', nombreContacto: '',
    telefono: '', email: '', direccion: '',
    observaciones: '', activo: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        setFormData({
          ...editingItem,
          nitCedula: formatNitCedula(editingItem.nitCedula || '')
        });
      } else {
        setFormData({
          nombre: initialData.nombre || '', 
          nitCedula: '', nombreContacto: '',
          telefono: '', email: '', direccion: '',
          observaciones: '', activo: true
        });
      }
      setErrorMessage('');
    }
  }, [isOpen, editingItem, initialData.nombre]);

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

  const handleChange = (e) => {
    setErrorMessage('');
    const { name, value, type, checked } = e.target;
    let parsedValue = value;
    if (type === 'checkbox') parsedValue = checked;
    if (name === 'nombre') parsedValue = value.toUpperCase();
    if (name === 'nitCedula') parsedValue = formatNitCedula(value);
    if (name === 'telefono') parsedValue = value.replace(/[^0-9 ]/g, ''); 

    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const payload = {
         ...formData,
         nitCedula: formData.nitCedula.replace(/\./g, ''),
         nombreContacto: formData.nombreContacto || null,
         email: formData.email || null
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

  const isDirty = !!formData.nombre || !!formData.nitCedula;

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
            name="nombre" 
            value={formData.nombre ?? ''} 
            onChange={handleChange} 
            placeholder="Ej: LÁCTEOS XYZ S.A.S"
            className={styles.input} 
            required 
          />
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>NIT / Cédula <span style={{color: '#e11d48'}}>*</span></label>
            <input 
              name="nitCedula"
              value={formData.nitCedula ?? ''}
              onChange={handleChange}
              placeholder="Ej: 900.123.456-7"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Nombre de Contacto</label>
            <input 
              name="nombreContacto" 
              value={formData.nombreContacto ?? ''} 
              onChange={handleChange} 
              className={styles.input} 
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
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <input 
              type="email"
              name="email" 
              value={formData.email ?? ''} 
              onChange={handleChange} 
              className={styles.input} 
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Dirección <span style={{color: '#e11d48'}}>*</span></label>
          <input 
            name="direccion" 
            value={formData.direccion ?? ''} 
            onChange={handleChange} 
            className={styles.input} 
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
            style={{ minHeight: '80px', resize: 'vertical' }}
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

        {formData.nombre && formData.nitCedula && (
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>
            <strong>Resumen:</strong> Se {editingItem ? 'actualizará' : 'registrará'} el proveedor <strong>{formData.nombre}</strong> identificado con NIT/C.C. <strong>{formData.nitCedula}</strong>.
          </div>
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
            disabled={!formData.nombre || !formData.nitCedula || !formData.telefono || !formData.direccion || isSubmitting}
          />
        </div>
      </form>
    </SmartModal>
  );
}
