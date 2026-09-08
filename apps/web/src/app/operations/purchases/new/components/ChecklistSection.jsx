import React from 'react';
import styles from '../new-purchase.module.css';
import { ChecklistItemRow } from './ChecklistItemRow';

export function ChecklistSection({ items, checklistMgr, proveedoresDB, setPendingItems, setComprasAsentadas }) {
  const conseguidos = items.filter(i => i.estadoOperativo === 'CONSEGUIDO').length;

  return (
    <div className={styles.checklistSection}>
      <div className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1rem' }}>Progreso: {conseguidos} de {items.length} conseguidos</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {items.map(item => (
          <ChecklistItemRow 
            key={item._id} 
            item={item} 
            checklistMgr={checklistMgr}
            proveedoresDB={proveedoresDB}
            setPendingItems={setPendingItems}
            setComprasAsentadas={setComprasAsentadas}
          />
        ))}
      </div>
    </div>
  );
}
