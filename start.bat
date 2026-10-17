@echo off
title HYDROSYNC AI - Platform Launcher
color 0B

echo ======================================================================
echo    HYDROSYNC AI - Climate Intelligence & Water Conservation Platform
echo    "Predict the Heat. Detect the Loss. Protect the Future."
echo    IBM Z Datathon 2026 - Real-Time AI for Critical Decisions
echo ======================================================================
echo.

cd /d "%~dp0"

:: 1. Verify Python availability
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not found on your PATH. Please install Python 3.10+ and try again.
    pause
    exit /b 1
)

:: 2. Verify Node and npm availability
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not found on your PATH. Please install Node.js 18+ and try again.
    pause
    exit /b 1
)

:: 3. Check and install frontend packages if node_modules missing
if not exist "frontend\node_modules" (
    echo [INFO] First-time setup detected: Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

echo [1/3] Spawning HYDROSYNC AI Backend (FastAPI on Port 8000)...
start "HYDROSYNC AI - Backend API" cmd /k "cd /d %~dp0 && python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload"

:: Brief delay to allow FastAPI to initialize
timeout /t 3 /nobreak >nul

echo [2/3] Spawning HYDROSYNC AI Frontend (Vite Client on Port 3000)...
start "HYDROSYNC AI - Frontend UI" cmd /k "cd /d %~dp0frontend && npm run dev -- --port 3000"

:: Brief delay to allow Vite to spin up
timeout /t 3 /nobreak >nul

echo [3/3] Opening HYDROSYNC AI Dashboard in your default web browser...
start http://localhost:3000

echo.
echo ======================================================================
echo  HYDROSYNC AI IS NOW RUNNING CONCURRENTLY!
echo.
echo  - Frontend Web Dashboard: http://localhost:3000
echo  - Backend OpenAPI Docs:   http://localhost:8000/docs
echo  - Health Check Endpoint:  http://localhost:8000/api/health
echo.
echo  Two separate console windows have been launched:
echo    1. Backend Server (FastAPI + Isolation Forest + NOAA Engine)
echo    2. Frontend Client (React 19 + TypeScript + Vite)
echo.
echo  To shut down the platform, simply close both spawned terminal windows
echo  or press Ctrl+C in each.
echo ======================================================================
echo.
pause
