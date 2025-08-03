@echo off
setlocal enabledelayedexpansion
set ROOT=%~dp0
cd /d %ROOT%

echo 🔁 啟動 MongoDB...
start "" "%ROOT%mongodb\bin\mongod.exe" --dbpath "%ROOT%mongodb\data" --logpath "%ROOT%mongodb\log\mongo.log" --logappend --port 27017
timeout /t 5 >nul

echo 🚀 啟動後端...
cd backend
call npm install
call node seed.js
start cmd /k "npm run dev"
cd ..

echo 🎨 啟動前端...
cd frontend
call npm install
start cmd /k "npm run dev"
cd ..

echo ✅ 所有服務已啟動，請開啟 http://localhost:5173
pause
