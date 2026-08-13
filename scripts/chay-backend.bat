@echo off
setlocal
set "PROJECT_ROOT=%~dp0.."
set "RUN_DRIVE="
set "BACKEND_PORT=8080"

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

for %%D in (Z Y X W V U T S R Q P O N M L K J I H G F E) do (
  call :drive_available %%D
  if errorlevel 1 (
    set "RUN_DRIVE=%%D:"
    goto :drive_found
  )
)

echo Khong tim thay drive-letter trong de chay backend.
exit /b 1

:drive_found
subst %RUN_DRIVE% "%PROJECT_ROOT%"
if errorlevel 1 goto :run_without_subst

cd /d %RUN_DRIVE%\backend
set "SERVER_PORT=%BACKEND_PORT%"
echo Backend URL: http://localhost:%BACKEND_PORT%
call mvnw.cmd spring-boot:run
set "EXIT_CODE=%ERRORLEVEL%"

cd /d "%PROJECT_ROOT%"
subst %RUN_DRIVE% /D
exit /b %EXIT_CODE%

:run_without_subst
echo Khong tao duoc drive tam bang subst. Chay backend bang duong dan hien tai.
cd /d "%PROJECT_ROOT%\backend"
set "SERVER_PORT=%BACKEND_PORT%"
echo Backend URL: http://localhost:%BACKEND_PORT%
call mvnw.cmd spring-boot:run
exit /b %ERRORLEVEL%

:drive_available
if exist "%~1:\nul" exit /b 0
exit /b 1

:backend_healthy
curl.exe --max-time 3 -s "http://localhost:%~1/api/students/SV001" | findstr /C:"SV001" >nul
if errorlevel 1 exit /b 1
exit /b 0
