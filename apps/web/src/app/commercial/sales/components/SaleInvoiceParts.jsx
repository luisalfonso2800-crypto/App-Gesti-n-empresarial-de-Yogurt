/**
 * @file SaleInvoiceParts.jsx
 * @module commercial/sales/components
 * @description Subcomponentes editoriales parametrizados para el comprobante de venta MANNÁ (SRP < 130 líneas).
 * @usedBy SaleInvoicePrintModal.jsx
 */
'use client';

import React from 'react';
import { User, FileText, Phone, Mail, Calendar, Share2, CreditCard, DollarSign, CheckCircle, QrCode } from 'lucide-react';
import styles from './sale-invoice-print-modal.module.css';

export function InvoiceHeaderEditorial({ idVenta, fecha, config = {} }) {
  return (
    <div className={styles.headerEditorial3Col}>
      <div className={styles.headerLeftCol}>
        <div className={styles.brandTitleRow}>
          <span className={styles.brandMannaTitle}>{config.nombreComercial || 'MANNÀ'}</span>
          <span className={styles.brandLeafGlyph}>❖</span>
        </div>
        <span className={styles.brandMannaMotto}>{config.lemaCabecera || 'Semilla · Tiempo · Fruto'}</span>
      </div>

      <div className={styles.headerCenterCol}>
        <p className={styles.headerCenterPhrase}>
          &ldquo;{config.citaEditorial || 'Sabor que nace de lo natural. Tradición que mira al futuro.'}&rdquo;
        </p>
      </div>

      <div className={styles.headerRightCol}>
        <div className={styles.voucherBox}>
          <div className={styles.voucherTitle}>COMPROBANTE DE VENTA</div>
          <div className={styles.voucherNumber}>N° {idVenta}</div>
          <div className={styles.voucherDate}>{fecha}</div>
          <div className={styles.voucherSeal}>ALIMENTOS QUE TRANSFORMAN</div>
        </div>
      </div>
    </div>
  );
}

export function InvoiceDataColumns({ sale, clientName, fecha }) {
  const cliente = sale.cliente || {};
  return (
    <div className={styles.dataColumnsContainer}>
      <div className={styles.dataColumn}>
        <div className={styles.dataColumnHeader}>DATOS DEL CLIENTE</div>
        <div className={styles.dataRow}>
          <User size={13} className={styles.dataIcon} />
          <span><strong>Cliente:</strong> {clientName}</span>
        </div>
        <div className={styles.dataRow}>
          <FileText size={13} className={styles.dataIcon} />
          <span><strong>Identificación:</strong> {cliente.documento || cliente.identificacion || 'Consumidor Final'}</span>
        </div>
        <div className={styles.dataRow}>
          <Phone size={13} className={styles.dataIcon} />
          <span><strong>Teléfono:</strong> {cliente.telefono || cliente.celular || 'No registrado'}</span>
        </div>
        <div className={styles.dataRow}>
          <Mail size={13} className={styles.dataIcon} />
          <span><strong>Correo:</strong> {cliente.email || cliente.correo || 'No registrado'}</span>
        </div>
      </div>

      <div className={styles.dataColumn}>
        <div className={styles.dataColumnHeader}>DATOS DE LA VENTA</div>
        <div className={styles.dataRow}>
          <Calendar size={13} className={styles.dataIcon} />
          <span><strong>Fecha:</strong> {fecha}</span>
        </div>
        <div className={styles.dataRow}>
          <Share2 size={13} className={styles.dataIcon} />
          <span><strong>Canal:</strong> {sale.canalVenta || 'DIRECTO'}</span>
        </div>
        <div className={styles.dataRow}>
          <CreditCard size={13} className={styles.dataIcon} />
          <span><strong>Modalidad:</strong> {sale.tipoPago || 'CONTADO'}</span>
        </div>
        <div className={styles.dataRow}>
          <DollarSign size={13} className={styles.dataIcon} />
          <span><strong>Forma de pago:</strong> {sale.metodoPago || (sale.tipoPago === 'CONTADO' ? 'EFECTIVO' : 'CRÉDITO')}</span>
        </div>
        <div className={styles.dataRow}>
          <CheckCircle size={13} className={styles.dataIcon} />
          <span><strong>Estado:</strong> <span className={styles.statusBadge}>{sale.estado || 'COMPLETADO'}</span></span>
        </div>
      </div>
    </div>
  );
}

export function InvoiceCorporateFooter({ config = {} }) {
  return (
    <div className={styles.corporateFooter}>
      <div className={styles.footer3Cols}>
        <div className={styles.footerCol}>
          <div className={styles.footerBrand}>{config.nombreComercial || 'MANNÀ'}</div>
          <div className={styles.footerLegal}>{config.razonSocial || 'Alimentos Naturales S.A.S.'}</div>
          <div className={styles.footerHolding}>{config.holding || 'GUERRERO PRADO HOLDING COMPANY FAMILY S.A.S.'}</div>
          <div className={styles.footerCity}>{config.ciudad || 'Santa Marta, Magdalena · Colombia'} - NIT: {config.nit || '901.234.567-8'}</div>
        </div>

        <div className={styles.footerColCenter}>
          <div className={styles.footerContactItem}>Tel / WA: {config.telefono || '+57 300 123 4567'}</div>
          <div className={styles.footerContactItem}>{config.correo || 'hola@manna.com.co'}</div>
          <div className={styles.footerContactItem}>{config.web || 'www.manna.com.co'}</div>
          <div className={styles.footerContactItem}>{config.instagram || '@manna.alimentos'}</div>
        </div>

        <div className={styles.footerColRight}>
          <div className={styles.qrContainer}>
            <QrCode size={40} strokeWidth={1.5} className={styles.qrSvg} />
            <span className={styles.qrText}>Conoce más sobre nuestro propósito</span>
          </div>
        </div>
      </div>

      <div className={styles.footerMottoSpread}>
        {(config.piePagina || 'SABOR QUE NACE DE LO NATURAL').split('').join(' ')}
      </div>
    </div>
  );
}
