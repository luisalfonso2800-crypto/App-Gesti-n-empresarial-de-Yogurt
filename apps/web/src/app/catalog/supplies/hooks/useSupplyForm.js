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
      const rawPayload = customData || formData;
      if (editingItem) {
        const { id: _id, precios, createdAt, updatedAt, ...cleanPayload } = rawPayload;
        await apiClient.patch(`/supplies/${editingItem.id}`, cleanPayload);
        const diffs = [];
        if (cleanPayload.nombre !== editingItem.nombre) diffs.push(`Nombre: ${cleanPayload.nombre}`);
        if (Number(cleanPayload.costoBase || 0) !== Number(editingItem.costoBase || 0)) {
          diffs.push(`Costo: $${Number(editingItem.costoBase || 0).toLocaleString('es-CO')} → $${Number(cleanPayload.costoBase || 0).toLocaleString('es-CO')}`);
        }
        if (Number(cleanPayload.stockMinimo || 0) !== Number(editingItem.stockMinimo || 0)) {
          diffs.push(`Stock: ${editingItem.stockMinimo || 0} → ${cleanPayload.stockMinimo || 0}`);
        }
        if (cleanPayload.marca !== editingItem.marca) diffs.push('Marca');
        if (cleanPayload.categoria !== editingItem.categoria) diffs.push('Categoría');
        const diffMsg = diffs.length === 1
          ? `Insumo "${cleanPayload.nombre || editingItem.nombre}" actualizado (${diffs[0]}).`
          : diffs.length > 1
            ? `Insumo "${cleanPayload.nombre || editingItem.nombre}" actualizado (Modificado: ${diffs.join(', ')}).`
            : `Insumo "${cleanPayload.nombre || editingItem.nombre}" actualizado sin cambios críticos.`;
        handleCloseModal();
        if (onSuccess) onSuccess({ ...cleanPayload, id: editingItem.id, isEdit: true, customMessage: diffMsg });
      } else {
        await apiClient.post('/supplies', rawPayload);
        handleCloseModal();
        if (onSuccess) onSuccess({ ...rawPayload, isEdit: false });
      }
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
