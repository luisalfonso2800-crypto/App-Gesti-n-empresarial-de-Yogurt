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
    if (name === 'nombre' || name === 'marca' || name === 'subcategoria') {
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
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const payload = {
        ...formData,
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
      setErrorMsg(err.message || err.response?.data?.message || 'Error al guardar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDirty = !!formData.nombre || !!formData.categoria;

  const unitNames = {
    'kg': 'kilogramos', 'g': 'gramos', 'L': 'litros', 'ml': 'mililitros', 'oz': 'onzas', 'und': 'unidades'
  };
  const selectedUnitName = unitNames[formData.unidadBase] || formData.unidadBase;
  const rawCostoBase = formData.costoBase ? Number(formData.costoBase.replace(/\./g, '')) : 0;

  return (
    <SmartModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={editingItem ? 'Editar Insumo' : 'Nuevo Insumo'}
      isDirty={isDirty}
      isSubmitting={isSubmitting}
    >
      {errorMsg && (
        <div className={styles.errorBanner}>
          {errorMsg}
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
                El stock mínimo de {formData.nombre || 'este insumo'}{formData.marca ? ` de la marca ${formData.marca}` : ''} es de {formData.stockMinimo} {selectedUnitName}.
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

        {formData.nombre && formData.categoria && formData.unidadBase && (
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>
            <strong>Resumen:</strong> Se {editingItem ? 'actualizará' : 'creará'} el insumo <strong>{formData.nombre}</strong> (categoría {formData.categoria.replace('_', ' ').toLowerCase()}), el cual será medido en <strong>{formData.unidadBase}</strong> con un umbral de alerta en <strong>{formData.stockMinimo || 0}</strong> {selectedUnitName}.
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
            disabled={!formData.nombre || !formData.categoria || !formData.unidadBase || !formData.stockMinimo || isSubmitting}
          />
        </div>
      </form>
    </SmartModal>
  );
}
