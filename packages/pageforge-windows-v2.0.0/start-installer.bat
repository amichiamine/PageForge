@echo off
echo PageForge - Demarrage Windows
echo ================================

REM Verifier PHP
php --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: PHP non trouve
    echo Installez PHP depuis https://windows.php.net/
    pause
    exit /b
)

REM Demarrer l'installateur
echo Demarrage de l'installateur...
echo Ouvrez votre navigateur sur: http://localhost:8000/install.php
php -S localhost:8000
pause
