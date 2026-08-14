@echo off
setlocal
set "PROJECT_ROOT=%~dp0.."
set "BACKEND_DIR=%PROJECT_ROOT%\backend"
set "BACKEND_JAR=target\course-registration-0.0.1-SNAPSHOT.jar"
set "BACKEND_PORT=8080"

where java >nul 2>nul
if errorlevel 1 (
  echo Khong tim thay Java. Vui long cai JDK 21 va mo terminal moi.
  exit /b 1
)

if not exist "%BACKEND_DIR%\mvnw.cmd" (
  echo Khong tim thay backend\mvnw.cmd. Vui long kiem tra cau truc du an.
  exit /b 1
)

call :backend_healthy 8080
if not errorlevel 1 (
  echo Backend dang chay tai http://localhost:8080
  exit /b 0
)

call :backend_healthy 18080
if not errorlevel 1 (
  echo Backend dang chay tai http://localhost:18080
  exit /b 0
)

netstat -ano | findstr /R /C:":8080 .*LISTENING" >nul
if not errorlevel 1 (
  echo Port 8080 dang ban. Backend se chay tam tren port 18080.
  set "BACKEND_PORT=18080"
)

if "%BACKEND_PORT%"=="18080" (
  netstat -ano | findstr /R /C:":18080 .*LISTENING" >nul
  if not errorlevel 1 (
    echo Port 18080 cung dang ban va khong phan hoi nhu backend cua du an.
    echo Vui long dong ung dung dang chiem 18080 hoac cau hinh cong khac.
    exit /b 1
  )
)

cd /d "%BACKEND_DIR%"
if not exist "%BACKEND_JAR%" (
  echo Chua co backend JAR. Dang package backend...
  call mvnw.cmd -DskipTests package
  if errorlevel 1 exit /b 1
)

set "SERVER_PORT=%BACKEND_PORT%"
echo Backend URL: http://localhost:%BACKEND_PORT%
java -jar "%BACKEND_JAR%" --server.port=%BACKEND_PORT%
exit /b %ERRORLEVEL%

:backend_healthy
curl.exe --max-time 3 -s "http://localhost:%~1/api/students/23010690" | findstr /C:"23010690" >nul
if errorlevel 1 exit /b 1
exit /b 0
