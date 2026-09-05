'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../../../lib/api-client';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { PrintIcon } from '../../../../components/ui/icons';
import styles from './new-purchase.module.css';

export default function NewPurchasePage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [reconciled, setReconciled] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('selectedForPurchase');
      if (stored) {
        const parsed = JSON.parse(stored);
        setItems(parsed);
        const initialReconciled = {};
        const initialQuantities = {};
        parsed.forEach(item => {
          initialReconciled[item.id] = true; // default to true
          initialQuantities[item.id] = 1; // default quantity
        });
        setReconciled(initialReconciled);
        setQuantities(initialQuantities);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleToggleReconciled = (id) => {
    setReconciled(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleQuantityChange = (id, val) => {
    setQuantities(prev => ({
      ...prev,
      [id]: parseFloat(val) || 0
    }));
  };

  const groupedItems = useMemo(() => {
    const groups = {};
    items.forEach(item => {
      if (!groups[item.idProveedor]) {
        groups[item.idProveedor] = {
          nombreProveedor: item.nombreProveedor,
          items: []
        };
      }
      groups[item.idProveedor].items.push(item);
    });
    return groups;
  }, [items]);

  const handleSavePurchase = async () => {
    setLoading(true);
    try {
      // For each provider group, we might want to create a purchase,
      // but let's assume we can loop over groups or send everything.
      // Usually a purchase order is per supplier. 
      // The prompt says: "Solo los insumos marcados como conseguidos se envían a POST /purchases... Los insumos conseguidos se eliminan de la lista temporal. Los insumos no conseguidos permanecen."

      const remainingItems = [];
      const purchasedItems = [];

      items.forEach(item => {
        if (reconciled[item.id]) {
          purchasedItems.push(item);
        } else {
          remainingItems.push(item);
        }
      });

      if (purchasedItems.length === 0) {
        alert("No hay ítems marcados como conseguidos.");
        setLoading(false);
        return;
      }

      // Group purchased by supplier to make API calls per supplier
      const pGroups = {};
      purchasedItems.forEach(item => {
        if (!pGroups[item.idProveedor]) {
          pGroups[item.idProveedor] = { total: 0, detalles: [] };
        }
        const qty = quantities[item.id] || 1;
        const totalLine = qty * item.precioCompra;
        pGroups[item.idProveedor].total += totalLine;
        pGroups[item.idProveedor].detalles.push({
          idInsumo: item.idInsumo,
          cantidad: qty,
          precioUnitario: item.precioCompra
        });
      });

      // Send to API
      for (const [provId, group] of Object.entries(pGroups)) {
        await apiClient.post('/purchases', {
          idProveedor: provId,
          fechaCompra: new Date().toISOString(),
          estado: 'COMPLETADO',
          total: group.total,
          observaciones: 'Compra conciliada desde carrito',
          detalles: group.detalles
        });
      }

      // Update session storage
      sessionStorage.setItem('selectedForPurchase', JSON.stringify(remainingItems));
      window.dispatchEvent(new Event('cartUpdated'));

      if (remainingItems.length > 0) {
        alert(`Compra registrada. Quedaron ${remainingItems.length} insumos pendientes en la lista.`);
        setItems(remainingItems);
      } else {
        alert("Compra completada exitosamente.");
        router.push('/operations/purchases');
      }
    } catch (err) {
      alert(err.message || 'Error al guardar compras');
    } finally {
      setLoading(false);
    }
  };

  const handleClearMissing = () => {
    if (confirm("¿Estás seguro de que quieres descartar los ítems no conseguidos?")) {
      const remainingItems = items.filter(item => reconciled[item.id]);
      setItems(remainingItems);
      sessionStorage.setItem('selectedForPurchase', JSON.stringify(remainingItems));
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>Conciliar y Registrar Compra</h1>
          <p className={styles.subtitle}>Verifica los insumos conseguidos antes de registrar la orden final.</p>
        </div>
        <div className={styles.headerActions}>
          <Button variant="secondary" onClick={handlePrint}>
            <PrintIcon size={18} style={{ marginRight: '0.5rem' }} /> Imprimir Lista
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <p>No hay insumos seleccionados para compra.</p>
          <Button onClick={() => router.push('/catalog/supplier-prices')}>Ir a Precios</Button>
        </div>
      ) : (
        <div className={styles.content}>
          {Object.entries(groupedItems).map(([provId, group]) => (
            <div key={provId} className={styles.groupCard}>
              <h2 className={styles.groupTitle}>Proveedor: {group.nombreProveedor || provId}</h2>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.printCheckboxCol}>[ ]</th>
                    <th className={styles.reconcileCol}>Conseguido</th>
                    <th>Insumo</th>
                    <th>Presentación</th>
                    <th>Precio Ref.</th>
                    <th className={styles.qtyCol}>Cantidad</th>
                    <th className={styles.printNotesCol}>Anotaciones / Costo Real</th>
                  </tr>
                </thead>
                <tbody>
                  {group.items.map(item => (
                    <tr key={item.id} className={!reconciled[item.id] ? styles.rowMissing : ''}>
                      <td className={styles.printCheckboxCol}></td>
                      <td className={styles.reconcileCol}>
                        <input 
                          type="checkbox" 
                          checked={reconciled[item.id] || false}
                          onChange={() => handleToggleReconciled(item.id)}
                          className={styles.checkbox}
                        />
                      </td>
                      <td>{item.nombreInsumo}</td>
                      <td>{item.presentacion}</td>
                      <td>${item.precioCompra}</td>
                      <td className={styles.qtyCol}>
                        <input 
                          type="number" 
                          min="1" 
                          step="1"
                          value={quantities[item.id] || 1} 
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                          className={styles.qtyInput}
                        />
                      </td>
                      <td className={styles.printNotesCol}></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          <div className={styles.footerActions}>
            <Button variant="danger" onClick={handleClearMissing}>Limpiar No Conseguidos</Button>
            <Button variant="primary" onClick={handleSavePurchase} disabled={loading}>
              {loading ? 'Guardando...' : 'Asentar Compra'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
