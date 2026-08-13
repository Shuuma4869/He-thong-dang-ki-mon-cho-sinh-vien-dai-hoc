@echo off
setlocal

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
if not exist node_modules (
  echo Dang cai dependency frontend...
  call npm install
  if errorlevel 1 exit /b 1
)
npm run dev
exit /b %ERRORLEVEL%
