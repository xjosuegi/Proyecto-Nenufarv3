@echo off
echo ========================================
echo    INICIANDO SERVIDOR NENUFARAI
echo ========================================
echo.

echo 🔧 Iniciando servidor Node.js en puerto 8000...
start cmd /k "node server.js"

timeout /t 3

echo 🌐 Iniciando ngrok...
start cmd /k "ngrok http 8000"

echo.
echo ✅ Servicios iniciados correctamente!
echo 📍 Servidor: http://localhost:8000
echo 📍 Ngrok: https://foggier-oversufficiently-giselle.ngrok-free.dev
echo.
echo ⏹️  Presiona cualquier tecla para cerrar este mensaje...
pause >nul