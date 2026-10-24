@echo off
title CodeVita Practice Hub - Live Server
echo ==============================================================
echo  Starting CodeVita Practice Hub Production Server & Live Tunnel
echo ==============================================================

cd /d "%~dp0"

echo [1/2] Launching Next.js Production Server on port 3000...
start "CodeVita Next.js Server" /B npm run start

timeout /t 3 /nobreak >nul

echo [2/2] Launching Cloudflare Public HTTPS Tunnel...
.\cloudflared.exe tunnel --url http://localhost:3000

pause
