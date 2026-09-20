/**
 * @file SaleProductsDispatchSection.jsx
 * @module commercial/sales/components/modal-parts
 * @description Sección de productos a despachar con botón de apertura a Drawer lateral de Cava y tabla limpia (SRP < 135 líneas).
 * @usedBy apps/web/src/app/commercial/sales/components/SaleModal.jsx
 */
import React, { useState } from 'react';
import { ShoppingCart, Plus } from 'lucide-react';
import styles from '../sale-modal.module.css';
import SaleProductsTable from './SaleProductsTable';
import SaleCavaCatalogDrawer from './SaleCavaCatalogDrawer';

export default function SaleProductsDispatchSection({
  products,
  detalles,
  onAddDetail,
  onRemoveDetail,
  onUpdateQty,
  onStockErrorChange,
  hasSubmitted = false,
  isDetallesMissing = false
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleAddProductFromDrawer = (prod, cantidad) => {
    const pInfo = prod.producto || prod;
    const minMay = Number(pInfo.cantidadMinimaMayorista || prod.cantidadMinimaMayorista || 12);
    const mayPrice = Number(pInfo.precioMayorista || prod.precioMayorista || 0);
    const regPrice = Number(pInfo.precioVenta || pInfo.precioVentaSug || prod.precioVenta || 0);
    const unitPrice = mayPrice > 0 && cantidad >= minMay ? mayPrice : regPrice;

    const presNombre = prod.presentacionNombre || pInfo.presentacionNombre || prod.nombrePresentacion || pInfo.nombrePresentacion || pInfo.presentacion?.nombre || prod.presentacion?.nombre || '';
    const volPres = prod.volumenPresentacion || pInfo.volumenPresentacion || prod.contenidoNeto || pInfo.contenidoNeto || pInfo.presentacion?.volumen || '';

    onAddDetail({
      idProducto: prod.idProducto || prod.id,
      nombre: pInfo.nombre || prod.nombre,
      presentacion: presNombre || pInfo.unidadMedida || 'Und',
      presentacionNombre: presNombre,
      nombrePresentacion: presNombre,
      volumenPresentacion: volPres,
      contenidoNeto: volPres,
      cantidad: Number(cantidad),
      precioUnitario: unitPrice,
      costoUnitario: Number(prod.costoPromedio || pInfo.costoEstandar || 0)
    });
    if (onStockErrorChange) onStockErrorChange('');
  };

  return (
    <div className={styles.productsSectionCard}>
      <div className={styles.productsSectionHeader}>
        <h4 className={styles.productsSectionTitle}>
          <ShoppingCart size={18} /> Productos a Despachar
        </h4>
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className={styles.btnOpenCatalogDrawer}
        >
          <Plus size={14} /> Agregar Productos desde Cava
        </button>
      </div>

      {hasSubmitted && isDetallesMissing && (
        <span className={styles.fieldErrorText}>
          Debe agregar al menos un producto a la orden
        </span>
      )}

      <SaleProductsTable
        detalles={detalles}
        onRemoveDetail={onRemoveDetail}
        onUpdateQty={onUpdateQty}
      />

      <SaleCavaCatalogDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        products={products}
        onAddProduct={handleAddProductFromDrawer}
      />
    </div>
  );
}

