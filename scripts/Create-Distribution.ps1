# ========================================
# SiteJet - Création Package Distribution PowerShell
# Génère un package complet prêt à distribuer
# ========================================

param(
    [string]$OutputPath = "SiteJet-Distribution",
    [switch]$IncludeSource,
    [switch]$Compress,
    [string]$Version = "2.0.0"
)

$ErrorActionPreference = "Stop"
$Host.UI.RawUI.WindowTitle = "SiteJet Distribution Creator"

# Couleurs et fonctions
function Write-Success { param($Message) Write-Host "✅ $Message" -ForegroundColor Green }
function Write-Info { param($Message) Write-Host "ℹ️  $Message" -ForegroundColor Cyan }
function Write-Warning { param($Message) Write-Host "⚠️  $Message" -ForegroundColor Yellow }
function Write-Error { param($Message) Write-Host "❌ $Message" -ForegroundColor Red }
function Write-Step { param($Step, $Message) Write-Host "[$Step] $Message" -ForegroundColor Magenta }

Clear-Host
Write-Host @"

   ██████╗██████╗ ███████╗ █████╗ ████████╗███████╗    ██████╗ ██╗███████╗████████╗
  ██╔════╝██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██╔════╝    ██╔══██╗██║██╔════╝╚══██╔══╝
  ██║     ██████╔╝█████╗  ███████║   ██║   █████╗      ██║  ██║██║███████╗   ██║   
  ██║     ██╔══██╗██╔══╝  ██╔══██║   ██║   ██╔══╝      ██║  ██║██║╚════██║   ██║   
  ╚██████╗██║  ██║███████╗██║  ██║   ██║   ███████╗    ██████╔╝██║███████║   ██║   
   ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝    ╚═════╝ ╚═╝╚══════╝   ╚═╝   

   Création de Package de Distribution SiteJet v$Version
   ==================================================

"@ -ForegroundColor Magenta

