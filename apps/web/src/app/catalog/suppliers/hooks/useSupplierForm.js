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
  
  const [formData, setFormData] = useState({
    nombre: '', nitCedula: '', nombreContacto: '',
    telefono: '', email: '', direccion: '',
    observaciones: '', activo: true
  });

  const handleOpenModal = (item) => {
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
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await apiClient.patch(`/suppliers/${editingItem.id}`, formData);
      } else {
        await apiClient.post('/suppliers', formData);
      }
      handleCloseModal();
      if (onSuccess) onSuccess();
    } catch (err) {
      alert(err.message || 'Error al guardar');
    }
  };

  return {
    isModalOpen, editingItem, formData, handleOpenModal, handleCloseModal,
    handleChange, handleSubmit
  };
}
