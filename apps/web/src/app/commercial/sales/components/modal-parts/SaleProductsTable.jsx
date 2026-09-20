/**
 * @file SaleProductsTable.jsx
 * @module commercial/sales/components/modal-parts
 * @description Tabla de productos agregados a la orden de despacho con alineación precisa, volumen ml y ajuste de cantidad (SRP < 135 líneas).
 * @usedBy apps/web/src/app/commercial/sales/components/modal-parts/SaleProductsDispatchSection.jsx
 */
import React from 'react';
import { Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import styles from '../sale-modal.module.css';

const obtenerDetallePresentacion = (item) => {
  const nombrePres = item.presentacionNombre || item.nombrePresentacion || item.presentacion?.nombre || (typeof item.presentacion === 'string' ? item.presentacion : '');
  const volPres = item.volumenPresentacion || item.presentacion?.volumen || item.presentacion?.volumenOzMl || item.contenidoNeto || '';

  if (!volPres) return nombrePres || 'Unidad Comercial';

  const volLimpio = volPres.includes('/') ? volPres.split('/')[1].trim() : volPres;
  if (nombrePres && volLimpio) {
    return `${nombrePres} • ${volLimpio}`;
  }
  return nombrePres || volLimpio;
};

export default function SaleProductsTable({ detalles, onRemoveDetail, onUpdateQty }) {
  return (
    <div className={styles.tableWrapper}>
       <table className={styles.productsTable}>
         <thead>
           <tr className={styles.tableHeaderRow}>
             <th className={styles.thProductCol}>Producto</th>
             <th className={styles.thQtyCol}>Cant.</th>
             <th className={styles.thPriceCol}>P. Venta</th>
             <th className={styles.thSubtotalCol}>Subtotal</th>
             <th className={styles.thActionCol}></th>
           </tr>
         </thead>
         <tbody>
           {detalles.map((d, i) => (
             <tr key={i} className={styles.tableBodyRow}>
               <td className={styles.tdProductCell}>
                 <span className={styles.tdProductName}>{d.nombre}</span>
                 <span className={styles.tdProductPresentation}>
                   {obtenerDetallePresentacion(d)}
                 </span>
               </td>
               <td className={styles.tdQtyCell}>
                 {onUpdateQty ? (
                   <div className={styles.tableQtyGroup}>
                     <button
                       type="button"
                       onClick={() => onUpdateQty(i, Number(d.cantidad) - 1)}
                       className={styles.btnTableQty}
                       title="Disminuir"
                     >
                       -
                     </button>
                     <span className={styles.tableQtyValue}>{d.cantidad}</span>
                     <button
                       type="button"
                       onClick={() => onUpdateQty(i, Number(d.cantidad) + 1)}
                       className={styles.btnTableQty}
                       title="Aumentar"
                     >
                       +
                     </button>
                   </div>
                 ) : (
                   <span>{d.cantidad}</span>
                 )}
               </td>
               <td className={styles.tdPriceCell}>{formatCurrency(d.precioUnitario)}</td>
               <td className={styles.tdSubtotalCell}>{formatCurrency(d.cantidad * d.precioUnitario)}</td>
               <td className={styles.tdActionCell}>
                 <button
                   type="button"
                   onClick={() => onRemoveDetail(i)}
                   className={styles.btnRemoveProduct}
                   aria-label="Eliminar producto"
                   title="Eliminar de la orden"
                 >
                   <Trash2 size={15} />
                 </button>
               </td>
             </tr>
           ))}
           {detalles.length === 0 && (
             <tr>
               <td colSpan="5" className={styles.emptyTableMessage}>
                 No hay productos agregados a la orden.
               </td>
             </tr>
           )}
         </tbody>
       </table>
    </div>
  );
}