try {
    # ========================================
    # 1. VÉRIFICATIONS PRÉALABLES
    # ========================================
    
    Write-Step "1/8" "Vérifications préalables"
    
    # Vérifier la structure du projet
    $requiredFiles = @("package.json", "server", "client", "docs")
    foreach ($file in $requiredFiles) {
        if (-not (Test-Path $file)) {
            throw "Fichier/dossier manquant: $file. Exécutez depuis la racine du projet."
        }
    }
    
    # Lire package.json
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    $projectName = $packageJson.name
    Write-Success "Projet détecté: $projectName v$($packageJson.version)"
    
    # ========================================
    # 2. NETTOYAGE ET PRÉPARATION
    # ========================================
    
    Write-Step "2/8" "Nettoyage et préparation"
    
    # Supprimer ancien package s'il existe
    if (Test-Path $OutputPath) {
        Write-Info "Suppression de l'ancien package..."
        Remove-Item $OutputPath -Recurse -Force
    }
    
    # Créer structure de distribution
    $distDirs = @(
        "$OutputPath",
        "$OutputPath/app",
        "$OutputPath/docs",
        "$OutputPath/scripts", 
        "$OutputPath/config",
        "$OutputPath/examples"
    )
    
    foreach ($dir in $distDirs) {
        New-Item -Path $dir -ItemType Directory -Force | Out-Null
    }
    
    Write-Success "Structure créée: $OutputPath/"
    
    # ========================================
    # 3. BUILD DE PRODUCTION
    # ========================================
    
    Write-Step "3/8" "Compilation de l'application"
    
    Write-Info "Installation des dépendances si nécessaire..."
    if (-not (Test-Path "node_modules")) {
        & npm install --silent
    }
    
    Write-Info "Build de production..."
    & npm run build
    
    if ($LASTEXITCODE -ne 0) {
        throw "Échec du build de production"
    }
    
    Write-Success "Application compilée avec succès"
    
    # ========================================
    # 4. COPIE DES FICHIERS APPLICATION
    # ========================================
    
    Write-Step "4/8" "Copie des fichiers d'application"
    
    # Fichiers essentiels
    $appFiles = @(
        "package.json",
        "package-lock.json", 
        "tsconfig.json",
        "vite.config.ts",
        "tailwind.config.ts",
        "postcss.config.js",
        "drizzle.config.ts",
        "components.json"
    )
    
    foreach ($file in $appFiles) {
        if (Test-Path $file) {
            Copy-Item $file "$OutputPath/app/" -Force
        }
    }
    
    # Dossiers essentiels
    $appDirs = @(
        @{ Src = "dist"; Dest = "$OutputPath/app/dist" },
        @{ Src = "server"; Dest = "$OutputPath/app/server" },
        @{ Src = "client"; Dest = "$OutputPath/app/client" },
        @{ Src = "shared"; Dest = "$OutputPath/app/shared" }
    )
    
    foreach ($dir in $appDirs) {
        if (Test-Path $dir.Src) {
            Copy-Item $dir.Src $dir.Dest -Recurse -Force
            Write-Info "Copié: $($dir.Src) -> $($dir.Dest)"
        }
    }
    
    Write-Success "Fichiers d'application copiés"
    
    # ========================================
    # 5. COPIE DE LA DOCUMENTATION
    # ========================================
    
    Write-Step "5/8" "Copie de la documentation"
    
    # Copier tous les fichiers docs
    Copy-Item "docs/*" "$OutputPath/docs/" -Recurse -Force
    
    # Copier README principal s'il existe
    if (Test-Path "README.md") {
        Copy-Item "README.md" "$OutputPath/"
    }
    
    Write-Success "Documentation copiée"
    
    # ========================================
    # 6. CRÉATION DES SCRIPTS D'INSTALLATION
    # ========================================
    
    Write-Step "6/8" "Création des scripts d'installation"
    
    # Script PowerShell Windows simple
    $windowsPS1 = @"
# SiteJet Installation Script PowerShell
# Version: $Version

Write-Host "SiteJet Installation" -ForegroundColor Green
Write-Host "===================" -ForegroundColor Green

# Test Node.js
try {
    `$nodeVersion = & node --version 2>`$null
    Write-Host "Node.js: `$nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERREUR: Node.js non trouvé" -ForegroundColor Red
    Write-Host "Installez depuis: https://nodejs.org"
    exit 1
}

# Test npm
try {
    `$npmVersion = & npm --version 2>`$null
    Write-Host "npm: `$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "ERREUR: npm non trouvé" -ForegroundColor Red
    exit 1
}

# Installation
Write-Host "Installation des dépendances..." -ForegroundColor Cyan
cd app
npm install --no-audit --no-fund

if (`$LASTEXITCODE -eq 0) {
    Write-Host "Installation réussie !" -ForegroundColor Green
    
    # Configuration
    if (Test-Path "../config/.env.example") {
        Copy-Item "../config/.env.example" ".env" -Force
    } else {
        "DATABASE_URL=sqlite:./database.db" | Out-File .env -Encoding UTF8
        "NODE_ENV=development" | Add-Content .env
        "PORT=3000" | Add-Content .env
    }
    
    # Initialisation DB
    npm run db:push 2>`$null
    
    Write-Host ""
    Write-Host "INSTALLATION TERMINÉE !" -ForegroundColor Green
    Write-Host "Démarrage: npm run dev" -ForegroundColor Yellow
    Write-Host "URL: http://localhost:3000" -ForegroundColor Yellow
} else {
    Write-Host "Erreur d'installation" -ForegroundColor Red
    Write-Host "Essayez: npm install --legacy-peer-deps"
}
"@

    $windowsPS1 | Out-File "$OutputPath/scripts/install-windows.ps1" -Encoding UTF8

    # Script batch de compatibilité
    $windowsBat = @"
@echo off
echo SiteJet Installation Windows
echo ===========================

REM Test PowerShell disponible
powershell -Command "exit 0" >nul 2>&1
if %errorlevel% equ 0 (
    echo Lancement installation PowerShell...
    powershell -ExecutionPolicy Bypass -File "%~dp0install-windows.ps1"
) else (
    echo PowerShell non disponible, installation basique...
    goto :basic_install
)
goto :end

:basic_install
echo Installation basique en cours...
cd app
npm install
if exist ..\config\.env.example copy ..\config\.env.example .env
if not exist .env echo DATABASE_URL=sqlite:./database.db > .env
npm run db:push >nul 2>&1
echo Installation terminee !
echo Demarrage: npm run dev

:end
pause
"@

    $windowsBat | Out-File "$OutputPath/scripts/install-windows.bat" -Encoding ASCII
    
    # Script Linux
    $linuxScript = @"
#!/bin/bash
echo "============================="
echo " SiteJet Installation Linux"
echo "============================="

# Test Node.js
if ! command -v node &> /dev/null; then
    echo "ERREUR: Node.js non installé"
    echo "Installation: sudo apt install nodejs npm"
    exit 1
fi

echo "Node.js: `$(node --version)"
echo "npm: `$(npm --version)"

# Installation
echo "Installation des dépendances..."
cd app
npm install

if [ `$? -eq 0 ]; then
    echo "Installation réussie !"
    
    # Configuration
    if [ -f "../config/.env.example" ]; then
        cp ../config/.env.example .env
    else
        echo "DATABASE_URL=sqlite:./database.db" > .env
        echo "NODE_ENV=development" >> .env
        echo "PORT=3000" >> .env
    fi
    
    # Initialisation DB
    npm run db:push 2>/dev/null
    
    echo ""
    echo "INSTALLATION TERMINÉE !"
    echo "Démarrage: npm run dev"
    echo "URL: http://localhost:3000"
else
    echo "Erreur d'installation"
    echo "Essayez: npm install --legacy-peer-deps"
fi
"@

    $linuxScript | Out-File "$OutputPath/scripts/install-linux.sh" -Encoding UTF8
    
    Write-Success "Scripts d'installation créés"
    
    # ========================================
    # 7. CONFIGURATION ET EXEMPLES
    # ========================================
    
    Write-Step "7/8" "Configuration et exemples"
    
    # Créer .env.example
    $envExample = @"
DATABASE_URL=sqlite:./database.db
NODE_ENV=development
PORT=3000
SESSION_SECRET=dev-secret-key-change-in-production
CORS_ORIGIN=http://localhost:3000
"@
    
    $envExample | Out-File "$OutputPath/config/.env.example" -Encoding UTF8
    
    # README de distribution
    $readmeContent = @"
# SiteJet - Package de Distribution v$Version

## Installation Rapide

### Windows
``````
scripts\install-windows.bat
``````

### Linux/macOS
``````
chmod +x scripts/install-linux.sh
./scripts/install-linux.sh
``````

### Manuel
``````
cd app/
npm install
cp ../config/.env.example .env
npm run db:push
npm run dev
``````

## Après Installation

- **URL locale**: http://localhost:3000
- **Documentation**: Dossier docs/
- **Configuration**: app/.env

## Structure

- **app/** - Application SiteJet complète
- **docs/** - Documentation utilisateur  
- **scripts/** - Scripts d'installation
- **config/** - Fichiers de configuration

## Support

Consultez docs/TROUBLESHOOTING.md pour la résolution de problèmes.

---
SiteJet v$Version - Éditeur visuel de sites web
"@

    $readmeContent | Out-File "$OutputPath/README.md" -Encoding UTF8
    
    # Fichier d'installation simple
    $installTxt = @"
INSTALLATION SITEJET v$Version
=============================

Windows:
1. Double-cliquez sur scripts\install-windows.bat
2. Suivez les instructions à l'écran

Linux/macOS:
1. Ouvrez un terminal
2. cd vers ce dossier
3. chmod +x scripts/install-linux.sh
4. ./scripts/install-linux.sh

Manuel:
1. cd app/
2. npm install
3. cp ../config/.env.example .env
4. npm run db:push
5. npm run dev

URL après installation: http://localhost:3000
"@

    $installTxt | Out-File "$OutputPath/INSTALL.txt" -Encoding UTF8
    
    Write-Success "Configuration créée"
    
    # ========================================
    # 8. FINALISATION
    # ========================================
    
    Write-Step "8/8" "Finalisation du package"
    
    # Calculer la taille
    $totalSize = (Get-ChildItem $OutputPath -Recurse | Measure-Object -Property Length -Sum).Sum
    $sizeMB = [math]::Round($totalSize / 1MB, 2)
    
    Write-Success "Package créé: $OutputPath/ ($sizeMB MB)"
    
    # Compression optionnelle
    if ($Compress) {
        Write-Info "Compression du package..."
        $zipPath = "$OutputPath.zip"
        if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
        
        Compress-Archive -Path "$OutputPath/*" -DestinationPath $zipPath -CompressionLevel Optimal
        $zipSize = [math]::Round((Get-Item $zipPath).Length / 1KB, 0)
        
        Write-Success "Archive créée: $zipPath ($zipSize KB)"
    }
    
    # Récapitulatif
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host " PACKAGE DISTRIBUTION CRÉÉ AVEC SUCCÈS" -ForegroundColor Green  
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    Write-Info "Contenu du package:"
    Write-Host "- Application compilée: app/ ($([math]::Round((Get-ChildItem "$OutputPath/app" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB, 1)) MB)"
    Write-Host "- Documentation: docs/ ($([math]::Round((Get-ChildItem "$OutputPath/docs" -Recurse | Measure-Object -Property Length -Sum).Sum / 1KB, 0)) KB)"
    Write-Host "- Scripts installation: scripts/"
    Write-Host "- Configuration: config/"
    
    Write-Host ""
    Write-Info "Fichiers d'installation:"
    Write-Host "- Windows: scripts\install-windows.bat"
    Write-Host "- Linux: scripts/install-linux.sh"
    Write-Host "- Manuel: Voir README.md"
    
    Write-Host ""
    Write-Host "Package prêt à distribuer dans: $OutputPath/" -ForegroundColor Yellow
    
} catch {
    Write-Error "Erreur lors de la création: $($_.Exception.Message)"
    exit 1
}

Write-Host ""
Write-Host "Création de distribution terminée." -ForegroundColor Magenta