import React, { useState } from 'react';
import styles from '../new-purchase.module.css';
import { AlertCircleIcon, XIcon, CheckIcon } from '@/components/ui/icons';
import { ArrowRightLeft } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useCart } from '@/context/CartContext';
import { useNotification } from '@/context/NotificationContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
export function ChecklistItemRow({ item, checklistMgr, proveedoresDB, setPendingItems, setComprasAsentadas }) {
  const { updateChecklistItem, checklistItems, setChecklistItems, simulationResult } = checklistMgr;
  const { lists, refreshCart } = useCart();
  const { showNotification } = useNotification();
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [selectedTargetList, setSelectedTargetList] = useState('');
  const [isMoving, setIsMoving] = useState(false);

  const availableLists = Object.values(lists).filter(l => l.id !== item.currentOrderId && !l.id.startsWith('local-'));

  const handleMoveList = async () => {
    if (!selectedTargetList) {
      showNotification('Seleccione una lista destino', 'error');
      return;
    }
    try {
      setIsMoving(true);
      await apiClient.post('/purchases/items/move', {
        itemId: item.orderItemId,
        fromOrderId: item.currentOrderId,
        toOrderId: selectedTargetList
      });
      showNotification(`Ítem transferido exitosamente a ${lists[selectedTargetList]?.name || 'la orden'}`, 'success');
      refreshCart();
      const newSelection = checklistItems.filter(i => i._id !== item._id);
      setChecklistItems(newSelection);
      sessionStorage.setItem('selectedForPurchase', JSON.stringify(newSelection));
      window.dispatchEvent(new Event('cartUpdated'));
      setIsMoveModalOpen(false);
    } catch (e) {
      showNotification(e.message || 'Error al mover ítem', 'error');
    } finally {
      setIsMoving(false);
    }
  };

  return (
    <div className={`${styles.checklistCard} ${item.estadoOperativo === 'CONSEGUIDO' ? styles.checklistCardConseguido : styles.checklistCardNoConseguido}`}>
      {/* Zona Encabezado */}
      <div className={styles.checklistHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.insumoName}>{item.insumoData?.nombre || item.nombre}</span>
          {item.duplicateWarning && (
            <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 'bold', marginLeft: '0.5rem' }}>
              {item.duplicateWarning}
            </span>
          )}
        </div>
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
                  return;
                }
                updateChecklistItem(item._id, 'estadoOperativo', 'PENDIENTE_OTRO_PROVEEDOR');
                setPendingItems(prev => [...prev, { ...item, fechaRegistro: new Date().toLocaleTimeString() }]);
                const newSelection = checklistItems.filter(i => i._id !== item._id);
                setChecklistItems(newSelection);
                sessionStorage.setItem('selectedForPurchase', JSON.stringify(newSelection));
                window.dispatchEvent(new Event('cartUpdated'));
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
          className={styles.btnNoConseguido}
          onClick={() => setIsMoveModalOpen(true)}
          title="Mover a otra lista"
          disabled={!item.orderItemId || !item.currentOrderId}
          style={{ opacity: (!item.orderItemId || !item.currentOrderId) ? 0.5 : 1 }}
        >
          <ArrowRightLeft size={18} /> Mover Lista
        </button>
        <button 
          className={`${styles.btnConseguido} ${item.estadoOperativo === 'CONSEGUIDO' ? styles.btnConseguidoActive : ''}`}
          onClick={async () => {
            updateChecklistItem(item._id, 'estadoOperativo', 'CONSEGUIDO');
            const simItem = simulationResult?.itemsLiquidados?.find(si => si.idPrecioProveedor === (item.idPrecioProveedor || item.priceData?.id));
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
              }
            } catch (e) {
              console.error(e);
            }
          }}
        >
          <CheckIcon size={18} /> Conseguido
        </button>
      </div>

      <Modal isOpen={isMoveModalOpen} onClose={() => setIsMoveModalOpen(false)} title="Mover a otra Lista">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Selecciona la lista de compra a la que deseas transferir este insumo:</p>
          
          {availableLists.length === 0 ? (
            <div style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '4px', textAlign: 'center' }}>
              <p style={{ margin: 0, color: '#374151', fontSize: '0.875rem' }}>No hay otras listas activas disponibles.</p>
              <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280', fontSize: '0.75rem' }}>Crea una nueva lista desde el carrito primero.</p>
            </div>
          ) : (
            <select 
              value={selectedTargetList} 
              onChange={e => setSelectedTargetList(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
            >
              <option value="">-- Seleccione una lista --</option>
              {availableLists.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setIsMoveModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleMoveList} disabled={isMoving || !selectedTargetList || availableLists.length === 0}>
              {isMoving ? 'Transfiriendo...' : 'Confirmar transferencia'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
