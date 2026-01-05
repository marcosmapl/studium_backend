@echo off
echo ====================================
echo   Studium - Sistema de Gestao de Estudos
echo ====================================
echo.
echo Iniciando Backend...
cd backend
start cmd /k "npm run dev"
echo.
echo Aguardando 3 segundos...
timeout /t 3 /nobreak >nul
echo.
echo Iniciando Frontend...
cd ..\frontend
start cmd /k "npm run dev"
echo.
echo ====================================
echo Servidores iniciados!
echo Backend: http://localhost:3333
echo Frontend: http://localhost:5173
echo ====================================
