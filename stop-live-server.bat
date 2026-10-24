@echo off
title Stop CodeVita Practice Hub
echo ==============================================================
echo  Stopping CodeVita Practice Hub Server & Tunnel
echo ==============================================================

echo Stopping Cloudflare Tunnel...
taskkill /F /IM cloudflared.exe 2>nul

echo Stopping Node.js / Next.js Server on port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    taskkill /F /PID %%a 2>nul
)

echo All services stopped cleanly.
timeout /t 2 /nobreak >nul
