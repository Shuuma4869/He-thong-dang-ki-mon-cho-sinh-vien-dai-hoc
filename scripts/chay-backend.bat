@echo off
setlocal
set "PROJECT_ROOT=%~dp0.."
set "BACKEND_DIR=%PROJECT_ROOT%\backend"
set "BACKEND_JAR=target\course-registration-0.0.1-SNAPSHOT.jar"
set "BACKEND_PORT=8080"

call :check_java_21
if errorlevel 1 exit /b 1

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
