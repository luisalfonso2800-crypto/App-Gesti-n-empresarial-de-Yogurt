@echo off
cd /d "C:\Proyects\App-Gesti-n-empresarial-de-Yogurt"

:: Cerrar procesos previos
taskkill /F /IM electron.exe /T >nul 2>&1

:: Levantar servicios en segundo plano absoluto
start /B pnpm run start:api:dev >nul 2>&1
start /B pnpm --filter web dev >nul 2>&1

:: Esperar a que respondan los puertos
timeout /t 5 /nobreak >nul

:: Abrir Electron indicando explícitamente el entorno local
set DESKTOP_WEB_URL=http://localhost:3000
set DESKTOP_API_URL=http://localhost:4000/api/v1
start "" "apps\desktop\node_modules\electron\dist\electron.exe" "apps\desktop"

exit