@echo off
setlocal
cd /d "%~dp0..\frontend"
if not exist node_modules (
  echo Dang cai dependency frontend...
  call npm install
  if errorlevel 1 exit /b 1
)
npm run dev
