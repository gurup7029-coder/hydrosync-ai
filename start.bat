@echo off
setlocal EnableDelayedExpansion
title HYDROSYNC AI - Platform Launcher
color 0B

echo ======================================================================
echo    HYDROSYNC AI - Climate Intelligence and Water Conservation
echo    "Predict the Heat. Detect the Loss. Protect the Future."
echo    IBM Z Datathon 2026 - Real-Time AI for Critical Decisions
echo ======================================================================
echo.

cd /d "%~dp0"

:: 1. Verify Python availability
python --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    set "PY_BIN=python"
    goto RUN
)

py --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    set "PY_BIN=py"
    goto RUN
)

echo [ERROR] Neither 'python' nor 'py' was found on your Windows PATH.
echo Please ensure Python is installed and added to PATH.
echo.
pause
exit /b 1

:RUN
echo [INFO] Python detected. Launching HYDROSYNC AI Unified Platform...
echo [INFO] Backend URL:  http://localhost:8000
echo [INFO] Frontend URL: http://localhost:3000
echo.
%PY_BIN% start_hydrosync.py

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [INFO] Program terminated. Press any key to exit.
    pause
)
