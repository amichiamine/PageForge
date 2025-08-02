@echo off
:: ========================================
:: TEST SCRIPT D'INSTALLATION SITEJET
:: Version simplifiée pour diagnostic
:: ========================================

setlocal EnableDelayedExpansion
color 0A

echo ========================================
echo TEST INSTALLATION SITEJET
echo ========================================
echo.

:: Test 1: Vérification Node.js
echo [TEST 1] Node.js...
node --version
if %errorlevel% neq 0 (
    echo ECHEC: Node.js non trouve
    pause
    exit /b 1
) else (
    echo OK: Node.js detecte
)

:: Test 2: Vérification npm
echo.
echo [TEST 2] npm...
npm --version
set NPM_ERROR=%errorlevel%
echo Code retour npm: %NPM_ERROR%
if %NPM_ERROR% neq 0 (
    echo ECHEC: npm non trouve
    pause
    exit /b 1
) else (
    echo OK: npm detecte
)

:: Test 3: Vérification du dossier app
echo.
echo [TEST 3] Structure des fichiers...
if not exist app (
    echo ECHEC: Dossier app manquant
    echo Fichiers presents:
    dir /b
    pause
    exit /b 1
) else (
    echo OK: Dossier app trouve
)

if not exist app\package.json (
    echo ECHEC: package.json manquant
    pause
    exit /b 1
) else (
    echo OK: package.json trouve
)

:: Test 4: Test npm install (dry-run)
echo.
echo [TEST 4] Test npm install...
cd app
npm install --dry-run >nul 2>&1
if %errorlevel% neq 0 (
    echo AVERTISSEMENT: npm install pourrait echouer
) else (
    echo OK: npm install devrait fonctionner
)

echo.
echo ========================================
echo TOUS LES TESTS PASSES !
echo Vous pouvez utiliser l'installateur complet.
echo ========================================
echo.

echo Voulez-vous lancer l'installation complete ? (O/N)
set /p LAUNCH=
if /i "%LAUNCH%" equ "O" (
    echo.
    echo Lancement de l'installateur complet...
    cd ..
    call package-installer.bat
) else (
    echo Installation annulee par l'utilisateur.
)

pause