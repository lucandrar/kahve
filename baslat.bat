@echo off
title AETHER ESPRESSO - Local Server
set "PATH=C:\Users\lucan\AppData\Local\Programs\nodejs;%PATH%"
cd /d "%~dp0"
echo AETHER ESPRESSO sunucusu baslatiliyor...
echo Tarayicinizda su adresi acin: http://localhost:3000
echo.
npm run dev
pause
