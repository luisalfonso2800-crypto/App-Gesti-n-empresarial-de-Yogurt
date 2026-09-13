/**
 * @file usePresentationForm.js
 * @module catalog/presentations/hooks
 * @description Gestión del formulario de presentaciones de producto con sincronización robusta de ID de contrato.
 * @responsibility Controlar variables del formulario, resolver claves de ID duales (id / idPresentacion), validar existencia antes de editar y sanitizar payloads.
 * @usedBy apps/web/src/app/catalog/presentations/page.jsx
 * @dependencies @/lib/api-client
 */

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';

const initialFormData = {
  id: '',
  idPresentacion: '',
  nombre: '',
  cantidadOz: '',
  cantidadMl: '',
  tipoEnvase: 'ENVASE',
  imagenUrl: '',
  observaciones: '',
  activo: true
};

export function usePresentationForm({ onSuccess }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [selectedId, setSelectedId] = useState(null);
  const [selectedPresentation, setSelectedPresentation] = useState(null);

  const [formData, setFormData] = useState(initialFormData);

  /**
   * Abre el modal en modo creación o edición, blindado contra eventos de clic (SyntheticEvents).
   * @param {Object|null} presentation - Datos del registro a editar o null/undefined para creación.
   */
  const handleOpenModal = (presentation = null) => {
    // Blindaje contra SyntheticEvents (clics de botones donde se pase el evento)
    const isSyntheticEvent = Boolean(
      presentation && (
        presentation.nativeEvent !== undefined ||
        presentation._reactName !== undefined ||
        typeof presentation.preventDefault === 'function' ||
        typeof presentation.stopPropagation === 'function'
      )
    );

    const isPlainObject = presentation && typeof presentation === 'object' && !isSyntheticEvent;
    
    // Resolución de ID tolerante sobre todas las variantes devueltas por PostgreSQL / Prisma
    const targetId = isPlainObject
      ? (presentation.id ?? presentation.idPresentacion ?? presentation.ID_Presentacion ?? presentation.id_presentacion ?? presentation._id ?? null)
      : null;

    // Solo es edición si es un objeto válido y posee un ID no vacío
    const hasValidId = Boolean(targetId && targetId !== 'undefined' && targetId !== 'null');
    const shouldEdit = Boolean(isPlainObject && hasValidId);

    if (shouldEdit) {
      const normalizedPresentation = {
        ...presentation,
        id: targetId,
        idPresentacion: targetId
      };

      setIsEditing(true);
      setSelectedId(targetId);
      setSelectedPresentation(normalizedPresentation);
      setEditingItem(normalizedPresentation);

      setFormData({
        id: targetId,
        idPresentacion: targetId,
        nombre: presentation.nombre ?? '',
        cantidadOz: presentation.cantidadOz != null ? String(presentation.cantidadOz) : '',
        cantidadMl: presentation.cantidadMl != null ? String(presentation.cantidadMl) : '',
        tipoEnvase: presentation.tipoEnvase ?? 'ENVASE',
        observaciones: presentation.observaciones ?? '',
        imagenUrl: presentation.imagenUrl ?? '',
        activo: presentation.activo ?? true
      });
    } else {
      setIsEditing(false);
      setSelectedId(null);
      setSelectedPresentation(null);
      setEditingItem(null);
      setFormData(initialFormData);
    }

    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedId(null);
    setSelectedPresentation(null);
    setEditingItem(null);
    setFormData(initialFormData);
    setErrorMsg('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (value ?? '')
    }));
  };

  const handleSubmit = async (e, customData) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const dataToSave = customData || formData;
      const cantOz = Math.max(0, Number(dataToSave.cantidadOz) || 0);
      const cantMl = Math.max(0, Number(dataToSave.cantidadMl) || 0);
      const imgClean = (dataToSave.imagenUrl || '').trim();

      const payload = {
        nombre: (dataToSave.nombre || '').trim().toUpperCase(),
        cantidadOz: cantOz,
        cantidadMl: cantMl,
        tipoEnvase: (dataToSave.tipoEnvase || 'ENVASE').trim().toUpperCase(),
        imagenUrl: imgClean || null,
        observaciones: (dataToSave.observaciones || '').trim().toUpperCase(),
        activo: Boolean(dataToSave.activo)
      };

      if (isEditing) {
        // Resolver el ID antes de la petición soportando selectedId, selectedPresentation o editingItem
        const id = selectedId 
          ?? selectedPresentation?.id 
          ?? selectedPresentation?.idPresentacion 
          ?? selectedPresentation?.ID_Presentacion
          ?? editingItem?.id 
          ?? editingItem?.idPresentacion 
          ?? editingItem?.ID_Presentacion
          ?? customData?.id 
          ?? customData?.idPresentacion 
          ?? formData?.id 
          ?? formData?.idPresentacion 
          ?? null;

        if (!id || id === 'undefined' || id === 'null') {
          setErrorMsg('No se pudo identificar la presentación para editar (identificador no válido).');
          setIsSubmitting(false);
          return;
        }
        await apiClient.patch(`/presentations/${id}`, payload);
      } else {
        await apiClient.post('/presentations', payload);
      }
      handleCloseModal();
      if (onSuccess) onSuccess();
    } catch (err) {
      const safeMsg = err.response?.data?.message || err.message || 'Error al procesar';
      setErrorMsg(typeof safeMsg === 'object' ? JSON.stringify(safeMsg) : String(safeMsg));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isModalOpen, isEditing, editingItem, selectedId, selectedPresentation, formData, setFormData, handleOpenModal, handleCloseModal,
    handleChange, handleSubmit, isSubmitting, errorMsg
  };
}
