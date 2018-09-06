@echo off

set DIR=%~dp0
set NODE_MODULES=%DIR%\node_modules

if not exist %NODE_MODULES% (
	echo Installing dependencies...
	call npm install
)

start "Castle Wars" cmd /C call node .\server.js

start "" "http://localhost"