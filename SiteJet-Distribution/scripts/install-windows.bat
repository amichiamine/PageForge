@echo off
echo ================================
echo Installation de SiteJet Windows
echo ================================

echo Verification de Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js n'est pas installe !
    echo Veuillez installer Node.js depuis https://nodejs.org
    echo Redemarrez ce script apres installation.
    pause
    exit /b 1
)

echo Node.js detecte : 
node --version

echo Installation des dependances...
cd app
npm install

if %errorlevel% neq 0 (
    echo Erreur lors de l'installation des dependances !
    pause
    exit /b 1
)

echo Configuration de la base de donnees...
copy ..\config\.env.example .env
npm run db:push

if %errorlevel% neq 0 (
    echo Erreur lors de la configuration de la base de donnees !
    pause
    exit /b 1
)

echo.
echo ================================
echo Installation terminee avec succes !
echo ================================
echo.
echo Pour demarrer SiteJet :
echo 1. Ouvrez une invite de commande
echo 2. Allez dans le dossier app\
echo 3. Tapez : npm run dev
echo 4. Ouvrez http://localhost:3000
echo.
pause
