/**
 * @file useSupplyForm.js
 * @module catalog/supplies/hooks
 * @description Manejo del formulario de insumos.
 * @responsibility Controlar validaciones y peticiones POST/PATCH de insumos.
 * @usedBy apps/web/src/app/catalog/supplies/page.jsx
 * @dependencies @/lib/api-client
 */
import { useState } from 'react';
import { apiClient } from '@/lib/api-client';

export function useSupplyForm({ onSuccess }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '', categoria: '', subcategoria: '', marca: '',
    unidadBase: '', stockMinimo: 0, observaciones: '', activo: true
  });

  const handleOpenModal = (item) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        nombre: '', categoria: '', subcategoria: '', marca: '',
        unidadBase: '', stockMinimo: 0, observaciones: '', activo: true
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
        await apiClient.patch(`/supplies/${editingItem.id}`, formData);
      } else {
        await apiClient.post('/supplies', formData);
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
