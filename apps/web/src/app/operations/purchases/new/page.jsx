'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './new-purchase.module.css';
import { TrashIcon, CheckIcon } from '../../../../components/ui/icons';
import { apiClient } from '../../../../lib/api-client';

export default function NewPurchasePage() {
  const router = useRouter();
  
  // Phase handling
  const [phase, setPhase] = useState(2); // 1 = Checklist, 2 = Form
  const [checklistItems, setChecklistItems] = useState([]);
  
  // Data from backend
  const [proveedoresDB, setProveedoresDB] = useState([]);
  const [insumosDB, setInsumosDB] = useState([]);
  const [supplierPrices, setSupplierPrices] = useState([]);
  
  // Form State
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [condicion, setCondicion] = useState('CONTADO');
  const [diasCredito, setDiasCredito] = useState(0);
  const [flete, setFlete] = useState(0);
  const [detalles, setDetalles] = useState([
    {
      id: Date.now(),
      insumo: null,
      empaque: 'Bulto',
      contenidoNeto: 50,
      unidadMedida: 'kg',
      marca: '',
      empaques: 1,
      precioUnitario: 0,
      showQuality: false,
      lote: '',
      fechaVencimiento: ''
    }
  ]);
  const [observaciones, setObservaciones] = useState('');

  // Modals state
  const [showProvModal, setShowProvModal] = useState(false);
  const [newProv, setNewProv] = useState({ nombre: '', nitCedula: '', telefono: '', personaContacto: '' });
  
  const [showInsumoModal, setShowInsumoModal] = useState(false);
  const [targetRowId, setTargetRowId] = useState(null);
  const [newInsumo, setNewInsumo] = useState({ nombre: '', categoria: 'MATERIA_PRIMA', unidadBase: 'KG', stockMinimo: 0, marca: '' });

  // Dropdowns state
  const [provSearch, setProvSearch] = useState('');
  const [showProvDropdown, setShowProvDropdown] = useState(false);
  const [activeInsumoDropdown, setActiveInsumoDropdown] = useState(null);
  const [insumoSearch, setInsumoSearch] = useState('');

  const provRef = useRef(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [provRes, insRes, pricesRes] = await Promise.all([
          apiClient.get('/suppliers'),
          apiClient.get('/supplies'),
          apiClient.get('/supplier-prices')
        ]);
        
        const proveedores = provRes || [];
        const insumos = insRes || [];
        const precios = pricesRes || [];
        
        setProveedoresDB(proveedores);
        setInsumosDB(insumos);
        setSupplierPrices(precios);

        // Check session storage for checklist
        try {
          const stored = sessionStorage.getItem('selectedForPurchase');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.length > 0) {
              const items = parsed.map((item, idx) => {
                const insumoInfo = insumos.find(i => i.id === item.idInsumo);
                const provInfo = proveedores.find(p => p.id === item.idProveedor);
                const priceInfo = precios.find(p => p.idInsumo === item.idInsumo && p.idProveedor === item.idProveedor);

                return {
                  ...item,
                  _id: idx,
                  conseguido: false,
                  insumoData: insumoInfo || item.insumo || {},
                  proveedorData: provInfo || item.proveedor || {},
                  priceData: priceInfo || {},
                  cantidadSolicitada: item.cantidad || 1,
                  precioCompraActual: priceInfo?.precioCompra || item.precioCompra || item.precio || 0,
                  estadoOperativo: 'Conseguido'
                };
              });
              setChecklistItems(items);
              setPhase(1);
            }
          }
        } catch (e) {
          console.error(e);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchInitialData();
  }, []);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (provRef.current && !provRef.current.contains(event.target)) {
        setShowProvDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute grouped checklist
  const checklistGrouped = checklistItems.reduce((acc, item) => {
    const prov = item.proveedorData?.nombre || item.proveedorNombre || 'Sin Proveedor';
    if (!acc[prov]) acc[prov] = [];
    acc[prov].push(item);
    return acc;
  }, {});

  const toggleChecklistItem = (id) => {
    setChecklistItems(items => items.map(it => 
      it._id === id ? { ...it, conseguido: !it.conseguido } : it
    ));
  };

  const updateChecklistItem = (id, field, value) => {
    setChecklistItems(items => items.map(it => 
      it._id === id ? { ...it, [field]: value } : it
    ));
  };

  const proceedToForm = () => {
    const conseguidos = checklistItems.filter(i => i.conseguido && i.estadoOperativo === 'Conseguido');
    if (conseguidos.length > 0) {
      // Map to form details
      const newDetalles = conseguidos.map((c, i) => ({
        id: Date.now() + i,
        insumo: { nombre: c.insumoData?.nombre || c.nombre || 'Insumo', isNew: false, id: c.insumoData?.id || c.idInsumo },
        empaque: c.priceData?.presentacionCompra?.split(' ')[0] || 'Unidad',
        contenidoNeto: c.priceData?.contenidoBase || 1,
        unidadMedida: c.insumoData?.unidadBase || c.unidad || 'UNIDAD',
        marca: c.insumoData?.marca || '',
        empaques: c.cantidadSolicitada || 1,
        precioUnitario: c.precioCompraActual || 0,
        showQuality: false,
        lote: '',
        fechaVencimiento: ''
      }));
      setDetalles(newDetalles);
      
      const firstProv = conseguidos[0].proveedorData;
      if (firstProv) {
         setProveedorSeleccionado(firstProv);
         setProvSearch(firstProv.nombre);
      }
    }
    setPhase(2);
  };

  const totalCompra = detalles.reduce((acc, det) => acc + ((det.empaques || 0) * (det.precioUnitario || 0)), 0);
  const totalConFlete = totalCompra + parseFloat(flete || 0);

  const handleCreateProv = async () => {
    try {
      const p = await apiClient.post('/suppliers', newProv);
      if (p) {
        setProveedoresDB(prev => [...prev, p]);
        setProveedorSeleccionado(p);
        setShowProvModal(false);
        setProvSearch(p.nombre);
        setShowProvDropdown(false);
      } else {
        alert("Error al registrar proveedor en el sistema.");
      }
    } catch (err) {
      console.error(err);
      alert("Error de red");
    }
  };

  const handleCreateInsumo = async () => {
    try {
      const i = await apiClient.post('/supplies', newInsumo);
      if (i) {
        setInsumosDB(prev => [...prev, i]);
        
        // Simular que este proveedor suministra este insumo recién creado
        if (proveedorSeleccionado) {
          setSupplierPrices(prev => [...prev, { idProveedor: proveedorSeleccionado.id, idInsumo: i.id }]);
        }
        
        setDetalles(detalles.map(d => {
          if (d.id === targetRowId) {
            return { ...d, insumo: i, unidadMedida: i.unidadBase || 'kg', marca: i.marca || '' };
          }
          return d;
        }));
        setShowInsumoModal(false);
        setActiveInsumoDropdown(null);
      } else {
        alert("Error al registrar insumo en el sistema.");
      }
    } catch (err) {
      console.error(err);
      alert("Error de red");
    }
  };

  const addRow = () => {
    setDetalles([...detalles, {
      id: Date.now(),
      insumo: null,
      empaque: 'Bulto',
      contenidoNeto: 1,
      unidadMedida: 'UNIDAD',
      marca: '',
      empaques: 1,
      precioUnitario: 0,
      showQuality: false,
      lote: '',
      fechaVencimiento: ''
    }]);
  };

  const removeRow = (id) => {
    if (detalles.length > 1) {
      setDetalles(detalles.filter(d => d.id !== id));
    }
  };

  const updateDetalle = (id, field, value) => {
    setDetalles(detalles.map(d => {
      if (d.id === id) {
        return { ...d, [field]: value };
      }
      return d;
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proveedorSeleccionado) {
      alert("Seleccione un proveedor");
      return;
    }

    const payload = {
      idProveedor: proveedorSeleccionado.isNew ? null : proveedorSeleccionado.id,
      esNuevoProveedor: proveedorSeleccionado.isNew ? true : false,
      nuevoProveedor: proveedorSeleccionado.isNew ? proveedorSeleccionado : null,
      condicion: condicion === 'CREDITO' ? `CREDITO - ${diasCredito} dias` : 'CONTADO',
      observaciones: observaciones + (parseFloat(flete) > 0 ? ` (Flete: $${flete})` : ''),
      total: totalConFlete,
      fechaCompra: new Date().toISOString(),
      detalles: detalles.map(d => ({
        idInsumo: d.insumo?.isNew ? null : d.insumo?.id,
        esNuevoInsumo: d.insumo?.isNew ? true : false,
        nuevoInsumo: d.insumo?.isNew ? d.insumo : null,
        cantidad: d.empaques,
        precioUnitario: d.precioUnitario,
        subtotal: d.empaques * d.precioUnitario,
        presentacion: `${d.empaque} ${d.contenidoNeto}${d.unidadMedida}`,
        empaques: d.empaques,
        contenidoBase: d.contenidoNeto,
        unidadEmpaque: d.unidadMedida,
        cantidadBaseTotal: d.empaques * d.contenidoNeto,
        costoBase: d.precioUnitario / (d.contenidoNeto || 1),
        lote: d.lote,
        fechaVencimiento: d.fechaVencimiento,
        marca: d.marca
      }))
    };

    try {
      const res = await apiClient.post('/purchases', payload);
      if (res) {
        alert("Compra registrada exitosamente");
        sessionStorage.removeItem('selectedForPurchase');
        router.push('/operations/purchases');
      } else {
        alert("Error al registrar compra");
      }
    } catch (err) {
      console.error(err);
      alert("Error de red");
    }
  };

  const filteredProv = proveedoresDB.filter(p => p.nombre.toLowerCase().includes(provSearch.toLowerCase()));
  
  // Filtrar Insumos por el Proveedor Seleccionado y la Búsqueda
  const validInsumoIdsForProv = proveedorSeleccionado
    ? new Set(supplierPrices.filter(sp => sp.idProveedor === proveedorSeleccionado.id).map(sp => sp.idInsumo))
    : new Set();
    
  const filteredIns = insumosDB.filter(i => 
    i.nombre.toLowerCase().includes(insumoSearch.toLowerCase()) && 
    (validInsumoIdsForProv.has(i.id) || !proveedorSeleccionado)
  );

  const generatedId = `CMP-${new Date().getFullYear()}-XXXX`;

  // Datalist brands extraction
  const todasLasMarcas = Array.from(new Set(insumosDB.map(i => i.marca).filter(Boolean)));

  if (phase === 1) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Checklist de Compras</h1>
          <div className={styles.noPrint} style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button className={styles.submitBtn} style={{ marginTop: 0, width: 'auto' }} onClick={() => window.print()}>
              Imprimir Checklist
            </button>
            <button className={styles.saveBtn} style={{ marginTop: 0, width: 'auto' }} onClick={proceedToForm}>
              Continuar a Formulario (Fase 2)
            </button>
          </div>
        </div>

        {/* PRINT ONLY TABLE */}
        <div className={styles.printTableContainer}>
          {Object.entries(checklistGrouped).map(([prov, items]) => (
            <div key={`print-${prov}`}>
              <h2 style={{ fontSize: '1.25rem', marginTop: '1rem' }}>Proveedor: {prov}</h2>
              <table className={styles.printTable}>
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>[ ]</th>
                    <th>Insumo</th>
                    <th>Marca</th>
                    <th>Presentación</th>
                    <th>Cant.</th>
                    <th>Notas</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={`print-item-${item._id}`}>
                      <td><div className={styles.printCheckbox}></div></td>
                      <td><b>{item.insumoData?.nombre}</b><br/>{item.insumoData?.categoria}</td>
                      <td>{item.insumoData?.marca || '-'}</td>
                      <td>
                        {item.priceData?.presentacionCompra || 'Bulto'} <br/> 
                        {item.priceData?.contenidoBase || 1} {item.insumoData?.unidadBase || item.unidadMedida}
                      </td>
                      <td></td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {/* INTERACTIVE UI */}
        <div className={styles.printArea}>
          {checklistItems.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', background: '#fff9c4', borderRadius: '8px', border: '1px solid #fbc02d', color: '#f57f17' }}>
              <h3>⚠️ No hay insumos en el carrito de compras</h3>
              <p>Seleccione insumos desde la sección de alertas de inventario o pase a la Fase 2 para agregarlos manualmente.</p>
            </div>
          ) : (
            Object.entries(checklistGrouped).map(([prov, items]) => (
              <div key={prov} className={styles.card}>
                <div className={styles.cardTitle}>Proveedor: {prov}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {items.map(item => {
                    const contNeto = item.priceData?.contenidoBase || 1;
                    const costoBase = item.precioCompraActual / contNeto;
                    
                    return (
                    <div key={item._id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                        <input 
                          type="checkbox" 
                          checked={item.conseguido}
                          onChange={() => toggleChecklistItem(item._id)}
                          style={{ width: '18px', height: '18px' }}
                        />
                        Conseguido
                      </label>
                      
                      <div style={{ flex: '1', minWidth: '200px' }}>
                        <div style={{ fontWeight: 'bold' }}>{item.insumoData?.nombre || item.nombre}</div>
                        <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Categoría: {item.insumoData?.categoria || 'N/A'} | Marca: {item.insumoData?.marca || '-'}</div>
                        <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                          Presentación: {item.priceData?.presentacionCompra || 'N/A'} | {contNeto} {item.insumoData?.unidadBase}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Stock Mín: {item.insumoData?.stockMinimo || 0}</div>
                      </div>

                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div>
                          <label className={styles.label}>Cant. Solicitada</label>
                          <input 
                            type="number" 
                            className={styles.input} 
                            style={{ width: '80px' }}
                            value={item.cantidadSolicitada} 
                            onChange={(e) => updateChecklistItem(item._id, 'cantidadSolicitada', parseFloat(e.target.value) || 0)} 
                          />
                        </div>
                        <div>
                          <label className={styles.label}>Precio ($)</label>
                          <input 
                            type="number" 
                            className={styles.input} 
                            style={{ width: '100px' }}
                            value={item.precioCompraActual} 
                            onChange={(e) => updateChecklistItem(item._id, 'precioCompraActual', parseFloat(e.target.value) || 0)} 
                          />
                        </div>
                        <div style={{ fontSize: '0.85rem', textAlign: 'right' }}>
                          <div style={{ color: '#6b7280' }}>Costo Base</div>
                          <div style={{ fontWeight: 'bold' }}>${costoBase.toFixed(2)} / {item.insumoData?.unidadBase}</div>
                        </div>
                        <div>
                          <label className={styles.label}>Estado</label>
                          <select 
                            className={styles.select} 
                            value={item.estadoOperativo}
                            onChange={(e) => updateChecklistItem(item._id, 'estadoOperativo', e.target.value)}
                          >
                            <option value="Conseguido">Conseguido</option>
                            <option value="Agotado en Tienda">Agotado en Tienda</option>
                            <option value="Proveedor ya no suministra">Proveedor ya no suministra</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )})}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <datalist id="marcas-list">
        {todasLasMarcas.map(m => (
          <option key={m} value={m} />
        ))}
      </datalist>

      <div className={styles.header}>
        <h1>Nueva Compra (Ingreso de Inventario)</h1>
        <p style={{ color: '#6b7280', margin: 0 }}>Consecutivo Generado: {generatedId}</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Proveedor y Condiciones */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>1. Información del Proveedor</div>
          <div className={styles.grid2}>
            <div className={styles.formGroup} ref={provRef}>
              <label className={styles.label}>Proveedor *</label>
              <input 
                type="text" 
                className={styles.input} 
                value={provSearch}
                onChange={(e) => {
                  setProvSearch(e.target.value);
                  setShowProvDropdown(true);
                  if (proveedorSeleccionado && proveedorSeleccionado.nombre !== e.target.value) {
                    setProveedorSeleccionado(null);
                  }
                }}
                onFocus={() => setShowProvDropdown(true)}
                placeholder="Buscar o crear proveedor..."
              />
              {showProvDropdown && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownAction} onClick={() => {
                     setNewProv({ nombre: provSearch, nitCedula: '', telefono: '', personaContacto: '' });
                     setShowProvModal(true);
                  }}>
                    + Registrar Nuevo Proveedor
                  </div>
                  {filteredProv.map(p => (
                    <div key={p.id} className={styles.dropdownItem} onClick={() => {
                      setProveedorSeleccionado(p);
                      setProvSearch(p.nombre);
                      setShowProvDropdown(false);
                    }}>
                      {p.nombre} {p.nitCedula && `(${p.nitCedula})`}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className={styles.grid2}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Condición de Pago</label>
                <select className={styles.select} value={condicion} onChange={e => setCondicion(e.target.value)}>
                  <option value="CONTADO">Contado</option>
                  <option value="CREDITO">Crédito</option>
                </select>
              </div>
              {condicion === 'CREDITO' && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>Días Crédito</label>
                  <input type="number" min="0" className={styles.input} value={diasCredito} onChange={e => setDiasCredito(e.target.value)} />
                </div>
              )}
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Observaciones</label>
            <input type="text" className={styles.input} value={observaciones} onChange={e => setObservaciones(e.target.value)} />
          </div>
        </div>

        {/* Detalles de Compra */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>2. Detalles e Insumos</div>
          
          <div className={styles.row}>
            <div className={styles.rowHeader}>Insumo</div>
            <div className={styles.rowHeader}>Presentación</div>
            <div className={styles.rowHeader}>Cantidad (Empaques)</div>
            <div className={styles.rowHeader}>Precio Unitario</div>
            <div className={styles.rowHeader}>Totales</div>
            <div></div>
          </div>

          {detalles.map(row => (
            <div key={row.id} style={{marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb'}}>
              <div className={styles.row} style={{ alignItems: 'flex-start' }}>
                {/* Insumo selector */}
                <div style={{position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                  <input 
                    type="text" 
                    className={styles.input}
                    placeholder="Buscar insumo..."
                    value={activeInsumoDropdown === row.id ? insumoSearch : (row.insumo?.nombre || '')}
                    onChange={(e) => {
                      if (activeInsumoDropdown !== row.id) {
                        setActiveInsumoDropdown(row.id);
                      }
                      setInsumoSearch(e.target.value);
                      if (row.insumo) updateDetalle(row.id, 'insumo', null);
                    }}
                    onFocus={() => {
                      setActiveInsumoDropdown(row.id);
                      setInsumoSearch(row.insumo?.nombre || '');
                    }}
                    disabled={!proveedorSeleccionado}
                  />
                  {!proveedorSeleccionado && (
                     <span style={{fontSize: '0.75rem', color: '#ef4444'}}>Seleccione proveedor primero</span>
                  )}
                  {row.insumo && (
                     <span style={{fontSize: '0.75rem', color: '#6b7280'}}>Stock Mínimo: {row.insumo.stockMinimo || 0} {row.insumo.unidadBase}</span>
                  )}
                  {activeInsumoDropdown === row.id && (
                    <div className={styles.dropdown}>
                      <div className={styles.dropdownAction} onClick={() => {
                        setTargetRowId(row.id);
                        setNewInsumo({ ...newInsumo, nombre: insumoSearch });
                        setShowInsumoModal(true);
                      }}>
                        + Registrar Nuevo Insumo
                      </div>
                      {filteredIns.length === 0 && (
                        <div style={{ padding: '0.5rem', fontSize: '0.85rem', color: '#6b7280' }}>
                          No hay insumos asociados.
                        </div>
                      )}
                      {filteredIns.map(i => (
                        <div key={i.id} className={styles.dropdownItem} onClick={() => {
                          updateDetalle(row.id, 'insumo', i);
                          updateDetalle(row.id, 'unidadMedida', i.unidadBase || 'kg');
                          updateDetalle(row.id, 'marca', i.marca || '');
                          setActiveInsumoDropdown(null);
                        }}>
                          {i.nombre} <span style={{color: '#9ca3af', fontSize:'0.75rem'}}>({i.unidadBase})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="text" className={styles.input} value={row.empaque} onChange={e => updateDetalle(row.id, 'empaque', e.target.value)} placeholder="Empaque (Ej: Bulto)" style={{flex: 1}} />
                    <input type="number" step="any" className={styles.input} value={row.contenidoNeto} onChange={e => updateDetalle(row.id, 'contenidoNeto', parseFloat(e.target.value) || 0)} placeholder="Contenido" style={{width: '70px'}} />
                    <select className={styles.select} value={row.unidadMedida} onChange={e => updateDetalle(row.id, 'unidadMedida', e.target.value)} style={{width: '70px'}}>
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="L">L</option>
                      <option value="ml">ml</option>
                      <option value="Unidades">Unidades</option>
                    </select>
                  </div>
                  <input type="text" className={styles.input} list="marcas-list" value={row.marca} onChange={e => updateDetalle(row.id, 'marca', e.target.value)} placeholder="Marca (opcional)" />
                </div>

                <input type="number" min="1" step="any" className={styles.input} value={row.empaques} onChange={e => updateDetalle(row.id, 'empaques', parseFloat(e.target.value) || 0)} />
                
                <input type="number" step="any" className={styles.input} value={row.precioUnitario} onChange={e => updateDetalle(row.id, 'precioUnitario', parseFloat(e.target.value) || 0)} />
                
                <div className={styles.stats}>
                  <div>Ingreso a Bodega: <b>{(row.empaques * row.contenidoNeto).toFixed(2)} {row.unidadMedida}</b></div>
                  <div>Subtotal: <b>${(row.empaques * row.precioUnitario).toFixed(2)}</b></div>
                </div>

                <button type="button" className={styles.removeBtn} onClick={() => removeRow(row.id)}>
                  <TrashIcon size={16} />
                </button>

                <div style={{gridColumn: '1 / -1', marginTop: '0.5rem'}}>
                  <button type="button" className={styles.toggleBtn} onClick={() => updateDetalle(row.id, 'showQuality', !row.showQuality)}>
                    {row.showQuality ? '- Ocultar Calidad/Lote' : '+ Añadir Calidad/Lote (Trazabilidad)'}
                  </button>
                </div>

                {row.showQuality && (
                  <div className={styles.qualitySection} style={{gridColumn: '1 / -1', marginTop: '0.5rem'}}>
                    <div>
                      <label className={styles.label}>Lote Proveedor</label>
                      <input type="text" className={styles.input} value={row.lote} onChange={e => updateDetalle(row.id, 'lote', e.target.value)} />
                    </div>
                    <div>
                      <label className={styles.label}>Fecha Vencimiento</label>
                      <input type="date" className={styles.input} value={row.fechaVencimiento} onChange={e => updateDetalle(row.id, 'fechaVencimiento', e.target.value)} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          <button type="button" className={styles.addBtn} onClick={addRow}>+ Añadir Fila</button>

          <div className={styles.formGroup} style={{ marginTop: '1rem', width: '200px' }}>
             <label className={styles.label}>Flete / Costo Adicional</label>
             <input type="number" step="any" className={styles.input} value={flete} onChange={e => setFlete(parseFloat(e.target.value) || 0)} />
          </div>

          <div className={styles.summary}>
            Total Compra: ${totalConFlete.toFixed(2)}
          </div>
        </div>

        <button type="submit" className={styles.submitBtn}>
          Confirmar Compra
        </button>
      </form>

      {/* Modal Proveedor */}
      {showProvModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalTitle}>Nuevo Proveedor</div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nombre / Razón Social</label>
              <input type="text" className={styles.input} value={newProv.nombre} onChange={e => setNewProv({...newProv, nombre: e.target.value})} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>NIT / Cédula</label>
              <input type="text" className={styles.input} value={newProv.nitCedula} onChange={e => setNewProv({...newProv, nitCedula: e.target.value})} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Teléfono</label>
              <input type="text" className={styles.input} value={newProv.telefono} onChange={e => setNewProv({...newProv, telefono: e.target.value})} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Persona de Contacto</label>
              <input type="text" className={styles.input} value={newProv.personaContacto} onChange={e => setNewProv({...newProv, personaContacto: e.target.value})} />
            </div>
            <div className={styles.modalActions}>
              <button type="button" className={styles.cancelBtn} onClick={() => setShowProvModal(false)}>Cancelar</button>
              <button type="button" className={styles.saveBtn} onClick={handleCreateProv}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Insumo */}
      {showInsumoModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalTitle}>Nuevo Insumo</div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nombre</label>
              <input type="text" className={styles.input} value={newInsumo.nombre} onChange={e => setNewInsumo({...newInsumo, nombre: e.target.value})} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Marca</label>
              <input type="text" className={styles.input} value={newInsumo.marca} onChange={e => setNewInsumo({...newInsumo, marca: e.target.value})} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Categoría</label>
              <select className={styles.select} value={newInsumo.categoria} onChange={e => setNewInsumo({...newInsumo, categoria: e.target.value})}>
                <option value="MATERIA_PRIMA">Materia Prima</option>
                <option value="EMPAQUE">Empaque</option>
                <option value="LIMPIEZA">Limpieza</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Unidad Base</label>
              <select className={styles.select} value={newInsumo.unidadBase} onChange={e => setNewInsumo({...newInsumo, unidadBase: e.target.value})}>
                <option value="kg">Kilogramos (kg)</option>
                <option value="L">Litros (L)</option>
                <option value="Unidades">Unidad (Unidades)</option>
                <option value="g">Gramos (g)</option>
                <option value="ml">Mililitros (ml)</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Stock Mínimo</label>
              <input type="number" className={styles.input} value={newInsumo.stockMinimo} onChange={e => setNewInsumo({...newInsumo, stockMinimo: parseFloat(e.target.value) || 0})} />
            </div>
            <div className={styles.modalActions}>
              <button type="button" className={styles.cancelBtn} onClick={() => setShowInsumoModal(false)}>Cancelar</button>
              <button type="button" className={styles.saveBtn} onClick={handleCreateInsumo}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
