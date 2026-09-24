/**
 * @file SuppliersHeader.jsx
 * @module catalog/suppliers/components
 * @description Cabecera de la lista de proveedores.
 * @responsibility Mostrar título, banner informativo y botón de acción principal.
 * @usedBy apps/web/src/app/catalog/suppliers/page.jsx
 * @dependencies @/components/ui/Button, @/components/ui/ContextBanner
 */
import React from 'react';
import { Button } from '@/components/ui/Button';
import { ContextBanner } from '@/components/ui/ContextBanner';
import styles from '../suppliers.module.css';

export function SuppliersHeader({ onNew }) {
  return (
    <div>
      <ContextBanner 
        title="Concepto Técnico" 
        description="Directorio de todas las personas y empresas que nos venden los insumos necesarios para operar. Funciona como un directorio centralizado de compras." 
        action={<Button onClick={onNew}>Nuevo Registro</Button>}
      />
    </div>
  );
}
