@echo off
title King Endog - Aplikasi Web Peternakan & Kasir
cd /d "%~dp0"

:: Cek apakah server lokal port 3000 sedang berjalan
netstat -ano | findstr :3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo Membuka aplikasi via server lokal...
    start http://localhost:3000
) else (
    echo Membuka aplikasi web langsung di browser...
    start "" "%~dp0index.html"
)
exit
