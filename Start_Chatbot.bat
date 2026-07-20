@echo off
echo =========================================
echo       Starting FDIAS Local Chatbot
echo =========================================
echo.

:: Get the directory where this batch file is located
set APP_DIR=%~dp0

:: Navigate to the backend folder
cd /d "%APP_DIR%backend"

:: Start the server in a new window so the user can see logs
echo Starting the backend server...
start "FDIAS Server" cmd /k "venv\Scripts\activate && uvicorn main:app --host 127.0.0.1 --port 8085"

:: Wait for 3 seconds to give the server time to start up
echo Waiting for server to initialize...
timeout /t 3 /nobreak > nul

:: Open the default web browser to the local app address
echo Opening your browser...
start http://127.0.0.1:8085

echo.
echo =========================================
echo Done! 
echo Keep the "FDIAS Server" black window open 
echo while you are using the app.
echo You can safely close this window now.
echo =========================================
timeout /t 5 > nul
exit
