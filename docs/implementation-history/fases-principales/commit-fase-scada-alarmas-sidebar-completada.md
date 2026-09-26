feat(scada-alarmas-sidebar): sistema de alarmas SCADA real, sidebar MANNÁ y deep-linking operativo

- Cambios técnicos de la fase:

  BACKEND — Nuevo endpoint de alarmas reales:
  * apps/api/src/dashboard/dashboard.service.js: Implementado getAlarms() con 5 categorías
    de alarmas consultando Prisma en tiempo real (SIN datos mockeados):
    - ALM-C02: Lotes VENCIDOS con stock disponible (CRITICAL)
    - ALM-W03: Lotes próximos a vencer <= 7 días y 8-15 días (WARNING)
    - ALM-W01: Insumos bajo stock mínimo / stock cero (WARNING/CRITICAL)
    - ALM-W04: Cuentas por cobrar vencidas con saldo pendiente (WARNING/CRITICAL)
    - ALM-W05: Desviación de costo real > 20% sobre costo teórico (WARNING/CRITICAL)
  * apps/api/src/dashboard/dashboard.controller.js: Registrado GET /api/v1/dashboard/alarms
    como primera ruta (antes de parametrizadas) retornando { generatedAt, summary, alarms[] }.

  FRONTEND SHELL — Sidebar MANNÁ botánico-industrial:
  * apps/web/src/components/shell/Shell.jsx: Refactorizado completamente con:
    - ERP_SECTIONS (4 categorías: GENERAL, CATÁLOGOS, OPERACIONES, COMERCIAL)
    - Badge dinámico de alarmas en "Alarmas SCADA" (polling real cada 30s via apiClient)
    - hasCritical → badge rojo pulsante / solo warnings → badge ámbar
    - Sidebar MANNÁ con brandWrapper, navList scrollable, sidebarFooter botánico
  * apps/web/src/components/shell/shell.module.css: Estilos botánico-industriales completos:
    - Fondo verde bosque #182622, píldora activa sage #CAD5B5
    - Clases .alarmBadge, .badgeWarning, .badgeCritical con @keyframes pulseAlarmBadge
    - .navGroup, .groupTitle, .brandWrapper, .sidebarFooter
  * apps/web/src/components/shell/Header.jsx: Erradicados enlaces violetas redundantes.
    Reemplazados por barra de instrumentación SCADA (.scadaInstrumentation):
    - LED animado "SISTEMA EN LÍNEA", fecha táctica, perfil OPERADOR-01

  FRONTEND DASHBOARD — Modal de alarmas dinámico y controladores:
  * apps/web/src/app/dashboard/page.jsx:
    - useSearchParams para escuchar ?channel=ALARMS desde el sidebar
    - fetchAlarms() → apiClient.get('/dashboard/alarms') al abrir overlay
    - acknowledgedIds con persistencia en sessionStorage('manna_ack_alarms')
    - handleAcknowledge(): acuse de recibo idempotente por ID de alarma
    - handleResolveAlarm(): deep-link inteligente por canal/entityType:
        SUMINISTROS/Insumo → /catalog/supplier-prices?search={nombre}&insumoId={uuid}
        FEFO/CAVA/Lote     → /operations/lots
        TESORERÍA/Venta    → /commercial/payments
        PLANTA             → /operations/production
    - pendingAlarmsCount: conteo reactivo de alarmas no reconocidas
    - Modal renderiza alarm.title + alarm.detail + alarm.action desde BD real
    - Botonera táctica: [Gestionar ↗] primero, [Reconocer / ✓ Atendida] segundo
  * apps/web/src/app/dashboard/Dashboard.module.css: Clases completas del sistema de alarmas:
    - .alarmBackdrop, .alarmModal, .alarmHeader, .alarmBody, .alarmItem
    - .alarmCritical, .alarmWarning, .alarmAcknowledged, .alarmActionsCluster
    - .resolveButton, .ackButton, .ackButtonDone, .alarmDesc

  FRONTEND PRECIOS — Deep-link receptivo:
  * apps/web/src/app/catalog/supplier-prices/page.jsx:
    - Importado useSearchParams + useEffect
    - Al montar: si ?search= presente (deep-link del SCADA), llama setFilterSearch()
    - Tabla carga prefiltrada con el insumo crítico listo para comprar

  DOCUMENTACIÓN:
  * docs/AUDITORIA_DATOS_Y_TELEMETRIA_SCADA.md: Auditoría técnica completa de BD y contratos:
    - Inventario de tablas con campos de telemetría
    - Matriz de 13 alarmas reales factibles sin inventar datos
    - Contrato propuesto GET /api/v1/dashboard/alarms (payload JSON)
    - 7 oportunidades de telemetría adicional identificadas

  PROMPTS DE IMPLEMENTACIÓN (nuevos):
  * apps/prompts/implememtacion/frontend/04-dashboard/170-dynamic-sidebar-alarm-badge.md
  * apps/prompts/implememtacion/frontend/05-sidebard/172-scada-alarm-acknowledge-and-action-handler.md

  LIMPIEZA:
  * Eliminados prompts obsoletos de la carpeta dashboard/ sin numeración estándar (148-156c)
  * Artefactos de compilación purgados: .next, dist, .turbo

- Alcance:
  * Cierre estricto de fase SCADA Alarmas + Sidebar MANNÁ sin inclusión de elementos fuera de alcance.
  * Sistema de alarmas 100% conectado a BD real (Prisma) sin mocks ni datos hardcodeados.
