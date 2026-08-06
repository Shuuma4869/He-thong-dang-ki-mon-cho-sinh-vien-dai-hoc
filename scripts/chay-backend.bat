@echo off
setlocal
set "PROJECT_ROOT=%~dp0.."
set "RUN_DRIVE="

for %%D in (Z Y X W V U T S R Q P O N M L K J I H G F E) do (
  if not exist %%D:\nul (
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
call mvnw.cmd spring-boot:run
set "EXIT_CODE=%ERRORLEVEL%"

cd /d "%PROJECT_ROOT%"
subst %RUN_DRIVE% /D
exit /b %EXIT_CODE%
