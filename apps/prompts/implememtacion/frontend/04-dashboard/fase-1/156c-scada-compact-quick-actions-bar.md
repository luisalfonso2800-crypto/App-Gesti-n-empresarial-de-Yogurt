/* Cinta de Accesos Rápidos Tácticos */
.quickAccessRibbon {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  height: 28px;
  min-height: 28px;
  flex-shrink: 0;
  padding: 0 0.5rem;
  background-color: #ECE7DF;
  border: 1px solid #DDD6CA;
  border-radius: 6px;
}

.quickAccessLabel {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #736B5E;
  white-space: nowrap;
}

.quickButtonsGroup {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex: 1;
  overflow-x: auto;
}

.quickBtn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.55rem;
  background-color: #FFFFFF;
  border: 1px solid #D8D1C5;
  border-radius: 4px;
  font-size: 0.72rem;
  font-weight: 600;
  color: #182622;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.15s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.quickBtn:hover {
  background-color: #182622;
  color: #F7F4EE;
  border-color: #182622;
  transform: translateY(-1px);
}

.quickBtn:hover .quickIcon {
  color: #CAD5B5;
}

.quickIcon {
  color: #C58A3E; /* Ámbar MANNÁ */
  transition: color 0.15s ease;
}

/* Compensación en el contenedor para blindar el 100vh sin scroll */
.dashboardContainer {
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 0.4rem 0.75rem;
  gap: 0.35rem; /* Margen vertical ultra-compacto */
  box-sizing: border-box;
  background-color: #F7F4EE;
}