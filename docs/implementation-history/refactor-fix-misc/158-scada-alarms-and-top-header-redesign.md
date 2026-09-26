# INCORPORACIÓN DE ALARMAS SCADA EN SIDEBAR Y REDISEÑO TOTAL DEL HEADER SUPERIOR MANNÁ

REGLAS DE MÁXIMO AHORRO DE CUOTA Y ARQUITECTURA:
- Modo bisturí: modifica exclusivamente `Shell.jsx`, `shell.module.css` (o el componente de cabecera superior existente `Header.jsx` / `TopNav.jsx`) y el modal de alarmas en `dashboard`.
- CERO TAILWIND: Usa exclusivamente CSS Modules nativos.
- Erradica de raíz la barra superior rota con enlaces violetas desordenados (`DashboardCatálogosOperacionesComercial`). Es una barra redundante del template anterior; todas esas categorías ya residen en la barra lateral MANNÁ.
- Reemplaza esa cabecera por la barra de instrumentación superior oficial de la maqueta de referencia MANNÁ (Estado Operativo + Reloj y Fecha SCADA + Perfil Operador).

---

### 1. AGREGAR "ALARMAS SCADA" BAJO DASHBOARD (`apps/web/src/components/shell/Shell.jsx`):
1. En la sección `GENERAL` del array `ERP_SECTIONS`, añade inmediatamente después de `Dashboard`:
   ```javascript
   {
     category: 'GENERAL',
     items: [
       { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
       { label: 'Alarmas SCADA', href: '/dashboard?channel=ALARMS', icon: Bell, badge: '3' },
     ],
   },