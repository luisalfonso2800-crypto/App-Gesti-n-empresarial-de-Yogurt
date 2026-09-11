/**
 * @file SupplierModal.jsx
 * @module catalog/suppliers/components
 * @description Modal de creación/edición de proveedor (CSS Modules + SmartModal).
 * @responsibility Renderizar el formulario asociado a los proveedores con validaciones Poka-Yoke.
 * @usedBy apps/web/src/app/catalog/suppliers/page.jsx
 * @dependencies @/components/ui/SmartModal, StrictNumberInput
 */
import React from 'react';
import SmartModal, { SubmitButton } from '@/components/ui/SmartModal';
import StrictNumberInput from '@/components/ui/inputs/StrictNumberInput';
import styles from '@/components/ui/SmartModal.module.css';

export function SupplierModal({ isOpen, onClose, editingItem, formData, handleChange, handleSubmit, isSubmitting, errorMsg }) {
  const isDirty = !!formData.nombre || !!formData.nitCedula;

  return (
    <SmartModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={editingItem ? 'Editar Proveedor' : 'Nuevo Proveedor'}
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
          <label className={styles.label}>Razón Social / Nombre <span style={{color: '#e11d48'}}>*</span></label>
          <input 
            name="nombre" 
            value={formData.nombre ?? ''} 
            onChange={handleChange} 
            placeholder="Ej: Lácteos XYZ S.A.S"
            className={styles.input} 
            required 
          />
        </div>

        <div className={styles.twoColumns}>
          <StrictNumberInput
            label="NIT / Cédula"
            name="nitCedula"
            value={formData.nitCedula ?? ''}
            onChange={handleChange}
            placeholder="Sin guiones ni puntos"
            required
          />

          <div className={styles.inputGroup}>
            <label className={styles.label}>Nombre de Contacto <span style={{color: '#e11d48'}}>*</span></label>
            <input 
              name="nombreContacto" 
              value={formData.nombreContacto ?? ''} 
              onChange={handleChange} 
              className={styles.input} 
              required 
            />
          </div>
        </div>

        <div className={styles.twoColumns}>
          <StrictNumberInput
            label="Teléfono"
            name="telefono"
            value={formData.telefono ?? ''}
            onChange={handleChange}
            placeholder="Solo números"
            required
          />

          <div className={styles.inputGroup}>
            <label className={styles.label}>Email <span style={{color: '#e11d48'}}>*</span></label>
            <input 
              type="email"
              name="email" 
              value={formData.email ?? ''} 
              onChange={handleChange} 
              className={styles.input} 
              required 
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
            disabled={!formData.nombre || !formData.nitCedula}
          />
        </div>
      </form>
    </SmartModal>
  );
}
