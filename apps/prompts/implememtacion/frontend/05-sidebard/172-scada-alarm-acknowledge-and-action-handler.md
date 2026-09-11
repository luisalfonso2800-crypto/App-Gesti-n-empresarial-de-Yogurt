# CONTROLADOR DE RECONOCIMIENTO Y ACCIÓN RESOLUTIVA EN ALARMAS SCADA

REGLAS DE CUOTA Y ARQUITECTURA:
- Modo bisturí: modifica exclusivamente `apps/web/src/app/dashboard/page.jsx` y `Dashboard.module.css`.
- CERO TAILWIND: Emplea CSS Modules nativos.
- Comportamiento operativo: 
  1. El botón "Reconocer" debe registrar el acuse de recibo del operador (estado visual reconocido, badge check `✓ Reconocida`, descuento del contador activo y persistencia en sesión).
  2. Cada alarma debe incluir un botón de acción resolutiva táctica ("Gestionar ↗" o "Comprar Insumo") que redirija de inmediato al módulo ERP responsable según el tipo de alarma:
     * Insumos bajo stock (`CANAL 03` / `Insumo`) -> `/operations/purchases`
     * Lotes vencidos o por vencer (`CANAL 02` / `Lote`) -> `/operations/batches`
     * Cartera y CxC vencidas (`CANAL 01` / `Venta`) -> `/commercial/payments`

---

### 1. GESTIÓN DE ESTADO Y ENRUTAMIENTO (`apps/web/src/app/dashboard/page.jsx`):
1. Declara el estado de alarmas reconocidas (inicializado con `sessionStorage` para no perder el estado al recargar):
   ```javascript
   const [acknowledgedIds, setAcknowledgedIds] = useState(() => {
     if (typeof window !== 'undefined') {
       const saved = sessionStorage.getItem('manna_ack_alarms');
       return saved ? JSON.parse(saved) : [];
     }
     return [];
   });

   const handleAcknowledge = (alarmId, e) => {
     e.stopPropagation();
     setAcknowledgedIds((prev) => {
       const next = prev.includes(alarmId) ? prev : [...prev, alarmId];
       if (typeof window !== 'undefined') {
         sessionStorage.setItem('manna_ack_alarms', JSON.stringify(next));
       }
       return next;
     });
   };

   const handleResolveAlarm = (alarm) => {
     setShowAlarmsOverlay(false);
     if (alarm.channel?.includes('SUMINISTROS') || alarm.entityType === 'Insumo') {
       router.push('/operations/purchases');
     } else if (alarm.channel?.includes('FEFO') || alarm.channel?.includes('PLANTA') || alarm.entityType === 'Lote') {
       router.push('/operations/batches');
     } else if (alarm.channel?.includes('FINANZAS') || alarm.entityType === 'Venta') {
       router.push('/commercial/payments');
     } else {
       router.push('/dashboard');
     }
   };


   const pendingAlarmsCount = (alarmsData?.alarms || []).filter(
  (a) => !acknowledgedIds.includes(a.id)
).length;


{alarmsData.alarms.map((alarm) => {
  const isAck = acknowledgedIds.includes(alarm.id);

  return (
    <div
      key={alarm.id}
      className={`${styles.alarmItem} ${
        alarm.level === 'CRITICAL' ? styles.alarmCritical : styles.alarmWarning
      } ${isAck ? styles.alarmAcknowledged : ''}`}
    >
      <div className={styles.alarmStatusDot} />

      <div className={styles.alarmDetails}>
        <div className={styles.alarmMeta}>
          <span className={styles.alarmLevel}>
            {alarm.level === 'CRITICAL' ? 'CRÍTICA' : 'ADVERTENCIA'}
          </span>
          <span className={styles.alarmChannel}>{alarm.channel}</span>
          <span className={styles.alarmTime}>
            {new Date(alarm.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <strong className={styles.alarmMsg}>{alarm.title}</strong>
        <p className={styles.alarmDesc}>{alarm.detail}</p>
        <p className={styles.alarmAction}>
          <strong>Acción:</strong> {alarm.action}
        </p>
      </div>

      {/* Botonera Táctica de Alarma */}
      <div className={styles.alarmActionsCluster}>
        <button
          type="button"
          onClick={() => handleResolveAlarm(alarm)}
          className={styles.resolveButton}
          title="Ir al módulo operativo correspondiente"
        >
          Gestionar ↗
        </button>

        <button
          type="button"
          onClick={(e) => handleAcknowledge(alarm.id, e)}
          disabled={isAck}
          className={`${styles.ackButton} ${isAck ? styles.ackButtonDone : ''}`}
        >
          {isAck ? '✓ Atendida' : 'Reconocer'}
        </button>
      </div>
    </div>
  );
})}


/* Agrupador de botones a la derecha de la tarjeta */
.alarmActionsCluster {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  align-self: center;
  margin-left: 0.75rem;
}

/* Botón Gestionar / Resolver */
.resolveButton {
  background-color: #182622;
  color: #F7F4EE;
  border: 1px solid #182622;
  border-radius: 6px;
  padding: 0.35rem 0.75rem;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.16s ease;
  white-space: nowrap;
}

.resolveButton:hover {
  background-color: #2D4A42;
  border-color: #2D4A42;
  transform: translateY(-1px);
}

/* Botón Reconocer */
.ackButton {
  background: #FFFFFF;
  border: 1px solid #D8D1C5;
  padding: 0.35rem 0.75rem;
  font-size: 0.72rem;
  font-weight: 700;
  border-radius: 6px;
  color: #182622;
  cursor: pointer;
  transition: all 0.16s ease;
  white-space: nowrap;
}

.ackButton:hover:not(:disabled) {
  background-color: #F4EFE6;
  border-color: #182622;
}

/* Estado Alarma Reconocida / Atendida */
.alarmAcknowledged {
  opacity: 0.6;
  background-color: #F7F5F0 !important;
  border-color: #DDD6CA !important;
  transition: opacity 0.25s ease;
}

.alarmAcknowledged .alarmStatusDot {
  background-color: #9CA3AF !important;
  box-shadow: none !important;
}

.ackButtonDone {
  background-color: #E5E7EB !important;
  color: #6B7280 !important;
  border-color: #D1D5DB !important;
  cursor: default !important;
}

