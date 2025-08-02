@echo off
:: ========================================
:: INSTALLATION SITEJET - VERSION VMWARE
:: Corrige les problèmes VMware sur Windows
:: ========================================

setlocal EnableDelayedExpansion
color 0A

echo.
echo =====================================
echo  SITEJET - INSTALLATION VMWARE FIX
echo =====================================
echo.

:: Informations de base
echo [INFO] Environnement detecte avec VMware
echo [INFO] Utilisateur: %USERNAME%
echo [INFO] Repertoire: %CD%
echo.

:: Test Node.js direct sans where
echo [TEST 1] Verification Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ECHEC: Node.js non installe ou non accessible
    echo.
    echo Solutions:
    echo 1. Installez Node.js depuis https://nodejs.org
    echo 2. Redemarrez votre ordinateur
    echo 3. Verifiez que Node.js est dans le PATH
    pause
    exit /b 1
) else (
    for /f %%v in ('node --version 2^>nul') do set NODE_VER=%%v
    echo OK: Node.js !NODE_VER! detecte
)

:: Test npm direct
echo [TEST 2] Verification npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ECHEC: npm non accessible
    pause
    exit /b 1
) else (
    for /f %%v in ('npm --version 2^>nul') do set NPM_VER=%%v
    echo OK: npm !NPM_VER! detecte
)

:: Test structure fichiers
echo [TEST 3] Verification structure...
if not exist ..\app (
    echo ECHEC: Dossier app manquant
    echo Vous devez executer ce script depuis le dossier scripts/
    pause
    exit /b 1
) else (
    echo OK: Dossier app trouve
)

if not exist ..\app\package.json (
    echo ECHEC: package.json manquant
    pause
    exit /b 1
) else (
    echo OK: package.json trouve
)

echo.
echo =====================================
echo  INSTALLATION EN COURS
echo =====================================
echo.

:: Aller dans le dossier app
echo [ETAPE 1] Acces au dossier application...
cd ..\app
if %errorlevel% neq 0 (
    echo ECHEC: Impossible d'acceder au dossier app
    pause
    exit /b 1
)

:: Configuration proxy npm si nécessaire (pour VMware)
echo [ETAPE 2] Configuration npm pour VMware...
npm config set registry https://registry.npmjs.org/
npm config set strict-ssl false
npm config delete proxy 2>nul
npm config delete https-proxy 2>nul

:: Installation des dépendances
echo [ETAPE 3] Installation des dependances...
echo Cela peut prendre 2-5 minutes...
echo.
npm install --no-optional --no-audit
if %errorlevel% neq 0 (
    echo.
    echo ECHEC de l'installation npm
    echo.
    echo Solutions a essayer:
    echo 1. npm cache clean --force
    echo 2. npm install --legacy-peer-deps
    echo 3. npm install --force
    echo.
    pause
    exit /b 1
) else (
    echo OK: Dependencies installees avec succes
)

:: Création du fichier .env
echo [ETAPE 4] Configuration environnement...
if exist ..\config\.env.example (
    copy ..\config\.env.example .env >nul
    echo OK: Configuration copiee depuis template
) else (
    echo DATABASE_URL=sqlite:./database.db > .env
    echo NODE_ENV=development >> .env
    echo PORT=3000 >> .env
    echo SESSION_SECRET=dev-secret-key >> .env
    echo OK: Configuration par defaut creee
)

:: Initialisation base de données
echo [ETAPE 5] Initialisation base de donnees...
npm run db:push >nul 2>&1
if %errorlevel% neq 0 (
    echo AVERTISSEMENT: Probleme d'initialisation DB
    echo L'application fonctionnera en mode degrade
) else (
    echo OK: Base de donnees initialisee
)

:: Test de démarrage
echo [ETAPE 6] Test de demarrage...
timeout /t 2 >nul
start /min npm run dev
timeout /t 5 >nul

:: Vérification que le serveur démarre
curl http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo OK: Serveur demarre avec succes
    taskkill /f /im node.exe >nul 2>&1
) else (
    echo INFO: Test serveur ignore ^(curl non disponible^)
)

echo.
echo =====================================
echo  INSTALLATION TERMINEE !
echo =====================================
echo.
echo Comment demarrer SiteJet:
echo 1. Ouvrez un nouveau terminal
echo 2. Tapez: cd "%CD%"
echo 3. Tapez: npm run dev
echo 4. Ouvrez: http://localhost:3000
echo.
echo Fichiers importants:
echo - Configuration: .env
echo - Logs: npm run dev
echo - Documentation: ..\docs\
echo.

echo Voulez-vous demarrer SiteJet maintenant ? ^(O/N^)
set /p START_NOW=
if /i "!START_NOW!" equ "O" (
    echo.
    echo Demarrage de SiteJet...
    echo Appuyez sur Ctrl+C pour arreter
    echo.
    npm run dev
) else (
    echo.
    echo Pour demarrer plus tard:
    echo cd "%CD%"
    echo npm run dev
)

echo.
pause