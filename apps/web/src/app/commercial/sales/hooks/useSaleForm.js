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
      Promise.all([
        apiClient.get('/products/selector').catch(() => []),
        apiClient.get('/clients').catch(() => [])
      ]).then(([prodsRes, clientsRes]) => {
        const prodsList = Array.isArray(prodsRes) ? prodsRes : (prodsRes?.data || []);
        const mapped = prodsList.map(p => {
          const stock = Number(p.inventario?.cantidadActual ?? p.stock ?? 0);
          const presObj = p.presentacion || {};
          const presNombre = presObj.nombre || '';
          const volPres = p.volumenPresentacion || (
            presObj.cantidadMl ? `${presObj.cantidadOz ? `${presObj.cantidadOz} oz / ` : ''}${presObj.cantidadMl} ml` : presNombre
          );

          return {
            ...p,
            id: p.id,
            nombre: p.nombre,
            presentacion: presObj,
            presentacionNombre: presNombre,
            nombrePresentacion: presNombre,
            volumenPresentacion: volPres,
            fotoComercialUrl: p.imagenUrl,
            precioVenta: Number(p.precioVenta || 0),
            precioMayorista: Number(p.precioMayorista || 0),
            cantidadMinimaMayorista: Number(p.cantidadMinimaMayorista || 12),
            stockCava: stock,
            stockActual: stock,
            cantidadActual: stock,
            stock: stock,
            producto: p
          };
        });
        setProducts(mapped);
        setClients(Array.isArray(clientsRes) ? clientsRes : (clientsRes?.data || []));
      });
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.idCliente) {
      setErrorMsg("Seleccione un cliente");
      return;
    }
    if (formData.detalles.length === 0) {
      setErrorMsg("Agregue al menos un producto a la orden");
      return;
    }
    
    setIsSubmitting(true);
    setErrorMsg('');
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
      setErrorMsg(err.message || 'Error al procesar la venta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const reloadClients = async () => {
    try {
      const data = await apiClient.get('/clients');
      setClients(data || []);
      return data || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  return {
    isModalOpen, formData, products, clients, isSubmitting, errorMsg,
    handleOpenModal, handleCloseModal, reloadClients, setFormData,
    handleChange, handleDetailsChange, handleSubmit
  };
}
