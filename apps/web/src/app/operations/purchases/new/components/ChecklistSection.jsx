import React from 'react';
import styles from '../new-purchase.module.css';
import { ChecklistItemRow } from './ChecklistItemRow';

export function ChecklistSection({ items, checklistMgr, proveedoresDB, setPendingItems, setComprasAsentadas }) {
  const conseguidos = items.filter(i => i.estadoOperativo === 'CONSEGUIDO').length;

  return (
    <div className={styles.checklistSection}>
      <div className={styles.sectionProgressHeader}>
        <h3 className={styles.sectionProgressTitle}>Progreso: {conseguidos} de {items.length} conseguidos</h3>
      </div>
      <div className={styles.sectionItemsList}>
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
