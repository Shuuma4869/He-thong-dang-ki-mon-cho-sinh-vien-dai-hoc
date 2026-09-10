@echo off
setlocal

set "BACKEND_PORT=%~1"
if "%BACKEND_PORT%"=="" set "BACKEND_PORT=8080"
set "VITE_API_BASE_URL=http://localhost:%BACKEND_PORT%/api"

call :check_node_npm
if errorlevel 1 exit /b 1

curl.exe --max-time 3 -s "http://localhost:3000" | findstr /I /C:"root" >nul
if not errorlevel 1 (
  echo Frontend dang chay tai http://localhost:3000
  exit /b 0
)

netstat -ano | findstr /R /C:":3000 .*LISTENING" >nul
if not errorlevel 1 (
  echo Port 3000 dang ban nhung khong phan hoi nhu frontend cua du an.
  echo Vui long dong ung dung dang chiem 3000 hoac doi cong frontend.
  exit /b 1
)

cd /d "%~dp0..\frontend"
if not exist package.json (
  echo Khong tim thay frontend\package.json. Vui long kiem tra cau truc du an.
  exit /b 1
)

if not exist node_modules (
  echo Dang cai dependency frontend...
  if exist package-lock.json (
    call npm ci
  ) else (
    call npm install
  )
  if errorlevel 1 exit /b 1
)

echo Frontend se chay tai http://localhost:3000
echo API backend: %VITE_API_BASE_URL%
npm run dev
exit /b %ERRORLEVEL%

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
