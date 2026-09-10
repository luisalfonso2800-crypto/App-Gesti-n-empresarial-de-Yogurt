/**
 * @file useSaleForm.js
 * @module commercial/sales/hooks
 * @description Gestión del formulario de emisión de nuevas ventas.
 * @responsibility Manejar el state y el submit action de una factura de venta.
 * @usedBy apps/web/src/app/commercial/sales/page.jsx
 * @dependencies @/lib/api-client
 */
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export function useSaleForm({ onSuccess }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    idCliente: '', fechaVenta: new Date().toISOString().substring(0, 10),
    canalVenta: 'DIRECTO', tipoPago: 'CONTADO', totalVenta: 0,
    valorPagado: 0, saldoPendiente: 0, estado: 'COMPLETADO',
    observaciones: '', detalles: []
  });

  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    if (isModalOpen) {
      apiClient.get('/inventory/finished-products').then(res => setProducts(res.data || [])).catch(console.error);
      apiClient.get('/clients').then(setClients).catch(() => setClients([]));
    }
  }, [isModalOpen]);

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
      [name]: type === 'number' ? (parseFloat(value) || 0) : value
    }));
  };

  const handleDetailsChange = (newDetails) => {
    setFormData(prev => {
      const subtotal = newDetails.reduce((sum, d) => sum + (Number(d.cantidad) * Number(d.precioUnitario)), 0);
      return {
        ...prev,
        detalles: newDetails,
        totalVenta: subtotal,
        valorPagado: prev.tipoPago === 'CONTADO' ? subtotal : prev.valorPagado,
        saldoPendiente: prev.tipoPago === 'CONTADO' ? 0 : subtotal - prev.valorPagado
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.idCliente) return alert("Seleccione un cliente");
    if (formData.detalles.length === 0) return alert("Agregue al menos un producto a la orden");
    
    try {
      await apiClient.post('/sales', {
        ...formData,
        fechaVenta: new Date(formData.fechaVenta).toISOString(),
        valorPagado: formData.tipoPago === 'CONTADO' ? formData.totalVenta : formData.valorPagado,
        saldoPendiente: formData.tipoPago === 'CONTADO' ? 0 : formData.totalVenta - formData.valorPagado
      });
      handleCloseModal();
      if (onSuccess) onSuccess();
    } catch (err) {
      alert(err.message || 'Error al guardar');
    }
  };

  return {
    isModalOpen, formData, products, clients,
    handleOpenModal, handleCloseModal,
    handleChange, handleDetailsChange, handleSubmit
  };
}
