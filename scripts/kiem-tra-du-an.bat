@echo off
setlocal

echo Kiem tra frontend...
cd /d "%~dp0..\frontend"
call npm run typecheck
if errorlevel 1 exit /b 1
call npm run build
if errorlevel 1 exit /b 1

echo Kiem tra backend...
cd /d "%~dp0..\backend"
call mvnw.cmd clean test
if errorlevel 1 exit /b 1
call mvnw.cmd clean package
if errorlevel 1 exit /b 1

echo Hoan thanh tat ca kiem tra.
