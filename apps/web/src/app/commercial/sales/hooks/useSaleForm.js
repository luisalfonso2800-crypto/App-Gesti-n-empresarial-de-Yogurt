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
        apiClient.get('/inventory/finished-products').catch(() => []),
        apiClient.get('/products?comercial=true').catch(() => [])
      ]).then(([invRes, prodsRes]) => {
        const invList = Array.isArray(invRes) ? invRes : (invRes?.data || []);
        const prodsList = Array.isArray(prodsRes) ? prodsRes : (prodsRes?.data || []);

        const isCommercialPackaged = (p) => {
          const prod = p.producto || p;
          const unidad = (p.unidadMedida || prod.unidadMedida || p.receta?.unidadRendimiento || '').toLowerCase();
          const esLitroPuro = (unidad === 'litros' || unidad === 'litro' || unidad === 'l') && !p.presentacionId && !prod.presentacionId && !p.presentacion && !prod.presentacion;
          const esGranelNombre = /granel/i.test(prod.nombre || p.nombre || '');
          if (esLitroPuro || esGranelNombre) return false;

          const esUnidad = unidad.includes('und') || Boolean(p.presentacionId || prod.presentacionId || p.presentacion || prod.presentacion);
          const esLacteoEnvasado = prod.categoria === 'LACTEOS' || p.categoria === 'LACTEOS';
          return esUnidad || esLacteoEnvasado;
        };

        if (invList.length > 0) {
          const filteredInv = invList.filter(isCommercialPackaged);
          const mapped = filteredInv.map(item => {
            const prod = item.producto || {};
            const stock = Number(item.cantidadActual ?? item.stockCava ?? item.stockActual ?? 0);
            const presObj = prod.presentacion || item.presentacion;
            const presNombre = presObj?.nombre || item.presentacionNombre || prod.presentacionNombre || '';
            const contNeto = presObj?.contenidoNeto || prod.contenidoNeto || item.contenidoNeto || '';
            const volPres = item.volumenPresentacion || prod.volumenPresentacion || presObj?.volumen || presObj?.volumenOzMl || (
              presObj?.cantidadMl ? `${presObj?.cantidadOz ? `${presObj?.cantidadOz} oz / ` : ''}${presObj?.cantidadMl} ml` : ''
            ) || contNeto || '';

            return {
              ...item,
              id: item.idProducto || item.id,
              nombre: prod.nombre || item.nombre || 'Producto',
              presentacion: presObj,
              presentacionNombre: presNombre,
              nombrePresentacion: presNombre,
              volumenPresentacion: volPres,
              contenidoNeto: contNeto || volPres,
              fotoComercialUrl: prod.fotoComercialUrl || prod.imagenUrl || item.fotoComercialUrl,
              precioVenta: Number(prod.precioVentaSug || prod.precioVenta || item.precioVenta || 0),
              precioMayorista: Number(prod.precioMayorista || item.precioMayorista || 0),
              cantidadMinimaMayorista: Number(prod.cantidadMinimaMayorista || item.cantidadMinimaMayorista || 12),
              stockCava: stock,
              stockActual: stock,
              cantidadActual: stock,
              costoPromedio: Number(item.costoPromedio || prod.costoEstandar || 0),
              producto: { ...prod, ...item, presentacionNombre: presNombre, nombrePresentacion: presNombre, volumenPresentacion: volPres, contenidoNeto: contNeto || volPres }
            };
          });
          setProducts(mapped);
        } else if (prodsList.length > 0) {
          const filteredProds = prodsList.filter(isCommercialPackaged);
          const mapped = filteredProds.map(prod => {
            const stock = Number(prod.stockCava ?? prod.stockActual ?? prod.inventario?.cantidadActual ?? 0);
            const presObj = prod.presentacion;
            const presNombre = presObj?.nombre || prod.presentacionNombre || prod.nombrePresentacion || '';
            const contNeto = presObj?.contenidoNeto || prod.contenidoNeto || '';
            const volPres = prod.volumenPresentacion || presObj?.volumen || presObj?.volumenOzMl || (
              presObj?.cantidadMl ? `${presObj?.cantidadOz ? `${presObj?.cantidadOz} oz / ` : ''}${presObj?.cantidadMl} ml` : ''
            ) || contNeto || '';

            return {
              id: prod.id,
              idProducto: prod.id,
              nombre: prod.nombre,
              presentacion: presObj,
              presentacionNombre: presNombre,
              nombrePresentacion: presNombre,
              volumenPresentacion: volPres,
              contenidoNeto: contNeto || volPres,
              fotoComercialUrl: prod.fotoComercialUrl || prod.imagenUrl,
              precioVenta: Number(prod.precioVenta || prod.precioVentaSug || 0),
              precioMayorista: Number(prod.precioMayorista || 0),
              cantidadMinimaMayorista: Number(prod.cantidadMinimaMayorista || 12),
              stockCava: stock,
              stockActual: stock,
              cantidadActual: stock,
              costoPromedio: Number(prod.inventario?.costoPromedio || prod.costoEstandar || 0),
              producto: { ...prod, presentacionNombre: presNombre, nombrePresentacion: presNombre, volumenPresentacion: volPres, contenidoNeto: contNeto || volPres }
            };
          });
          setProducts(mapped);
        } else {
          setProducts([]);
        }
      }).catch(console.error);

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
