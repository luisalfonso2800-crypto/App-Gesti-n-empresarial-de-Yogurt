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

      <div className={styles.header}>
        <div className={styles.checklistTopHeader}>
          <button
            type="button"
            onClick={() => window.location.href = '/operations/purchases'}
            className={styles.backLinkBtn}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            Volver a Compras
          </button>
          <h1 className={styles.phaseTitle}>Checklist de Compras</h1>

          {activeOrder && (
            <div className={styles.activeOrderMeta}>
              <span className={styles.orderCodeBadge}>{activeOrder.codigo}</span>
              <span className={styles.orderNameText}>{activeOrder.nombre}</span>
              <span className={`${styles.orderStatusBadge} ${
                activeOrder.estado === 'COMPLETADA' ? styles.statusCompleted :
                activeOrder.estado === 'EN_PROCESO' ? styles.statusInProgress : styles.statusPending
              }`}>
                {activeOrder.estado}
              </span>
            </div>
          )}
        </div>

        <div className={`${styles.noPrint} ${styles.checklistActionsBar}`}>
          <button className={`${styles.submitBtn} ${styles.btnActionAuto}`} onClick={() => window.print()}>
            Imprimir Checklist
          </button>
          <button
            type="button"
            className={styles.btnAddPending}
            onClick={() => setShowAddPendingModal(true)}
          >
            + Añadir Pendiente a la Lista
          </button>
          <button className={`${styles.saveBtn} ${styles.btnActionAuto}`} onClick={proceedToForm}>
            + Registrar Compras Adicionales / Imprevistos
          </button>
        </div>
      </div>

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
