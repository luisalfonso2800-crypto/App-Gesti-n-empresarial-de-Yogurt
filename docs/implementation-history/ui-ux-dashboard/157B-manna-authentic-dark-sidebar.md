# IMPLEMENTACIÓN DEL SIDEBAR OFICIAL MANNÁ SCADA (IDENTIDAD BOTÁNICO-INDUSTRIAL)

REGLAS DE CUOTA Y ARQUITECTURA:
- Modo bisturí: modifica exclusivamente los componentes del Shell/Sidebar (`apps/web/src/components/shell/Shell.jsx` y `shell.module.css`, o donde resida la barra lateral del layout).
- CERO TAILWIND: Emplea únicamente CSS Modules nativos.
- Erradica el sidebar blanco genérico "Yogurt ERP". Debe reflejar con precisión matemática el panel izquierdo de la imagen de referencia MANNÁ:
  * Fondo verde bosque profundo (`#182622`).
  * Logotipo con hoja botánica + texto MANNÁ + lema "Semilla · Tiempo · Fruto".
  * Ítems de navegación con píldora activa verde salvia claro (`#CAD5B5`) y texto oscuro (`#182622`).
  * Badge numérico en Alarmas (`3`) con fondo salvia/mostaza tenue.
  * Bloque inferior con hoja botánica y la cita en cursiva: *"Procesos que dan vida. La tecnología también puede cuidar lo esencial."*

---

### 1. ESTILOS DEFINITIVOS (`apps/web/src/components/shell/shell.module.css`):
Reemplaza o ajusta los estilos de la barra lateral izquierda:

```css
/* Layout maestro de 2 columnas bloqueado en viewport */
.layoutContainer {
  display: flex;
  width: 100vw;
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  background-color: #F7F4EE;
}

/* Barra lateral MANNÁ */
.sidebar {
  width: 240px;
  min-width: 240px;
  height: 100vh;
  background-color: #182622; /* Verde bosque profundo */
  color: #F7F4EE;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem 1rem 1.25rem 1rem;
  box-sizing: border-box;
  border-right: 1px solid #233732;
  user-select: none;
}

/* Header: Logotipo y Marca */
.brandWrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 1.75rem;
}

.brandLogoIcon {
  color: #CAD5B5; /* Verde salvia tenue */
  margin-bottom: 0.35rem;
}

.brandTitle {
  font-family: var(--font-serif, "Georgia", serif);
  font-size: 1.55rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: #F7F4EE;
  margin: 0;
  line-height: 1.1;
}

.brandSubtitle {
  font-size: 0.62rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #8E9F94;
  margin-top: 0.3rem;
}

/* Navegación central */
.navList {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
  overflow-y: auto;
}

.navItem {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.6rem 0.85rem;
  border-radius: 9px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #A3B5AA;
  text-decoration: none;
  transition: all 0.18s ease;
}

.navItem:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: #FFFFFF;
}

/* Estado activo: píldora salvia brillante */
.navItemActive {
  background-color: #CAD5B5 !important;
  color: #182622 !important;
  font-weight: 700;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.12);
}

.navItemActive svg {
  color: #182622 !important;
}

/* Badge de Alarmas */
.alarmBadge {
  margin-left: auto;
  background-color: #DDE5B6;
  color: #182622;
  font-size: 0.7rem;
  font-weight: 800;
  border-radius: 9999px;
  padding: 0.1rem 0.45rem;
  line-height: 1;
}

/* Footer botánico */
.sidebarFooter {
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.footerLeafIcon {
  color: #CAD5B5;
  opacity: 0.85;
}

.footerQuote {
  font-family: var(--font-serif, "Georgia", serif);
  font-style: italic;
  font-size: 0.82rem;
  color: #D5DDD7;
  line-height: 1.35;
}

.footerSubQuote {
  font-size: 0.68rem;
  color: #798D80;
  line-height: 1.3;
}

/* Contenedor derecho (Páginas y Dashboard) */
.mainContent {
  flex: 1;
  min-width: 0;
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}