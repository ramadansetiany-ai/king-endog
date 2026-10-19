@echo off
title Upload King Endog ke GitHub
cd /d "%~dp0"
echo ========================================================
echo   👑🥚 Mengunggah Proyek King Endog ke GitHub...
echo ========================================================
echo.
"C:\Program Files\Git\cmd\git.exe" push -u origin main
echo.
if %errorlevel% equ 0 (
    echo ========================================================
    echo   🎉 BERHASIL! Seluruh file King Endog sudah terunggah ke GitHub!
    echo ========================================================
) else (
    echo Gagal mengunggah. Silakan periksa pesan di atas.
)
pause
