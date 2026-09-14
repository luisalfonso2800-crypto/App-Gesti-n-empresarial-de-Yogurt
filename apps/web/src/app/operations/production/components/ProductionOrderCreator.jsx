/**
 * @file ProductionOrderCreator.jsx
 * @module operations/production/components
 * @description Panel interactivo para planificar una nueva orden de producción y calcular BOM.
 * @responsibility Renderizar selectores de receta, escala, tabla BOM y alerta de faltantes.
 * @usedBy apps/web/src/app/operations/production/page.jsx
 * @dependencies react, lucide-react, @/components/ui/Button, @/components/ui/Badge
 */
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AlertTriangle } from 'lucide-react';
import styles from '../production.module.css';

export default function ProductionOrderCreator({
  recipes,
  selectedRecipe,
  setSelectedRecipe,
  qty,
  setQty,
  bom,
  bomLoading,
  hasShortage,
  handlePurchaseShortage,
  handleCreateOrder,
  onClose
}) {
  return (
    <div className={styles.creatorCard}>
      <div className={styles.creatorHeader}>
        <h3>Planificar Nueva Orden</h3>
        <Button variant="secondary" size="sm" onClick={onClose}>Cerrar</Button>
      </div>
      
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Receta / Producto</label>
          <select 
            value={selectedRecipe} 
            onChange={e => setSelectedRecipe(e.target.value)} 
            className={styles.input}
          >
            <option value="">Seleccione...</option>
            {recipes.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
            {recipes.length === 0 && <option value="mock-123">Yogur Escolar Fresa 150ml (Simulado)</option>}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label>Cantidad a Producir</label>
          <input 
            type="number" 
            min="1" 
            value={qty} 
            onChange={e => setQty(Number(e.target.value))} 
            className={styles.input} 
          />
        </div>
      </div>

      {selectedRecipe && (
        <div className={styles.bomSection}>
          <h4>BOM (Lista de Materiales y Fórmula Requerida)</h4>
          {bomLoading ? <p>Calculando...</p> : (
            <>
              {hasShortage && (
                <div className={styles.alertBanner}>
                  <AlertTriangle size={20} />
                  <span>Insumos insuficientes para esta escala de producción.</span>
                  <Button variant="danger" size="sm" onClick={handlePurchaseShortage}>
                    + Disparar Lista de Compra
                  </Button>
                </div>
              )}
              <table className={styles.bomTable}>
                <thead>
                  <tr>
                    <th>Insumo</th>
                    <th className={styles.thRight}>Req. Teórico</th>
                    <th className={styles.thRight}>Stock Actual</th>
                    <th className={styles.thRight}>Faltante</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {bom.map((b) => (
                    <tr key={b.idInsumo}>
                      <td>{b.nombreInsumo}</td>
                      <td className={styles.thRight}>{Number(b.requeridoTeorico).toFixed(2)} {b.unidad}</td>
                      <td className={styles.thRight}>{Number(b.stockActual).toFixed(2)} {b.unidad}</td>
                      <td className={`${styles.thRight} ${b.faltante > 0 ? styles.missingText : ''}`}>
                        {Number(b.faltante).toFixed(2)} {b.unidad}
                      </td>
                      <td>
                        {b.faltante > 0 ? <Badge status="inactive">Faltante</Badge> : <Badge status="active">Suficiente</Badge>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={styles.creatorActions}>
                <Button variant="secondary" onClick={handleCreateOrder}>Guardar como Planificada / Borrador</Button>
                <Button variant="primary" disabled={hasShortage} onClick={handleCreateOrder}>Iniciar Producción</Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
