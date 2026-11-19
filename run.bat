@echo off
title Raksha Connect - Smart Citizen Support System
echo ==========================================================
echo   RAKSHA CONNECT - Smart Citizen Support System
echo   One app. The right helpline. Instantly.
echo ==========================================================
echo Starting server...
python app.py
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Python execution failed. Opening standalone web application...
    start index.html
)
pause
