/**
 * @file purchases/new/components/FormPhase.jsx
 * @module components/FormPhase
 * @description Vista completa de la fase 2 (Formulario final de la orden).
 */
import React, { useState } from 'react';
import { PurchaseHeader } from './PurchaseHeader';
import styles from '../new-purchase.module.css';

export function FormPhase({ checklistMgr, proveedoresDB, setPhase, router, modals }) {
  const [condicion, setCondicion] = useState('CONTADO');
  const [diasCredito, setDiasCredito] = useState(0);

  return (
    <div className={styles.container}>
      <PurchaseHeader 
        condicion={condicion} 
        setCondicion={setCondicion} 
        diasCredito={diasCredito} 
        setDiasCredito={setDiasCredito} 
      />
      <div className={styles.formContent}>
        <h2>Fase 2 de la Compra</h2>
        <button className={styles.saveBtn} onClick={() => router.push('/operations/purchases')}>Finalizar</button>
      </div>
    </div>
  );
}
