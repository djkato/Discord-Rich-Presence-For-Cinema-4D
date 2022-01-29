@echo off

set Active=0

:Search
timeout /t 60 /nobreak > null

wmic process list brief | find /i "Cinema 4D.exe"
set result=%ERRORLEVEL%
if "%result%"=="0" goto ProcessFound

goto ProcessNotFound

:ProcessFound
IF %Active%==1 goto Search

start node "Rich Presence For C4D.js"
set Active=1

goto Search

:ProcessNotFound

set Active=0
goto Search
