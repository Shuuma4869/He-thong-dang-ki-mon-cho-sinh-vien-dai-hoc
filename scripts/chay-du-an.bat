@echo off
setlocal

set "PROJECT_ROOT=%~dp0.."
set "SCRIPT_DIR=%~dp0"
set "EXPECTED_BACKEND_PORT=8080"
set "EXPECTED_BACKEND_API=http://localhost:8080/api"
set "BACKEND_ALREADY_RUNNING=0"
set "FRONTEND_ALREADY_RUNNING=0"

echo ==================================================
echo  HE THONG DANG KY MON HOC - CHAY TOAN BO DU AN
echo ==================================================
echo.

where java >nul 2>nul
if errorlevel 1 (
  echo Khong tim thay Java. Vui long cai JDK 21 va mo terminal moi.
  pause
  exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
  echo Khong tim thay Node.js. Vui long cai Node.js 20 tro len.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo Khong tim thay npm. Vui long cai Node.js 20 tro len.
  pause
  exit /b 1
)

if not exist "%PROJECT_ROOT%\frontend\package.json" (
  echo Khong tim thay frontend\package.json. Vui long chay script tu dung thu muc repository.
  pause
  exit /b 1
)

if not exist "%PROJECT_ROOT%\backend\mvnw.cmd" (
  echo Khong tim thay backend\mvnw.cmd. Vui long kiem tra cau truc du an.
  pause
  exit /b 1
)

echo [1/4] Kiem tra va build frontend...
cd /d "%PROJECT_ROOT%\frontend"
if not exist node_modules (
  echo Dang cai dependency frontend...
  if exist package-lock.json (
    call npm ci
  ) else (
    call npm install
  )
  if errorlevel 1 goto :failed
)

call npm run typecheck
if errorlevel 1 goto :failed

call npm run build
if errorlevel 1 goto :failed

echo.
echo [2/4] Build backend...
cd /d "%PROJECT_ROOT%\backend"
call mvnw.cmd clean package
if errorlevel 1 goto :failed

echo.
echo [3/4] Kiem tra cong backend...
call :backend_healthy 8080
if not errorlevel 1 (
  echo Backend da san sang tai http://localhost:8080
  set "BACKEND_ALREADY_RUNNING=1"
) else (
  netstat -ano | findstr /R /C:":8080 .*LISTENING" >nul
  if not errorlevel 1 (
    echo Port 8080 dang ban. Backend se chay tam tren port 18080.
    set "EXPECTED_BACKEND_PORT=18080"
  )
)

if "%EXPECTED_BACKEND_PORT%"=="18080" (
  call :backend_healthy 18080
  if not errorlevel 1 (
    echo Backend da san sang tai http://localhost:18080
    set "BACKEND_ALREADY_RUNNING=1"
  ) else (
    netstat -ano | findstr /R /C:":18080 .*LISTENING" >nul
    if not errorlevel 1 (
      echo Port 18080 dang ban nhung khong phan hoi nhu backend cua du an.
      goto :failed
    )
  )
)

if "%EXPECTED_BACKEND_PORT%"=="8080" if "%BACKEND_ALREADY_RUNNING%"=="0" (
  call :backend_healthy 18080
  if not errorlevel 1 (
    echo Backend da san sang tai http://localhost:18080
    set "EXPECTED_BACKEND_PORT=18080"
    set "BACKEND_ALREADY_RUNNING=1"
  )
)

if "%EXPECTED_BACKEND_PORT%"=="8080" (
  echo Backend se chay tai http://localhost:8080
) else (
  echo Backend se chay tai http://localhost:18080
)
set "EXPECTED_BACKEND_API=http://localhost:%EXPECTED_BACKEND_PORT%/api"

echo.
echo [4/4] Mo backend va frontend...
if "%BACKEND_ALREADY_RUNNING%"=="0" (
  start "Course Registration Backend" cmd /k ""%SCRIPT_DIR%chay-backend.bat""
  call :wait_backend
  if errorlevel 1 goto :failed
) else (
  echo Khong mo them backend moi vi backend da dang chay.
)

call :frontend_healthy
if not errorlevel 1 (
  echo Frontend da san sang tai http://localhost:3000
  set "FRONTEND_ALREADY_RUNNING=1"
) else (
  netstat -ano | findstr /R /C:":3000 .*LISTENING" >nul
  if not errorlevel 1 (
    echo Port 3000 dang ban nhung khong phan hoi nhu frontend cua du an.
    goto :failed
  )
)

if "%FRONTEND_ALREADY_RUNNING%"=="0" (
  start "Course Registration Frontend" cmd /k ""%SCRIPT_DIR%chay-frontend.bat" %EXPECTED_BACKEND_PORT%"
  call :wait_frontend
  if errorlevel 1 goto :failed
) else (
  echo Khong mo them frontend moi vi frontend da dang chay.
)

start "" "http://localhost:3000"

echo.
echo ==================================================
echo  DA KHOI DONG DU AN
echo ==================================================
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:%EXPECTED_BACKEND_PORT%
echo API:      %EXPECTED_BACKEND_API%
echo.
echo Neu frontend chua hien ngay, doi vai giay roi bam Ctrl + F5.
echo Khong dong cua so Backend/Frontend khi dang demo.
echo.
pause
exit /b 0

:wait_backend
echo Dang cho backend san sang...
for /L %%I in (1,1,30) do (
  call :backend_healthy %EXPECTED_BACKEND_PORT%
  if not errorlevel 1 exit /b 0
  timeout /t 1 /nobreak >nul
)
echo Backend chua san sang sau 30 giay.
exit /b 1

:backend_healthy
curl.exe --max-time 3 -s "http://localhost:%~1/api/students/23010690" | findstr /C:"23010690" >nul
if errorlevel 1 exit /b 1
exit /b 0

:wait_frontend
echo Dang cho frontend san sang...
for /L %%I in (1,1,30) do (
  call :frontend_healthy
  if not errorlevel 1 exit /b 0
  timeout /t 1 /nobreak >nul
)
echo Frontend chua san sang sau 30 giay.
exit /b 1

:frontend_healthy
curl.exe --max-time 3 -s "http://localhost:3000" | findstr /I /C:"root" >nul
if errorlevel 1 exit /b 1
exit /b 0

:failed
echo.
echo Build, kiem tra, hoac khoi dong bi loi. Vui long xem thong bao phia tren.
pause
exit /b 1
