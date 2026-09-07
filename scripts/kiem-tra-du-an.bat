@echo off
setlocal

set "PROJECT_ROOT=%~dp0.."
set "FRONTEND_DIR=%PROJECT_ROOT%\frontend"
set "BACKEND_DIR=%PROJECT_ROOT%\backend"

where java >nul 2>nul
if errorlevel 1 (
  echo Khong tim thay Java. Vui long cai JDK 21 va mo terminal moi.
  exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
  echo Khong tim thay Node.js. Vui long cai Node.js 20 tro len.
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo Khong tim thay npm. Vui long cai Node.js 20 tro len.
  exit /b 1
)

if not exist "%FRONTEND_DIR%\package.json" (
  echo Khong tim thay frontend\package.json. Vui long chay script tu dung thu muc repository.
  exit /b 1
)

if not exist "%BACKEND_DIR%\mvnw.cmd" (
  echo Khong tim thay backend\mvnw.cmd. Vui long kiem tra cau truc du an.
  exit /b 1
)

echo Kiem tra frontend...
cd /d "%FRONTEND_DIR%"
if not exist node_modules (
  echo Dang cai dependency frontend...
  if exist package-lock.json (
    call npm ci
  ) else (
    call npm install
  )
  if errorlevel 1 exit /b 1
)

call npm run typecheck
if errorlevel 1 exit /b 1
call npm run build
if errorlevel 1 exit /b 1

echo Kiem tra backend...
cd /d "%BACKEND_DIR%"
call mvnw.cmd clean test
if errorlevel 1 exit /b 1
call mvnw.cmd clean package
if errorlevel 1 exit /b 1

echo Hoan thanh tat ca kiem tra.
