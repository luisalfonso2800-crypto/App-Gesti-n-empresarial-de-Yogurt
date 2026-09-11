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
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    nombre: '', cantidadOz: '', cantidadMl: '',
    tipoEnvase: '', activo: true, observaciones: ''
  });

  const handleOpenModal = (item) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        ...item,
        cantidadOz: item.cantidadOz ?? '',
        cantidadMl: item.cantidadMl ?? '',
        nombre: item.nombre ?? '',
        tipoEnvase: item.tipoEnvase ?? '',
        observaciones: item.observaciones ?? ''
      });
    } else {
      setEditingItem(null);
      setFormData({
        nombre: '', cantidadOz: '', cantidadMl: '',
        tipoEnvase: '', activo: true, observaciones: ''
      });
    }
    setErrorMsg('');
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
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e, customData) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const payload = customData || formData;
      if (editingItem) {
        await apiClient.patch(`/presentations/${editingItem.id}`, payload);
      } else {
        await apiClient.post('/presentations', payload);
      }
      handleCloseModal();
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMsg(err.message || 'Error al guardar');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isModalOpen, editingItem, formData, setFormData, handleOpenModal, handleCloseModal,
    handleChange, handleSubmit, isSubmitting, errorMsg
  };
}
