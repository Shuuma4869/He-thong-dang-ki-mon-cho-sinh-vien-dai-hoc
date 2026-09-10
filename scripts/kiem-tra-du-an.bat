@echo off
setlocal

set "PROJECT_ROOT=%~dp0.."
set "FRONTEND_DIR=%PROJECT_ROOT%\frontend"
set "BACKEND_DIR=%PROJECT_ROOT%\backend"

call :check_java_21
if errorlevel 1 exit /b 1
call :check_node_npm
if errorlevel 1 exit /b 1

if not exist "%FRONTEND_DIR%\package.json" (
  echo Khong tim thay frontend\package.json. Vui long kiem tra cau truc du an.
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

echo Kiem tra backend: unit/regression va integration tests...
cd /d "%BACKEND_DIR%"
call mvnw.cmd clean verify
if errorlevel 1 exit /b 1

echo Hoan thanh tat ca kiem tra.
exit /b 0

:check_java_21
where java >nul 2>nul
if errorlevel 1 (
  echo Khong tim thay Java. Vui long cai JDK 21 va mo terminal moi.
  exit /b 1
)
where javac >nul 2>nul
if errorlevel 1 (
  echo Khong tim thay javac. Vui long cai day du JDK 21, khong chi JRE.
  exit /b 1
)
set "JAVA_VERSION="
for /f "tokens=3" %%V in ('java -version 2^>^&1 ^| findstr /I /C:"version"') do if not defined JAVA_VERSION set "JAVA_VERSION=%%~V"
if not defined JAVA_VERSION (
  echo Khong doc duoc phien ban Java. Vui long kiem tra JAVA_HOME va PATH.
  exit /b 1
)
if not "%JAVA_VERSION:~0,2%"=="21" (
  echo Du an yeu cau JDK 21, nhung java tren PATH dang la %JAVA_VERSION%.
  echo Hay cap nhat JAVA_HOME va PATH, sau do mo terminal moi.
  exit /b 1
)
exit /b 0

:check_node_npm
where node >nul 2>nul
if errorlevel 1 (
  echo Khong tim thay Node.js. Vui long cai Node.js 20 tro len.
  exit /b 1
)
where npm >nul 2>nul
if errorlevel 1 (
  echo Khong tim thay npm. Vui long cai npm 10 tro len.
  exit /b 1
)
set "NODE_MAJOR="
for /f "tokens=1 delims=." %%V in ('node --version') do set "NODE_MAJOR=%%V"
set "NODE_MAJOR=%NODE_MAJOR:~1%"
if not defined NODE_MAJOR (
  echo Khong doc duoc phien ban Node.js.
  exit /b 1
)
if %NODE_MAJOR% LSS 20 (
  echo Du an yeu cau Node.js 20 tro len.
  node --version
  exit /b 1
)
set "NPM_MAJOR="
for /f "tokens=1 delims=." %%V in ('npm --version') do set "NPM_MAJOR=%%V"
if not defined NPM_MAJOR (
  echo Khong doc duoc phien ban npm.
  exit /b 1
)
if %NPM_MAJOR% LSS 10 (
  echo Du an yeu cau npm 10 tro len.
  npm --version
  exit /b 1
)
exit /b 0
