/**
 * @file ProductModal.jsx
 * @module catalog/products/components
 * @description Modal de administración de atributos del producto.
 * @responsibility Formulario para los valores comerciales del producto.
 * @usedBy apps/web/src/app/catalog/products/page.jsx
 * @dependencies @/components/ui/Modal, Input, Button
 */
import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import styles from '../products.module.css';

export function ProductModal({ isOpen, onClose, editingItem, formData, handleChange, handleSubmit }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingItem ? 'Editar' : 'Nuevo'}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input label="Nombre" name="nombre" value={formData.nombre || ''} onChange={handleChange} required />
        <Input label="ID Presentación" name="idPresentacion" value={formData.idPresentacion || ''} onChange={handleChange} required />
        <Input label="Categoría" name="categoria" value={formData.categoria || ''} onChange={handleChange} required />
        <Input label="Descripción" name="descripcion" value={formData.descripcion || ''} onChange={handleChange} required />
        <Input label="Canal de Venta" name="canalVenta" value={formData.canalVenta || ''} onChange={handleChange} required />
        <Input label="Precio Venta" name="precioVenta" type="number" step="0.01" value={formData.precioVenta || 0} onChange={handleChange} required />
        <Input label="Margen Objetivo" name="margenObjetivo" type="number" step="0.01" value={formData.margenObjetivo || 0} onChange={handleChange} required />
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
