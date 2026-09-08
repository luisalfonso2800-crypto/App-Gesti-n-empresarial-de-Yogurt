/**
 * @file useSaleForm.js
 * @module commercial/sales/hooks
 * @description Gestión del formulario de emisión de nuevas ventas.
 * @responsibility Manejar el state y el submit action de una factura de venta.
 * @usedBy apps/web/src/app/commercial/sales/page.jsx
 * @dependencies @/lib/api-client
 */
import { useState } from 'react';
import { apiClient } from '@/lib/api-client';

export function useSaleForm({ onSuccess }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    idCliente: '', fechaVenta: new Date().toISOString().substring(0, 10),
    canalVenta: 'DIRECTO', tipoPago: 'CONTADO', totalVenta: 0,
    valorPagado: 0, saldoPendiente: 0, estado: 'COMPLETADO',
    observaciones: '', detalles: []
  });

  const handleOpenModal = () => {
    setFormData({
      idCliente: '', fechaVenta: new Date().toISOString().substring(0, 10),
      canalVenta: 'DIRECTO', tipoPago: 'CONTADO', totalVenta: 0,
      valorPagado: 0, saldoPendiente: 0, estado: 'COMPLETADO',
      observaciones: '', detalles: []
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/sales', {
        ...formData,
        fechaVenta: new Date(formData.fechaVenta).toISOString()
      });
      handleCloseModal();
      if (onSuccess) onSuccess();
    } catch (err) {
      alert(err.message || 'Error al guardar');
    }
  };

  return {
    isModalOpen, formData, handleOpenModal, handleCloseModal,
    handleChange, handleSubmit
  };
}
