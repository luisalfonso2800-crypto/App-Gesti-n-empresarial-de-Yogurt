/**
 * @file ProductionHeader.jsx
 * @module operations/production/components
 * @description Encabezado de la página de producción.
 * @responsibility Contener el título y botón de acción principal.
 * @usedBy apps/web/src/app/operations/production/page.jsx
 * @dependencies @/components/ui/Button, styles
 */
import React from 'react';
import { Button } from '@/components/ui/Button';
import { ContextBanner } from '@/components/ui/ContextBanner';
import styles from '../production.module.css';

export function ProductionHeader({ onNewOrder }) {
  return (
    <div>
      <ContextBanner 
        title="Concepto Técnico" 
        description="Aquí se gestiona el trabajo de fábrica. Permite dar la orden de fabricar, descuenta los insumos usados automáticamente y registra los desperdicios o mermas." 
        action={<Button onClick={onNewOrder}>Nueva Orden</Button>}
      />
    </div>
  );
}
