@echo off
title PujaConnect Launcher
cd /d "%~dp0"

echo =======================================================
echo           PUJACONNECT - 1-CLICK LAUNCHER
echo =======================================================
echo.
echo Starting PujaConnect server and Public Tunnel...
echo.

:: Start Next.js Production Server in background if not already running
start "PujaConnect Server" /min cmd /c "npm start"

:: Wait 3 seconds for server to initialize
timeout /t 3 /nobreak >nul

:: Open browser locally
start http://localhost:3000

:: Start Cloudflare Tunnel for Live Public Access
echo Starting Live Public HTTPS Tunnel...
echo A public https://*.trycloudflare.com link will appear below.
echo Keep this window open while using the live link.
echo.
.\cloudflared.exe tunnel --url http://localhost:3000

pause
