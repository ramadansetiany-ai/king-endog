@echo off
title ENDOGHAYAM - Web App Server
cd /d "%~dp0"
echo =======================================================
echo    🥚 Memulai Aplikasi Web ENDOGHAYAM...
echo    Otentikasi Login Google + Sistem Manajemen Telur
echo =======================================================
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
