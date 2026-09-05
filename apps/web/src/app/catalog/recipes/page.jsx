'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api-client';
import { Button } from '../../../components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { LoadingState, ErrorState, EmptyState } from '../../../components/ui/States';
import styles from './recipes.module.css';

export default function Page() {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: '',
    idProducto: '',
    rendimientoBase: 0,
    unidadRendimiento: 'Litros',
    observaciones: '',
    activo: true,
    etapas: []
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [recipesData, productsData, suppliesData, pricesData] = await Promise.all([
        apiClient.get('/recipes'),
        apiClient.get('/products'),
        apiClient.get('/supplies'),
        apiClient.get('/supplier-prices/active')
      ]);
      setItems(recipesData);
      setProducts(productsData);
      setSupplies(suppliesData);
      setPrices(pricesData);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenEditor = async (item) => {
    if (item) {
      // Fetch full BOM for editing
      try {
        const fullItem = await apiClient.get(`/recipes/${item.id}/bom`);
        setFormData(fullItem);
      } catch (err) {
        alert('Error al cargar la receta: ' + err.message);
        return;
      }
    } else {
      setFormData({
        nombre: '',
        idProducto: '',
        rendimientoBase: 0,
        unidadRendimiento: 'Litros',
        observaciones: '',
        activo: true,
        etapas: []
      });
    }
    setIsEditing(true);
  };

  const handleCloseEditor = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const addEtapa = () => {
    setFormData(prev => ({
      ...prev,
      etapas: [
        ...prev.etapas,
        {
          nombre: '',
          orden: prev.etapas.length + 1,
          tiempoMinimoMin: 0,
          tiempoEstandarMin: 0,
          tiempoMaximoMin: 0,
          tempMinimaGrados: 0,
          tempMaximaGrados: 0,
          instrucciones: '',
          activo: true,
          detalles: []
        }
      ]
    }));
  };

  const updateEtapa = (index, field, value) => {
    const newEtapas = [...formData.etapas];
    newEtapas[index] = { ...newEtapas[index], [field]: value };
    setFormData(prev => ({ ...prev, etapas: newEtapas }));
  };

  const removeEtapa = (index) => {
    const newEtapas = [...formData.etapas];
    newEtapas.splice(index, 1);
    // Reorder
    newEtapas.forEach((e, i) => e.orden = i + 1);
    setFormData(prev => ({ ...prev, etapas: newEtapas }));
  };

  const addDetalle = (etapaIndex) => {
    const newEtapas = [...formData.etapas];
    newEtapas[etapaIndex].detalles.push({
      idInsumo: '',
      cantidadRequerida: 0,
      unidad: '',
      mermaPorcentaje: 0,
      esOpcional: false,
      grupoVariante: 'NINGUNO',
      tipoInsumo: 'BASE',
      activo: true
    });
    setFormData(prev => ({ ...prev, etapas: newEtapas }));
  };

  const updateDetalle = (etapaIndex, detalleIndex, field, value) => {
    const newEtapas = [...formData.etapas];
    const det = { ...newEtapas[etapaIndex].detalles[detalleIndex], [field]: value };
    
    // Auto fill unit if insumo is selected
    if (field === 'idInsumo') {
      const ins = supplies.find(s => s.id === value);
      if (ins) det.unidad = ins.unidadBase;
    }
    
    newEtapas[etapaIndex].detalles[detalleIndex] = det;
    setFormData(prev => ({ ...prev, etapas: newEtapas }));
  };

  const removeDetalle = (etapaIndex, detalleIndex) => {
    const newEtapas = [...formData.etapas];
    newEtapas[etapaIndex].detalles.splice(detalleIndex, 1);
    setFormData(prev => ({ ...prev, etapas: newEtapas }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await apiClient.patch(`/recipes/${formData.id}`, formData);
      } else {
        await apiClient.post('/recipes', formData);
      }
      handleCloseEditor();
      fetchData();
    } catch (err) {
      alert(err.message || 'Error al guardar');
    }
  };

  const handleToggleActive = async (item) => {
    try {
      await apiClient.patch(`/recipes/${item.id}`, { activo: !item.activo });
      fetchData();
    } catch (err) {
      alert(err.message || 'Error al cambiar estado');
    }
  };

  const calculateCost = () => {
    let total = 0;
    const priceMap = prices.reduce((acc, p) => ({ ...acc, [p.idInsumo]: p.costoUnidadBase }), {});
    
    formData.etapas?.forEach(etapa => {
      etapa.detalles?.forEach(det => {
        const cost = parseFloat(priceMap[det.idInsumo]) || 0;
        const req = parseFloat(det.cantidadRequerida) || 0;
        const merma = parseFloat(det.mermaPorcentaje) || 0;
        const totalReq = req * (1 + (merma / 100));
        if (!det.esOpcional && det.activo !== false) {
            total += (totalReq * cost);
        }
      });
    });
    return total;
  };

  if (isEditing) {
    return (
      <div>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <h1 className={styles.title}>{formData.id ? 'Editar Receta Técnica' : 'Nueva Receta Técnica'}</h1>
          </div>
          <Button variant="secondary" onClick={handleCloseEditor}>Volver al Listado</Button>
        </div>

        <form onSubmit={handleSubmit} className={styles.editorContainer}>
          <div>
            <h2 className={styles.sectionTitle}>Cabecera de Receta</h2>
            <div className={styles.grid2}>
              <div>
                <label className={styles.label}>Nombre</label>
                <input className={styles.input} name="nombre" value={formData.nombre} onChange={handleChange} required />
              </div>
              <div>
                <label className={styles.label}>Producto Asociado</label>
                <select className={styles.select} name="idProducto" value={formData.idProducto} onChange={handleChange} required>
                  <option value="">Seleccione un producto...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre} ({p.presentacion?.nombre})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={styles.label}>Rendimiento Base</label>
                <input className={styles.input} type="number" step="0.01" name="rendimientoBase" value={formData.rendimientoBase} onChange={handleChange} required />
              </div>
              <div>
                <label className={styles.label}>Unidad Rendimiento</label>
                <input className={styles.input} name="unidadRendimiento" value={formData.unidadRendimiento} onChange={handleChange} required />
              </div>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <label className={styles.label}>Observaciones</label>
              <input className={styles.input} name="observaciones" value={formData.observaciones || ''} onChange={handleChange} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className={styles.sectionTitle} style={{ border: 'none', margin: 0 }}>Etapas de Producción</h2>
              <Button type="button" onClick={addEtapa}>+ Agregar Etapa</Button>
            </div>
            
            {formData.etapas?.map((etapa, eIdx) => {
              if (etapa.activo === false) return null;
              return (
              <div key={eIdx} className={styles.stageCard}>
                <div className={styles.stageHeader}>
                  <h3>Etapa {etapa.orden}: {etapa.nombre || 'Nueva Etapa'}</h3>
                  <Button type="button" variant="danger" onClick={() => removeEtapa(eIdx)}>Eliminar Etapa</Button>
                </div>
                <div className={styles.grid3}>
                  <div>
                    <label>Nombre Fase</label>
                    <input className={styles.input} value={etapa.nombre} onChange={e => updateEtapa(eIdx, 'nombre', e.target.value)} required />
                  </div>
                  <div>
                    <label>Tiempo Estándar (Min)</label>
                    <input className={styles.input} type="number" value={etapa.tiempoEstandarMin || 0} onChange={e => updateEtapa(eIdx, 'tiempoEstandarMin', parseInt(e.target.value))} />
                  </div>
                  <div>
                    <label>T. Min / Max (Min)</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input className={styles.input} type="number" value={etapa.tiempoMinimoMin || 0} onChange={e => updateEtapa(eIdx, 'tiempoMinimoMin', parseInt(e.target.value))} />
                      <input className={styles.input} type="number" value={etapa.tiempoMaximoMin || 0} onChange={e => updateEtapa(eIdx, 'tiempoMaximoMin', parseInt(e.target.value))} />
                    </div>
                  </div>
                  <div>
                    <label>Temp. Mínima (°C)</label>
                    <input className={styles.input} type="number" step="0.1" value={etapa.tempMinimaGrados || 0} onChange={e => updateEtapa(eIdx, 'tempMinimaGrados', parseFloat(e.target.value))} />
                  </div>
                  <div>
                    <label>Temp. Máxima (°C)</label>
                    <input className={styles.input} type="number" step="0.1" value={etapa.tempMaximaGrados || 0} onChange={e => updateEtapa(eIdx, 'tempMaximaGrados', parseFloat(e.target.value))} />
                  </div>
                  <div>
                    <label>Instrucciones</label>
                    <input className={styles.input} value={etapa.instrucciones || ''} onChange={e => updateEtapa(eIdx, 'instrucciones', e.target.value)} />
                  </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0 }}>Lista de Materiales (BOM)</h4>
                    <Button type="button" variant="secondary" onClick={() => addDetalle(eIdx)}>+ Agregar Insumo</Button>
                  </div>
                  {etapa.detalles?.filter(d => d.activo !== false).length > 0 && (
                    <table className={styles.bomTable}>
                      <thead>
                        <tr>
                          <th>Insumo</th>
                          <th>Cant. Requerida</th>
                          <th>Merma %</th>
                          <th>Tipo Insumo</th>
                          <th>Grupo Variante</th>
                          <th>Opcional</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {etapa.detalles.map((det, dIdx) => {
                          if (det.activo === false) return null;
                          return (
                          <tr key={dIdx}>
                            <td>
                              <select className={styles.select} value={det.idInsumo} onChange={e => updateDetalle(eIdx, dIdx, 'idInsumo', e.target.value)} required>
                                <option value="">Seleccione...</option>
                                {supplies.map(s => (
                                  <option key={s.id} value={s.id}>{s.nombre} ({s.unidadBase})</option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <input className={styles.input} type="number" step="0.0001" value={det.cantidadRequerida || 0} onChange={e => updateDetalle(eIdx, dIdx, 'cantidadRequerida', parseFloat(e.target.value))} required />
                            </td>
                            <td>
                              <input className={styles.input} type="number" step="0.1" value={det.mermaPorcentaje || 0} onChange={e => updateDetalle(eIdx, dIdx, 'mermaPorcentaje', parseFloat(e.target.value))} />
                            </td>
                            <td>
                              <select className={styles.select} value={det.tipoInsumo} onChange={e => updateDetalle(eIdx, dIdx, 'tipoInsumo', e.target.value)}>
                                <option value="BASE">BASE</option>
                                <option value="COMPLEMENTO">COMPLEMENTO</option>
                                <option value="EMPAQUE_BASE">EMPAQUE BASE</option>
                                <option value="EMPAQUE_COMPLEMENTO">EMPAQUE COMPLEMENTO</option>
                              </select>
                            </td>
                            <td>
                              <select className={styles.select} value={det.grupoVariante || 'NINGUNO'} onChange={e => updateDetalle(eIdx, dIdx, 'grupoVariante', e.target.value)}>
                                <option value="NINGUNO">NINGUNO</option>
                                <option value="CEREAL">CEREAL</option>
                                <option value="FRUTA">FRUTA</option>
                                <option value="JALEA">JALEA</option>
                                <option value="SABOR">SABOR</option>
                                <option value="OTRO">OTRO</option>
                              </select>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <input type="checkbox" checked={det.esOpcional} onChange={e => updateDetalle(eIdx, dIdx, 'esOpcional', e.target.checked)} />
                            </td>
                            <td>
                              <Button type="button" variant="danger" onClick={() => removeDetalle(eIdx, dIdx)}>X</Button>
                            </td>
                          </tr>
                        )})}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )})}
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
            <Button type="button" variant="secondary" onClick={handleCloseEditor}>Cancelar</Button>
            <Button type="submit">Guardar Receta</Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>Recetas Técnicas (V2)</h1>
          <p className={styles.subtitle}>Fórmulas estándar de elaboración con BOM y Etapas (Ruta de proceso).</p>
        </div>
        <Button onClick={() => handleOpenEditor(null)}>Nueva Receta</Button>
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : items.length === 0 ? (
        <EmptyState title="No hay registros" description="Crea la primera receta para comenzar" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Nombre Receta</TH>
              <TH>Producto Asociado</TH>
              <TH>Rendimiento</TH>
              <TH>N° Etapas</TH>
              <TH>Estado</TH>
              <TH>Acciones</TH>
            </TR>
          </THead>
          <TBody>
            {items.map((item) => (
              <TR key={item.id}>
                <TD>{item.nombre}</TD>
                <TD>{item.producto ? `${item.producto.nombre} (${item.producto.presentacion?.nombre || ''})` : item.idProducto}</TD>
                <TD>{item.rendimientoBase} {item.unidadRendimiento}</TD>
                <TD>{item.etapas?.filter(e => e.activo !== false).length || 0}</TD>
                <TD>
                  <Badge status={item.activo ? 'active' : 'inactive'}>
                    {item.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TD>
                <TD>
                  <div className={styles.actions}>
                    <Button variant="secondary" onClick={() => handleOpenEditor(item)}>Editar / Ver BOM</Button>
                    <Button 
                      variant={item.activo ? 'danger' : 'primary'} 
                      onClick={() => handleToggleActive(item)}
                    >
                      {item.activo ? 'Desactivar' : 'Activar'}
                    </Button>
                  </div>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}
