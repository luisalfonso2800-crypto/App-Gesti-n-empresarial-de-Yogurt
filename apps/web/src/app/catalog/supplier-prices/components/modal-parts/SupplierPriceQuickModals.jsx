/**
 * @file SupplierPriceQuickModals.jsx
 * @module catalog/supplier-prices/components/modal-parts
 * @description Modales anidados para registro en caliente de Insumo y Proveedor.
 * @responsibility Aislar el renderizado y los callbacks de SupplyModal y SupplierModal.
 * @usedBy apps/web/src/app/catalog/supplier-prices/components/SupplierPriceModal.jsx
 */
'use client';

import React from 'react';
import { SupplyModal } from '@/components/catalog/SupplyModal';
import { SupplierModal } from '@/components/catalog/SupplierModal';

export default function SupplierPriceQuickModals({
  showSupplyModal,
  setShowSupplyModal,
  initialSupplySearch,
  onSupplyCreated,
  showSupplierModal,
  setShowSupplierModal,
  initialSupplierSearch,
  onSupplierCreated,
  handleChange
}) {
  return (
    <>
      {showSupplyModal && (
        <SupplyModal
          isOpen={showSupplyModal}
          onClose={() => setShowSupplyModal(false)}
          initialData={{ nombre: initialSupplySearch }}
          onSuccess={(newSupply) => {
            setShowSupplyModal(false);
            if (newSupply?.id) {
              if (onSupplyCreated) onSupplyCreated(newSupply);
              handleChange({ target: { name: 'idInsumo', value: newSupply.id } });
            }
          }}
        />
      )}

      {showSupplierModal && (
        <SupplierModal
          isOpen={showSupplierModal}
          onClose={() => setShowSupplierModal(false)}
          initialData={{ nombre: initialSupplierSearch }}
          onSuccess={(newSupplier) => {
            setShowSupplierModal(false);
            if (newSupplier?.id) {
              if (onSupplierCreated) onSupplierCreated(newSupplier);
              handleChange({ target: { name: 'idProveedor', value: newSupplier.id } });
            }
          }}
        />
      )}
    </>
  );
}
