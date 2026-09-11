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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    nombre: '', categoria: '', subcategoria: '', marca: '',
    unidadBase: '', stockMinimo: '', observaciones: '', activo: true
  });

  const handleOpenModal = (item) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        ...item,
        stockMinimo: item.stockMinimo || ''
      });
    } else {
      setEditingItem(null);
      setFormData({
        nombre: '', categoria: '', subcategoria: '', marca: '',
        unidadBase: '', stockMinimo: '', observaciones: '', activo: true
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
        await apiClient.patch(`/supplies/${editingItem.id}`, payload);
      } else {
        await apiClient.post('/supplies', payload);
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
    isModalOpen, editingItem, formData, handleOpenModal, handleCloseModal,
    handleChange, handleSubmit, isSubmitting, errorMsg
  };
}
