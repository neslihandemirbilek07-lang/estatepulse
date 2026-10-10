@echo off
title EstatePulse AI Real Estate Platform
echo ========================================================
echo   Starting EstatePulse AI Real Estate Platform...
echo   URL: http://localhost:3000
echo ========================================================
cd /d "%~dp0client"
npm run dev
pause
