/**
 * @file useCartManager.js
 * @module catalog/supplier-prices/hooks
 * @description Maneja el estado del carrito de compras para insumos seleccionados, persistiendo en sessionStorage.
 * @responsibility Sincronización del carrito, creación de órdenes y delegación a API.
 * @usedBy apps/web/src/app/catalog/supplier-prices/page.jsx
 * @dependencies @/lib/api-client, next/navigation
 */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

export function useCartManager() {
  const router = useRouter();
  const [selectedForPurchase, setSelectedForPurchase] = useState([]);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('selectedForPurchase');
      if (stored) {
        setSelectedForPurchase(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveToSession = (newSelection) => {
    setSelectedForPurchase(newSelection);
    try {
      sessionStorage.setItem('selectedForPurchase', JSON.stringify(newSelection));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (e) {
      console.error(e);
    }
  };

  const togglePurchaseItem = (item) => {
    const isAdded = selectedForPurchase.some(p => p.id === item.id);
    if (isAdded) {
      saveToSession(selectedForPurchase.filter(p => p.id !== item.id));
    } else {
      const alreadyHasInsumoProveedor = selectedForPurchase.some(p => p.idInsumo === item.idInsumo && p.idProveedor === item.idProveedor);
      if (alreadyHasInsumoProveedor) return;
      
      const newItem = {
        id: item.id,
        idPrecioProveedor: item.id,
        idInsumo: item.idInsumo,
        idProveedor: item.idProveedor,
        insumoNombre: item.insumo?.Nombre_Insumo || item.insumo?.nombre || item.idInsumo,
        proveedorNombre: item.proveedor?.Nombre_Proveedor || item.proveedor?.nombre || item.idProveedor,
        marca: item.insumo?.Marca || item.insumo?.marca || 'Sin marca',
        categoria: item.insumo?.Categoria || item.insumo?.categoria || 'Materia Prima',
        presentacionCompra: item.presentacionCompra || 'Paquete',
        contenidoBase: item.cantidadEquivalenteBase || item.cantidadPresentacion || 1,
        unidadBase: item.insumo?.Unidad_Base || item.insumo?.unidadBase || 'Unidades',
        unidadMedida: item.unidadPresentacion || item.insumo?.Unidad_Base || item.insumo?.unidadBase || 'Unidad',
        stockMinimo: item.insumo?.Stock_Minimo || item.insumo?.stockMinimo || 0,
        precioCompra: item.precioCompra,
        costoUnidadBase: item.costoUnidadBase
      };
      saveToSession([...selectedForPurchase, newItem]);
    }
  };

  const clearPurchaseList = () => {
    saveToSession([]);
  };

  const proceedToPurchase = async () => {
    try {
      const payload = {
        nombre: `Lista de Compra - ${new Date().toLocaleDateString('es-CO')}`,
        items: selectedForPurchase.map(item => ({
          insumoId: item.insumoId || item.idInsumo || item.id,
          proveedorId: item.proveedorId || item.idProveedor,
          presentacionId: item.presentacionId || item.idPresentacion || null,
          cantidad: Number(item.cantidad || 1),
          precioEstimado: Number(item.precioEmpaque || item.precio || item.precioCompra || item.precioEstimado || 0)
        }))
      };

      const order = await apiClient.post('/purchases/orders', payload);
      
      clearPurchaseList();
      router.push(`/operations/purchases/new?orderId=${order.id}`);
    } catch (e) {
      console.error('Failed to create order. Message:', e.message, 'Details:', e);
      window.dispatchEvent(new CustomEvent('showNotification', { 
        detail: { message: e.message || 'Error al crear la orden.', type: 'error' } 
      }));
      router.push('/operations/purchases/new');
    }
  };

  return {
    selectedForPurchase,
    togglePurchaseItem,
    clearPurchaseList,
    proceedToPurchase
  };
}
