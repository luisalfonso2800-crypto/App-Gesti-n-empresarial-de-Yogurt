/**
 * @file useProductForm.js
 * @module catalog/products/hooks
 * @description Lógica del form de productos.
 * @responsibility Administrar el estado de edición e invocar guardado de productos.
 * @usedBy apps/web/src/app/catalog/products/page.jsx
 * @dependencies @/lib/api-client
 */
import { useState } from 'react';
import { apiClient } from '@/lib/api-client';

export function useProductForm({ onSuccess }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '', idPresentacion: '', categoria: '', descripcion: '',
    canalVenta: '', precioVenta: 0, margenObjetivo: 0, observaciones: '', activo: true
  });

  const handleOpenModal = (item) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        nombre: '', idPresentacion: '', categoria: '', descripcion: '',
        canalVenta: '', precioVenta: 0, margenObjetivo: 0, observaciones: '', activo: true
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
        await apiClient.patch(`/products/${editingItem.id}`, formData);
      } else {
        await apiClient.post('/products', formData);
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
