/**
 * @file purchases/new/hooks/usePurchaseData.js
 * @module hooks/usePurchaseData
 * @description Hook encargado de inicializar catálogos y resolver validaciones asíncronas de base de datos.
 * @responsibility Consolidar la capa de datos de la vista de nueva compra (Fase 1).
 * @usedBy apps/web/src/app/operations/purchases/new/page.jsx
 * @dependencies apiClient, useState, useEffect
 */
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export function usePurchaseData(showNotification) {
  const [isInitializing, setIsInitializing] = useState(true);
  const [phase, setPhase] = useState(1);
  const [proveedoresDB, setProveedoresDB] = useState([]);
  const [insumosDB, setInsumosDB] = useState([]);
  const [supplierPrices, setSupplierPrices] = useState([]);
  const [initialChecklistItems, setInitialChecklistItems] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      let proveedores = [];
      let insumos = [];
      let precios = [];

      try {
        const [provRes, insRes, pricesRes] = await Promise.all([
          apiClient.get('/suppliers').catch(() => []),
          apiClient.get('/supplies').catch(() => []),
          apiClient.get('/supplier-prices').catch(() => [])
        ]);
        
        proveedores = provRes || [];
        insumos = insRes || [];
        precios = pricesRes || [];
        
        setProveedoresDB(proveedores);
        setInsumosDB(insumos);
        setSupplierPrices(precios);
      } catch (err) {
        console.error('Error cargando catálogos:', err);
      }

      const queryParams = new URLSearchParams(window.location.search);
      const isManual = queryParams.get('manual') === 'true';
      const orderId = queryParams.get('orderId');

      let activeOrders = [];
      try {
        activeOrders = await apiClient.get('/purchases/orders/active');
      } catch (e) {
        console.error('Failed to fetch active orders', e);
      }

      if (orderId) {
        try {
          const orderDetail = await apiClient.get(`/purchases/orders/${orderId}`);
          if (orderDetail && orderDetail.items && orderDetail.items.length > 0) {
            const items = orderDetail.items.map((item, idx) => {
              const insumoInfo = insumos.find(i => i.id === item.idInsumo);
              const provInfo = proveedores.find(p => p.id === item.idProveedor);
              const priceInfo = precios.find(p => p.idInsumo === item.idInsumo && p.idProveedor === item.idProveedor);
              
              const duplicateInOtherOrder = (activeOrders || []).find(ao => 
                ao.id !== orderId && 
                ao.items && ao.items.some(aoi => aoi.idInsumo === item.idInsumo && aoi.estadoItem === 'PENDIENTE')
              );

              return {
                ...item,
                _id: idx,
                orderItemId: item.id,
                currentOrderId: orderId,
                insumoData: insumoInfo || {},
                proveedorData: provInfo || {},
                priceData: priceInfo || {},
                cantidadSolicitada: item.cantidad || 1,
                precioCompraActual: item.precioEstimado || priceInfo?.precioCompra || 0,
                estadoOperativo: item.estadoItem === 'PENDIENTE' ? 'CONSEGUIDO' : item.estadoItem,
                motivoNoConseguido: '',
                detalleMotivoNoConseguido: '',
                duplicateWarning: duplicateInOtherOrder ? `[Aviso: Este insumo también se encuentra asignado en ${duplicateInOtherOrder.codigo} - ${duplicateInOtherOrder.nombre}]` : null
              };
            });
            
            setInitialChecklistItems(items.filter(i => i.estadoOperativo !== 'COMPRADO' && i.estadoOperativo !== 'DESCARTADO'));
            setPhase(1);
          } else {
            setPhase(2);
          }
        } catch (e) {
          console.warn('Orden no encontrada o error de red en orden:', e);
          if (showNotification) showNotification('No se encontró la orden especificada, inicializando vista limpia.', 'warning');
          setPhase(2);
        }
      } else {
          try {
            const stored = sessionStorage.getItem('selectedForPurchase');
            if (stored && !isManual) {
              const parsed = JSON.parse(stored);
              if (parsed && parsed.length > 0) {
                const items = parsed.map((item, idx) => {
                  const insumoInfo = insumos.find(i => i.id === item.idInsumo);
                  const provInfo = proveedores.find(p => p.id === item.idProveedor);
                  const priceInfo = precios.find(p => p.idInsumo === item.idInsumo && p.idProveedor === item.idProveedor);
  
                  return {
                    ...item,
                    _id: idx,
                    insumoData: insumoInfo || item.insumo || {},
                    proveedorData: provInfo || item.proveedor || {},
                    priceData: priceInfo || {},
                    cantidadSolicitada: item.cantidad || 1,
                    precioCompraActual: priceInfo?.precioCompra || item.precioCompra || item.precio || 0,
                    estadoOperativo: 'CONSEGUIDO',
                    motivoNoConseguido: '',
                    detalleMotivoNoConseguido: ''
                  };
                });
                setInitialChecklistItems(items);
                setPhase(1);
              } else {
                setPhase(2);
              }
            } else {
              setPhase(2);
            }
          } catch (e) {
            console.error(e);
            setPhase(2);
          }
      }
      setIsInitializing(false);
    };
    fetchInitialData();
  }, [showNotification]);

  return { isInitializing, phase, setPhase, proveedoresDB, insumosDB, supplierPrices, initialChecklistItems, setProveedoresDB, setInsumosDB };
}