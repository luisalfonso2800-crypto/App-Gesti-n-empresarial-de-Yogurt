/**
 * @file InventoryStockTable.jsx
 * @module operations/inventory/components
 * @description Tabla de existencias de Bodega / Cava con semáforo y kárdex expandible de movimientos.
 * @responsibility Renderizar el catálogo de inventario y subtabla de transacciones.
 * @usedBy apps/web/src/app/operations/inventory/page.jsx
 * @dependencies react, lucide-react, @/components/ui/Table, @/components/ui/Badge, @/components/ui/Button
 */
import React from 'react';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from '../inventory.module.css';

export default function InventoryStockTable({
  activeTab,
  inventory,
  finishedProducts,
  expandedId,
  movements,
  loadingMovements,
  handleToggleRow,
  setAdjustmentModal
}) {
  const items = activeTab === 'INSUMOS' ? inventory : finishedProducts;

  return (
    <div className={styles.tableWrapper}>
      <Table>
        <THead>
          <TR>
            <TH>{activeTab === 'INSUMOS' ? 'Insumo / Referencia' : 'Producto Terminado'}</TH>
            <TH>Categoría</TH>
            <TH className={styles.thRight}>Stock Actual</TH>
            {activeTab === 'INSUMOS' && <TH className={styles.thCenter}>Semáforo</TH>}
            <TH className={styles.thRight}>Valorización</TH>
            <TH className={styles.thCenter}>Acciones</TH>
          </TR>
        </THead>
        <TBody>
          {items.map((item) => {
            const id = activeTab === 'INSUMOS' ? item.idInsumo : item.idProducto;
            const pNom = item.producto?.nombre || item.nombre || 'Producto';
            const prNom = item.producto?.presentacion?.nombre || item.presentacion?.nombre;
            const name = activeTab === 'INSUMOS'
              ? item.insumo?.nombre
              : (prNom && prNom.trim().toLowerCase() !== pNom.trim().toLowerCase() ? `${pNom} - ${prNom}` : pNom);
            const cat = activeTab === 'INSUMOS' ? item.insumo?.categoria : (item.producto?.categoria || item.categoria);
            const rawUnit = activeTab === 'INSUMOS' ? (item.insumo?.unidadBase || 'kg') : (item.unidadMedida || item.unidad || item.recetas?.[0]?.unidadRendimiento || item.producto?.unidadMedida || '');
            const u = String(rawUnit).toLowerCase();
            const esEnvasado = u.includes('und') || u.includes('unidad') || cat === 'LACTEOS' || Boolean(item.presentacionId || item.producto?.presentacionId);
            let unit = 'Litros';
            if (activeTab === 'INSUMOS') {
              unit = rawUnit || 'kg';
            } else if (esEnvasado) {
              unit = 'Unidades';
            } else if (u.includes('kg') || u.includes('kilo')) {
              unit = 'Kg';
            } else if (u.includes('g') || u.includes('gramo')) {
              unit = 'g';
            } else if (u.includes('ml')) {
              unit = 'ml';
            }
            const status = item.estado || 'OPTIMO';
            const valor = activeTab === 'INSUMOS' ? item.valorTotal : (item.valorizacionTotal ?? (Number(item.cantidadActual) * Number(item.costoPromedio || 0)));

            return (
              <React.Fragment key={id}>
                <TR className={styles.tableRow} onClick={() => handleToggleRow(id)}>
                  <TD>
                    <div className={styles.flexCenter}>
                      {expandedId === id ? <ChevronUp size={16} className={styles.textMuted}/> : <ChevronDown size={16} className={styles.textMuted}/>}
                      <strong className={styles.monoStrong}>{name || id}</strong>
                    </div>
                  </TD>
                  <TD><span className={styles.categoryBadge}>{cat || '-'}</span></TD>
                  <TD className={styles.tdRight}><span className={styles.stockValue}>{Number(item.cantidadActual).toLocaleString()}</span> {unit}</TD>
                  {activeTab === 'INSUMOS' && (
                    <TD className={styles.tdCenter}>
                      <span className={status === 'CRITICO' ? styles.badgeDanger : status === 'BAJO' ? styles.badgeWarning : styles.badgeSuccess}>
                        {status === 'CRITICO' ? 'Agotado' : status === 'BAJO' ? 'Bajo Mínimo' : 'Óptimo'}
                      </span>
                    </TD>
                  )}
                  <TD className={styles.tdValorization}>${Number(valor || 0).toLocaleString('es-CO')}</TD>
                  <TD className={styles.tdCenter}>
                    <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); setAdjustmentModal({ open: true, item, tipo: 'AJUSTE_POSITIVO', cantidad: '', motivo: '' }); }}>
                      Ajustar
                    </Button>
                  </TD>
                </TR>
                {expandedId === id && (
                  <TR className={styles.expandedRow}>
                    <TD colSpan={activeTab === 'INSUMOS' ? 6 : 5} className={styles.tdZeroPadding}>
                      <div className={styles.kardexContainer}>
                        <h4 className={styles.kardexTitle}>Kárdex de Movimientos (Últimos registros)</h4>
                        {loadingMovements && !movements[id] ? (
                          <div className={styles.loadingText}>Cargando historial...</div>
                        ) : (
                          <table className={styles.kardexTable}>
                            <thead>
                              <tr>
                                <th>Fecha</th>
                                <th>Tipo</th>
                                <th>Motivo</th>
                                <th className={styles.thRight}>Cantidad</th>
                                <th className={styles.thRight}>Costo Unit.</th>
                                <th className={styles.thRight}>Saldo Anterior</th>
                                <th className={styles.thRight}>Saldo Nuevo</th>
                              </tr>
                            </thead>
                            <tbody>
                              {movements[id] && movements[id].length > 0 ? (
                                movements[id].map((m) => (
                                  <tr key={m.id}>
                                    <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                                    <td><Badge status={m.cantidadAjuste > 0 ? 'active' : 'warning'}>{m.tipo}</Badge></td>
                                    <td>{m.motivo || '-'}</td>
                                    <td className={styles.tdRight}>
                                      <strong className={m.cantidadAjuste > 0 ? styles.positiveText : styles.negativeText}>
                                        {m.cantidadAjuste > 0 ? `+${m.cantidadAjuste}` : m.cantidadAjuste}
                                      </strong>
                                    </td>
                                    <td className={styles.tdRight}>${Number(m.costoUnitario || 0).toLocaleString('es-CO')}</td>
                                    <td className={styles.tdRight}>{m.saldoAnterior}</td>
                                    <td className={styles.tdRight}><strong>{m.saldoNuevo}</strong></td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={7} className={styles.emptyText}>No hay movimientos registrados para esta referencia</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </TD>
                  </TR>
                )}
              </React.Fragment>
            );
          })}
        </TBody>
      </Table>
    </div>
  );
}
