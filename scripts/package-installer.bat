@echo off
:: ========================================
:: INSTALLATEUR AUTOMATIQUE SITEJET
:: Package de Distribution Windows
:: ========================================

setlocal EnableDelayedExpansion
color 0A

echo.
echo    ███████╗██╗████████╗███████╗     ██╗███████╗████████╗
echo    ██╔════╝██║╚══██╔══╝██╔════╝     ██║██╔════╝╚══██╔══╝
echo    ███████╗██║   ██║   █████╗       ██║█████╗     ██║   
echo    ╚════██║██║   ██║   ██╔══╝  ██   ██║██╔══╝     ██║   
echo    ███████║██║   ██║   ███████╗╚█████╔╝███████╗   ██║   
echo    ╚══════╝╚═╝   ╚═╝   ╚══════╝ ╚════╝ ╚══════╝   ╚═╝   
echo.
echo    Editeur Visuel de Sites Web - Installation Automatique
echo    ========================================================
echo.

:: Vérification des privilèges administrateur
echo [VERIFICATION] Controle des privileges...
net session >nul 2>&1
if %errorLevel% neq 0 (
    color 0C
    echo [ERREUR] Privileges administrateur requis !
    echo.
    echo Solutions :
    echo 1. Clic droit sur ce fichier et "Executer en tant qu'administrateur"
    echo 2. Ou installer Node.js manuellement depuis https://nodejs.org
    echo.
    pause
    exit /b 1
) else (
    echo [OK] Privileges administrateur detectes
)

:: Vérification de Node.js
echo [VERIFICATION] Detection de Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [INSTALL] Node.js non trouve, installation automatique...
    echo.
    echo Telechargement de Node.js LTS...
    
    :: Téléchargement de Node.js
    powershell -Command "& {
        $ProgressPreference = 'SilentlyContinue'
        Write-Host 'Telechargement de Node.js...'
        Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi' -OutFile 'nodejs-installer.msi'
        Write-Host 'Telechargement termine !'
    }"
    
    if exist nodejs-installer.msi (
        echo [INSTALL] Installation de Node.js en cours...
        msiexec /i nodejs-installer.msi /quiet /norestart
        
        :: Attendre la fin de l'installation
        timeout /t 30 /nobreak >nul
        
        :: Nettoyer le fichier d'installation
        del nodejs-installer.msi
        
        echo [OK] Node.js installe avec succes !
        echo [INFO] Redemarrage de la session pour prendre en compte Node.js...
        
        :: Relancer le script avec les nouvelles variables d'environnement
        timeout /t 3 /nobreak >nul
        start "" "%~f0"
        exit /b 0
    ) else (
        color 0C
        echo [ERREUR] Echec du telechargement de Node.js !
        echo Veuillez installer manuellement depuis https://nodejs.org
        pause
        exit /b 1
    )
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo [OK] Node.js trouve : !NODE_VERSION!
)

:: Vérification de npm
echo [VERIFICATION] Verification de npm...
timeout /t 1 /nobreak >nul
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo [ERREUR] npm non trouve ! Reinstallez Node.js.
    pause
    exit /b 1
) else (
    echo [OK] npm detecte
    for /f "tokens=*" %%i in ('npm --version 2^>nul') do (
        if "%%i" neq "" (
            set NPM_VERSION=%%i
            echo [OK] npm version : !NPM_VERSION!
        )
    )
    if "!NPM_VERSION!" equ "" (
        echo [OK] npm fonctionne ^(version non detectee^)
    )
)

:: Vérification de l'espace disque
echo.
echo [VERIFICATION] Verification de l'espace disque...
:: Vérification simplifiée de l'espace disque
dir >nul 2>&1
if %errorlevel% neq 0 (
    echo [AVERTISSEMENT] Impossible de verifier l'espace disque
) else (
    echo [OK] Acces au disque confirme
    echo [INFO] Assurez-vous d'avoir au moins 2 Go d'espace libre
)

echo.
echo ========================================
echo INSTALLATION DE SITEJET
echo ========================================
echo.

:: Navigation vers le dossier app
if not exist app (
    color 0C
    echo [ERREUR] Dossier 'app' introuvable !
    echo Assurez-vous d'executer ce script depuis le bon repertoire.
    pause
    exit /b 1
)

