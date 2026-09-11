# CORRECCIÓN DE CONSUMO DE ALARMAS EN EL SIDEBAR MANNÁ (USO DE APICLIENT)

REGLAS DE CUOTA Y ARQUITECTURA:
- Modo bisturí: modifica exclusivamente `apps/web/src/components/shell/Shell.jsx` y `shell.module.css`.
- Cero Tailwind: usa exclusivamente CSS Modules nativos.
- Causa raíz: `Shell.jsx` usó `fetch('/api/v1/dashboard/alarms')` relativo hacia el puerto de Next.js (3000) en vez de usar el cliente HTTP del proyecto que apunta al backend NestJS (puerto 4000).

---

### 1. ACTUALIZACIÓN EN `apps/web/src/components/shell/Shell.jsx`:
1. Importa el cliente API centralizado del proyecto (revisa si es `import apiClient from '../../lib/apiClient';` o `@/lib/apiClient` o la instancia que use `page.jsx` de dashboard).
2. Reemplaza la llamada de `fetchAlarmSummary`:
   ```javascript
   useEffect(() => {
     let isMounted = true;

     const fetchAlarmSummary = async () => {
       try {
         // Usa apiClient o la variable de entorno NEXT_PUBLIC_API_URL
         const res = await apiClient.get('/dashboard/alarms');
         const data = res.data || res;
         
         if (isMounted && data?.summary) {
           setAlarmCount(data.summary.total || 0);
           setHasCritical((data.summary.critical || 0) > 0);
         }
       } catch (error) {
         console.error('Error cargando resumen de alarmas en Sidebar:', error);
       }
     };

     fetchAlarmSummary();
     const interval = setInterval(fetchAlarmSummary, 30000); // Refresco cada 30s
     return () => {
       isMounted = false;
       clearInterval(interval);
     };
   }, []);