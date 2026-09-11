/**
 * @file SupplyModal.jsx
 * @module catalog/supplies/components
 * @description Modal para creación/edición de un insumo con validación Poka-Yoke (CSS Modules + Summary).
 * @responsibility Presentar el formulario y conectar validaciones y callbacks.
 * @usedBy apps/web/src/app/catalog/supplies/page.jsx
 * @dependencies SmartModal, SmartSelect
 */
import React from 'react';
import SmartModal, { SubmitButton } from '@/components/ui/SmartModal';
import SmartSelect from '@/components/ui/inputs/SmartSelect';
import styles from '@/components/ui/SmartModal.module.css';

export function SupplyModal({ isOpen, onClose, editingItem, formData, handleChange, handleSubmit, isSubmitting, errorMsg }) {
  const isDirty = !!formData.nombre || !!formData.categoria;

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e, {
      ...formData,
      stockMinimo: Number(formData.stockMinimo)
    });
  };

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

      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Nombre del Insumo <span style={{color: '#e11d48'}}>*</span></label>
          <input 
            name="nombre" 
            value={formData.nombre ?? ''} 
            onChange={handleChange} 
            placeholder="Ej: Leche Entera"
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
            options={[
              { id: 'MATERIA_PRIMA', label: 'Materia Prima' },
              { id: 'EMPAQUE', label: 'Material de Empaque' },
              { id: 'QUIMICOS', label: 'Químicos / Aseo' }
            ]}
            required
            placeholder="Seleccione categoría"
          />
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Subcategoría <span style={{color: '#e11d48'}}>*</span></label>
            <input 
              name="subcategoria" 
              value={formData.subcategoria ?? ''} 
              onChange={handleChange} 
              className={styles.input} 
              required 
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
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

          <div className={styles.inputGroup}>
            <label className={styles.label}>Unidad Base <span style={{color: '#e11d48'}}>*</span></label>
            <input 
              name="unidadBase" 
              value={formData.unidadBase ?? ''} 
              onChange={handleChange} 
              placeholder="Ej: litro, kg, gr"
              className={styles.input} 
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Stock Mínimo <span style={{color: '#e11d48'}}>*</span></label>
            <input 
              type="number"
              step="0.01"
              min="0"
              name="stockMinimo" 
              value={formData.stockMinimo ?? ''} 
              onChange={handleChange} 
              placeholder="Ej: 10"
              className={styles.input} 
              required 
            />
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
            <strong>Resumen:</strong> Se {editingItem ? 'actualizará' : 'creará'} el insumo <strong>{formData.nombre}</strong> (categoría {formData.categoria.replace('_', ' ').toLowerCase()}), el cual será medido en <strong>{formData.unidadBase}</strong> con un umbral de alerta en <strong>{formData.stockMinimo || 0}</strong> {formData.unidadBase}.
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
            disabled={!formData.nombre || !formData.categoria}
          />
        </div>
      </form>
    </SmartModal>
  );
}
