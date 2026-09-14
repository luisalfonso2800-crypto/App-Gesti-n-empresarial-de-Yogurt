/**
 * @file SaleProductsDispatchSection.jsx
 * @module commercial/sales/components/modal-parts
 * @description Sección del formulario para selección y adición de productos a despachar con validación de stock y tabla resumen.
 * @responsibility Manejar la selección interactiva de producto, cantidad, precio con letras y listado de items agregados.
 * @usedBy apps/web/src/app/commercial/sales/components/SaleModal.jsx
 * @dependencies react, lucide-react, @/components/ui/inputs/SmartSelect, @/components/ui/inputs/StrictNumberInput, @/lib/formatters, @/utils/numberToWords
 */
import React, { useState, useEffect } from 'react';
import SmartSelect from '@/components/ui/inputs/SmartSelect';
import StrictNumberInput from '@/components/ui/inputs/StrictNumberInput';
import { ShoppingCart, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { montoATextoPesos } from '@/utils/numberToWords';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../sale-modal.module.css';

export default function SaleProductsDispatchSection({
  products,
  detalles,
  onAddDetail,
  onRemoveDetail,
  onStockErrorChange
}) {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');
  const [stockError, setStockError] = useState('');

  const selectedProd = products.find(p => p.id === selectedProductId);

  // Validar stock reactivamente contra la cava
  useEffect(() => {
    let err = '';
    if (selectedProd && qty) {
      const q = Number(qty);
      const disp = Number(selectedProd.cantidadActual);
      if (q > disp) {
        err = `Stock insuficiente en cava: solo hay ${disp} unidades disponibles`;
      }
    }
    setStockError(err);
    if (onStockErrorChange) {
      onStockErrorChange(err);
    }
  }, [selectedProd, qty, onStockErrorChange]);

  const handleProductSelect = (e) => {
    const val = e.target.value;
    setSelectedProductId(val);
    const prod = products.find(p => p.id === val);
    if (prod && prod.producto) {
      setPrice(Number(prod.producto.precioVentaSug) || '');
    } else {
      setPrice('');
    }
  };

  const handleAdd = () => {
    if (!selectedProductId || !qty || !price || stockError) return;
    const q = Number(qty);
    const p = Number(price);
    if (q <= 0 || p <= 0 || !selectedProd) return;

    onAddDetail({
      idProducto: selectedProd.id,
      nombre: selectedProd.producto?.nombre,
      cantidad: q,
      precioUnitario: p,
      costoUnitario: Number(selectedProd.costoPromedio || 0)
    });

    setSelectedProductId('');
    setQty('');
    setPrice('');
  };

  const cleanNumericPrice = price ? parseInt(String(price).replace(/\D/g, ''), 10) : 0;

  return (
    <div className={styles.productsSectionCard}>
      <h4 className={styles.productsSectionTitle}>
        <ShoppingCart size={18} /> Productos a Despachar
      </h4>

      <div className={styles.addProductRow}>
        <div className={styles.productSelectCol}>
          <SmartSelect
            label="Producto en Cava"
            name="selectedProductId"
            value={selectedProductId}
            onChange={handleProductSelect}
            options={products.filter(p => Number(p.cantidadActual) > 0).map(p => ({
              id: p.id,
              label: p.producto?.nombre,
              subtext: `Stock: ${p.cantidadActual} ${p.producto?.unidadMedida}`
            }))}
          />
        </div>

        <div className={styles.productQtyCol}>
          <StrictNumberInput
            label="Cant."
            name="qty"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder="1"
            error={stockError}
          />
        </div>

        <div className={styles.productPriceCol}>
          <label className={modalStyles.label}>
            Precio Unit. <span className={styles.requiredAsterisk}>*</span>
          </label>
          <input
            name="price"
            type="text"
            inputMode="numeric"
            min="0"
            placeholder="0"
            value={price ? String(price).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''}
            onChange={(e) => setPrice(e.target.value.replace(/\D/g, ''))}
            onKeyDown={(e) => {
              if (e.key === '-') e.preventDefault();
            }}
            className={modalStyles.input}
            required
          />
          {cleanNumericPrice > 0 && (
            <span className={styles.productPriceWords}>
              ✦ {montoATextoPesos(cleanNumericPrice)}
            </span>
          )}
        </div>

        <div className={styles.productAddButtonContainer}>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!selectedProductId || !qty || !price || !!stockError}
            className={styles.btnAddProduct}
          >
            <Plus size={16} /> Agregar
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.productsTable}>
          <thead>
            <tr className={styles.tableHeaderRow}>
              <th className={styles.thLeft}>Producto</th>
              <th className={styles.thRight}>Cant.</th>
              <th className={styles.thRight}>P. Venta</th>
              <th className={styles.thRight}>Subtotal</th>
              <th className={styles.thAction}></th>
            </tr>
          </thead>
          <tbody>
            {detalles.map((d, i) => (
              <tr key={i} className={styles.tableBodyRow}>
                <td className={styles.tdName}>{d.nombre}</td>
                <td className={styles.tdQty}>{d.cantidad}</td>
                <td className={styles.tdPrice}>{formatCurrency(d.precioUnitario)}</td>
                <td className={styles.tdSubtotal}>{formatCurrency(d.cantidad * d.precioUnitario)}</td>
                <td className={styles.tdAction}>
                  <button
                    type="button"
                    onClick={() => onRemoveDetail(i)}
                    className={styles.btnRemoveProduct}
                    aria-label="Eliminar producto"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {detalles.length === 0 && (
              <tr>
                <td colSpan="5" className={styles.emptyTableMessage}>
                  No hay productos agregados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
