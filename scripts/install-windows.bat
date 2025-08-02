@echo off
:: ========================================
:: SiteJet - Installation Windows Simple
:: Contourne les restrictions PowerShell
:: ========================================

color 0A
title SiteJet Installation

echo.
echo ========================================
echo  SITEJET - INSTALLATION WINDOWS
echo ========================================
echo.

:: Test Node.js
echo [1/5] Verification Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ECHEC: Node.js non installe
    echo Installez depuis: https://nodejs.org
    pause
    exit /b 1
) else (
    for /f %%v in ('node --version 2^>nul') do echo OK: Node.js %%v detecte
)

:: Test npm  
echo [2/5] Verification npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ECHEC: npm non accessible
    pause
    exit /b 1
) else (
    for /f %%v in ('npm --version 2^>nul') do echo OK: npm %%v detecte
)

:: Vérifier structure projet
echo [3/5] Verification structure projet...
if not exist ..\package.json (
    echo ECHEC: package.json manquant - mauvais repertoire
    echo Executez ce script depuis le dossier scripts/
    pause
    exit /b 1
)
cd ..

:: Installation
echo [4/5] Installation dependances...
echo Patientez 2-5 minutes...
npm config set audit false
npm config set fund false
npm install --no-audit --no-fund
if %errorlevel% neq 0 (
    echo Reessai avec options compatibilite...
    npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo ECHEC: Installation impossible
        pause
        exit /b 1
    )
)

:: Configuration
echo [5/5] Configuration...
if exist config\.env.example (
    copy config\.env.example .env >nul
) else (
    echo DATABASE_URL=sqlite:./database.db > .env
    echo NODE_ENV=development >> .env
    echo PORT=3000 >> .env
)
npm run db:push >nul 2>&1

echo.
echo ========================================
echo  INSTALLATION TERMINEE !
echo ========================================
echo.
echo Demarrage:
echo   npm run dev
echo.
echo URL: http://localhost:3000
echo.

set /p START="Demarrer maintenant ? (O/N): "
if /i "%START%" equ "O" (
    echo.
    echo Demarrage de SiteJet...
    npm run dev
) else (
    echo.
    echo Installation terminee.
    pause
)