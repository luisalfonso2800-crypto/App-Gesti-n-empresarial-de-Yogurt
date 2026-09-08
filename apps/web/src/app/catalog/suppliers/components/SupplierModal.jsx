/**
 * @file SupplierModal.jsx
 * @module catalog/suppliers/components
 * @description Modal de creación/edición de proveedor.
 * @responsibility Renderizar el formulario asociado a los proveedores.
 * @usedBy apps/web/src/app/catalog/suppliers/page.jsx
 * @dependencies @/components/ui/Modal, Input, Button
 */
import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import styles from '../suppliers.module.css';

export function SupplierModal({ isOpen, onClose, editingItem, formData, handleChange, handleSubmit }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingItem ? 'Editar' : 'Nuevo'}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input label="Nombre" name="nombre" value={formData.nombre || ''} onChange={handleChange} required />
        <Input label="NIT/Cédula" name="nitCedula" value={formData.nitCedula || ''} onChange={handleChange} required />
        <Input label="Nombre Contacto" name="nombreContacto" value={formData.nombreContacto || ''} onChange={handleChange} required />
        <Input label="Teléfono" name="telefono" value={formData.telefono || ''} onChange={handleChange} required />
        <Input label="Email" name="email" value={formData.email || ''} onChange={handleChange} required />
        <Input label="Dirección" name="direccion" value={formData.direccion || ''} onChange={handleChange} required />
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
