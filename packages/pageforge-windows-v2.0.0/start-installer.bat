@echo off
title PageForge - Installation Windows
cls
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🚀 PAGEFORGE v2.0.0                      ║
echo ║                Installation Automatisée Windows             ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Vérifier PHP
php --version >nul 2>&1
if errorlevel 1 (
    echo ❌ PHP non trouvé
    echo.
    echo Installez PHP depuis : https://windows.php.net/
    echo Ou utilisez XAMPP : https://www.apachefriends.org/
    echo.
    pause
    exit /b 1
)

echo ✅ PHP détecté
echo.

REM Démarrer l'installateur web
echo 🌐 Démarrage de l'installateur web...
echo.
echo Ouvrez votre navigateur sur : http://localhost:8000/install.php
echo.
echo Pour arrêter l'installateur, fermez cette fenêtre.
echo.

php -S localhost:8000
pause
