/**
 * @file purchases/new/page.jsx
 * @module page/NewPurchase
 * @description Orquestador de la vista de nueva compra (Fase 1 y Fase 2).
 * @responsibility Renderizar el Layout, cargar hooks iniciales y delegar a los componentes de fase.
 */
'use client';
import { useState, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './new-purchase.module.css';
import { usePurchaseData } from './hooks/usePurchaseData';
import { useChecklistManager } from './hooks/useChecklistManager';
import { usePurchaseModals } from './hooks/usePurchaseModals';
import { ChecklistPhase } from './components/ChecklistPhase';
import { FormPhase } from './components/FormPhase';

import { Suspense } from "react";

function NewPurchasePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDirectMode = searchParams.get('mode') === 'direct';
  
  // Toast state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const toastTimeoutRef = useRef(null);
  const showNotification = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3500);
  }, []);

  const { isInitializing, phase, setPhase, proveedoresDB, insumosDB, supplierPrices, initialChecklistItems, setProveedoresDB, setInsumosDB, activeOrder, refreshOrder } = usePurchaseData(showNotification);
  const checklistMgr = useChecklistManager(initialChecklistItems, phase);
  const modals = usePurchaseModals();

  if (isInitializing) {
    return (
      <div className={styles.initializingContainer}>
        <div className={styles.initializingText}>Cargando módulo de compras...</div>
      </div>
    );
  }

  return (
    <>
      {(!isDirectMode && phase === 1) ? (
         <ChecklistPhase 
            checklistMgr={checklistMgr} 
            setPhase={setPhase} 
            proveedoresDB={proveedoresDB}
            activeOrder={activeOrder}
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
            activeOrder={activeOrder}
            refreshOrder={refreshOrder}
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

export default function NewPurchasePage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <NewPurchasePageContent />
    </Suspense>
  );
}
