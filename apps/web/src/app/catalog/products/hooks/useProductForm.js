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
  const [presentations, setPresentations] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    nombre: '', idPresentacion: '', categoria: '', descripcion: '',
    canalVenta: '', precioVenta: '', margenObjetivo: '', observaciones: '', activo: true,
    precioMayorista: '', cantidadMinimaMayorista: 12, descuentoMayoristaPorcentaje: '',
    tipoImpuesto: 'GRAVADO', tarifaIva: 19, precioIncluyeIva: true,
    codigo: '', costoEstimado: '', unidadVenta: 'UND', stockMinimo: '5'
  });

  const loadPresentations = async () => {
    try {
      const data = await apiClient.get('/presentations');
      setPresentations(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenModal = (item) => {
    loadPresentations();
    if (item) {
      setEditingItem(item);
      const { presentacion, recetas, lotes, inventario, ...restItem } = item;
      setFormData({
        ...restItem,
        idPresentacion: item.idPresentacion || item.presentacion?.id || '',
        precioVenta: item.precioVenta || '',
        margenObjetivo: item.margenObjetivo || '',
        precioMayorista: item.precioMayorista ?? '',
        cantidadMinimaMayorista: item.cantidadMinimaMayorista ?? 12,
        descuentoMayoristaPorcentaje: item.descuentoMayoristaPorcentaje ?? '',
        tipoImpuesto: item.tipoImpuesto || 'GRAVADO',
        tarifaIva: item.tarifaIva !== undefined && item.tarifaIva !== null ? Number(item.tarifaIva) : 19,
        precioIncluyeIva: item.precioIncluyeIva ?? true,
        codigo: item.codigo || '',
        costoEstimado: item.costoEstimado || '',
        unidadVenta: item.unidadVenta || 'UND',
        stockMinimo: item.inventario?.stockMinimo ?? item.stockMinimo ?? '5'
      });
    } else {
      setEditingItem(null);
      setFormData({
        nombre: '', idPresentacion: '', categoria: '', descripcion: '',
        canalVenta: '', precioVenta: '', margenObjetivo: '', observaciones: '', activo: true,
        precioMayorista: '', cantidadMinimaMayorista: 12, descuentoMayoristaPorcentaje: '',
        tipoImpuesto: 'GRAVADO', tarifaIva: 19, precioIncluyeIva: true,
        codigo: '', costoEstimado: '', unidadVenta: 'UND', stockMinimo: '5'
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
    let parsedValue = type === 'checkbox' ? checked : value;

    if (name === 'stockMinimo') {
      const num = parseInt(value, 10);
      if (isNaN(num) || num < 0) {
        parsedValue = '0';
      } else {
        parsedValue = String(num);
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const handleSubmit = async (e, customData) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const rawPayload = customData || formData;
      const {
        presentacion,
        recetas,
        producciones,
        lotes,
        inventario,
        detalleVentas,
        movimientos,
        recetasConsumo,
        detallesProduccionConsumo,
        ...cleanPayload
      } = rawPayload;

      const payload = {
        ...cleanPayload,
        idPresentacion: String(cleanPayload.idPresentacion || presentacion?.id || '')
      };

      if (editingItem) {
        await apiClient.patch(`/products/${editingItem.id}`, payload);
      } else {
        await apiClient.post('/products', payload);
      }
      handleCloseModal();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('onboarding:refresh'));
        window.dispatchEvent(new Event('onboarding-refresh'));
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMsg(err.message || 'Error al guardar');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isModalOpen, editingItem, formData, presentations, isSubmitting, errorMsg, handleOpenModal, handleCloseModal,
    handleChange, handleSubmit
  };
}
