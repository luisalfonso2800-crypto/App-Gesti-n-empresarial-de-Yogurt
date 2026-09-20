/**
 * @file ChecklistPhase.jsx
 * @module operations/purchases/new/components
 * @description Fase 1 de compras: Checklist interactivo (<150 líneas, SRP, 0 inline styles).
 * @responsibility Orquestar cabecera, impresión, lista interactiva, pendientes y compras asentadas.
 * @usedBy apps/web/src/app/operations/purchases/new/page.jsx
 * @dependencies React, ChecklistSection, ../new-purchase.module.css, ./parts/*
 */
import React, { useState } from 'react';
import { ChecklistSection } from './ChecklistSection';
import styles from '../new-purchase.module.css';
import ChecklistAddPendingModal from './parts/ChecklistAddPendingModal';
import ChecklistPendingItemsTable from './parts/ChecklistPendingItemsTable';
import ChecklistSettledPurchasesTable from './parts/ChecklistSettledPurchasesTable';
import ChecklistPrintTable from './parts/ChecklistPrintTable';
import ShoppingChecklistHeader from './ShoppingChecklistHeader';

export function ChecklistPhase({ checklistMgr, setPhase, proveedoresDB, activeOrder }) {
  const [pendingItems, setPendingItems] = useState([]);
  const [comprasAsentadas, setComprasAsentadas] = useState([]);
  const [showAddPendingModal, setShowAddPendingModal] = useState(false);
  const [pendingForm, setPendingForm] = useState({ nombre: '', cantidad: '' });

  const proceedToForm = () => {
    if (activeOrder && activeOrder.id) {
      const url = new URL(window.location);
      if (url.searchParams.get('orderId') !== activeOrder.id) {
        url.searchParams.set('orderId', activeOrder.id);
        window.history.replaceState({}, '', url);
      }
    }
    setPhase(2);
  };

  const { checklistItems, checklistGrouped, setChecklistItems } = checklistMgr;

  const handleAddPending = () => {
    const nombre = pendingForm.nombre.trim();
    const cantidad = parseFloat(pendingForm.cantidad) || 1;
    if (!nombre) return;

    const nuevo = {
      _id: Date.now(),
      insumoData: { nombre },
      proveedorData: {},
      priceData: {},
      estadoOperativo: 'PENDIENTE',
      cantidadSolicitada: cantidad,
      precioCompraActual: 0,
      motivoNoConseguido: '',
      detalleMotivoNoConseguido: '',
      esPendienteManual: true
    };
    setChecklistItems(prev => [...prev, nuevo]);
    setPendingForm({ nombre: '', cantidad: '' });
    setShowAddPendingModal(false);
  };

  return (
    <div className={styles.container}>
      <ChecklistAddPendingModal
        isOpen={showAddPendingModal}
        onClose={() => setShowAddPendingModal(false)}
        pendingForm={pendingForm}
        setPendingForm={setPendingForm}
        handleAddPending={handleAddPending}
      />

      <ShoppingChecklistHeader
        activeOrder={activeOrder}
        onPrint={() => window.print()}
        onAddPending={() => setShowAddPendingModal(true)}
        onProceedToForm={proceedToForm}
      />

      <ChecklistPrintTable checklistGrouped={checklistGrouped} />

      <div className={styles.printArea}>
        {checklistItems.length === 0 ? (
          <div className={styles.emptyCartWarning}>
            <h3>⚠️ No hay insumos en el carrito de compras</h3>
            <p>Seleccione insumos desde la sección de alertas de inventario, use &quot;Añadir Pendiente&quot; para agregar manualmente, o pase a Registrar Compras Adicionales.</p>
          </div>
        ) : (
          Object.entries(checklistGrouped).map(([prov, items]) => (
            <div key={prov} className={styles.card}>
              <div className={styles.cardTitle}>Proveedor: {prov}</div>
              <ChecklistSection
                items={items}
                checklistMgr={checklistMgr}
                proveedoresDB={proveedoresDB}
                setPendingItems={setPendingItems}
                setComprasAsentadas={setComprasAsentadas}
              />
            </div>
          ))
        )}
      </div>

      <ChecklistPendingItemsTable
        pendingItems={pendingItems}
        setPendingItems={setPendingItems}
        setChecklistItems={setChecklistItems}
      />

      <ChecklistSettledPurchasesTable
        comprasAsentadas={comprasAsentadas}
        setComprasAsentadas={setComprasAsentadas}
      />
    </div>
  );
}
