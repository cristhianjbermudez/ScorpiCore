@echo off
chcp 65001 >nul
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -padmin scorpicore -e "SELECT section_key, LEFT(content, 100) FROM site_settings WHERE section_key='hero'"
