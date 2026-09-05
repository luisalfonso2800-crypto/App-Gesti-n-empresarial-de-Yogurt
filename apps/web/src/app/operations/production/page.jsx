'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { apiClient } from '../../../lib/api-client';
import { Button } from '../../../components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { LoadingState, ErrorState, EmptyState } from '../../../components/ui/States';
import styles from './production.module.css';
import { ContextBanner } from '../../../components/ui/ContextBanner';


export default function ProductionPage() {
  const [productions, setProductions] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [view, setView] = useState('list'); // list, create, complete
  const [editingItem, setEditingItem] = useState(null);
  
  // Create Form State
  const [selectedRecipeId, setSelectedRecipeId] = useState('');
  const [cantidadPlanificada, setCantidadPlanificada] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [bomSimulado, setBomSimulado] = useState([]);
  
  // Complete Form State
  const [completeDetalles, setCompleteDetalles] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodData, recData] = await Promise.all([
        apiClient.get('/production'),
        apiClient.get('/recipes')
      ]);
      setProductions(prodData);
      setRecipes(recData);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setSelectedRecipeId('');
    setCantidadPlanificada(1);
    setSelectedVariants({});
    setBomSimulado([]);
    setView('create');
  };

  const handleOpenComplete = (item) => {
    setEditingItem(item);
    setCompleteDetalles(item.detalles.map(d => ({
      ...d,
      cantidadRealUtilizada: d.cantidadRealUtilizada ?? d.cantidadTeorica
    })));
    setView('complete');
  };

  const handleCloseView = () => {
    setView('list');
    setEditingItem(null);
  };

  const selectedRecipe = useMemo(() => {
    return recipes.find(r => r.id === selectedRecipeId);
  }, [recipes, selectedRecipeId]);

  const variantGroups = useMemo(() => {
    if (!selectedRecipe) return [];
    const groups = new Set();
    selectedRecipe.etapas?.forEach(e => {
      e.detalles?.forEach(d => {
        if (d.esOpcional && d.grupoVariante && d.grupoVariante !== 'NINGUNO') {
          groups.add(d.grupoVariante);
        }
      });
    });
    return Array.from(groups);
  }, [selectedRecipe]);

  const handleVariantChange = (group, val) => {
    setSelectedVariants(prev => {
      const n = { ...prev };
      if (val) n[group] = true;
      else delete n[group];
      return n;
    });
  };

  const simularBOM = async () => {
    if (!selectedRecipeId || cantidadPlanificada <= 0) return;
    try {
      const vStr = Object.keys(selectedVariants).join(',');
      const data = await apiClient.get(`/production/recipe-bom/${selectedRecipeId}?cantidad=${cantidadPlanificada}&variantes=${vStr}`);
      setBomSimulado(data);
    } catch (err) {
      alert("Error simulando BOM: " + err.message);
    }
  };

  useEffect(() => {
    if (selectedRecipeId) {
      const timer = setTimeout(() => simularBOM(), 300);
      return () => clearTimeout(timer);
    } else {
      setBomSimulado([]);
    }
  }, [selectedRecipeId, cantidadPlanificada, selectedVariants]);

  const handleSubmitCreate = async (e) => {
    e.preventDefault();
    try {
      const data = {
        idProducto: selectedRecipe.idProducto,
        fechaProduccion: new Date().toISOString(),
        cantidadPlanificada: Number(cantidadPlanificada),
        estado: 'PLANIFICADA',
        detalles: bomSimulado.map(b => ({
          idInsumo: b.idInsumo,
          cantidadTeorica: b.requeridoTeorico,
          unidad: b.unidad,
          costoTeorico: b.costoTeorico
        }))
      };
      await apiClient.post('/production', data);
      handleCloseView();
      fetchData();
    } catch (err) {
      alert(err.message || 'Error al guardar');
    }
  };

  const handleSubmitComplete = async (e) => {
    e.preventDefault();
    try {
      const data = {
        cantidadProducidaReal: Number(editingItem.cantidadPlanificada), // For simplicity
        detalles: completeDetalles.map(d => ({
          id: d.id,
          cantidadRealUtilizada: Number(d.cantidadRealUtilizada)
        }))
      };
      await apiClient.patch(`/production/${editingItem.id}/complete`, data);
      handleCloseView();
      fetchData();
    } catch (err) {
      alert(err.message || 'Error al completar');
    }
  };

  const renderCreateView = () => (
    <div className={styles.editorContainer}>
      <div className={styles.headerTitle}>
        <h2 className={styles.title}>Nueva Orden de Producción</h2>
        <Button variant="secondary" onClick={handleCloseView} style={{ width: 'fit-content', marginTop: '1rem' }}>Volver</Button>
      </div>
      
      <form onSubmit={handleSubmitCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className={styles.grid2}>
          <div>
            <label>Receta a Producir</label>
            <select className={styles.select} value={selectedRecipeId} onChange={e => setSelectedRecipeId(e.target.value)} required>
              <option value="">Seleccione una receta...</option>
              {recipes.filter(r => r.activo).map(r => (
                <option key={r.id} value={r.id}>{r.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Cantidad a Producir (Unidades Finales)</label>
            <input className={styles.input} type="number" step="0.01" value={cantidadPlanificada} onChange={e => setCantidadPlanificada(e.target.value)} required />
          </div>
        </div>

        {variantGroups.length > 0 && (
          <div>
            <h3 className={styles.sectionTitle}>Variantes Opcionales</h3>
            <div className={styles.grid3}>
              {variantGroups.map(vg => (
                <div key={vg}>
                  <label>
                    <input 
                      type="checkbox" 
                      checked={!!selectedVariants[vg]} 
                      onChange={e => handleVariantChange(vg, e.target.checked)} 
                    /> Iniciar con Variante: {vg}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {bomSimulado.length > 0 && (
          <div>
            <h3 className={styles.sectionTitle}>BOM Escalonado y Disponibilidad</h3>
            <table className={styles.bomTable}>
              <thead>
                <tr>
                  <th>Etapa</th>
                  <th>Insumo</th>
                  <th>Requerido (Teórico)</th>
                  <th>Stock Actual</th>
                  <th>Faltante</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {bomSimulado.map((b, i) => (
                  <tr key={i} className={b.ok ? styles.okRow : styles.missingRow}>
                    <td>{b.etapa}</td>
                    <td>{b.nombreInsumo}</td>
                    <td>{b.requeridoTeorico.toFixed(2)} {b.unidad}</td>
                    <td>{b.stockActual.toFixed(2)} {b.unidad}</td>
                    <td className={b.faltante > 0 ? styles.missingText : ''}>{b.faltante.toFixed(2)}</td>
                    <td className={b.ok ? styles.okText : styles.missingText}>{b.ok ? 'OK' : 'FALTANTE'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className={styles.formActions}>
          <Button type="button" variant="secondary" onClick={handleCloseView}>Cancelar</Button>
          <Button type="submit" disabled={!selectedRecipeId || bomSimulado.some(b => !b.ok)}>
            Registrar Orden y Tomar Snapshot
          </Button>
        </div>
      </form>
    </div>
  );

  const renderCompleteView = () => (
    <div className={styles.editorContainer}>
      <div className={styles.headerTitle}>
        <h2 className={styles.title}>Cierre de Producción</h2>
        <p className={styles.subtitle}>Reporte el consumo real de materiales. El inventario se descontará con base en el consumo físico reportado.</p>
        <Button variant="secondary" onClick={handleCloseView} style={{ width: 'fit-content', marginTop: '1rem' }}>Volver</Button>
      </div>

      <form onSubmit={handleSubmitComplete}>
        <table className={styles.bomTable}>
          <thead>
            <tr>
              <th>ID Insumo</th>
              <th>Consumo Teórico</th>
              <th>Consumo Real Físico</th>
              <th>Variación / Merma Extra</th>
            </tr>
          </thead>
          <tbody>
            {completeDetalles.map((d, idx) => {
              const diff = d.cantidadRealUtilizada - d.cantidadTeorica;
              let diffClass = '';
              if (diff > 0) diffClass = styles.mermaDanger;
              else if (diff < 0) diffClass = styles.mermaSuccess;
              else diffClass = styles.okText;

              return (
                <tr key={d.id}>
                  <td>{d.idInsumo}</td>
                  <td>{Number(d.cantidadTeorica).toFixed(2)} {d.unidad}</td>
                  <td>
                    <input 
                      className={styles.input} 
                      type="number" 
                      step="0.0001" 
                      value={d.cantidadRealUtilizada} 
                      onChange={e => {
                        const arr = [...completeDetalles];
                        arr[idx].cantidadRealUtilizada = e.target.value;
                        setCompleteDetalles(arr);
                      }}
                      required
                    />
                  </td>
                  <td className={diffClass}>
                    {diff > 0 ? '+' : ''}{diff.toFixed(2)} {d.unidad}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className={styles.formActions}>
           <Button type="submit">Completar y Descontar Inventario</Button>
        </div>
      </form>
    </div>
  );

  if (view === 'create') return renderCreateView();
  if (view === 'complete') return renderCompleteView();

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>Producción</h1>
          <p className={styles.subtitle}>Planificación y registro de órdenes de fabricación ejecutadas a partir de las recetas maestras.</p>
        </div>
        <Button onClick={handleOpenCreate}>Nueva Orden</Button>
      </div>
      <ContextBanner title="Concepto Técnico" description="Aquí se gestiona el trabajo de fábrica. Permite dar la orden de fabricar, descuenta los insumos usados automáticamente y registra los desperdicios o mermas." />


      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : productions.length === 0 ? (
        <EmptyState title="No hay producción" description="Registra la primera orden" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Producto (ID)</TH>
              <TH>Fecha</TH>
              <TH>Planificada</TH>
              <TH>Producida</TH>
              <TH>Estado</TH>
              <TH>Acciones</TH>
            </TR>
          </THead>
          <TBody>
            {productions.map((item) => (
              <TR key={item.id}>
                <TD>{item.idProducto}</TD>
                <TD>{new Date(item.fechaProduccion).toLocaleDateString()}</TD>
                <TD>{Number(item.cantidadPlanificada).toFixed(2)}</TD>
                <TD>{item.cantidadProducidaReal ? Number(item.cantidadProducidaReal).toFixed(2) : '-'}</TD>
                <TD>
                  <Badge status={item.estado === 'COMPLETADA' ? 'active' : 'inactive'}>
                    {item.estado}
                  </Badge>
                </TD>
                <TD>
                  {item.estado !== 'COMPLETADA' && (
                    <Button onClick={() => handleOpenComplete(item)}>Cerrar Orden (Real)</Button>
                  )}
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}
