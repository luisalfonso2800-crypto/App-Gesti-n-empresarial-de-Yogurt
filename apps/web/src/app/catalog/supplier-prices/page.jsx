'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../../lib/api-client';
import { Button } from '../../../components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { LoadingState, ErrorState, EmptyState } from '../../../components/ui/States';
import styles from './supplier-prices.module.css';
import { ContextBanner } from '../../../components/ui/ContextBanner';


export default function Page() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [formData, setFormData] = useState({
        idInsumo: '',
        idProveedor: '',
        presentacionCompra: '',
        cantidadPresentacion: 0,
        unidadPresentacion: '',
        cantidadEquivalenteBase: 0,
        precioCompra: 0,
        costoUnidadBase: 0,
        observaciones: '',
        activo: true
  });

  // Filters state
  const [filterInsumo, setFilterInsumo] = useState('');
  const [filterProveedor, setFilterProveedor] = useState('');
  const [filterEstado, setFilterEstado] = useState('Todos');
  const [filterSearch, setFilterSearch] = useState('');
  const [filterSort, setFilterSort] = useState('none');

  // Purchase List state
  const [selectedForPurchase, setSelectedForPurchase] = useState([]);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('selectedForPurchase');
      if (stored) {
        setSelectedForPurchase(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveToSession = (newSelection) => {
    setSelectedForPurchase(newSelection);
    try {
      sessionStorage.setItem('selectedForPurchase', JSON.stringify(newSelection));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (e) {
      console.error(e);
    }
  };

  const togglePurchaseItem = (item) => {
    const isAdded = selectedForPurchase.some(p => p.id === item.id);
    if (isAdded) {
      saveToSession(selectedForPurchase.filter(p => p.id !== item.id));
    } else {
      const alreadyHasInsumoProveedor = selectedForPurchase.some(p => p.idInsumo === item.idInsumo && p.idProveedor === item.idProveedor);
      if (alreadyHasInsumoProveedor) return;
      
      const newItem = {
        id: item.id,
        idPrecioProveedor: item.id,
        idInsumo: item.idInsumo,
        idProveedor: item.idProveedor,
        insumoNombre: item.insumo?.Nombre_Insumo || item.insumo?.nombre || item.idInsumo,
        proveedorNombre: item.proveedor?.Nombre_Proveedor || item.proveedor?.nombre || item.idProveedor,
        marca: item.insumo?.Marca || item.insumo?.marca || 'Sin marca',
        categoria: item.insumo?.Categoria || item.insumo?.categoria || 'Materia Prima',
        presentacionCompra: item.presentacionCompra || 'Paquete',
        contenidoBase: item.cantidadEquivalenteBase || item.cantidadPresentacion || 1,
        unidadBase: item.insumo?.Unidad_Base || item.insumo?.unidadBase || 'Unidades',
        unidadMedida: item.unidadPresentacion || item.insumo?.Unidad_Base || item.insumo?.unidadBase || 'Unidad',
        stockMinimo: item.insumo?.Stock_Minimo || item.insumo?.stockMinimo || 0,
        precioCompra: item.precioCompra,
        costoUnidadBase: item.costoUnidadBase
      };
      saveToSession([...selectedForPurchase, newItem]);
    }
  };

  const clearPurchaseList = () => {
    saveToSession([]);
  };

  const proceedToPurchase = () => {
    router.push('/operations/purchases/new');
  };


  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/supplier-prices');
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenModal = (item) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        idInsumo: '',
        idProveedor: '',
        presentacionCompra: '',
        cantidadPresentacion: 0,
        unidadPresentacion: '',
        cantidadEquivalenteBase: 0,
        precioCompra: 0,
        costoUnidadBase: 0,
        observaciones: '',
        activo: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await apiClient.patch(`/supplier-prices/${editingItem.id}`, formData);
      } else {
        await apiClient.post('/supplier-prices', formData);
      }
      handleCloseModal();
      fetchItems();
    } catch (err) {
      alert(err.message || 'Error al guardar');
    }
  };

  const handleToggleActive = async (item) => {
    try {
      await apiClient.patch(`/supplier-prices/${item.id}`, { activo: !item.activo });
      fetchItems();
    } catch (err) {
      alert(err.message || 'Error al cambiar estado');
    }
  };

  const clearFilters = () => {
    setFilterInsumo('');
    setFilterProveedor('');
    setFilterEstado('Todos');
    setFilterSearch('');
    setFilterSort('none');
  };

  const hasFilters = filterInsumo !== '' || filterProveedor !== '' || filterEstado !== 'Todos' || filterSearch !== '' || filterSort !== 'none';

  const uniqueInsumos = useMemo(() => {
    const map = new Map();
    items.forEach(i => {
      if (i.insumo) map.set(i.idInsumo, i.insumo);
    });
    return Array.from(map.values());
  }, [items]);

  const uniqueProveedores = useMemo(() => {
    const map = new Map();
    items.forEach(i => {
      if (i.proveedor) map.set(i.idProveedor, i.proveedor);
    });
    return Array.from(map.values());
  }, [items]);

  const bestPricesMap = useMemo(() => {
    const map = new Map();
    items.forEach(item => {
      if (item.activo) {
        const currentMin = map.get(item.idInsumo);
        if (currentMin === undefined || item.costoUnidadBase < currentMin) {
          map.set(item.idInsumo, item.costoUnidadBase);
        }
      }
    });
    return map;
  }, [items]);

  const summaryCard = useMemo(() => {
    if (!filterInsumo) return null;
    const activeItemsForInsumo = items.filter(i => i.idInsumo === filterInsumo && i.activo);
    if (activeItemsForInsumo.length === 0) return null;

    let minItem = activeItemsForInsumo[0];
    let maxItem = activeItemsForInsumo[0];

    activeItemsForInsumo.forEach(i => {
      if (i.costoUnidadBase < minItem.costoUnidadBase) minItem = i;
      if (i.costoUnidadBase > maxItem.costoUnidadBase) maxItem = i;
    });

    const optionsCount = activeItemsForInsumo.length;
    let savingsPercent = 0;
    if (maxItem.costoUnidadBase > 0 && maxItem.costoUnidadBase !== minItem.costoUnidadBase) {
      savingsPercent = ((maxItem.costoUnidadBase - minItem.costoUnidadBase) / maxItem.costoUnidadBase) * 100;
    }

    return {
      minItem,
      maxItem,
      optionsCount,
      savingsPercent: savingsPercent.toFixed(2)
    };
  }, [items, filterInsumo]);

  const filteredItems = useMemo(() => {
    let result = items.filter(item => {
      if (filterInsumo && item.idInsumo !== filterInsumo) return false;
      if (filterProveedor && item.idProveedor !== filterProveedor) return false;
      if (filterEstado === 'Activos' && !item.activo) return false;
      if (filterEstado === 'Inactivos' && item.activo) return false;
      if (filterSearch) {
        const query = filterSearch.toLowerCase();
        const insumoName = (item.insumo?.Nombre_Insumo || item.insumo?.nombre || '').toLowerCase();
        const proveedorName = (item.proveedor?.Nombre_Proveedor || item.proveedor?.nombre || '').toLowerCase();
        const pres = (item.presentacionCompra || '').toLowerCase();
        if (!insumoName.includes(query) && !proveedorName.includes(query) && !pres.includes(query)) {
          return false;
        }
      }
      return true;
    });

    if (filterSort === 'asc') {
      result.sort((a, b) => a.costoUnidadBase - b.costoUnidadBase);
    }
    return result;
  }, [items, filterInsumo, filterProveedor, filterEstado, filterSearch, filterSort]);

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>Precios de Proveedores</h1>
          <p className={styles.subtitle}>Histórico y lista de tarifas vigentes cotizadas por cada proveedor para los diferentes insumos.</p>
        </div>
        <Button onClick={() => handleOpenModal()}>Nuevo Registro</Button>
      </div>
      <ContextBanner title="Concepto Técnico" description="Permite comparar cuánto cuesta cada insumo dependiendo del proveedor. Ayuda a encontrar la mejor opción de compra mostrando el costo real por unidad mínima." />


      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Insumo</label>
          <select className={styles.filterSelect} value={filterInsumo} onChange={e => setFilterInsumo(e.target.value)}>
            <option value="">Todos los insumos</option>
            {uniqueInsumos.map(ins => (
              <option key={ins.id || ins.ID_Insumo} value={ins.id || ins.ID_Insumo}>
                {ins.Nombre_Insumo || ins.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Proveedor</label>
          <select className={styles.filterSelect} value={filterProveedor} onChange={e => setFilterProveedor(e.target.value)}>
            <option value="">Todos los proveedores</option>
            {uniqueProveedores.map(prov => (
              <option key={prov.id || prov.ID_Proveedor} value={prov.id || prov.ID_Proveedor}>
                {prov.Nombre_Proveedor || prov.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Estado</label>
          <select className={styles.filterSelect} value={filterEstado} onChange={e => setFilterEstado(e.target.value)}>
            <option value="Todos">Todos</option>
            <option value="Activos">Activos</option>
            <option value="Inactivos">Inactivos</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Orden</label>
          <select className={styles.filterSelect} value={filterSort} onChange={e => setFilterSort(e.target.value)}>
            <option value="none">Por defecto</option>
            <option value="asc">Menor a mayor costo</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Búsqueda</label>
          <input 
            type="text" 
            className={styles.filterInput} 
            placeholder="Buscar presentación..." 
            value={filterSearch}
            onChange={e => setFilterSearch(e.target.value)}
          />
        </div>
        {hasFilters && (
          <Button variant="secondary" onClick={clearFilters}>Limpiar Filtros</Button>
        )}
      </div>

      {summaryCard && (
        <div className={styles.summaryCard}>
          <h3 className={styles.summaryTitle}>Resumen de Aprovisionamiento</h3>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Opciones Disponibles</span>
              <span className={styles.summaryValue}>{summaryCard.optionsCount}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Mejor Tarifa (Costo Base)</span>
              <span className={styles.summaryValueSuccess}>${summaryCard.minItem.costoUnidadBase} - {summaryCard.minItem.proveedor?.Nombre_Proveedor || summaryCard.minItem.proveedor?.nombre || 'Proveedor'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Ahorro vs Tarifa Alta</span>
              <span className={styles.summaryValueInfo}>{summaryCard.savingsPercent}%</span>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : items.length === 0 ? (
        <EmptyState title="No hay registros" description="Crea el primer registro para comenzar" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Insumo</TH>
              <TH>Proveedor</TH>
              <TH>Presentación Compra</TH>
              <TH>Contenido Base</TH>
              <TH>Precio Compra</TH>
              <TH>Costo Unidad Base</TH>
              <TH>Estado</TH>
              <TH>Acciones</TH>
            </TR>
          </THead>
          <TBody>
            {filteredItems.length === 0 ? (
              <TR>
                <TD colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>No hay resultados para los filtros aplicados</TD>
              </TR>
            ) : (
              filteredItems.map((item) => {
                const isBestPrice = item.activo && item.costoUnidadBase === bestPricesMap.get(item.idInsumo);
                const isAdded = selectedForPurchase.some(p => p.id === item.id);
                const alreadyHasSameProviderAndInsumo = !isAdded && selectedForPurchase.some(p => p.idInsumo === item.idInsumo && p.idProveedor === item.idProveedor);
                
                return (
                <TR key={item.id}>
                  <TD>{item.insumo?.Nombre_Insumo || item.insumo?.nombre || item.idInsumo}</TD>
                  <TD>{item.proveedor?.Nombre_Proveedor || item.proveedor?.nombre || item.idProveedor}</TD>
                  <TD>{item.cantidadPresentacion || 1} {item.unidadPresentacion || 'Paquete'}</TD>
                  <TD>{item.cantidadEquivalenteBase} {item.insumo?.Unidad_Base || item.insumo?.unidadBase || ''}</TD>
                  <TD>${item.precioCompra}</TD>
                  <TD>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span>${item.costoUnidadBase} / {item.insumo?.Unidad_Base || item.insumo?.unidadBase || 'Unidad'}</span>
                      {isBestPrice && (
                        <span className={styles.bestPriceBadge}>★ Más Económico</span>
                      )}
                    </div>
                  </TD>
                  <TD>
                    <Badge status={item.activo ? 'active' : 'inactive'}>
                      {item.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TD>
                  <TD>
                    <div className={styles.actions}>
                      <Button variant="secondary" onClick={() => handleOpenModal(item)}>Editar</Button>
                      <Button 
                        variant={item.activo ? 'danger' : 'primary'} 
                        onClick={() => handleToggleActive(item)}
                      >
                        {item.activo ? 'Desactivar' : 'Activar'}
                      </Button>
                      {item.activo && (
                        <Button 
                          variant={isAdded ? "secondary" : "success"} 
                          disabled={alreadyHasSameProviderAndInsumo}
                          onClick={() => togglePurchaseItem(item)}
                        >
                          {isAdded ? 'Quitar (✓ Añadido)' : alreadyHasSameProviderAndInsumo ? 'Ya añadido (Mismo Prov.)' : 'Comprar'}
                        </Button>
                      )}
                    </div>
                  </TD>
                </TR>
                );
              })
            )}
          </TBody>
        </Table>
      )}

      {selectedForPurchase.length > 0 && (
        <div className={styles.floatingCart}>
          <div className={styles.cartInfo}>
            <span>{selectedForPurchase.length} insumo(s) seleccionados para compra</span>
          </div>
          <div className={styles.cartActions}>
            <Button variant="secondary" onClick={clearPurchaseList}>Vaciar lista</Button>
            <Button variant="primary" onClick={proceedToPurchase}>Continuar a Orden de Compra</Button>
          </div>
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingItem ? 'Editar' : 'Nuevo'}
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          
          <Input 
            label="ID Insumo" 
            name="idInsumo" 
            value={formData.idInsumo || ''} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="ID Proveedor" 
            name="idProveedor" 
            value={formData.idProveedor || ''} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Presentación Compra" 
            name="presentacionCompra" 
            value={formData.presentacionCompra || ''} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Cantidad Presentación" 
            name="cantidadPresentacion" 
            type="number" step="0.01"
            value={formData.cantidadPresentacion || 0} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Unidad Presentación" 
            name="unidadPresentacion" 
            value={formData.unidadPresentacion || ''} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Cantidad Equivalente Base" 
            name="cantidadEquivalenteBase" 
            type="number" step="0.01"
            value={formData.cantidadEquivalenteBase || 0} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Precio Compra" 
            name="precioCompra" 
            type="number" step="0.01"
            value={formData.precioCompra || 0} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Costo Unidad Base" 
            name="costoUnidadBase" 
            type="number" step="0.01"
            value={formData.costoUnidadBase || 0} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Observaciones" 
            name="observaciones" 
            value={formData.observaciones || ''} 
            onChange={handleChange} 
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input 
              type="checkbox" 
              name="activo" 
              checked={formData.activo} 
              onChange={handleChange} 
            />
            Activo
          </label>
          <div className={styles.formActions}>
            <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
