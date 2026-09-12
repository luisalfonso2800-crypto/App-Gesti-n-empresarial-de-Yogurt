/**
 * @file SupplyModal.jsx
 * @module components/catalog
 * @description Modal para creación/edición de un insumo con validación Poka-Yoke (CSS Modules + SmartModal).
 * @responsibility Presentar el formulario centralizado de insumos y conectar validaciones y reglas de MANNÁ.
 * @dependencies SmartModal, SmartSelect, numberToWords
 */
'use client';

import React, { useState, useEffect } from 'react';
import SmartModal, { SubmitButton } from '@/components/ui/SmartModal';
import SmartSelect from '@/components/ui/inputs/SmartSelect';
import styles from '@/components/ui/SmartModal.module.css';
import { apiClient } from '@/lib/api-client';
import { montoATextoPesos } from '@/utils/numberToWords';

const CATEGORIAS_INSUMOS = {
  MATERIA_PRIMA: {
    label: 'Materia Prima',
    subcategorias: [
      'Base Láctea',
      'Cultivos y Fermentos',
      'Endulzantes',
      'Frutas y Preparados',
      'Estabilizantes y Espesantes',
      'Aromas y Colorantes'
    ]
  },
  MATERIAL_EMPAQUE: {
    label: 'Material de Empaque',
    subcategorias: [
      'Envases Primarios',
      'Cierres y Sellos',
      'Identificación',
      'Empaque Secundario'
    ]
  },
  INOCUIDAD_SANITIZACION: {
    label: 'Inocuidad y Sanitización',
    subcategorias: [
      'Detergentes CIP',
      'Ácidos de Neutralización',
      'Desinfectantes Terminales',
      'Aseo General'
    ]
  },
  DOTACION_EPP: {
    label: 'Dotación y EPP',
    subcategorias: [
      'Protección Sanitaria'
    ]
  },
  MANTENIMIENTO_OPERATIVO: {
    label: 'Mantenimiento Operativo',
    subcategorias: [
      'Grado Alimenticio'
    ]
  }
};

