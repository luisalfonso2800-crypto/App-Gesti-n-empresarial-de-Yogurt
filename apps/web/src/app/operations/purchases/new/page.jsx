/**
 * @file purchases/new/page.jsx
 * @module page/NewPurchase
 * @description Orquestador de la vista de nueva compra (Fase 1 y Fase 2).
 * @responsibility Renderizar el Layout, cargar hooks iniciales y delegar a los componentes de fase.
 */
'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './new-purchase.module.css';
import { usePurchaseData } from './hooks/usePurchaseData';
import { useChecklistManager } from './hooks/useChecklistManager';
import { usePurchaseModals } from './hooks/usePurchaseModals';
import { QuickSupplierModal } from './components/QuickSupplierModal';
import { QuickSupplyModal } from './components/QuickSupplyModal';
import { ChecklistPhase } from './components/ChecklistPhase';
import { FormPhase } from './components/FormPhase';

export default function NewPurchasePage() {
  const router = useRouter();
  
  // Toast state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const toastTimeoutRef = useRef(null);
  const showNotification = (message, type = 'success') => {
    setToast({ show: true, message, type });
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3500);
  };

  const { isInitializing, phase, setPhase, proveedoresDB, insumosDB, supplierPrices, initialChecklistItems, setProveedoresDB, setInsumosDB } = usePurchaseData(showNotification);
  const checklistMgr = useChecklistManager(initialChecklistItems, phase);
  const modals = usePurchaseModals();

  if (isInitializing) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f9fafb' }}>
        <div style={{ color: '#6b7280', fontSize: '1.125rem' }}>Cargando módulo de compras...</div>
      </div>
    );
  }

  return (
    <>
      <QuickSupplierModal 
        show={modals.showProvModal} 
        onClose={() => modals.setShowProvModal(false)}
        newProv={modals.newProv}
        setNewProv={modals.setNewProv}
        setProveedoresDB={setProveedoresDB}
        targetRowId={modals.targetRowId}
        setTargetRowId={modals.setTargetRowId}
        showNotification={showNotification}
      />
      
      <QuickSupplyModal 
        show={modals.showInsumoModal}
        onClose={() => modals.setShowInsumoModal(false)}
        newInsumo={modals.newInsumo}
        setNewInsumo={modals.setNewInsumo}
        setInsumosDB={setInsumosDB}
        showNotification={showNotification}
      />

      {phase === 1 ? (
         <ChecklistPhase 
            checklistMgr={checklistMgr} 
            setPhase={setPhase} 
            proveedoresDB={proveedoresDB}
         />
      ) : (
         <FormPhase 
            checklistMgr={checklistMgr}
            proveedoresDB={proveedoresDB}
            insumosDB={insumosDB}
            supplierPrices={supplierPrices}
            showNotification={showNotification}
            setPhase={setPhase}
            router={router}
            modals={modals}
         />
      )}

      {toast.show && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          {toast.message}
        </div>
      )}
    </>
  );
}