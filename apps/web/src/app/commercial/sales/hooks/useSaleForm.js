/**
 * @file useSaleForm.js
 * @module commercial/sales/hooks
 * @description Gestión del formulario de emisión de nuevas ventas con liquidación tributaria (SRP < 150).
 * @responsibility Manejar el state, cálculo condicional de IVA y el submit de una factura de venta.
 * @usedBy apps/web/src/app/commercial/sales/page.jsx
 * @dependencies @/lib/api-client
 */
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

const INITIAL_FORM = {
  idCliente: '',
  fechaVenta: new Date().toISOString().substring(0, 10),
  canalVenta: 'DIRECTO',
  tipoPago: 'CONTADO',
  aplicaIva: false,
  subtotal: 0,
  descuentoTotal: 0,
  baseImponible: 0,
  ivaTotal: 0,
  totalVenta: 0,
  valorPagado: 0,
  saldoPendiente: 0,
  estado: 'COMPLETADO',
  observaciones: '',
  detalles: []
};

export function useSaleForm({ onSuccess }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdSale, setCreatedSale] = useState(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
            volumenPresentacion: volPres,
            fotoComercialUrl: p.imagenUrl,
            precioVenta: Number(p.precioVenta || 0),
            precioMayorista: Number(p.precioMayorista || 0),
            cantidadMinimaMayorista: Number(p.cantidadMinimaMayorista || 12),
            tipoImpuesto: p.tipoImpuesto || 'GRAVADO',
            tarifaIva: p.tarifaIva !== undefined && p.tarifaIva !== null ? Number(p.tarifaIva) : 19,
            precioIncluyeIva: p.precioIncluyeIva ?? true,
            stockCava: stock,
            stockActual: stock,
            producto: p
          };
        });
        setProducts(mapped);
        setClients(Array.isArray(clientsRes) ? clientsRes : (clientsRes?.data || []));
      });
    }
  }, [isModalOpen]);

  const computeTotals = (detalles, aplicaIva, tipoPago, valorPagadoInput) => {
    let subtotalBruto = 0;
    let descuentoTotal = 0;
    let baseImponible = 0;
    let ivaTotal = 0;
    let totalVenta = 0;

    const computedDetalles = (detalles || []).map(d => {
      const cant = Number(d.cantidad || 0);
      const precio = Number(d.precioUnitario || 0);
      const brutoLinea = cant * precio;
      const rawDesc = Number(d.descuento || 0);
      const maxDescPermitido = brutoLinea * 0.50;
      const desc = Math.min(rawDesc, maxDescPermitido);
      const subLinea = Math.max(0, brutoLinea - desc);

      subtotalBruto += brutoLinea;
      descuentoTotal += desc;

      if (!aplicaIva) {
        baseImponible += subLinea;
        totalVenta += subLinea;
        return {
          ...d,
          descuento: desc,
          tarifaIva: 0,
          baseGravable: subLinea,
          montoIva: 0,
          totalLinea: subLinea
        };
      }

      const pInfo = products.find(p => (p.idProducto || p.id) === (d.idProducto || d.id));
      const tipoImp = pInfo?.tipoImpuesto || 'GRAVADO';
      const tarifa = (tipoImp === 'EXCLUIDO' || tipoImp === 'EXENTO') ? 0 : Number(pInfo?.tarifaIva ?? 19);
      const incluye = pInfo?.precioIncluyeIva ?? true;

      let baseLinea = subLinea;
      let ivaLinea = 0;

      if (tarifa > 0) {
        if (incluye) {
          baseLinea = Math.round(subLinea / (1 + (tarifa / 100)));
          ivaLinea = subLinea - baseLinea;
        } else {
          baseLinea = subLinea;
          ivaLinea = Math.round(baseLinea * (tarifa / 100));
        }
      }

      baseImponible += baseLinea;
      ivaTotal += ivaLinea;
      const totalLineaFinal = baseLinea + ivaLinea;
      totalVenta += totalLineaFinal;

      return {
        ...d,
        descuento: desc,
        tarifaIva: tarifa,
        baseGravable: baseLinea,
        montoIva: ivaLinea,
        totalLinea: totalLineaFinal
      };
    });

    const valorPagado = tipoPago === 'CONTADO' ? totalVenta : Number(valorPagadoInput || 0);
    const saldoPendiente = tipoPago === 'CONTADO' ? 0 : Math.max(0, totalVenta - valorPagado);

    return {
      detalles: computedDetalles,
      subtotal: subtotalBruto,
      descuentoTotal,
      baseImponible,
      ivaTotal,
      totalVenta,
      valorPagado,
      saldoPendiente
    };
  };

  const handleOpenModal = () => {
    setFormData(INITIAL_FORM);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const actualVal = type === 'checkbox' ? checked : (type === 'number' ? (parseFloat(value) || 0) : value);

    setFormData(prev => {
      const updated = { ...prev, [name]: actualVal };
      const totals = computeTotals(updated.detalles, updated.aplicaIva, updated.tipoPago, updated.valorPagado);
      return { ...updated, ...totals };
    });
  };

  const handleDetailsChange = (newDetails) => {
    setFormData(prev => {
      const totals = computeTotals(newDetails, prev.aplicaIva, prev.tipoPago, prev.valorPagado);
      return { ...prev, ...totals };
    });
  };

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
      // HAL-F9-02: Whitelist estricta compatible con DTO Zod .strict()
      const payload = {
        idCliente: formData.idCliente,
        fechaVenta: new Date(formData.fechaVenta).toISOString(),
        tipoPago: formData.tipoPago || 'CONTADO',
        canalVenta: formData.canalVenta || 'DIRECTA',
        aplicaIva: Boolean(formData.aplicaIva),
        observaciones: formData.observaciones || null,
        valorPagado: Number(formData.tipoPago === 'CONTADO' ? formData.totalVenta : (formData.valorPagado || 0)),
        detalles: formData.detalles.map(d => ({
          idProducto: d.idProducto,
          cantidad: Number(d.cantidad),
          precioUnitario: Number(d.precioUnitario),
          descuento: Math.min(Number(d.descuento || 0), (Number(d.cantidad) * Number(d.precioUnitario)) * 0.50),
          tipoDescuento: d.tipoDescuento || 'COMERCIAL',
          tarifaIva: Number(d.tarifaIva ?? (formData.aplicaIva ? 19 : 0))
        }))
      };

      const response = await apiClient.post('/sales', payload);
      const saleResult = response?.data || response;
      const clientObj = clients.find(c => c.id === formData.idCliente);
      const saleWithMeta = {
        ...formData,
        ...(typeof saleResult === 'object' ? saleResult : {}),
        cliente: clientObj || saleResult?.cliente || { nombre: 'CLIENTE' },
        detalles: saleResult?.detalles || formData.detalles
      };
      setCreatedSale(saleWithMeta);
      handleCloseModal();
      setIsPrintModalOpen(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMsg(err.message || 'Error al procesar la venta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClosePrintModal = () => {
    setIsPrintModalOpen(false);
    setCreatedSale(null);
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
    createdSale, isPrintModalOpen, handleClosePrintModal,
    handleOpenModal, handleCloseModal, reloadClients, setFormData,
    handleChange, handleDetailsChange, handleSubmit
  };
}
