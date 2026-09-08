/**
 * @file SupplyModal.jsx
 * @module catalog/supplies/components
 * @description Modal para creación/edición de un insumo.
 * @responsibility Presentar el formulario y conectar validaciones y callbacks.
 * @usedBy apps/web/src/app/catalog/supplies/page.jsx
 * @dependencies @/components/ui/Modal, Input, Button
 */
import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import styles from '../supplies.module.css';

export function SupplyModal({ isOpen, onClose, editingItem, formData, handleChange, handleSubmit }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingItem ? 'Editar' : 'Nuevo'}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input label="Nombre" name="nombre" value={formData.nombre || ''} onChange={handleChange} required />
        <Input label="Categoría" name="categoria" value={formData.categoria || ''} onChange={handleChange} required />
        <Input label="Subcategoría" name="subcategoria" value={formData.subcategoria || ''} onChange={handleChange} required />
        <Input label="Marca" name="marca" value={formData.marca || ''} onChange={handleChange} required />
        <Input label="Unidad Base" name="unidadBase" value={formData.unidadBase || ''} onChange={handleChange} required />
        <Input label="Stock Mínimo" name="stockMinimo" type="number" step="0.01" value={formData.stockMinimo || 0} onChange={handleChange} required />
        <Input label="Observaciones" name="observaciones" value={formData.observaciones || ''} onChange={handleChange} required />
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
          <input type="checkbox" name="activo" checked={formData.activo} onChange={handleChange} /> Activo
        </label>
        <div className={styles.formActions}>
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </Modal>
  );
}
