@echo off
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -padmin scorpicore < "C:\Proyectos\ScorpiCore\server\update-copy.sql"
echo Done!
pause
