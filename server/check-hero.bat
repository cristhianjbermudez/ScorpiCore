@echo off
chcp 65001 >nul
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -padmin scorpicore --default-character-set=utf8mb4 -e "SELECT content FROM site_settings WHERE section_key='hero'" 2>nul