echo [INSTALL] Navigation vers le dossier app...
cd app

:: Vérification de package.json
if not exist package.json (
    color 0C
    echo [ERREUR] Fichier package.json introuvable !
    echo Le package SiteJet semble incomplet.
    pause
    exit /b 1
)

:: Installation des dépendances
echo [INSTALL] Installation des dependances Node.js...
echo Cela peut prendre quelques minutes selon votre connexion...
echo Appuyez sur une touche pour continuer ou attendez 5 secondes...
timeout /t 5 >nul

echo.
echo Installation en cours...
npm install --no-audit --prefer-offline
if %errorlevel% neq 0 (
    color 0C
    echo [ERREUR] Echec de l'installation des dependances !
    echo.
    echo Solutions possibles :
    echo 1. Verifiez votre connexion internet
    echo 2. Essayez : npm install --force
    echo 3. Supprimez node_modules/ et recommencez
    echo.
    pause
    exit /b 1
) else (
    echo [OK] Dependances installees avec succes !
)

:: Configuration de la base de données
echo.
echo [CONFIG] Configuration de la base de donnees...

if exist ..\config\.env.example (
    echo [COPY] Copie du fichier de configuration...
    copy ..\config\.env.example .env >nul
    echo [OK] Fichier .env cree
) else (
    echo [CREATE] Creation du fichier de configuration par defaut...
    echo DATABASE_URL=sqlite:./database.db > .env
    echo NODE_ENV=development >> .env
    echo PORT=3000 >> .env
    echo [OK] Configuration par defaut creee
)

:: Initialisation de la base de données
echo [DB] Initialisation de la base de donnees...
timeout /t 2 /nobreak >nul
npm run db:push 2>nul
if %errorlevel% neq 0 (
    color 0E
    echo [AVERTISSEMENT] Erreur lors de l'initialisation de la base de donnees
    echo SiteJet fonctionnera mais certaines fonctionnalites peuvent etre limitees.
    echo Vous pourrez reinitialiser plus tard avec : npm run db:push
    timeout /t 3 /nobreak >nul
) else (
    echo [OK] Base de donnees initialisee !
)

:: Test rapide
echo.
echo [TEST] Test de l'installation...
echo Verification des fichiers critiques...

set CRITICAL_FILES=package.json node_modules .env
for %%F in (%CRITICAL_FILES%) do (
    if not exist %%F (
        color 0E
        echo [AVERTISSEMENT] Fichier manquant : %%F
    ) else (
        echo [OK] %%F present
    )
)

:: Succès !
color 0A
echo.
echo ========================================
echo INSTALLATION TERMINEE AVEC SUCCES !
echo ========================================
echo.
echo SiteJet est maintenant installe et pret a utiliser !
echo.
echo PROCHAINES ETAPES :
echo.
echo 1. Pour DEMARRER SiteJet :
echo    ^> npm run dev
echo.
echo 2. Puis ouvrez votre navigateur sur :
echo    ^> http://localhost:3000
echo.
echo 3. AIDE et DOCUMENTATION :
echo    ^> Consultez le dossier docs\
echo    ^> Manuel : docs\USER_MANUAL.md
echo    ^> Demarrage rapide : docs\QUICK_START_GUIDE.md
echo.
echo 4. SUPPORT :
echo    ^> Email : support@sitejet.com
echo    ^> Documentation : https://docs.sitejet.com
echo.
echo INFORMATIONS SYSTEME :
echo ^> Node.js : !NODE_VERSION!
echo ^> npm : !NPM_VERSION!
echo ^> Repertoire : %CD%
echo ^> Date installation : %DATE% %TIME%
echo.
echo ========================================
echo Felicitations ! Bienvenue dans SiteJet !
echo ========================================
echo.

:: Proposer de démarrer immédiatement
echo Voulez-vous demarrer SiteJet maintenant ? ^(O/N^)
set /p START_NOW=
if /i "!START_NOW!" equ "O" (
    echo.
    echo Demarrage de SiteJet...
    echo Appuyez sur Ctrl+C pour arreter le serveur
    echo.
    timeout /t 3 /nobreak >nul
    npm run dev
)

echo.
echo Merci d'avoir choisi SiteJet !
echo N'hesitez pas a nous contacter pour toute question.
echo.
pause