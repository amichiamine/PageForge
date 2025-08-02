# ========================================
# SiteJet - Test et Diagnostic PowerShell
# Validation complète de l'environnement
# ========================================

param(
    [switch]$Detailed,
    [switch]$FixIssues
)

$ErrorActionPreference = "Continue"
$Host.UI.RawUI.WindowTitle = "SiteJet Diagnostic"

# Couleurs et fonctions
function Write-TestResult { 
    param($Name, $Status, $Details = "")
    $icon = if ($Status -eq "OK") { "✅" } else { "❌" }
    $color = if ($Status -eq "OK") { "Green" } else { "Red" }
    Write-Host "$icon $Name" -ForegroundColor $color
    if ($Details) { Write-Host "   $Details" -ForegroundColor Gray }
}

function Write-Section { param($Title) Write-Host "`n=== $Title ===" -ForegroundColor Cyan }

Clear-Host
Write-Host @"

████████╗███████╗███████╗████████╗    ███████╗██╗████████╗███████╗     ██╗███████╗████████╗
╚══██╔══╝██╔════╝██╔════╝╚══██╔══╝    ██╔════╝██║╚══██╔══╝██╔════╝     ██║██╔════╝╚══██╔══╝
   ██║   █████╗  ███████╗   ██║       ███████╗██║   ██║   █████╗       ██║█████╗     ██║   
   ██║   ██╔══╝  ╚════██║   ██║       ╚════██║██║   ██║   ██╔══╝  ██   ██║██╔══╝     ██║   
   ██║   ███████╗███████║   ██║       ███████║██║   ██║   ███████╗╚█████╔╝███████╗   ██║   
   ╚═╝   ╚══════╝╚══════╝   ╚═╝       ╚══════╝╚═╝   ╚═╝   ╚══════╝ ╚════╝ ╚══════╝   ╚═╝   

   Test et Diagnostic Complet
   =========================

"@ -ForegroundColor Magenta

$results = @{}

# ========================================
# INFORMATIONS SYSTÈME
# ========================================

Write-Section "Informations Système"

$osInfo = Get-CimInstance -ClassName Win32_OperatingSystem
$cpuInfo = Get-CimInstance -ClassName Win32_Processor | Select-Object -First 1
$memInfo = Get-CimInstance -ClassName Win32_PhysicalMemory | Measure-Object -Property Capacity -Sum

Write-Host "OS: $($osInfo.Caption) ($($osInfo.OSArchitecture))" -ForegroundColor Gray
Write-Host "CPU: $($cpuInfo.Name)" -ForegroundColor Gray
Write-Host "RAM: $([math]::Round($memInfo.Sum / 1GB, 1)) GB" -ForegroundColor Gray
Write-Host "PowerShell: $($PSVersionTable.PSVersion)" -ForegroundColor Gray
Write-Host "Utilisateur: $env:USERNAME" -ForegroundColor Gray
Write-Host "Répertoire: $PWD" -ForegroundColor Gray

# ========================================
# TEST NODE.JS
# ========================================

Write-Section "Test Node.js"

try {
    $nodeVersion = & node --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-TestResult "Node.js" "OK" $nodeVersion
        $results.NodeJS = "OK"
        
        # Test des modules Node.js intégrés
        if ($Detailed) {
            try {
                $nodeModules = & node -e "console.log(Object.keys(process.binding('natives')).length)" 2>$null
                Write-TestResult "Modules Node.js" "OK" "$nodeModules modules intégrés"
            } catch {
                Write-TestResult "Modules Node.js" "WARNING" "Impossible de vérifier"
            }
        }
    } else {
        Write-TestResult "Node.js" "ECHEC" "Non installé ou inaccessible"
        $results.NodeJS = "ECHEC"
    }
} catch {
    Write-TestResult "Node.js" "ECHEC" $_.Exception.Message
    $results.NodeJS = "ECHEC"
}

# ========================================
# TEST NPM
# ========================================

Write-Section "Test npm"

try {
    $npmVersion = & npm --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-TestResult "npm" "OK" "Version $npmVersion"
        $results.npm = "OK"
        
        # Test configuration npm
        if ($Detailed) {
            try {
                $registry = & npm config get registry 2>$null
                Write-TestResult "npm registry" "OK" $registry
                
                $cache = & npm config get cache 2>$null
                Write-TestResult "npm cache" "OK" $cache
            } catch {
                Write-TestResult "npm config" "WARNING" "Impossible de vérifier la config"
            }
        }
        
        # Test connectivité npm
        try {
            $ping = & npm ping 2>$null
            if ($ping -match "pong") {
                Write-TestResult "npm connectivité" "OK" "Registry accessible"
            } else {
                Write-TestResult "npm connectivité" "WARNING" "Registry peut être inaccessible"
            }
        } catch {
            Write-TestResult "npm connectivité" "WARNING" "Test de connectivité échoué"
        }
        
    } else {
        Write-TestResult "npm" "ECHEC" "Non accessible"
        $results.npm = "ECHEC"
    }
} catch {
    Write-TestResult "npm" "ECHEC" $_.Exception.Message
    $results.npm = "ECHEC"
}

# ========================================
# TEST STRUCTURE FICHIERS
# ========================================

Write-Section "Test Structure de Fichiers"

$requiredPaths = @(
    @{ Path = "../package.json"; Name = "package.json racine" },
    @{ Path = "../server"; Name = "Dossier server" },
    @{ Path = "../client"; Name = "Dossier client" },
    @{ Path = "../docs"; Name = "Documentation" }
)

