/**
 * @file SalesTable.jsx
 * @module commercial/sales/components
 * @description Renderiza historial de facturas.
 * @responsibility Pintar las ventas, totales cobrados y pendientes por cobrar.
 * @usedBy apps/web/src/app/commercial/sales/page.jsx
 * @dependencies @/components/ui/Table, Badge, States
 */
import React from 'react';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { AssistedEmptyState } from '@/components/ui/AssistedEmptyState';
import styles from '../sales.module.css';

export function SalesTable({
  sales,
  loading,
  error,
  onNew,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  onPrevPage,
  onNextPage,
  mostrarCifras = false
}) {
  const maskMoney = (valor) => mostrarCifras ? `$${Number(valor || 0).toLocaleString('es-CO')}` : '$ ••••••';

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (sales.length === 0 && totalItems === 0) {
    return (
      <AssistedEmptyState
        icon="🛒"
        title="Comienza registrando tu primera Venta"
        description="Facturación y pedidos de despacho a clientes comerciales y minoristas."
        actionLabel="+ Nueva Venta"
        onAction={() => onNew && onNew()}
        topButtonLabel="Nueva Venta"
      />
    );
  }

  const startRecord = totalItems > 0 ? (currentPage - 1) * 10 + 1 : 0;
  const endRecord = Math.min(currentPage * 10, totalItems);

  return (
    <div>
      <Table>
        <THead>
          <TR>
            <TH>Cliente</TH>
            <TH>Fecha</TH>
            <TH>Condición</TH>
            <TH>Total</TH>
            <TH>Saldo Pendiente</TH>
            <TH>Estado</TH>
          </TR>
        </THead>
        <TBody>
          {sales.length === 0 ? (
            <TR>
              <TD colSpan={6} className={styles.emptyText}>No hay ventas en este rango de fechas.</TD>
            </TR>
          ) : (
            sales.map((item) => {
              const cliNom = item.clienteNombre || item.cliente?.nombre || `Cliente ${item.idCliente?.slice(0, 8) || ''}`;
              const cliTipo = item.clienteTipo || item.cliente?.tipoCliente || 'MINORISTA';
              const esCredito = item.tipoPago === 'CREDITO';
              const totalNum = Number(item.totalVenta || 0);
              const saldoNum = Number(item.saldoPendiente || 0);

              return (
                <TR key={item.id}>
                  <TD>
                    <strong className={styles.clientNameStrong}>{cliNom}</strong>
                    <span className={styles.clientSubText}>
                      <span className={cliTipo === 'MAYORISTA' ? styles.badgeMayorista : styles.badgeMinorista}>
                        {cliTipo}
                      </span>
                      {item.canalVenta && ` • ${item.canalVenta}`}
                    </span>
                  </TD>
                  <TD>{new Date(item.fechaVenta).toLocaleDateString('es-CO')}</TD>
                  <TD>
                    <span className={esCredito ? styles.badgeCredito : styles.badgeContado}>
                      {esCredito ? 'Crédito' : 'Contado'}
                    </span>
                    {esCredito && item.fechaLimitePago && (
                      <small className={styles.creditDueText}>
                        Vence: {new Date(item.fechaLimitePago).toLocaleDateString('es-CO')}
                      </small>
                    )}
                  </TD>
                  <TD><strong>{maskMoney(totalNum)}</strong></TD>
                  <TD>
                    <span className={saldoNum > 0 ? styles.balancePending : styles.balancePaid}>
                      {maskMoney(saldoNum)}
                    </span>
                  </TD>
                  <TD>
                    <Badge status={item.estado === 'COMPLETADO' ? 'active' : 'inactive'}>
                      {item.estado}
                    </Badge>
                  </TD>
                </TR>
              );
            })
          )}
        </TBody>
      </Table>

      {totalItems > 0 && (
        <div className={styles.tablePagination}>
          <span className={styles.paginationInfo}>
            Mostrando {startRecord} - {endRecord} de {totalItems} ventas
          </span>
          <div className={styles.paginationButtons}>
            <button
              type="button"
              onClick={onPrevPage}
              disabled={currentPage <= 1}
              className={styles.btnPagination}
            >
              ← Anterior
            </button>
            <span className={styles.paginationInfo}>
              Pág. {currentPage} de {totalPages}
            </span>
            <button
              type="button"
              onClick={onNextPage}
              disabled={currentPage >= totalPages}
              className={styles.btnPagination}
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
