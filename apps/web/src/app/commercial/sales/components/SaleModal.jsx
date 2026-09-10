/**
 * @file SaleModal.jsx
 * @module commercial/sales/components
 * @description Vista del formulario de captura para nuevas ventas (Despacho desde Cava).
 * @responsibility Presentar al usuario los controles para definir los montos y elegir lotes FEFO.
 * @usedBy apps/web/src/app/commercial/sales/page.jsx
 * @dependencies @/components/ui/Modal, Input, Button
 */
import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ShoppingCart, Plus, Trash2 } from 'lucide-react';
import styles from '../sales.module.css';

export function SaleModal({ 
  isOpen, onClose, formData, products, clients, 
  handleChange, handleDetailsChange, handleSubmit 
}) {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(0);

  const handleAddProduct = () => {
    if (!selectedProductId || qty <= 0 || price <= 0) return;
    const prod = products.find(p => p.id === selectedProductId);
    if (!prod) return;

    if (qty > Number(prod.cantidadActual)) {
      alert(`Stock insuficiente. Disponible: ${prod.cantidadActual}`);
      return;
    }

    const newDetail = {
      idProducto: prod.id,
      nombre: prod.producto?.nombre,
      cantidad: Number(qty),
      precioUnitario: Number(price),
      costoUnitario: Number(prod.costoPromedio || 0),
    };

    handleDetailsChange([...formData.detalles, newDetail]);
    setSelectedProductId('');
    setQty(1);
    setPrice(0);
  };

  const handleRemoveProduct = (index) => {
    const newDet = formData.detalles.filter((_, i) => i !== index);
    handleDetailsChange(newDet);
  };

  const handleProductSelect = (e) => {
    const val = e.target.value;
    setSelectedProductId(val);
    const prod = products.find(p => p.id === val);
    if (prod && prod.producto) {
      setPrice(Number(prod.producto.precioVentaSug) || 0);
    }
  };

  const utilidadTotal = formData.detalles.reduce((sum, d) => sum + ((d.precioUnitario - d.costoUnitario) * d.cantidad), 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nueva Venta (Despacho desde Cava)">
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        
        <div className={styles.grid2}>
          <div className={styles.formGroup}>
            <label>Cliente</label>
            <select name="idCliente" value={formData.idCliente} onChange={handleChange} className={styles.input} required>
              <option value="">Seleccione Cliente...</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.nombre} ({c.documento})</option>)}
              {clients.length === 0 && <option value="mock-client-1">Cliente Mostrador (Simulado)</option>}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Fecha Venta</label>
            <input name="fechaVenta" type="date" value={formData.fechaVenta} onChange={handleChange} className={styles.input} required />
          </div>
          <div className={styles.formGroup}>
            <label>Canal</label>
            <select name="canalVenta" value={formData.canalVenta} onChange={handleChange} className={styles.input}>
              <option value="DIRECTO">Venta Directa</option>
              <option value="DISTRIBUIDOR">Distribuidor</option>
              <option value="INSTITUCIONAL">Institucional</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Tipo de Pago</label>
            <select name="tipoPago" value={formData.tipoPago} onChange={handleChange} className={styles.input}>
              <option value="CONTADO">Contado</option>
              <option value="CREDITO">Crédito</option>
            </select>
          </div>
        </div>

        <div className={styles.cavaSection}>
          <h4 className={styles.sectionTitle}><ShoppingCart size={16} /> Productos a Despachar</h4>
          <div className={styles.productAdder}>
            <select value={selectedProductId} onChange={handleProductSelect} className={styles.input}>
              <option value="">Seleccione Producto en Cava...</option>
              {products.filter(p => Number(p.cantidadActual) > 0).map(p => (
                <option key={p.id} value={p.id}>
                  {p.producto?.nombre} (Stock: {p.cantidadActual} {p.producto?.unidadMedida})
                </option>
              ))}
            </select>
            <input type="number" min="1" placeholder="Cant." value={qty} onChange={e => setQty(e.target.value)} className={styles.input} style={{width: '80px'}} />
            <input type="number" min="0" placeholder="Precio Unit." value={price} onChange={e => setPrice(e.target.value)} className={styles.input} style={{width: '120px'}} />
            <Button type="button" variant="secondary" onClick={handleAddProduct}><Plus size={16} /> Agregar</Button>
          </div>

          <table className={styles.detailsTable}>
            <thead>
              <tr>
                <th>Producto</th>
                <th style={{textAlign:'right'}}>Cant.</th>
                <th style={{textAlign:'right'}}>P. Venta</th>
                <th style={{textAlign:'right'}}>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {formData.detalles.map((d, i) => (
                <tr key={i}>
                  <td>{d.nombre}</td>
                  <td style={{textAlign:'right'}}>{d.cantidad}</td>
                  <td style={{textAlign:'right'}}>${d.precioUnitario.toLocaleString()}</td>
                  <td style={{textAlign:'right'}}>${(d.cantidad * d.precioUnitario).toLocaleString()}</td>
                  <td style={{textAlign:'right'}}>
                    <Button type="button" variant="danger" size="sm" onClick={() => handleRemoveProduct(i)}>
                      <Trash2 size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
              {formData.detalles.length === 0 && (
                <tr><td colSpan="5" className={styles.emptyText}>No hay productos agregados.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.financialSummary}>
          <div className={styles.summaryItem}>
            <span>Subtotal Venta:</span>
            <strong>${formData.totalVenta.toLocaleString()}</strong>
          </div>
          <div className={styles.summaryItem}>
            <span>Margen Bruto Estimado:</span>
            <strong style={{color: utilidadTotal > 0 ? '#059669' : '#dc2626'}}>${utilidadTotal.toLocaleString()}</strong>
          </div>
        </div>

        {formData.tipoPago === 'CREDITO' && (
          <div className={styles.grid2} style={{marginTop: '1rem'}}>
            <div className={styles.formGroup}>
              <label>Valor Pagado (Abono)</label>
              <input name="valorPagado" type="number" min="0" max={formData.totalVenta} value={formData.valorPagado} onChange={handleChange} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>Fecha Límite</label>
              <input name="fechaLimitePago" type="date" value={formData.fechaLimitePago || ''} onChange={handleChange} className={styles.input} required />
            </div>
          </div>
        )}

        <div className={styles.formActions}>
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={formData.detalles.length === 0}>Despachar y Facturar</Button>
        </div>
      </form>
    </Modal>
  );
}
