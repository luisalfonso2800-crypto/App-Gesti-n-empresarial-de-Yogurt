/**
 * @file PresentationModal.jsx
 * @module catalog/presentations/components
 * @description Modal de registro y actualización de presentaciones.
 * @responsibility Presentar el form y capturar unidades volumétricas.
 * @usedBy apps/web/src/app/catalog/presentations/page.jsx
 * @dependencies @/components/ui/Modal, Input, Button
 */
import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import styles from '../presentations.module.css';

export function PresentationModal({ isOpen, onClose, editingItem, formData, handleChange, handleSubmit }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingItem ? 'Editar Presentación' : 'Nueva Presentación'}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input label="Nombre" name="nombre" value={formData.nombre || ''} onChange={handleChange} required />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input label="Cantidad (Oz)" name="cantidadOz" type="number" step="0.01" value={formData.cantidadOz || 0} onChange={handleChange} required />
          <Input label="Cantidad (Ml)" name="cantidadMl" type="number" step="0.01" value={formData.cantidadMl || 0} onChange={handleChange} required />
        </div>
        <Input label="Tipo de Envase" name="tipoEnvase" value={formData.tipoEnvase || ''} onChange={handleChange} required />
        <Input label="Observaciones" name="observaciones" value={formData.observaciones || ''} onChange={handleChange} />
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