export function SupplyModal({ isOpen, onClose, editingItem, onSuccess, initialData = {} }) {
  const [formData, setFormData] = useState({
    nombre: '', categoria: '', subcategoria: '', marca: '',
    unidadBase: '', empaque: '', stockMinimo: '', costoBase: '', observaciones: '', activo: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

  const formatThousands = (value) => {
    if (!value) return '';
    const numStr = value.toString().replace(/\D/g, '');
    if (!numStr) return '';
    return Number(numStr).toLocaleString('es-CO');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let parsedValue = value;
    if (type === 'checkbox') parsedValue = checked;
    if (['nombre', 'marca', 'subcategoria', 'observaciones'].includes(name)) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitDisabled) return;
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

  const isDirty = !!formData.nombre || !!formData.categoria;

  const unitNames = {
    'kg': 'kilogramos', 'g': 'gramos', 'L': 'litros', 'ml': 'mililitros', 'oz': 'onzas', 'und': 'unidades'
  };
  const selectedUnitName = unitNames[formData.unidadBase] || formData.unidadBase;
  const rawCostoBase = formData.costoBase ? Number(String(formData.costoBase).replace(/\./g, '')) : 0;
  const minStockNum = formData.stockMinimo ? Number(String(formData.stockMinimo).replace(/\./g, '')) : 0;

  const missingFields = [];
  if (!formData.nombre?.trim()) missingFields.push('Nombre del insumo');
  if (!formData.categoria) missingFields.push('Categoría');
  if (!formData.marca?.trim()) missingFields.push('Marca');
  if (!formData.unidadBase) missingFields.push('Unidad base');
  if (!formData.stockMinimo) missingFields.push('Stock mínimo');

  const isSubmitDisabled = missingFields.length > 0 || isSubmitting;
  const submitTitle = missingFields.length > 0
    ? `Complete los campos obligatorios: ${missingFields.join(', ')}`
    : '';

  return (
    <SmartModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={editingItem ? 'Editar Insumo' : 'Nuevo Insumo'}
      isDirty={isDirty}
      isSubmitting={isSubmitting}
    >
      {errorMsg && (
        <div style={{
          marginBottom: '1rem',
          backgroundColor: '#FEF2F2',
          border: '1px solid #F87171',
          color: '#B91C1C',
          padding: '0.6rem 0.85rem',
          borderRadius: '6px',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Nombre del Insumo <span style={{color: '#e11d48'}}>*</span></label>
          <input 
            name="nombre" 
            value={formData.nombre ?? ''} 
            onChange={handleChange} 
            placeholder="Ej: LECHE ENTERA"
            className={styles.input} 
            style={{ textTransform: 'uppercase' }}
            required 
          />
        </div>

        <div className={styles.twoColumns}>
          <SmartSelect
            label="Categoría"
            name="categoria"
            value={formData.categoria ?? ''}
            onChange={handleChange}
            options={Object.entries(CATEGORIAS_INSUMOS).map(([key, val]) => ({ id: key, label: val.label }))}
            required
            placeholder="Seleccione categoría"
          />
          
          <SmartSelect
            label="Subcategoría"
            name="subcategoria"
            value={formData.subcategoria ?? ''}
            onChange={handleChange}
            options={(CATEGORIAS_INSUMOS[formData.categoria]?.subcategorias || []).map(s => ({ id: s, label: s }))}
            required
            placeholder="Seleccione subcategoría"
            disabled={!formData.categoria}
          />
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Marca <span style={{color: '#e11d48'}}>*</span></label>
            <input 
              name="marca" 
              value={formData.marca ?? ''} 
              onChange={handleChange} 
              className={styles.input} 
              style={{ textTransform: 'uppercase' }}
              required 
            />
          </div>

          <SmartSelect
            label="Empaque"
            name="empaque"
            value={formData.empaque ?? ''}
            onChange={handleChange}
            options={[
              { id: 'UNIDAD', label: 'UNIDAD' },
              { id: 'ENVASE', label: 'ENVASE' },
              { id: 'BOLSA', label: 'BOLSA' },
              { id: 'CAJA', label: 'CAJA' },
              { id: 'BULTO', label: 'BULTO' },
              { id: 'BOTELLA', label: 'BOTELLA' },
              { id: 'BIDÓN', label: 'BIDÓN' },
              { id: 'CANASTILLA', label: 'CANASTILLA' },
              { id: 'OTRO', label: 'OTRO' }
            ]}
            placeholder="Seleccione empaque"
          />
        </div>

        <div className={styles.twoColumns}>
          <SmartSelect
            label="Unidad Base"
            name="unidadBase"
            value={formData.unidadBase ?? ''}
            onChange={handleChange}
            options={[
              { id: 'kg', label: 'Kilogramo (kg)' },
              { id: 'g', label: 'Gramo (g)' },
              { id: 'L', label: 'Litro (L)' },
              { id: 'ml', label: 'Mililitro (ml)' },
              { id: 'oz', label: 'Onza (oz)' },
              { id: 'und', label: 'Unidad / Pieza (und)' }
            ]}
            required
            placeholder="Seleccione unidad"
          />

          <div className={styles.inputGroup}>
            <label className={styles.label}>Stock Mínimo <span style={{color: '#e11d48'}}>*</span></label>
            <input 
              name="stockMinimo" 
              value={formData.stockMinimo ?? ''} 
              onChange={handleChange} 
              placeholder="0"
              className={styles.input} 
              style={{ textAlign: 'right' }}
              required 
            />
            {formData.stockMinimo && formData.unidadBase && (
              <span style={{ fontSize: '0.75rem', color: '#6b7280', fontStyle: 'italic', marginTop: '0.25rem', display: 'block' }}>
                *El mínimo {minStockNum === 1 ? 'es' : 'son'} {formData.stockMinimo} {selectedUnitName} para emitir alertas de reabastecimiento.*
              </span>
            )}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Costo Base Referencial ($)</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <input 
              name="costoBase" 
              value={formData.costoBase ?? ''} 
              onChange={handleChange} 
              placeholder="0"
              className={styles.input} 
              style={{ textAlign: 'right' }}
            />
            {rawCostoBase > 0 && (
              <span style={{ 
                fontSize: '0.75rem', 
                color: '#065F46', 
                backgroundColor: '#F7F4EE', 
                border: '1px solid #CAD5B5', 
                padding: '0.25rem 0.5rem', 
                borderRadius: '9999px',
                alignSelf: 'flex-end'
              }}>
                ✦ {montoATextoPesos(rawCostoBase)}
              </span>
            )}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Observaciones</label>
          <input 
            name="observaciones" 
            value={formData.observaciones ?? ''} 
            onChange={handleChange} 
            className={styles.input} 
            style={{ textTransform: 'uppercase' }}
          />
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', userSelect: 'none' }}>
          <input 
            type="checkbox" 
            name="activo" 
            checked={formData.activo} 
            onChange={handleChange}
          />
          <span style={{ fontSize: '0.875rem', color: '#1c1917' }}>Insumo Activo</span>
        </label>

        {formData.nombre && (
          <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '6px', fontSize: '0.76rem', color: '#166534' }}>
            <strong>Resumen:</strong> Se {editingItem ? 'actualizará' : 'creará'} el insumo <strong>{formData.nombre}</strong>{formData.categoria ? <> (categoría <strong>{formData.categoria.replace('_', ' ').toLowerCase()}</strong>)</> : null}{formData.unidadBase ? <>, medido en <strong>{formData.unidadBase}</strong> con umbral de alerta en <strong>{formData.stockMinimo || 0}</strong> {selectedUnitName}</> : null}{rawCostoBase > 0 ? <> y costo base de <strong>${rawCostoBase.toLocaleString('es-CO')}</strong></> : null}.
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
            text="Guardar Insumo"
            disabled={isSubmitDisabled}
            title={submitTitle}
            style={isSubmitDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          />
        </div>
      </form>
    </SmartModal>
  );
}
