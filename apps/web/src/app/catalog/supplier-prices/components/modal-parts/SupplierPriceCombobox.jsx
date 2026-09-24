/**
 * @file SupplierPriceCombobox.jsx
 * @module catalog/supplier-prices/components/modal-parts
 * @description Selector reactivo estilizado con búsqueda y alta rápida (+ Nuevo) para Insumos y Proveedores.
 * @responsibility Renderizar input de búsqueda interactiva, dropdown acoplado y botón de limpieza.
 * @usedBy apps/web/src/app/catalog/supplier-prices/components/SupplierPriceModal.jsx
 */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from '../supplier-price-modal.module.css';

export default function SupplierPriceCombobox({
  label,
  placeholder,
  value,
  items = [],
  onSelect,
  onClear,
  onAddNew,
  addNewLabel,
  disabled = false,
  required = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  const selectedItem = items.find(i => String(i.id) === String(value));

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredItems = items.filter(item => {
    const text = `${item.nombre || ''} ${item.subtext || ''} ${item.categoria || ''}`.toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  return (
    <div className={styles.comboboxWrapper} ref={wrapperRef}>
      <div className={styles.comboboxHeader}>
        <label className={styles.comboboxLabel}>
          {label} {required && <span className={styles.requiredAsterisk}>*</span>}
        </label>
      </div>

      <div className={styles.inputWrapper}>
        <input
          type="text"
          disabled={disabled}
          placeholder={selectedItem ? selectedItem.nombre : placeholder}
          value={isOpen ? searchTerm : (selectedItem ? selectedItem.nombre : '')}
          onFocus={() => {
            if (!disabled) {
              setSearchTerm('');
              setIsOpen(true);
            }
          }}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`${styles.comboboxInput} ${disabled ? styles.inputDisabled : ''}`}
        />
        {selectedItem && !isOpen && (
          <button
            type="button"
            className={styles.innerClearBtn}
            onClick={() => onClear()}
            title="Borrar selección"
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && !disabled && (
        <div className={styles.comboboxDropdown}>
          {onAddNew && (
            <div
              className={styles.dropdownAction}
              onClick={() => {
                setIsOpen(false);
                onAddNew(searchTerm);
              }}
            >
              {addNewLabel}
            </div>
          )}

          {filteredItems.map(item => (
            <div
              key={item.id}
              className={`${styles.dropdownItem} ${String(item.id) === String(value) ? styles.dropdownItemSelected : ''}`}
              onClick={() => {
                onSelect(item);
                setIsOpen(false);
                setSearchTerm('');
              }}
            >
              <div className={styles.itemTitle}>{item.nombre}</div>
              {(item.subtext || item.categoria) && (
                <div className={styles.itemSubtitle}>{item.subtext || item.categoria}</div>
              )}
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className={styles.dropdownEmpty}>Sin coincidencias</div>
          )}
        </div>
      )}
    </div>
  );
}
