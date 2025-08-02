@echo off
:: ========================================
:: INSTALLATION SIMPLE SITEJET
:: Version robuste sans fioritures
:: ========================================

echo Installation Simple de SiteJet
echo =================================
echo.

:: Vérification Node.js
echo Verification Node.js...
node --version || (
    echo ERREUR: Node.js non trouve
    echo Installez Node.js depuis https://nodejs.org
    pause
    exit /b 1
)

:: Vérification npm
echo Verification npm...
npm --version || (
    echo ERREUR: npm non trouve
    pause
    exit /b 1
)

:: Vérification structure
echo Verification fichiers...
if not exist app\package.json (
    echo ERREUR: Structure SiteJet incorrecte
    echo Assurez-vous d'etre dans le bon dossier
    pause
    exit /b 1
)

:: Installation
echo.
echo Installation des dependances...
cd app
npm install || (
    echo ERREUR: Installation echouee
    pause
    exit /b 1
)

:: Configuration
echo.
echo Configuration...
if exist ..\config\.env.example (
    copy ..\config\.env.example .env >nul
) else (
    echo DATABASE_URL=sqlite:./database.db > .env
    echo NODE_ENV=development >> .env
    echo PORT=3000 >> .env
)

:: Base de données
echo.
echo Initialisation base de donnees...
npm run db:push >nul 2>&1

:: Fin
echo.
echo =================================
echo INSTALLATION TERMINEE !
echo =================================
echo.
echo Pour demarrer : npm run dev
echo Puis ouvrir : http://localhost:3000
echo.
pause