@echo off
title Personal Finance Manager - Student Hostel Edition (Offline)
cls
echo ===================================================================
echo   PERSONAL FINANCE MANAGER - STUDENT HOSTEL EDITION
echo   100%% OFFLINE ON-DEVICE LAUNCHER (ZERO INTERNET REQUIRED)
echo ===================================================================
echo.
echo   Choose your preferred desktop interface:
echo.
echo   [1] Modern High-End Desktop App (Recommended - Sleek & Full Features)
echo   [2] Python Tkinter Desktop App (Dark Slate Edition)
echo   [3] Run Automated 20-Point Test Suite (IB Criterion E Verification)
echo   [4] Exit
echo.
set /p opt="Enter choice (1-4) [Default is 1]: "
if "%opt%"=="" set opt=1

if "%opt%"=="1" (
    echo.
    echo Starting Modern Offline Interface...
    python launch_offline_ui.py
    if errorlevel 1 (
        echo Trying python3...
        python3 launch_offline_ui.py
    )
    goto end
)

if "%opt%"=="2" (
    echo.
    echo Starting Python Tkinter Interface...
    python main.py
    if errorlevel 1 (
        echo Trying python3...
        python3 main.py
    )
    goto end
)

if "%opt%"=="3" (
    echo.
    echo Running Automated Test Suite...
    python test_suite.py
    if errorlevel 1 (
        python3 test_suite.py
    )
    pause
    goto end
)

:end
