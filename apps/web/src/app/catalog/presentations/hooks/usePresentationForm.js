/**
 * @file usePresentationForm.js
 * @module catalog/presentations/hooks
 * @description Gestión del formulario de presentaciones de producto.
 * @responsibility Controlar las variables del formulario y realizar el POST/PATCH.
 * @usedBy apps/web/src/app/catalog/presentations/page.jsx
 * @dependencies @/lib/api-client
 */
import { useState } from 'react';
import { apiClient } from '@/lib/api-client';

export function usePresentationForm({ onSuccess }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre: '', cantidadOz: 0, cantidadMl: 0,
    tipoEnvase: '', activo: true, observaciones: ''
  });

  const handleOpenModal = (item) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        nombre: '', cantidadOz: 0, cantidadMl: 0,
        tipoEnvase: '', activo: true, observaciones: ''
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
        await apiClient.patch(`/presentations/${editingItem.id}`, formData);
      } else {
        await apiClient.post('/presentations', formData);
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
