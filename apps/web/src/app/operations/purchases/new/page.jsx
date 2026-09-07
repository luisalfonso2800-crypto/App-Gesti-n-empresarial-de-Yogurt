'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './new-purchase.module.css';
import { TrashIcon, CheckIcon, XIcon, AlertCircleIcon, ClockIcon, RotateCcwIcon } from '../../../../components/ui/icons';
import { apiClient } from '../../../../lib/api-client';

export default function NewPurchasePage() {
  const router = useRouter();
  
  // Phase handling
  const [phase, setPhase] = useState(1); // 1 = Checklist, 2 = Form
  const [checklistItems, setChecklistItems] = useState([]);
  const [isInitializing, setIsInitializing] = useState(true);
  
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

  // Toast state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const toastTimeoutRef = useRef(null);

  const showNotification = (message, type = 'success') => {
    setToast({ show: true, message, type });
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3500);
  };

  // Modals state
  const [showProvModal, setShowProvModal] = useState(false);
  const [newProv, setNewProv] = useState({ nombre: '', nitCedula: '', telefono: '', personaContacto: '', email: '', direccion: '', observaciones: '', activo: true });
  
  const [showInsumoModal, setShowInsumoModal] = useState(false);
  const [targetRowId, setTargetRowId] = useState(null);
  const [newInsumo, setNewInsumo] = useState({ nombre: '', categoria: 'MATERIA_PRIMA', unidadBase: 'KG', stockMinimo: 0, marca: '' });

  const [simulationResult, setSimulationResult] = useState({ subtotalGlobal: 0, itemsLiquidados: [] });
  const [comprasAsentadas, setComprasAsentadas] = useState([]);
  const [pendingItems, setPendingItems] = useState([]);

  // Dropdowns state
  const [provSearch, setProvSearch] = useState('');
  const [showProvDropdown, setShowProvDropdown] = useState(false);
  const [activeInsumoDropdown, setActiveInsumoDropdown] = useState(null);
  const [insumoSearch, setInsumoSearch] = useState('');

  const provRef = useRef(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      let proveedores = [];
      let insumos = [];
      let precios = [];

      try {
        const [provRes, insRes, pricesRes] = await Promise.all([
          apiClient.get('/suppliers').catch(() => []),
          apiClient.get('/supplies').catch(() => []),
          apiClient.get('/supplier-prices').catch(() => [])
        ]);
        
        proveedores = provRes || [];
        insumos = insRes || [];
        precios = pricesRes || [];
        
        setProveedoresDB(proveedores);
        setInsumosDB(insumos);
        setSupplierPrices(precios);
      } catch (err) {
        console.error('Error cargando catálogos:', err);
      }

      const queryParams = new URLSearchParams(window.location.search);
      const isManual = queryParams.get('manual') === 'true';
      const orderId = queryParams.get('orderId');

      let activeOrders = [];
      try {
        activeOrders = await apiClient.get('/purchases/orders/active');
      } catch (e) {
        console.error('Failed to fetch active orders', e);
      }

      if (orderId) {
        try {
          const orderDetail = await apiClient.get(`/purchases/orders/${orderId}`);
          if (orderDetail && orderDetail.items && orderDetail.items.length > 0) {
            const items = orderDetail.items.map((item, idx) => {
              const insumoInfo = insumos.find(i => i.id === item.idInsumo);
              const provInfo = proveedores.find(p => p.id === item.idProveedor);
              const priceInfo = precios.find(p => p.idInsumo === item.idInsumo && p.idProveedor === item.idProveedor);
              
              // Duplicate check
              const duplicateInOtherOrder = (activeOrders || []).find(ao => 
                ao.id !== orderId && 
                ao.items && ao.items.some(aoi => aoi.idInsumo === item.idInsumo && aoi.estadoItem === 'PENDIENTE')
              );

              return {
                ...item,
                _id: idx,
                orderItemId: item.id,
                currentOrderId: orderId,
                insumoData: insumoInfo || {},
                proveedorData: provInfo || {},
                priceData: priceInfo || {},
                cantidadSolicitada: item.cantidad || 1,
                precioCompraActual: item.precioEstimado || priceInfo?.precioCompra || 0,
                estadoOperativo: item.estadoItem === 'PENDIENTE' ? 'CONSEGUIDO' : item.estadoItem,
                motivoNoConseguido: '',
                detalleMotivoNoConseguido: '',
                duplicateWarning: duplicateInOtherOrder ? `[Aviso: Este insumo también se encuentra asignado en ${duplicateInOtherOrder.codigo} - ${duplicateInOtherOrder.nombre}]` : null
              };
            });
            
            setChecklistItems(items.filter(i => i.estadoOperativo !== 'COMPRADO' && i.estadoOperativo !== 'DESCARTADO'));
            setPhase(1);
          } else {
            setPhase(2);
          }
        } catch (e) {
          console.warn('Orden no encontrada o error de red en orden:', e);
          showNotification('No se encontró la orden especificada, inicializando vista limpia.', 'warning');
          setPhase(2);
        }
      } else {
          // Check session storage for checklist
          try {
            const stored = sessionStorage.getItem('selectedForPurchase');
            if (stored && !isManual) {
              const parsed = JSON.parse(stored);
              if (parsed && parsed.length > 0) {
                const items = parsed.map((item, idx) => {
                  const insumoInfo = insumos.find(i => i.id === item.idInsumo);
                  const provInfo = proveedores.find(p => p.id === item.idProveedor);
                  const priceInfo = precios.find(p => p.idInsumo === item.idInsumo && p.idProveedor === item.idProveedor);
  
                  return {
                    ...item,
                    _id: idx,
                    insumoData: insumoInfo || item.insumo || {},
                    proveedorData: provInfo || item.proveedor || {},
                    priceData: priceInfo || {},
                    cantidadSolicitada: item.cantidad || 1,
                    precioCompraActual: priceInfo?.precioCompra || item.precioCompra || item.precio || 0,
                    estadoOperativo: 'CONSEGUIDO',
                    motivoNoConseguido: '',
                    detalleMotivoNoConseguido: ''
                  };
                });
                setChecklistItems(items);
                setPhase(1);
              } else {
                setPhase(2);
              }
            } else {
              setPhase(2);
            }
          } catch (e) {
            console.error(e);
            setPhase(2);
          }
        }
      setIsInitializing(false);
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const simulate = async () => {
      const itemsPayload = checklistItems.filter(i => i.estadoOperativo !== 'DESCARTADO').map(item => ({
        idPrecioProveedor: item.idPrecioProveedor || item.priceData?.id,
        cantidadEmpaques: item.cantidadSolicitada || 1,
        precioEmpaque: item.precioCompraActual || 0,
        factorReal: item.contenidoBaseEditado || item.contenidoBase || item.priceData?.cantidadEquivalenteBase || 1,
        unidadBase: item.unidadBaseEditada || item.insumoData?.unidadBase || item.unidadBase || item.unidadMedida
      }));

      if (itemsPayload.length > 0) {
        try {
          const res = await apiClient.post('/purchases/simulate', { items: itemsPayload });
          setSimulationResult(res);
        } catch (e) {
          console.error('Error simulating:', e);
        }
      } else {
        setSimulationResult({ subtotalGlobal: 0, itemsLiquidados: [] });
      }
    };
    
    if (phase === 1 && checklistItems.length > 0) {
      simulate();
    }
  }, [checklistItems, phase]);

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
    const conseguidos = checklistItems.filter(i => i.estadoOperativo === 'CONSEGUIDO');
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
    if (!newProv.nombre || !newProv.nitCedula) {
      alert("Nombre y NIT/Cédula son obligatorios.");
      return;
    }
    
    const modalForm = newProv;
    const payload = {
      nombre: modalForm.nombre?.trim(),
      nitCedula: modalForm.nitCedula?.trim(),
      nombreContacto: modalForm.personaContacto?.trim() || modalForm.nombreContacto?.trim() || null,
      telefono: modalForm.telefono?.trim() || null,
      email: modalForm.email?.trim() || null,
      direccion: modalForm.direccion?.trim() || null,
      observaciones: modalForm.observaciones?.trim() || null,
      activo: modalForm.activo !== undefined ? modalForm.activo : true,
    };

    try {
      const p = await apiClient.post('/suppliers', payload);
      if (p) {
        setProveedoresDB(prev => [...prev, p]);
        
        if (targetRowId !== null) {
          updateChecklistItem(targetRowId, 'idProveedorAlternativo', p.id);
          setTargetRowId(null);
        } else {
          setProveedorSeleccionado(p);
          setProvSearch(p.nombre);
          setShowProvDropdown(false);
        }
        
        setShowProvModal(false);
        showNotification(`Proveedor "${payload.nombre}" registrado y asignado.`);
      } else {
        alert("Error al registrar proveedor en el sistema.");
      }
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || "Error de red al registrar proveedor (posible NIT duplicado)";
      alert(msg);
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
        showNotification(`Insumo "${i.nombre}" registrado exitosamente.`, 'success');
      } else {
        showNotification("Error al registrar insumo en el sistema.", 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification("Error de red al registrar insumo.", 'error');
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
      showNotification("Seleccione un proveedor para continuar.", 'error');
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
        showNotification("Compra registrada exitosamente", 'success');
        sessionStorage.removeItem('selectedForPurchase');
        router.push('/operations/purchases');
      } else {
        showNotification("Error al registrar compra", 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification("Error de red al registrar la compra.", 'error');
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

  const renderModals = () => (
    <>
      {/* Modal Proveedor */}
      {showProvModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalTitle}>Nuevo Proveedor</div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nombre / Razón Social *</label>
              <input type="text" className={styles.input} value={newProv.nombre} onChange={e => setNewProv({...newProv, nombre: e.target.value})} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>NIT / Cédula *</label>
              <input type="text" className={styles.input} value={newProv.nitCedula} onChange={e => setNewProv({...newProv, nitCedula: e.target.value})} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Teléfono</label>
              <input type="text" className={styles.input} value={newProv.telefono} onChange={e => setNewProv({...newProv, telefono: e.target.value})} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input type="email" className={styles.input} value={newProv.email} onChange={e => setNewProv({...newProv, email: e.target.value})} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Persona de Contacto</label>
              <input type="text" className={styles.input} value={newProv.personaContacto} onChange={e => setNewProv({...newProv, personaContacto: e.target.value})} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Dirección</label>
              <input type="text" className={styles.input} value={newProv.direccion} onChange={e => setNewProv({...newProv, direccion: e.target.value})} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Observaciones</label>
              <textarea className={styles.input} value={newProv.observaciones} onChange={e => setNewProv({...newProv, observaciones: e.target.value})} />
            </div>
            <div className={styles.formGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" checked={newProv.activo} onChange={e => setNewProv({...newProv, activo: e.target.checked})} />
              <label className={styles.label} style={{ margin: 0 }}>Activo</label>
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
          <div className={styles.modalContent}>
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
    </>
  );

  if (isInitializing) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f9fafb' }}>
        <div style={{ color: '#6b7280', fontSize: '1.125rem' }}>Cargando módulo de compras...</div>
      </div>
    );
  }

  return (
    <>
      {phase === 1 ? (
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
                    <div key={item._id} className={`${styles.checklistCard} ${item.estadoOperativo === 'CONSEGUIDO' ? styles.checklistCardConseguido : styles.checklistCardNoConseguido}`}>
                      {/* Zona Encabezado */}
                      <div className={styles.checklistHeader}>
                        <span className={styles.insumoName}>{item.insumoData?.nombre || item.nombre}</span>
                        <span className={styles.badge}>Categoría: {item.insumoData?.categoria || item.categoria || 'N/A'}</span>
                        <span className={styles.badge}>Marca: {item.insumoData?.marca || item.marca || 'Sin marca'}</span>
                        <span className={`${styles.badge} ${styles.badgeStock}`}>
                          Stock Mín: {item.insumoData?.stockMinimo || item.stockMinimo || 0} {item.insumoData?.unidadBase || item.unidadBase || item.unidadMedida}
                        </span>
                        <span style={{ fontSize: '0.85rem', color: '#6b7280', marginLeft: 'auto' }}>
                          Presentación: {item.priceData?.presentacionCompra || item.presentacionCompra || 'N/A'} ({item.contenidoBase || item.priceData?.cantidadEquivalenteBase || 1} {item.insumoData?.unidadBase || item.unidadBase || item.unidadMedida})
                        </span>
                      </div>

                      {item.duplicateWarning && (
                        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '0.75rem', borderRadius: '6px', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                          <AlertCircleIcon size={18} />
                          <b>Atención:</b> {item.duplicateWarning}
                        </div>
                      )}

                      {/* Zona Central: Controles y Resumen */}
                      <div className={`${styles.checklistBody} ${(item.estadoOperativo === 'NO_CONSEGUIDO' || item.estadoOperativo === 'DESCARTADO') ? styles.disabledArea : ''}`}>
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>Cant. Solicitada</label>
                          <input 
                            type="number" 
                            className={styles.input} 
                            style={{ width: '120px' }}
                            min="1"
                            step="any"
                            value={item.cantidadSolicitada} 
                            onChange={(e) => updateChecklistItem(item._id, 'cantidadSolicitada', parseFloat(e.target.value))} 
                            onBlur={(e) => {
                               let val = parseFloat(e.target.value);
                               if (isNaN(val) || val < 1) updateChecklistItem(item._id, 'cantidadSolicitada', 1);
                            }}
                          />
                        </div>
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>Precio Empaque ($)</label>
                          <input 
                            type="number" 
                            className={styles.input} 
                            style={{ width: '140px' }}
                            min="0"
                            step="any"
                            value={item.precioCompraActual} 
                            onChange={(e) => updateChecklistItem(item._id, 'precioCompraActual', parseFloat(e.target.value) || 0)} 
                          />
                        </div>

                        {/* Bloque Resumen */}
                        <div className={styles.summaryBlock}>
                          {(() => {
                            const cantidad = item.cantidadSolicitada || 1;
                            const precio = item.precioCompraActual || 0;
                            const subtotal = cantidad * precio;
                            const contenidoNeto = item.contenidoBaseEditado || item.contenidoBase || item.priceData?.cantidadEquivalenteBase || 1;
                            const ingresoNetoBodega = cantidad * contenidoNeto;
                            const costoBaseUnitario = ingresoNetoBodega > 0 ? subtotal / ingresoNetoBodega : 0;
                            const unidadBase = item.unidadBaseEditada || item.insumoData?.unidadBase || item.unidadBase || item.unidadMedida || '';

                            return (
                              <>
                                <div className={styles.summaryItem}>
                                  <span className={styles.summaryLabel}>Subtotal:</span>
                                  <span className={styles.summaryValue}>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className={styles.summaryItem}>
                                  <span className={styles.summaryLabel}>Total neto a bodega:</span>
                                  <span className={styles.summaryValue}>{ingresoNetoBodega.toFixed(2)} {unidadBase}</span>
                                </div>
                                <div className={styles.summaryItem}>
                                  <span className={styles.summaryLabel}>Costo unitario real:</span>
                                  <span className={styles.summaryValue}>${costoBaseUnitario.toFixed(2)} / {unidadBase}</span>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Motivos para NO_CONSEGUIDO */}
                      {(item.estadoOperativo === 'NO_CONSEGUIDO' || item.estadoOperativo === 'PENDIENTE_OTRO_PROVEEDOR') && (
                        <div className={styles.motivosBar}>
                          <label className={styles.label} style={{ color: '#991b1b' }}>Motivo por el cual no se consiguió:</label>
                          <select 
                            className={styles.select}
                            value={item.motivoNoConseguido || ''}
                            onChange={(e) => updateChecklistItem(item._id, 'motivoNoConseguido', e.target.value)}
                            style={{ borderColor: '#fca5a5' }}
                          >
                            <option value="">-- Seleccione un motivo --</option>
                            <option value="Agotado en punto de venta">Agotado en punto de venta</option>
                            <option value="Proveedor ya no distribuye este insumo">Proveedor ya no distribuye este insumo</option>
                            <option value="Precio fuera de presupuesto">Precio fuera de presupuesto</option>
                            <option value="Presentación o calidad no aceptable">Presentación o calidad no aceptable</option>
                            <option value="Otro motivo (especificar)">Otro motivo (especificar)</option>
                          </select>
                          {item.motivoNoConseguido === 'Otro motivo (especificar)' && (
                            <input 
                              type="text" 
                              className={styles.input} 
                              placeholder="Especifique el motivo..."
                              value={item.detalleMotivoNoConseguido || ''}
                              onChange={(e) => updateChecklistItem(item._id, 'detalleMotivoNoConseguido', e.target.value)}
                              style={{ borderColor: '#fca5a5' }}
                            />
                          )}
                          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                            <button 
                              type="button" 
                              className={styles.cancelBtn} 
                              onClick={() => {
                                if (!item.motivoNoConseguido) {
                                  showNotification('Seleccione un motivo primero.', 'error');
                                  return;
                                }
                                updateChecklistItem(item._id, 'estadoOperativo', 'PENDIENTE_OTRO_PROVEEDOR');
                                setPendingItems(prev => [...prev, { ...item, fechaRegistro: new Date().toLocaleTimeString() }]);
                                const newSelection = checklistItems.filter(i => i._id !== item._id);
                                setChecklistItems(newSelection);
                                sessionStorage.setItem('selectedForPurchase', JSON.stringify(newSelection));
                                window.dispatchEvent(new Event('cartUpdated'));
                                showNotification(`"${item.insumoData?.nombre || item.nombre}" movido a pendientes: ${item.motivoNoConseguido}`, 'info');
                              }}
                            >
                              Registrar motivo y mantener en lista
                            </button>
                            <button 
                              type="button" 
                              className={styles.cancelBtn} 
                              style={{ color: '#ef4444', borderColor: '#ef4444' }}
                              onClick={async () => {
                                updateChecklistItem(item._id, 'estadoOperativo', 'DESCARTADO');
                                const newSelection = checklistItems.filter(i => i._id !== item._id);
                                setChecklistItems(newSelection);
                                sessionStorage.setItem('selectedForPurchase', JSON.stringify(newSelection));
                                window.dispatchEvent(new Event('cartUpdated'));

                                if (item.currentOrderId && item.orderItemId) {
                                  try {
                                    await apiClient.patch(`/purchases/orders/${item.currentOrderId}/items/${item.orderItemId}`, { estadoItem: 'DESCARTADO' });
                                  } catch(e) { console.error('Failed to update item state', e); }
                                }
                                
                                showNotification('Insumo descartado de la orden.', 'warning');
                              }}
                            >
                              Registrar motivo y descartar
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Edición Comercial (Flexibilidad) */}
                      {item.editCommercial && (
                        <div className={styles.qualitySection} style={{ borderTopColor: '#3b82f6' }}>
                          <div style={{ gridColumn: '1 / -1', fontWeight: 600, color: '#1e40af' }}>Nuevas condiciones comerciales:</div>
                          <div>
                            <label className={styles.label}>Proveedor</label>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <select className={styles.select} style={{ flex: 1 }} value={item.idProveedorAlternativo || ''} onChange={e => {
                                updateChecklistItem(item._id, 'idProveedorAlternativo', e.target.value);
                              }}>
                                <option value="">-- Mismo Proveedor --</option>
                                {proveedoresDB.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                              </select>
                              <button type="button" className={styles.saveBtn} style={{ marginTop: 0, width: 'auto' }} onClick={() => {
                                setTargetRowId(item._id);
                                setNewProv({ nombre: '', nitCedula: '', telefono: '', personaContacto: '', email: '', direccion: '', observaciones: '', activo: true });
                                setShowProvModal(true);
                              }}>
                                + Nuevo Proveedor
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className={styles.label}>Marca</label>
                            <input type="text" className={styles.input} list="marcas-list" value={item.marcaAlternativa || item.insumoData?.marca || item.marca || ''} onChange={e => updateChecklistItem(item._id, 'marcaAlternativa', e.target.value)} />
                          </div>
                          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.5rem' }}>
                            <div style={{ flex: 1 }}>
                              <label className={styles.label}>Empaque Comercial</label>
                              <input type="text" className={styles.input} value={item.empaqueAlternativo || item.priceData?.presentacionCompra || 'Bulto'} onChange={e => updateChecklistItem(item._id, 'empaqueAlternativo', e.target.value)} />
                            </div>
                            <div style={{ width: '100px' }}>
                              <label className={styles.label}>Cont. Neto</label>
                              <input type="number" step="any" className={styles.input} value={item.contenidoBaseEditado || item.contenidoBase || item.priceData?.cantidadEquivalenteBase || 1} onChange={e => updateChecklistItem(item._id, 'contenidoBaseEditado', parseFloat(e.target.value) || 1)} />
                            </div>
                            <div style={{ width: '100px' }}>
                              <label className={styles.label}>Unidad</label>
                              <select className={styles.select} value={item.unidadBaseEditada || item.insumoData?.unidadBase || item.unidadBase || item.unidadMedida} onChange={e => updateChecklistItem(item._id, 'unidadBaseEditada', e.target.value)}>
                                <option value="kg">kg</option>
                                <option value="g">g</option>
                                <option value="L">L</option>
                                <option value="ml">ml</option>
                                <option value="Unidades">Unidades</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Zona Control: Botones de estado */}
                      <div className={styles.checklistFooter}>
                        <button type="button" className={styles.toggleBtn} onClick={() => updateChecklistItem(item._id, 'editCommercial', !item.editCommercial)} style={{ marginRight: 'auto' }}>
                          ¿Comprado con otros datos? (Cambiar proveedor / marca / empaque)
                        </button>

                        <button 
                          className={`${styles.btnNoConseguido} ${item.estadoOperativo === 'NO_CONSEGUIDO' ? styles.btnNoConseguidoActive : ''}`}
                          onClick={() => updateChecklistItem(item._id, 'estadoOperativo', 'NO_CONSEGUIDO')}
                        >
                          <XIcon size={18} /> No Conseguido
                        </button>
                        <button 
                          className={`${styles.btnConseguido} ${item.estadoOperativo === 'CONSEGUIDO' ? styles.btnConseguidoActive : ''}`}
                          onClick={async () => {
                            updateChecklistItem(item._id, 'estadoOperativo', 'CONSEGUIDO');
                            const simItem = simulationResult.itemsLiquidados.find(si => si.idPrecioProveedor === (item.idPrecioProveedor || item.priceData?.id));
                            if (!simItem) return;
                            
                            const payload = {
                              idProveedor: item.idProveedorAlternativo || item.proveedorData?.id,
                              esNuevoProveedor: false,
                              condicion: 'CONTADO',
                              total: simItem.subtotal,
                              fechaCompra: new Date().toISOString(),
                              detalles: [{
                                idInsumo: item.idInsumo,
                                esNuevoInsumo: false,
                                cantidad: item.cantidadSolicitada,
                                precioUnitario: item.precioCompraActual,
                                subtotal: simItem.subtotal,
                                presentacion: `${item.empaqueAlternativo || item.priceData?.presentacionCompra || 'Empaque'} ${item.contenidoBaseEditado || item.contenidoBase || item.priceData?.cantidadEquivalenteBase || 1}${item.unidadBaseEditada || item.insumoData?.unidadBase || item.unidadBase || item.unidadMedida}`,
                                empaques: item.cantidadSolicitada,
                                contenidoBase: item.contenidoBaseEditado || item.contenidoBase || item.priceData?.cantidadEquivalenteBase || 1,
                                unidadEmpaque: item.unidadBaseEditada || item.insumoData?.unidadBase || item.unidadBase || item.unidadMedida,
                                cantidadBaseTotal: simItem.ingresoNetoBodega,
                                costoBase: simItem.costoBaseUnitario,
                                marca: item.marcaAlternativa || item.insumoData?.marca || item.marca || ''
                              }]
                            };

                            try {
                              const res = await apiClient.post('/purchases', payload);
                              if (res) {
                                // Add to comprasAsentadas
                                setComprasAsentadas(prev => [...prev, { ...item, ...payload.detalles[0], idCompra: res.id, provNombre: proveedoresDB.find(p => p.id === payload.idProveedor)?.nombre || item.proveedorData?.nombre }]);
                                // Remove from checklistItems
                                const remainingItems = checklistItems.filter(i => i._id !== item._id);
                                setChecklistItems(remainingItems);
                                sessionStorage.setItem('selectedForPurchase', JSON.stringify(remainingItems));
                                window.dispatchEvent(new Event('cartUpdated'));

                                if (item.currentOrderId && item.orderItemId) {
                                  try {
                                    await apiClient.patch(`/purchases/orders/${item.currentOrderId}/items/${item.orderItemId}`, { estadoItem: 'COMPRADO' });
                                  } catch (err) { console.error('Error actualizando item de orden:', err); }
                                }

                                showNotification('Compra registrada y asentada.', 'success');
                              }
                            } catch (e) {
                              showNotification('Error asentando compra.', 'error');
                              console.error(e);
                            }
                          }}
                        >
                          <CheckIcon size={18} /> Conseguido
                        </button>
                      </div>
                    </div>
                  )})}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Insumos Pendientes / No Conseguidos */}
        {pendingItems.length > 0 && (
          <div className={`${styles.card} ${styles.pendingSection}`}>
            <div className={styles.cardTitle} style={{ color: '#854d0e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ClockIcon size={20} />
              Insumos Pendientes de Compra (No Conseguidos)
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className={styles.tablePending} style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #fde047', textAlign: 'left', background: '#fef9c3' }}>
                    <th style={{ padding: '0.75rem' }}>Insumo</th>
                    <th style={{ padding: '0.75rem' }}>Proveedor / Presentación</th>
                    <th style={{ padding: '0.75rem' }}>Motivo Registrado</th>
                    <th style={{ padding: '0.75rem' }}>Estado</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingItems.map((pi, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #fef08a' }}>
                      <td style={{ padding: '0.75rem' }}><b>{pi.insumoData?.nombre || pi.nombre}</b><br/><span style={{ fontSize: '0.75rem', color: '#713f12' }}>{pi.insumoData?.categoria || pi.categoria}</span></td>
                      <td style={{ padding: '0.75rem' }}>{pi.proveedorData?.nombre || pi.proveedorNombre || 'N/A'}<br/><span style={{ fontSize: '0.75rem', color: '#713f12' }}>{pi.priceData?.presentacionCompra || 'N/A'}</span></td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ fontWeight: 600, color: '#991b1b' }}>{pi.motivoNoConseguido}</span>
                        {pi.detalleMotivoNoConseguido && <div style={{ fontSize: '0.75rem', fontStyle: 'italic', color: '#7f1d1d' }}>{pi.detalleMotivoNoConseguido}</div>}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={styles.badgePending}>Pendiente</span>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        <button 
                          type="button" 
                          className={styles.btnReintentar}
                          onClick={() => {
                            const reactivatedItem = { ...pi };
                            delete reactivatedItem.estadoOperativo;
                            delete reactivatedItem.motivoNoConseguido;
                            delete reactivatedItem.detalleMotivoNoConseguido;
                            delete reactivatedItem.fechaRegistro;
                            setChecklistItems(prev => [...prev, reactivatedItem]);
                            setPendingItems(prev => prev.filter((_, i) => i !== idx));
                            showNotification('Insumo devuelto al checklist para reintento.', 'info');
                          }}
                        >
                          <RotateCcwIcon size={16} /> Reintentar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Resumen de Compras Asentadas */}
        {comprasAsentadas.length > 0 && (
          <div className={styles.card} style={{ marginTop: '2rem', borderTop: '4px solid #10b981' }}>
            <div className={styles.cardTitle} style={{ color: '#065f46' }}>Resumen de Compras Asentadas en Sesión</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: '#f3f4f6', borderBottom: '1px solid #d1d5db', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem' }}>Insumo</th>
                    <th style={{ padding: '0.75rem' }}>Proveedor</th>
                    <th style={{ padding: '0.75rem' }}>Marca</th>
                    <th style={{ padding: '0.75rem' }}>Cant. Empaques</th>
                    <th style={{ padding: '0.75rem' }}>Neto a Bodega</th>
                    <th style={{ padding: '0.75rem' }}>Costo Base</th>
                    <th style={{ padding: '0.75rem' }}>Subtotal Pagado</th>
                  </tr>
                </thead>
                <tbody>
                  {comprasAsentadas.map((c, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.75rem' }}>{c.insumoData?.nombre || c.nombre}</td>
                      <td style={{ padding: '0.75rem' }}>{c.provNombre || 'N/A'}</td>
                      <td style={{ padding: '0.75rem' }}>{c.marca}</td>
                      <td style={{ padding: '0.75rem' }}>{c.empaques}</td>
                      <td style={{ padding: '0.75rem' }}>{c.cantidadBaseTotal.toFixed(2)} {c.unidadEmpaque}</td>
                      <td style={{ padding: '0.75rem' }}>${c.costoBase.toFixed(2)}</td>
                      <td style={{ padding: '0.75rem' }}>${c.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button 
                type="button" 
                className={styles.submitBtn} 
                style={{ width: 'auto', background: '#3b82f6' }}
                onClick={() => {
                  setComprasAsentadas([]);
                  if (checklistItems.length === 0) {
                     sessionStorage.setItem('selectedForPurchase', JSON.stringify([]));
                     window.dispatchEvent(new Event('cartUpdated'));
                     showNotification('Sesión de compras completada. Redirigiendo...', 'success');
                     setTimeout(() => router.push('/operations/purchases'), 1500);
                  }
                }}
              >
                Limpiar Resumen / Finalizar Jornada
              </button>
            </div>
          </div>
        )}
      </div>
      ) : (
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
                className={`${styles.input} ${toast.show && toast.type === 'success' ? styles.successBorder : ''}`} 
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
                     setNewProv({ nombre: provSearch, nitCedula: '', telefono: '', personaContacto: '', email: '', direccion: '', observaciones: '', activo: true });
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
    </div>
    )}
    {renderModals()}
    {toast.show && (
      <div className={styles.toastContainer}>
        <div className={`${styles.toast} ${toast.type === 'success' ? styles.toastSuccess : styles.toastError}`}>
          <div className={styles.toastIcon}>
            <CheckIcon size={20} />
          </div>
          <span className={styles.toastMessage}>{toast.message}</span>
          <button type="button" className={styles.toastCloseBtn} onClick={() => setToast(prev => ({ ...prev, show: false }))}>
            <XIcon size={16} />
          </button>
        </div>
      </div>
    )}
    </>
  );
}
