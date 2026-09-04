const fs = require('fs');
const path = require('path');

const uiDir = path.join(process.cwd(), 'apps', 'web', 'src', 'components', 'ui');
const shellDir = path.join(process.cwd(), 'apps', 'web', 'src', 'components', 'shell');
const presentationsDir = path.join(process.cwd(), 'apps', 'web', 'src', 'app', 'catalog', 'presentations');
const layoutDir = path.join(process.cwd(), 'apps', 'web', 'src', 'app');

fs.mkdirSync(uiDir, { recursive: true });
fs.mkdirSync(shellDir, { recursive: true });
fs.mkdirSync(presentationsDir, { recursive: true });
fs.mkdirSync(layoutDir, { recursive: true });

// Button.tsx
fs.writeFileSync(path.join(uiDir, 'Button.tsx'), \
import React from 'react';
import styles from './button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const btnClass = \\\\\\ \\\ \\\\\\;
  return <button className={btnClass} {...props} />;
}
\);

// Input
fs.writeFileSync(path.join(uiDir, 'input.module.css'), \
.container { display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 1rem; }
.label { font-size: 0.875rem; font-weight: 500; color: #374151; }
.input { padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 0.875rem; }
.input:focus { outline: none; border-color: #2563eb; ring: 2px solid #2563eb; }
.input:disabled { background-color: #f3f4f6; cursor: not-allowed; }
.error { border-color: #ef4444; }
.errorText { color: #ef4444; font-size: 0.75rem; }
\);

fs.writeFileSync(path.join(uiDir, 'Input.tsx'), \
import React from 'react';
import styles from './input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <input 
        className={\\\\\\ \\\ \\\\\\} 
        {...props} 
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
\);

// Table
fs.writeFileSync(path.join(uiDir, 'table.module.css'), \
.container { width: 100%; overflow-x: auto; border: 1px solid #e5e7eb; border-radius: 0.5rem; }
.table { width: 100%; border-collapse: collapse; text-align: left; }
.th { padding: 0.75rem 1rem; background-color: #f9fafb; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb; }
.td { padding: 0.75rem 1rem; border-bottom: 1px solid #e5e7eb; color: #111827; }
.tr:hover { background-color: #f3f4f6; }
.tr:last-child .td { border-bottom: none; }
\);

fs.writeFileSync(path.join(uiDir, 'Table.tsx'), \
import React from 'react';
import styles from './table.module.css';

export function Table({ children }: { children: React.ReactNode }) {
  return <div className={styles.container}><table className={styles.table}>{children}</table></div>;
}

export function THead({ children }: { children: React.ReactNode }) {
  return <thead>{children}</thead>;
}

export function TBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TR({ children }: { children: React.ReactNode }) {
  return <tr className={styles.tr}>{children}</tr>;
}

export function TH({ children }: { children: React.ReactNode }) {
  return <th className={styles.th}>{children}</th>;
}

export function TD({ children }: { children: React.ReactNode }) {
  return <td className={styles.td}>{children}</td>;
}
\);

// Badge
fs.writeFileSync(path.join(uiDir, 'badge.module.css'), \
.badge { display: inline-flex; align-items: center; padding: 0.125rem 0.625rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; }
.active { background-color: #d1fae5; color: #065f46; }
.inactive { background-color: #fee2e2; color: #991b1b; }
\);

fs.writeFileSync(path.join(uiDir, 'Badge.tsx'), \
import React from 'react';
import styles from './badge.module.css';

interface BadgeProps {
  status: 'active' | 'inactive';
  children: React.ReactNode;
}

export function Badge({ status, children }: BadgeProps) {
  return <span className={\\\\\\ \\\\\\}>{children}</span>;
}
\);

// Modal
fs.writeFileSync(path.join(uiDir, 'modal.module.css'), \
.overlay { position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 50; }
.modal { background-color: white; border-radius: 0.5rem; padding: 1.5rem; width: 100%; max-width: 32rem; max-height: 90vh; overflow-y: auto; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.title { font-size: 1.25rem; font-weight: 600; margin: 0; }
.close { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6b7280; }
.close:hover { color: #111827; }
\);

fs.writeFileSync(path.join(uiDir, 'Modal.tsx'), \
import React from 'react';
import styles from './modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button className={styles.close} onClick={onClose}>&times;</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
\);

// States
fs.writeFileSync(path.join(uiDir, 'states.module.css'), \
.container { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; text-align: center; }
.title { font-size: 1.125rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem; }
.description { color: #6b7280; font-size: 0.875rem; }
.error { color: #ef4444; }
\);

fs.writeFileSync(path.join(uiDir, 'States.tsx'), \
import React from 'react';
import styles from './states.module.css';

export function LoadingState() {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Cargando...</div>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      {description && <div className={styles.description}>{description}</div>}
    </div>
  );
}

export function ErrorState({ error }: { error: string }) {
  return (
    <div className={styles.container}>
      <div className={\\\\\\ \\\\\\}>Error</div>
      <div className={styles.description}>{error}</div>
    </div>
  );
}
\);

// Shell
fs.writeFileSync(path.join(shellDir, 'shell.module.css'), \
.layout { display: flex; min-height: 100vh; background-color: #f9fafb; }
.sidebar { width: 16rem; background-color: white; border-right: 1px solid #e5e7eb; display: flex; flex-direction: column; }
.sidebarHeader { padding: 1.5rem; border-bottom: 1px solid #e5e7eb; font-weight: bold; font-size: 1.25rem; color: #111827; }
.nav { padding: 1rem; flex: 1; }
.navGroup { margin-bottom: 1.5rem; }
.navGroupTitle { font-size: 0.75rem; text-transform: uppercase; font-weight: 600; color: #6b7280; margin-bottom: 0.5rem; }
.navLink { display: block; padding: 0.5rem 0.75rem; color: #374151; text-decoration: none; border-radius: 0.375rem; font-size: 0.875rem; margin-bottom: 0.25rem; }
.navLink:hover { background-color: #f3f4f6; }
.navLinkActive { background-color: #eff6ff; color: #2563eb; font-weight: 500; }
.main { flex: 1; display: flex; flex-direction: column; }
.header { height: 4rem; background-color: white; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; padding: 0 2rem; }
.content { padding: 2rem; flex: 1; overflow-y: auto; }
\);

fs.writeFileSync(path.join(shellDir, 'Sidebar.tsx'), \
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './shell.module.css';

const navItems = [
  {
    group: 'Catálogos',
    items: [
      { name: 'Presentaciones', path: '/catalog/presentations' },
      { name: 'Insumos', path: '/catalog/supplies' },
      { name: 'Proveedores', path: '/catalog/suppliers' },
      { name: 'Productos', path: '/catalog/products' },
      { name: 'Recetas', path: '/catalog/recipes' },
    ]
  },
  {
    group: 'Operaciones',
    items: [
      { name: 'Abastecimiento', path: '/supply' },
      { name: 'Inventario', path: '/inventory' },
      { name: 'Producción', path: '/production' },
      { name: 'Comercial', path: '/commercial' },
      { name: 'Finanzas', path: '/finance' },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>Yogurt ERP</div>
      <nav className={styles.nav}>
        {navItems.map((group) => (
          <div key={group.group} className={styles.navGroup}>
            <div className={styles.navGroupTitle}>{group.group}</div>
            {group.items.map((item) => {
              const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
              return (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={\\\\\\ \\\\\\}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </div>
  );
}
\);

fs.writeFileSync(path.join(shellDir, 'Header.tsx'), \
import React from 'react';
import styles from './shell.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div>Bienvenido</div>
    </header>
  );
}
\);

fs.writeFileSync(path.join(shellDir, 'Shell.tsx'), \
'use client';
import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import styles from './shell.module.css';

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>
        <Header />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
\);

// Layout
fs.writeFileSync(path.join(layoutDir, 'layout.tsx'), \
import type { Metadata } from "next";
import { Shell } from "../components/shell/Shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yogurt ERP",
  description: "Sistema de gestión",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
\);

fs.writeFileSync(path.join(layoutDir, 'globals.css'), \
html, body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
* { box-sizing: border-box; }
\);

// Page Presentations
fs.writeFileSync(path.join(presentationsDir, 'presentations.module.css'), \
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.title { font-size: 1.5rem; font-weight: bold; color: #111827; margin: 0; }
.actions { display: flex; gap: 1rem; }
.form { display: flex; flex-direction: column; gap: 1rem; }
.formActions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }
\);

fs.writeFileSync(path.join(presentationsDir, 'page.tsx'), \
'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Presentation, CreatePresentationDto, UpdatePresentationDto } from '@/types/presentation';
import { Button } from '@/components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/States';
import styles from './presentations.module.css';

export default function PresentationsPage() {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Presentation | null>(null);
  
  const [formData, setFormData] = useState<Partial<Presentation>>({
    nombre: '',
    cantidadOz: 0,
    cantidadMl: 0,
    tipoEnvase: '',
    activo: true,
    observaciones: ''
  });

  const fetchPresentations = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<Presentation[]>('/presentations');
      setPresentations(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar presentaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPresentations();
  }, []);

  const handleOpenModal = (item?: Presentation) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        nombre: '',
        cantidadOz: 0,
        cantidadMl: 0,
        tipoEnvase: '',
        activo: true,
        observaciones: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await apiClient.patch(\\\/presentations/\\\\\\, formData);
      } else {
        await apiClient.post('/presentations', formData);
      }
      handleCloseModal();
      fetchPresentations();
    } catch (err: any) {
      alert(err.message || 'Error al guardar');
    }
  };

  const handleToggleActive = async (item: Presentation) => {
    try {
      await apiClient.patch(\\\/presentations/\\\\\\, { activo: !item.activo });
      fetchPresentations();
    } catch (err: any) {
      alert(err.message || 'Error al cambiar estado');
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Presentaciones</h1>
        <Button onClick={() => handleOpenModal()}>Nueva Presentación</Button>
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : presentations.length === 0 ? (
        <EmptyState title="No hay presentaciones" description="Crea la primera presentación para comenzar" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Nombre</TH>
              <TH>Volumen (Oz/Ml)</TH>
              <TH>Envase</TH>
              <TH>Estado</TH>
              <TH>Acciones</TH>
            </TR>
          </THead>
          <TBody>
            {presentations.map((item) => (
              <TR key={item.id}>
                <TD>{item.nombre}</TD>
                <TD>{item.cantidadOz} oz / {item.cantidadMl} ml</TD>
                <TD>{item.tipoEnvase}</TD>
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
                  </div>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingItem ? 'Editar Presentación' : 'Nueva Presentación'}
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input 
            label="Nombre" 
            name="nombre" 
            value={formData.nombre || ''} 
            onChange={handleChange} 
            required 
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input 
              label="Cantidad (Oz)" 
              name="cantidadOz" 
              type="number" 
              step="0.01"
              value={formData.cantidadOz || 0} 
              onChange={handleChange} 
              required 
            />
            <Input 
              label="Cantidad (Ml)" 
              name="cantidadMl" 
              type="number" 
              step="0.01"
              value={formData.cantidadMl || 0} 
              onChange={handleChange} 
              required 
            />
          </div>
          <Input 
            label="Tipo de Envase" 
            name="tipoEnvase" 
            value={formData.tipoEnvase || ''} 
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
\);
