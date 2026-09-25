@echo off
cd /d "C:\Proyects\App-Gesti-n-empresarial-de-Yogurt"

:: Cerrar procesos previos
taskkill /F /IM electron.exe /T >nul 2>&1

:: Levantar servicios en segundo plano absoluto
start /B pnpm run start:api:dev >nul 2>&1
start /B pnpm --filter web dev >nul 2>&1

:: Esperar a que respondan los puertos
timeout /t 5 /nobreak >nul

:: Abrir Electron directamente sin pasar por la consola de pnpm
start "" "apps\desktop\node_modules\electron\dist\electron.exe" "apps\desktop"

exit