/**
 * @file useSupplierForm.js
 * @module catalog/suppliers/hooks
 * @description Manejo del formulario de creación y edición de proveedores.
 * @responsibility Controlar las variables del formulario y realizar el POST/PATCH.
 * @usedBy apps/web/src/app/catalog/suppliers/page.jsx
 * @dependencies @/lib/api-client
 */
import { useState } from 'react';
import { apiClient } from '@/lib/api-client';

export function useSupplierForm({ onSuccess }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre: '', nitCedula: '', nombreContacto: '',
    telefono: '', email: '', direccion: '',
    observaciones: '', activo: true
  });

  const handleOpenModal = (item) => {
    setErrorMsg(null);
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        nombre: '', nitCedula: '', nombreContacto: '',
        telefono: '', email: '', direccion: '',
        observaciones: '', activo: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Evitar parseFloat en inputs no type="number"
    let parsedValue = value;
    if (type === 'checkbox') parsedValue = checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      if (editingItem) {
        await apiClient.patch(`/suppliers/${editingItem.id}`, formData);
      } else {
        await apiClient.post('/suppliers', formData);
      }
      handleCloseModal();
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMsg(err.message || 'Error al guardar el proveedor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isModalOpen, editingItem, formData, handleOpenModal, handleCloseModal,
    handleChange, handleSubmit, isSubmitting, errorMsg
  };
}
