/**
 * @file RecipeModal.jsx
 * @module catalog/recipes/components
 * @description Editor principal para crear/editar recetas técnicas (vista de página completa simulada).
 * @responsibility Formularios, etapas, y llamadas a cálculos de costo.
 * @usedBy apps/web/src/app/catalog/recipes/page.jsx
 * @dependencies @/components/ui/Button, @/components/ui/ContextBanner, IngredientsFormSection, styles local
 */
import React from 'react';
import { Button } from '@/components/ui/Button';
import { ContextBanner } from '@/components/ui/ContextBanner';
import { IngredientsFormSection } from './IngredientsFormSection';
import styles from '../recipes.module.css';

export function RecipeModal({ 
  formData, products, supplies, onClose, onSubmit, onChange,
  onAddEtapa, onUpdateEtapa, onRemoveEtapa,
  onAddDetalle, onUpdateDetalle, onRemoveDetalle, calculateCost
}) {
  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>{formData.id ? 'Editar Receta Técnica' : 'Nueva Receta Técnica'}</h1>
        </div>
        <Button variant="secondary" onClick={onClose}>Volver al Listado</Button>
      </div>
      <ContextBanner title="Concepto Técnico" description="Instrucciones paso a paso para fabricar los productos. Incluye la lista de ingredientes, cantidades exactas y los tiempos o temperaturas requeridos en el proceso." />

      <form onSubmit={onSubmit} className={styles.editorContainer}>
        <div>
          <h2 className={styles.sectionTitle}>Cabecera de Receta</h2>
          <div className={styles.grid2}>
            <div>
              <label className={styles.label}>Nombre</label>
              <input className={styles.input} name="nombre" value={formData.nombre} onChange={onChange} required />
            </div>
            <div>
              <label className={styles.label}>Producto Asociado</label>
              <select className={styles.select} name="idProducto" value={formData.idProducto} onChange={onChange} required>
                <option value="">Seleccione un producto...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre} ({p.presentacion?.nombre})</option>
                ))}
              </select>
            </div>
            <div>
              <label className={styles.label}>Rendimiento Base</label>
              <input className={styles.input} type="number" step="0.01" name="rendimientoBase" value={formData.rendimientoBase} onChange={onChange} required />
            </div>
            <div>
              <label className={styles.label}>Unidad Rendimiento</label>
              <input className={styles.input} name="unidadRendimiento" value={formData.unidadRendimiento} onChange={onChange} required />
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label className={styles.label}>Observaciones</label>
            <input className={styles.input} name="observaciones" value={formData.observaciones || ''} onChange={onChange} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className={styles.sectionTitle} style={{ border: 'none', margin: 0 }}>Etapas de Producción</h2>
            <Button type="button" onClick={onAddEtapa}>+ Agregar Etapa</Button>
          </div>
          
          {formData.etapas?.map((etapa, eIdx) => {
            if (etapa.activo === false) return null;
            return (
              <div key={eIdx} className={styles.stageCard}>
                <div className={styles.stageHeader}>
                  <h3>Etapa {etapa.orden}: {etapa.nombre || 'Nueva Etapa'}</h3>
                  <Button type="button" variant="danger" onClick={() => onRemoveEtapa(eIdx)}>Eliminar Etapa</Button>
                </div>
                <div className={styles.grid3}>
                  <div>
                    <label>Nombre Fase</label>
                    <input className={styles.input} value={etapa.nombre} onChange={e => onUpdateEtapa(eIdx, 'nombre', e.target.value)} required />
                  </div>
                  <div>
                    <label>Tiempo Estándar (Min)</label>
                    <input className={styles.input} type="number" value={etapa.tiempoEstandarMin || 0} onChange={e => onUpdateEtapa(eIdx, 'tiempoEstandarMin', parseInt(e.target.value))} />
                  </div>
                  <div>
                    <label>T. Min / Max (Min)</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input className={styles.input} type="number" value={etapa.tiempoMinimoMin || 0} onChange={e => onUpdateEtapa(eIdx, 'tiempoMinimoMin', parseInt(e.target.value))} />
                      <input className={styles.input} type="number" value={etapa.tiempoMaximoMin || 0} onChange={e => onUpdateEtapa(eIdx, 'tiempoMaximoMin', parseInt(e.target.value))} />
                    </div>
                  </div>
                  <div>
                    <label>Temp. Mínima (°C)</label>
                    <input className={styles.input} type="number" step="0.1" value={etapa.tempMinimaGrados || 0} onChange={e => onUpdateEtapa(eIdx, 'tempMinimaGrados', parseFloat(e.target.value))} />
                  </div>
                  <div>
                    <label>Temp. Máxima (°C)</label>
                    <input className={styles.input} type="number" step="0.1" value={etapa.tempMaximaGrados || 0} onChange={e => onUpdateEtapa(eIdx, 'tempMaximaGrados', parseFloat(e.target.value))} />
                  </div>
                  <div>
                    <label>Instrucciones</label>
                    <input className={styles.input} value={etapa.instrucciones || ''} onChange={e => onUpdateEtapa(eIdx, 'instrucciones', e.target.value)} />
                  </div>
                </div>

                <IngredientsFormSection 
                  etapa={etapa} 
                  etapaIndex={eIdx}
                  supplies={supplies}
                  onAdd={onAddDetalle}
                  onUpdate={onUpdateDetalle}
                  onRemove={onRemoveDetalle}
                />
              </div>
            )
          })}
        </div>

        <div className={styles.summaryCard}>
          <h4>Resumen de Proyección (Componentes Base)</h4>
          <div className={styles.summaryRow}>
            <span>Rendimiento Formulado:</span>
            <span>{formData.rendimientoBase} {formData.unidadRendimiento}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Total Etapas Activas:</span>
            <span>{formData.etapas?.filter(e => e.activo !== false).length || 0}</span>
          </div>
          <div className={styles.summaryTotal}>
            <span>Costo Teórico Proyectado:</span>
            <span>${calculateCost().toLocaleString('es-CO', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className={styles.formActions}>
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Guardar Receta</Button>
        </div>
      </form>
    </div>
  );
}
