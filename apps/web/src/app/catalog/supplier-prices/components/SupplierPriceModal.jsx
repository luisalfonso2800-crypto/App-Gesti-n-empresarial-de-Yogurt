/**
 * @file SupplierPriceModal.jsx
 * @module catalog/supplier-prices/components
 * @description Modal y formulario para la creación/edición de precios de proveedor.
 * @responsibility Manejar la entrada de datos del usuario, validación y envío de petición.
 * @usedBy apps/web/src/app/catalog/supplier-prices/page.jsx
 * @dependencies @/components/ui/Modal, @/components/ui/Input, @/components/ui/Button, styles local
 */
import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import styles from '../supplier-prices.module.css';

export function SupplierPriceModal({ isOpen, onClose, editingItem, onSubmit }) {
  const [formData, setFormData] = useState({
    idInsumo: '',
    idProveedor: '',
    presentacionCompra: '',
    cantidadPresentacion: 0,
    unidadPresentacion: '',
    cantidadEquivalenteBase: 0,
    precioCompra: 0,
    costoUnidadBase: 0,
    observaciones: '',
    activo: true
  });

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
    } else {
      setFormData({
        idInsumo: '',
        idProveedor: '',
        presentacionCompra: '',
        cantidadPresentacion: 0,
        unidadPresentacion: '',
        cantidadEquivalenteBase: 0,
        precioCompra: 0,
        costoUnidadBase: 0,
        observaciones: '',
        activo: true
      });
    }
  }, [editingItem, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData, editingItem);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={editingItem ? 'Editar' : 'Nuevo'}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input label="ID Insumo" name="idInsumo" value={formData.idInsumo || ''} onChange={handleChange} required />
        <Input label="ID Proveedor" name="idProveedor" value={formData.idProveedor || ''} onChange={handleChange} required />
        <Input label="Presentación Compra" name="presentacionCompra" value={formData.presentacionCompra || ''} onChange={handleChange} required />
        <Input label="Cantidad Presentación" name="cantidadPresentacion" type="number" step="0.01" value={formData.cantidadPresentacion || 0} onChange={handleChange} required />
        <Input label="Unidad Presentación" name="unidadPresentacion" value={formData.unidadPresentacion || ''} onChange={handleChange} required />
        <Input label="Cantidad Equivalente Base" name="cantidadEquivalenteBase" type="number" step="0.01" value={formData.cantidadEquivalenteBase || 0} onChange={handleChange} required />
        <Input label="Precio Compra" name="precioCompra" type="number" step="0.01" value={formData.precioCompra || 0} onChange={handleChange} required />
        <Input label="Costo Unidad Base" name="costoUnidadBase" type="number" step="0.01" value={formData.costoUnidadBase || 0} onChange={handleChange} required />
        <Input label="Observaciones" name="observaciones" value={formData.observaciones || ''} onChange={handleChange} />
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
          <input type="checkbox" name="activo" checked={formData.activo} onChange={handleChange} />
          Activo
        </label>
        <div className={styles.formActions}>
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </Modal>
  );
}
