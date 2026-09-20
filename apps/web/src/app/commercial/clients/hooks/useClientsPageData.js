/**
 * @file useClientsPageData.js
 * @module commercial/clients/hooks
 * @description Hook orquestador de datos y formulario para ClientsPage.
 * @responsibility Cargar clientes del backend, formatear entradas (teléfonos, mayúsculas) y procesar creación.
 * @usedBy apps/web/src/app/commercial/clients/page.jsx
 * @dependencies react, @/lib/api-client
 */
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

const INITIAL_FORM = {
  nombre: '',
  tipoCliente: 'MINORISTA',
  canal: 'DIRECTO',
  contacto: '',
  telefono: '',
  direccion: '',
  diasCredito: '',
  observaciones: ''
};

export function useClientsPageData() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/clients');
      setClients(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleOpenModal = () => {
    setFormData(INITIAL_FORM);
    setSubmitError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const formatPhone = (value) => {
    if (!value) return '';
    const digits = value.toString().replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;
    if (['nombre', 'contacto', 'direccion', 'observaciones'].includes(name)) {
      parsedValue = value.toUpperCase();
    }
    if (name === 'telefono') {
      parsedValue = formatPhone(value);
    }
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const isDirty = !!formData.nombre || !!formData.contacto;

  const missingFields = [];
  if (!formData.nombre?.trim()) missingFields.push('Nombre / Razón Social');
  if (!formData.tipoCliente) missingFields.push('Tipo de cliente');
  if (!formData.canal) missingFields.push('Canal');
  if (formData.telefono && formData.telefono.replace(/\D/g, '').length < 10) missingFields.push('Teléfono debe tener 10 dígitos');

  const isSubmitDisabled = missingFields.length > 0 || isSubmitting;
  const submitTitle = missingFields.length > 0 ? `Complete los campos obligatorios: ${missingFields.join(', ')}` : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitDisabled) return;
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      await apiClient.post('/clients', {
        ...formData,
        nombre: (formData.nombre || '').trim().toUpperCase(),
        contacto: (formData.contacto || '').trim().toUpperCase() || null,
        direccion: (formData.direccion || '').trim().toUpperCase() || null,
        observaciones: (formData.observaciones || '').trim().toUpperCase() || null,
        telefono: formData.telefono ? formData.telefono.replace(/\D/g, '').trim() : null,
        diasCredito: Number(formData.diasCredito) || 0
      });
      handleCloseModal();
      fetchClients();
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || 'Error al guardar el cliente');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    clients,
    loading,
    error,
    submitError,
    isModalOpen,
    isSubmitting,
    formData,
    isDirty,
    isSubmitDisabled,
    submitTitle,
    handleOpenModal,
    handleCloseModal,
    handleChange,
    handleSubmit
  };
}
