/**
 * @file useCartManager.js
 * @module catalog/supplier-prices/hooks
 * @description Hook puente para conectar la tabla de lista de precios con el carrito global.
 * @responsibility Añadir o eliminar items de compras desde la vista de lista de precios.
 * @usedBy apps/web/src/app/catalog/supplier-prices/page.jsx
 * @dependencies @/context/CartContext
 */
import { useCart } from '@/context/CartContext';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

export function useCartManager() {
  const { cartItems, addToCart, removeFromCart, clearCart } = useCart();
  const router = useRouter();

  // Alias compatible con el diseño previo en la vista de supplier-prices
  const selectedForPurchase = cartItems;

  const togglePurchaseItem = (item) => {
    const existing = cartItems.find(i => i.id === item.id);
    if (existing) {
      removeFromCart(item.id);
    } else {
      const newItem = {
        ...item,
        nombreInsumo: item.insumo?.nombre || 'Insumo',
        nombreProveedor: item.proveedor?.nombre || 'Proveedor',
        idInsumo: item.idInsumo,
        idProveedor: item.idProveedor,
        idPresentacion: item.idPresentacion,
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
      addToCart(newItem);
    }
  };

  const clearPurchaseList = () => {
    clearCart();
  };

  const proceedToPurchase = async () => {
    try {
      const payload = {
        nombre: `Lista de Compra - ${new Date().toLocaleDateString('es-CO')}`,
        items: cartItems.map(item => ({
          insumoId: item.insumoId || item.idInsumo || item.id,
          proveedorId: item.proveedorId || item.idProveedor,
          presentacionId: item.presentacionId || item.idPresentacion || null,
          cantidad: Number(item.cantidad || 1),
          precioEstimado: Number(item.precioEmpaque || item.precio || item.precioCompra || item.precioEstimado || 0)
        }))
      };

      const order = await apiClient.post('/purchases/orders', payload);
      
      clearCart();
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
