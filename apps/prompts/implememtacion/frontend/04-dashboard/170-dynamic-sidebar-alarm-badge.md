# VINCULACIÓN DINÁMICA DEL BADGE DE ALARMAS SCADA EN EL SIDEBAR MANNÁ

REGLAS DE MÁXIMO AHORRO DE CUOTA Y ARQUITECTURA:
- Modo bisturí: modifica exclusivamente `apps/web/src/components/shell/Shell.jsx` y `shell.module.css`.
- CERO TAILWIND: Emplea CSS Modules nativos.
- Reactividad: Consume el nuevo endpoint `GET /api/v1/dashboard/alarms` en segundo plano para que el sidebar refleje el número exacto de contingencias reales de la base de datos (por ejemplo, el 11 detectado actualmente). Si no hay alarmas (0), el círculo no debe mostrarse.

---

### 1. ESTADO REACTIVO Y CONSULTA EN `Shell.jsx` (`apps/web/src/components/shell/Shell.jsx`):
1. Importa `useState` y `useEffect`.
2. Declara el estado de conteo:
   ```javascript
   const [alarmCount, setAlarmCount] = useState(0);
   const [hasCritical, setHasCritical] = useState(false);

   useEffect(() => {
  let isMounted = true;

  const fetchAlarmSummary = async () => {
    try {
      const res = await fetch('/api/v1/dashboard/alarms');
      if (!res.ok) return;
      const data = await res.json();
      if (isMounted && data?.summary) {
        setAlarmCount(data.summary.total || 0);
        setHasCritical((data.summary.critical || 0) > 0);
      }
    } catch (error) {
      // Silencioso en sidebar para no romper la navegación
    }
  };

  fetchAlarmSummary();
  const interval = setInterval(fetchAlarmSummary, 45000); // Polling táctico de 45s
  return () => {
    isMounted = false;
    clearInterval(interval);
  };
}, []);

{item.label === 'Alarmas SCADA' && alarmCount > 0 && (
  <span className={`${styles.alarmBadge} ${hasCritical ? styles.badgeCritical : styles.badgeWarning}`}>
    {alarmCount > 99 ? '99+' : alarmCount}
  </span>
)}



.alarmBadge {
  margin-left: auto;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.68rem;
  font-weight: 800;
  line-height: 1;
  color: #FFFFFF;
  letter-spacing: -0.02em;
  transition: transform 0.2s ease;
}

/* Color si solo hay advertencias (como el caso actual de 11 insumos) */
.badgeWarning {
  background-color: #D97706; /* Ámbar / naranja de advertencia */
  box-shadow: 0 0 6px rgba(217, 119, 6, 0.45);
}

/* Color si hay al menos una crítica (lote vencido / rotura total) */
.badgeCritical {
  background-color: #EF4444; /* Rojo SCADA crítico */
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.6);
  animation: pulseAlarmBadge 2s infinite ease-in-out;
}

@keyframes pulseAlarmBadge {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}


**Siguientes pasos recomendados para el SCADA:**

* **Acción directa desde la Alarma:** Convertir el botón *"Reconocer"* en una acción resolutiva. Por ejemplo, al pulsar sobre la alarma de *"Leche cruda: 70L / Mínimo 100L"*, abrir directamente el modal prellenado de compra al proveedor sugerido (*Lácteos El Campo*) para resolver la contingencia en un clic.
* **Sincronizar el Canvas de Silos con el inventario real:** El silo de Materia Prima ya refleja `$5.676.839`; conectar el segundo silo (Cava de Producto Terminado) con la suma de `InventarioProducto` para que ambos muestren volumen y valor vivo en pesos.
* **Poblar el Radar FEFO con los lotes reales:** Pasar los lotes consultados en la base de datos al barrido del radar para que los puntos verdes, amarillos y rojos parpadeen en la distancia según los días restantes de caducidad.