@echo off
:: ──────────────────────────────────────────────────────────────
::  setup.bat  – instalador 1-clic
::  • Copia mp3_api.exe a  C:\Program Files\YouTubeMP3Server
::  • Crea acceso directo en Inicio (arranca con Windows)
::  • Lanza el servidor inmediatamente
:: ──────────────────────────────────────────────────────────────

rem — auto-elevación a administrador —
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Solicitando permisos de administrador…
    powershell -Command "Start-Process -FilePath \"%~f0\" -Verb RunAs"
    exit /b
)

rem — rutas —
set "SRC=%~dp0"
set "TARGET=%ProgramFiles%\YouTubeMP3Server"

rem — copiar ejecutable —
if not exist "%TARGET%" mkdir "%TARGET%"
copy /Y "%SRC%mp3_api.exe" "%TARGET%" >nul

rem — acceso directo en carpeta Inicio —
powershell -NoProfile -Command ^
 "$lnk=\"$Env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup\YouTubeMP3.lnk\";" ^
 "$s=(New-Object -ComObject WScript.Shell).CreateShortcut($lnk);" ^
 "$s.TargetPath='%TARGET%\\mp3_api.exe';" ^
 "$s.WorkingDirectory='%TARGET%';" ^
 "$s.WindowStyle=7;$s.Save()"

rem — lanzar backend ahora mismo —
start "" "%TARGET%\mp3_api.exe"

echo.
echo 1) Servidor iniciado correctamente.
echo 2) Abre Chrome  →  chrome://extensions
echo 3) Activa “Modo desarrollador” y arrastra la carpeta 'extension'.
echo.
pause