foreach ($item in $requiredPaths) {
    if (Test-Path $item.Path) {
        Write-TestResult $item.Name "OK" "Trouvé"
        $results[$item.Name] = "OK"
    } else {
        Write-TestResult $item.Name "ECHEC" "Manquant: $($item.Path)"
        $results[$item.Name] = "ECHEC"
    }
}

# Analyse package.json si présent
if (Test-Path "../package.json") {
    try {
        $packageJson = Get-Content "../package.json" | ConvertFrom-Json
        Write-TestResult "package.json valide" "OK" "Version: $($packageJson.version)"
        
        if ($packageJson.scripts.dev) {
            Write-TestResult "Script dev" "OK" $packageJson.scripts.dev
        } else {
            Write-TestResult "Script dev" "WARNING" "Script de démarrage manquant"
        }
    } catch {
        Write-TestResult "package.json valide" "ECHEC" "Fichier corrompu"
    }
}

# ========================================
# TEST ESPACE DISQUE
# ========================================

Write-Section "Test Espace Disque"

try {
    $drive = Get-PSDrive -Name C
    $freeGB = [math]::Round($drive.Free / 1GB, 2)
    $totalGB = [math]::Round(($drive.Used + $drive.Free) / 1GB, 2)
    
    if ($freeGB -gt 2) {
        Write-TestResult "Espace disque" "OK" "$freeGB GB libres sur $totalGB GB"
    } else {
        Write-TestResult "Espace disque" "WARNING" "Seulement $freeGB GB libres (recommandé: 2+ GB)"
    }
} catch {
    Write-TestResult "Espace disque" "WARNING" "Impossible de vérifier"
}

# ========================================
# TEST PORTS RÉSEAU
# ========================================

Write-Section "Test Ports Réseau"

$ports = @(3000, 8000, 5000)
foreach ($port in $ports) {
    try {
        $connection = Test-NetConnection -ComputerName localhost -Port $port -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
        if ($connection.TcpTestSucceeded) {
            Write-TestResult "Port $port" "WARNING" "Occupé (peut causer des conflits)"
        } else {
            Write-TestResult "Port $port" "OK" "Disponible"
        }
    } catch {
        Write-TestResult "Port $port" "OK" "Probablement disponible"
    }
}

# ========================================
# TEST INSTALLATION SITEJET
# ========================================

Write-Section "Test Installation SiteJet"

if (Test-Path "../node_modules") {
    $moduleCount = (Get-ChildItem "../node_modules" -Directory -ErrorAction SilentlyContinue).Count
    if ($moduleCount -gt 0) {
        Write-TestResult "Dépendances installées" "OK" "$moduleCount modules"
    } else {
        Write-TestResult "Dépendances installées" "ECHEC" "Dossier node_modules vide"
    }
} else {
    Write-TestResult "Dépendances installées" "ECHEC" "npm install requis"
}

if (Test-Path "../.env") {
    Write-TestResult "Configuration .env" "OK" "Fichier présent"
} else {
    Write-TestResult "Configuration .env" "WARNING" "Fichier de configuration manquant"
}

# ========================================
# RÉSUMÉ ET RECOMMANDATIONS
# ========================================

Write-Section "Résumé du Diagnostic"

$okCount = ($results.Values | Where-Object { $_ -eq "OK" }).Count
$totalTests = $results.Count

Write-Host ""
if ($okCount -eq $totalTests) {
    Write-Host "🎉 Tous les tests réussis ! SiteJet est prêt." -ForegroundColor Green
    Write-Host ""
    Write-Host "Pour installer et démarrer:" -ForegroundColor Cyan
    Write-Host ".\Install-SiteJet.ps1" -ForegroundColor Yellow
} else {
    Write-Host "⚠️  $okCount/$totalTests tests réussis. Problèmes détectés." -ForegroundColor Yellow
    Write-Host ""
    
    if ($results.NodeJS -eq "ECHEC" -or $results.npm -eq "ECHEC") {
        Write-Host "🔧 Actions requises:" -ForegroundColor Red
        Write-Host "1. Installez Node.js depuis https://nodejs.org" -ForegroundColor Yellow
        Write-Host "2. Redémarrez votre ordinateur" -ForegroundColor Yellow
        Write-Host "3. Relancez ce test" -ForegroundColor Yellow
    } else {
        Write-Host "🔧 Vous pouvez continuer l'installation:" -ForegroundColor Cyan
        Write-Host ".\Install-SiteJet.ps1" -ForegroundColor Yellow
    }
}

# Option de correction automatique
if ($FixIssues -and ($results.NodeJS -eq "ECHEC" -or $results.npm -eq "ECHEC")) {
    Write-Host ""
    Write-Host "🛠️  Tentative de correction automatique..." -ForegroundColor Cyan
    
    # Vérifier si chocolatey est disponible pour installation automatique
    try {
        $choco = Get-Command choco -ErrorAction SilentlyContinue
        if ($choco) {
            Write-Host "Installation Node.js via Chocolatey..."
            & choco install nodejs -y
            Write-Host "Redémarrez votre terminal et relancez le test."
        } else {
            Write-Host "Installez Chocolatey puis relancez avec -FixIssues"
            Write-Host "https://chocolatey.org/install"
        }
    } catch {
        Write-Host "Correction automatique non disponible. Installation manuelle requise."
    }
}

Write-Host ""
Write-Host "Test terminé. Consultez docs/TROUBLESHOOTING.md pour l'aide." -ForegroundColor Magenta