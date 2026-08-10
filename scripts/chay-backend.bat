@echo off
setlocal
set "PROJECT_ROOT=%~dp0.."
set "RUN_DRIVE="
set "BACKEND_PORT=8080"

netstat -ano | findstr /R /C:":8080 .*LISTENING" >nul
if not errorlevel 1 (
  echo Port 8080 dang ban. Backend se chay tam tren port 18080.
  set "BACKEND_PORT=18080"
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
if errorlevel 1 exit /b 1

cd /d %RUN_DRIVE%\backend
set "SERVER_PORT=%BACKEND_PORT%"
echo Backend URL: http://localhost:%BACKEND_PORT%
call mvnw.cmd spring-boot:run
set "EXIT_CODE=%ERRORLEVEL%"

cd /d "%PROJECT_ROOT%"
subst %RUN_DRIVE% /D
exit /b %EXIT_CODE%

:drive_available
if exist "%~1:\nul" exit /b 0
exit /b 1
