'use client';

import React from 'react';
import { Check } from 'lucide-react';
import styles from '../server-offline-canvas.module.css';

const steps = [
  'Enlace con Servidor de Planta restablecido',
  'Bus SCADA sincronizado',
  'Cargando catálogo/módulo...'
];

/**
 * @file ReconnectionChecklist.jsx
 * @module components/ui/parts/ReconnectionChecklist
 * @description Lista animada y escalonada de confirmación de handshake operativo.
 */
export function ReconnectionChecklist() {
  return (
    <div className={styles.checklistContainer} role="status" aria-live="polite">
      {steps.map((text) => (
        <div key={text} className={styles.checklistItem}>
          <Check size={16} className={styles.checkItemIcon} strokeWidth={2.5} />
          <span>{text}</span>
        </div>
      ))}
    </div>
  );
}
