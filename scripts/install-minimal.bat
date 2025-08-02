@echo off
:: Installation minimaliste SiteJet
:: Version ultra-robuste

echo SiteJet - Installation Minimaliste
echo ===================================

:: Aller dans le dossier app
if not exist app (
    echo ERREUR: Dossier app manquant
    pause
    exit /b 1
)

echo 1. Acces au dossier app...
cd app

:: Vérifier package.json
if not exist package.json (
    echo ERREUR: package.json manquant
    pause
    exit /b 1
)

echo 2. Installation dependencies...
npm install

:: Vérifier si l'installation a réussi
if %errorlevel% neq 0 (
    echo ERREUR: Installation echouee
    echo.
    echo Solutions possibles:
    echo - Verifiez votre connexion internet
    echo - Essayez: npm cache clean --force
    echo - Essayez: npm install --legacy-peer-deps
    pause
    exit /b 1
)

echo 3. Creation fichier configuration...
echo DATABASE_URL=sqlite:./database.db > .env
echo NODE_ENV=development >> .env
echo PORT=3000 >> .env

echo 4. Initialisation base de donnees...
npm run db:push

echo.
echo ===================================
echo INSTALLATION TERMINEE !
echo ===================================
echo.
echo Demarrage: npm run dev
echo URL: http://localhost:3000
echo.
echo Appuyez sur une touche pour demarrer...
pause >nul

echo.
echo Demarrage de SiteJet...
npm run dev