import React, { useState } from 'react';
import { ChecklistSection } from './ChecklistSection';
import styles from '../new-purchase.module.css';
import { ClockIcon, RotateCcwIcon } from '@/components/ui/icons';

export function ChecklistPhase({ checklistMgr, setPhase, proveedoresDB }) {
  const [pendingItems, setPendingItems] = useState([]);
  const [comprasAsentadas, setComprasAsentadas] = useState([]);

  const proceedToForm = () => {
    setPhase(2);
  };

  const { checklistItems, checklistGrouped, setChecklistItems } = checklistMgr;

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
              <ChecklistSection 
                items={items} 
                checklistMgr={checklistMgr}
                proveedoresDB={proveedoresDB}
                setPendingItems={setPendingItems}
                setComprasAsentadas={setComprasAsentadas}
              />
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
              }}
            >
              Cerrar Resumen
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
