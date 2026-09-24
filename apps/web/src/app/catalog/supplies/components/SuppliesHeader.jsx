/**
 * @file SuppliesHeader.jsx
 * @module catalog/supplies/components
 * @description Encabezado de la página de insumos con filtros.
 * @responsibility Filtro visual, búsqueda y botón principal.
 * @usedBy apps/web/src/app/catalog/supplies/page.jsx
 * @dependencies @/components/ui/Button, styles local
 */
import React from 'react';
import { Button } from '@/components/ui/Button';
import { ContextBanner } from '@/components/ui/ContextBanner';
import { Input } from '@/components/ui/Input';
import styles from '../supplies.module.css';

export function SuppliesHeader({ onNew, searchTerm, setSearchTerm, categoryFilter, setCategoryFilter, categories }) {
  return (
    <div>
      <ContextBanner 
        title="Concepto Técnico" 
        description="Aquí se registran los materiales que compras (ingredientes y empaques). Todo se maneja en unidades de medida estándar para facilitar el control en la fábrica." 
        action={<Button onClick={() => onNew()}>Nuevo Registro</Button>}
      />
      
      <div className={styles.searchFiltersRow}>
        <Input 
          placeholder="Buscar por código o nombre..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <select 
          value={categoryFilter} 
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={styles.categorySelect}
        >
          <option value="">Todas las categorías</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
