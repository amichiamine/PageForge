<?php
/**
 * 🚀 GÉNÉRATEUR DE PACKAGES PAGEFORGE
 * 
 * Crée automatiquement les packages de déploiement pour tous les environnements
 * - Package cPanel (hébergement web)
 * - Package Windows (installation locale)
 * - Package Linux (installation locale) 
 * - Package VS Code (développement)
 */

class PageForgePackageGenerator {
    private $version = '2.0.0';
    private $baseDir;
    private $packagesDir;
    
    public function __construct() {
        $this->baseDir = dirname(__DIR__);
        $this->packagesDir = $this->baseDir . '/packages';
        
        // Créer le dossier packages
        if (!is_dir($this->packagesDir)) {
            mkdir($this->packagesDir, 0755, true);
        }
    }
    
    public function generateAllPackages() {
        echo "🚀 Génération des packages PageForge v{$this->version}\n";
        echo "=" . str_repeat("=", 50) . "\n\n";
        
        try {
            $this->generateCPanelPackage();
            $this->generateWindowsPackage();
            $this->generateLinuxPackage();
            $this->generateVSCodePackage();
            
            echo "\n✅ TOUS LES PACKAGES GÉNÉRÉS AVEC SUCCÈS !\n";
            echo "📁 Dossier: " . realpath($this->packagesDir) . "\n\n";
            
            $this->showPackageSummary();
            
        } catch (Exception $e) {
            echo "❌ Erreur: " . $e->getMessage() . "\n";
            exit(1);
        }
    }
    
    private function generateCPanelPackage() {
        echo "📦 Génération package cPanel...\n";
        
        $packageDir = $this->packagesDir . '/pageforge-cpanel-v' . $this->version;
        $this->createCleanDirectory($packageDir);
        
        // Copier les fichiers essentiels
        $this->copyProjectFiles($packageDir, 'production');
        
        // Installateur cPanel
        copy($this->baseDir . '/install-interactive.php', $packageDir . '/install.php');
        
        // Documentation
        copy($this->baseDir . '/README_INSTALLATION_CPANEL.md', $packageDir . '/README.md');
        
        // Fichier d'information
        $this->createPackageInfo($packageDir, 'cPanel', [
            'type' => 'Hébergement web cPanel',
            'requirements' => 'PHP 7.4+, MySQL/PostgreSQL',
            'installation' => 'Interface web interactive',
            'features' => [
                'Installation sans ligne de commande',
                'Configuration automatique base de données',
                'Interface responsive moderne',
                'Nettoyage automatique post-installation'
            ]
        ]);
        
        // Instructions rapides
        file_put_contents($packageDir . '/INSTALLATION.txt', $this->getCPanelInstructions());
        
        // Créer l'archive ZIP
        $this->createZipArchive($packageDir, 'pageforge-cpanel-v' . $this->version . '.zip');
        
        echo "✅ Package cPanel créé\n";
    }
    
    private function generateWindowsPackage() {
        echo "📦 Génération package Windows...\n";
        
        $packageDir = $this->packagesDir . '/pageforge-windows-v' . $this->version;
        $this->createCleanDirectory($packageDir);
        
        // Copier les fichiers essentiels
        $this->copyProjectFiles($packageDir, 'local');
        
        // Installateur local (universel)
        copy($this->baseDir . '/install-local.php', $packageDir . '/install.php');
        
        // Documentation Windows
        copy($this->baseDir . '/README_INSTALLATION_LOCALE.md', $packageDir . '/README.md');
        
        // Script de démarrage Windows
        $this->createWindowsStartScript($packageDir);
        
        // Fichier d'information
        $this->createPackageInfo($packageDir, 'Windows', [
            'type' => 'Installation locale Windows',
            'requirements' => 'PHP 7.4+, Node.js 18+',
            'installation' => 'Interface web PHP',
            'features' => [
                'Détection automatique Windows',
                'Installation Node.js guidée',
                'Configuration SQLite/PostgreSQL',
                'Script de démarrage inclus'
            ]
        ]);
        
        // Instructions Windows
        file_put_contents($packageDir . '/WINDOWS-INSTALL.txt', $this->getWindowsInstructions());
        
        // Créer l'archive ZIP
        $this->createZipArchive($packageDir, 'pageforge-windows-v' . $this->version . '.zip');
        
        echo "✅ Package Windows créé\n";
    }
    
    private function generateLinuxPackage() {
        echo "📦 Génération package Linux...\n";
        
        $packageDir = $this->packagesDir . '/pageforge-linux-v' . $this->version;
        $this->createCleanDirectory($packageDir);
        
        // Copier les fichiers essentiels
        $this->copyProjectFiles($packageDir, 'local');
        
        // Installateur local (universel)
        copy($this->baseDir . '/install-local.php', $packageDir . '/install.php');
        
        // Documentation
        copy($this->baseDir . '/README_INSTALLATION_LOCALE.md', $packageDir . '/README.md');
        
        // Script de démarrage Linux
        $this->createLinuxStartScript($packageDir);
        
        // Fichier d'information
        $this->createPackageInfo($packageDir, 'Linux', [
            'type' => 'Installation locale Linux/macOS',
            'requirements' => 'PHP 7.4+, Node.js 18+',
            'installation' => 'Interface web PHP',
            'features' => [
                'Compatible toutes distributions Linux',
                'Support macOS inclus',
                'Installation Node.js automatique',
                'Scripts shell optimisés'
            ]
        ]);
        
        // Instructions Linux
        file_put_contents($packageDir . '/LINUX-INSTALL.txt', $this->getLinuxInstructions());
        
        // Créer l'archive TAR.GZ (plus commun sur Linux)
        $this->createTarArchive($packageDir, 'pageforge-linux-v' . $this->version . '.tar.gz');
        
        echo "✅ Package Linux créé\n";
    }
    
    private function generateVSCodePackage() {
        echo "📦 Génération package VS Code...\n";
        
        $packageDir = $this->packagesDir . '/pageforge-vscode-v' . $this->version;
        $this->createCleanDirectory($packageDir);
        
        // Copier les fichiers de développement
        $this->copyProjectFiles($packageDir, 'development');
        
        // Installateur VS Code
        copy($this->baseDir . '/install-vscode.php', $packageDir . '/setup.php');
        
        // Documentation développement
        copy($this->baseDir . '/README_VSCODE_SETUP.md', $packageDir . '/README.md');
        
        // Configuration VS Code préparée
        $this->createVSCodeConfigs($packageDir);
        
        // Fichier d'information
        $this->createPackageInfo($packageDir, 'VS Code', [
            'type' => 'Environnement de développement VS Code',
            'requirements' => 'PHP 7.4+, Node.js 18+, VS Code, Git',
            'installation' => 'Configuration automatique développement',
            'features' => [
                'Configuration VS Code complète',
                'Debug client/serveur intégré',
                'Extensions recommandées',
                'Snippets personnalisés PageForge',
                'Structure projet professionnelle'
            ]
        ]);
        
        // Guide développement
        file_put_contents($packageDir . '/DEVELOPMENT.txt', $this->getVSCodeInstructions());
        
        // Créer l'archive ZIP
        $this->createZipArchive($packageDir, 'pageforge-vscode-v' . $this->version . '.zip');
        
        echo "✅ Package VS Code créé\n";
    }
    
    private function copyProjectFiles($targetDir, $type) {
        // Créer la structure de base
        $this->createProjectStructure($targetDir);
        
        // Copier les fichiers selon le type
        switch ($type) {
            case 'production':
                $this->copyProductionFiles($targetDir);
                break;
            case 'local':
                $this->copyLocalFiles($targetDir);
                break;
            case 'development':
                $this->copyDevelopmentFiles($targetDir);
                break;
        }
    }
    
    private function createProjectStructure($targetDir) {
        $dirs = [
            'client',
            'client/src',
            'client/src/components',
            'client/src/pages',
            'client/src/lib',
            'client/public',
            'server',
            'server/routes',
            'shared',
            'docs',
            'config'
        ];
        
        foreach ($dirs as $dir) {
            if (!is_dir($targetDir . '/' . $dir)) {
                mkdir($targetDir . '/' . $dir, 0755, true);
            }
        }
    }
    
    private function copyProductionFiles($targetDir) {
        $files = [
            'package.json',
            'tsconfig.json',
            'vite.config.ts',
            'tailwind.config.ts',
            'postcss.config.js',
            'drizzle.config.ts',
            '.env.example'
        ];
        
        foreach ($files as $file) {
            if (file_exists($this->baseDir . '/' . $file)) {
                copy($this->baseDir . '/' . $file, $targetDir . '/' . $file);
            }
        }
        
        // Copier les dossiers sources
        $this->copyDirectory($this->baseDir . '/client', $targetDir . '/client');
        $this->copyDirectory($this->baseDir . '/server', $targetDir . '/server');
        $this->copyDirectory($this->baseDir . '/shared', $targetDir . '/shared');
    }
    
    private function copyLocalFiles($targetDir) {
        $this->copyProductionFiles($targetDir);
        
        // Fichiers spécifiques local
        if (file_exists($this->baseDir . '/README.md')) {
            copy($this->baseDir . '/README.md', $targetDir . '/README-PROJECT.md');
        }
    }
    
    private function copyDevelopmentFiles($targetDir) {
        $this->copyLocalFiles($targetDir);
        
        // Fichiers de développement supplémentaires
        $devFiles = [
            '.gitignore',
            'components.json'
        ];
        
        foreach ($devFiles as $file) {
            if (file_exists($this->baseDir . '/' . $file)) {
                copy($this->baseDir . '/' . $file, $targetDir . '/' . $file);
            }
        }
        
        // Documentation développement
        if (is_dir($this->baseDir . '/docs')) {
            $this->copyDirectory($this->baseDir . '/docs', $targetDir . '/docs');
        }
    }
    
    private function copyDirectory($src, $dst) {
        if (!is_dir($src)) return;
        
        if (!is_dir($dst)) {
            mkdir($dst, 0755, true);
        }
        
        $files = scandir($src);
        foreach ($files as $file) {
            if ($file == '.' || $file == '..') continue;
            
            $srcPath = $src . '/' . $file;
            $dstPath = $dst . '/' . $file;
            
            if (is_dir($srcPath)) {
                $this->copyDirectory($srcPath, $dstPath);
            } else {
                copy($srcPath, $dstPath);
            }
        }
    }
    
    private function createCleanDirectory($dir) {
        if (is_dir($dir)) {
            $this->removeDirectory($dir);
        }
        mkdir($dir, 0755, true);
    }
    
    private function removeDirectory($dir) {
        if (!is_dir($dir)) return;
        
        $files = scandir($dir);
        foreach ($files as $file) {
            if ($file == '.' || $file == '..') continue;
            
            $path = $dir . '/' . $file;
            if (is_dir($path)) {
                $this->removeDirectory($path);
            } else {
                unlink($path);
            }
        }
        rmdir($dir);
    }
    
    private function createPackageInfo($packageDir, $platform, $info) {
        $content = "# PageForge v{$this->version} - Package {$platform}\n\n";
        $content .= "## Informations\n";
        $content .= "- **Type**: {$info['type']}\n";
        $content .= "- **Prérequis**: {$info['requirements']}\n";
        $content .= "- **Installation**: {$info['installation']}\n";
        $content .= "- **Version**: {$this->version}\n";
        $content .= "- **Date**: " . date('Y-m-d H:i:s') . "\n\n";
        
        $content .= "## Fonctionnalités\n";
        foreach ($info['features'] as $feature) {
            $content .= "- {$feature}\n";
        }
        
        $content .= "\n## Support\n";
        $content .= "Pour toute question ou problème, consultez la documentation incluse.\n";
        
        file_put_contents($packageDir . '/PACKAGE-INFO.md', $content);
    }
    
    private function createWindowsStartScript($packageDir) {
        $script = "@echo off\n";
        $script .= "echo PageForge - Demarrage Windows\n";
        $script .= "echo ================================\n\n";
        $script .= "REM Verifier PHP\n";
        $script .= "php --version >nul 2>&1\n";
        $script .= "if errorlevel 1 (\n";
        $script .= "    echo ERREUR: PHP non trouve\n";
        $script .= "    echo Installez PHP depuis https://windows.php.net/\n";
        $script .= "    pause\n";
        $script .= "    exit /b\n";
        $script .= ")\n\n";
        $script .= "REM Demarrer l'installateur\n";
        $script .= "echo Demarrage de l'installateur...\n";
        $script .= "echo Ouvrez votre navigateur sur: http://localhost:8000/install.php\n";
        $script .= "php -S localhost:8000\n";
        $script .= "pause\n";
        
        file_put_contents($packageDir . '/start-installer.bat', $script);
    }
    
    private function createLinuxStartScript($packageDir) {
        $script = "#!/bin/bash\n";
        $script .= "echo \"PageForge - Démarrage Linux\"\n";
        $script .= "echo \"=============================\"\n\n";
        $script .= "# Vérifier PHP\n";
        $script .= "if ! command -v php &> /dev/null; then\n";
        $script .= "    echo \"ERREUR: PHP non trouvé\"\n";
        $script .= "    echo \"Installez PHP: sudo apt install php (Ubuntu/Debian)\"\n";
        $script .= "    exit 1\n";
        $script .= "fi\n\n";
        $script .= "# Démarrer l'installateur\n";
        $script .= "echo \"Démarrage de l'installateur...\"\n";
        $script .= "echo \"Ouvrez votre navigateur sur: http://localhost:8000/install.php\"\n";
        $script .= "php -S localhost:8000\n";
        
        file_put_contents($packageDir . '/start-installer.sh', $script);
        chmod($packageDir . '/start-installer.sh', 0755);
    }
    
    private function createVSCodeConfigs($packageDir) {
        // Créer .vscode
        $vscodeDir = $packageDir . '/.vscode-template';
        mkdir($vscodeDir, 0755, true);
        
        // settings.json
        $settings = [
            'typescript.preferences.importModuleSpecifier' => 'relative',
            'editor.formatOnSave' => true,
            'editor.defaultFormatter' => 'esbenp.prettier-vscode',
            'editor.codeActionsOnSave' => [
                'source.fixAll.eslint' => true
            ],
            'tailwindCSS.includeLanguages' => [
                'typescript' => 'typescript',
                'typescriptreact' => 'typescriptreact'
            ]
        ];
        file_put_contents($vscodeDir . '/settings.json', json_encode($settings, JSON_PRETTY_PRINT));
        
        // extensions.json
        $extensions = [
            'recommendations' => [
                'ms-vscode.vscode-typescript-next',
                'bradlc.vscode-tailwindcss',
                'esbenp.prettier-vscode',
                'ms-vscode.vscode-eslint',
                'formulahendry.auto-rename-tag'
            ]
        ];
        file_put_contents($vscodeDir . '/extensions.json', json_encode($extensions, JSON_PRETTY_PRINT));
    }
    
    private function createZipArchive($sourceDir, $zipName) {
        $zipPath = $this->packagesDir . '/' . $zipName;
        
        if (class_exists('ZipArchive')) {
            $zip = new ZipArchive();
            if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) === TRUE) {
                $this->addDirectoryToZip($zip, $sourceDir, basename($sourceDir));
                $zip->close();
                echo "  📦 Archive créée: $zipName\n";
            }
        } else {
            // Fallback avec système
            $command = "cd " . escapeshellarg($this->packagesDir) . " && zip -r " . escapeshellarg($zipName) . " " . escapeshellarg(basename($sourceDir));
            exec($command);
            echo "  📦 Archive créée: $zipName\n";
        }
    }
    
    private function createTarArchive($sourceDir, $tarName) {
        $tarPath = $this->packagesDir . '/' . $tarName;
        $command = "cd " . escapeshellarg($this->packagesDir) . " && tar -czf " . escapeshellarg($tarName) . " " . escapeshellarg(basename($sourceDir));
        exec($command);
        echo "  📦 Archive créée: $tarName\n";
    }
    
    private function addDirectoryToZip($zip, $dir, $zipDir) {
        $files = scandir($dir);
        foreach ($files as $file) {
            if ($file == '.' || $file == '..') continue;
            
            $filePath = $dir . '/' . $file;
            $zipPath = $zipDir . '/' . $file;
            
            if (is_dir($filePath)) {
                $zip->addEmptyDir($zipPath);
                $this->addDirectoryToZip($zip, $filePath, $zipPath);
            } else {
                $zip->addFile($filePath, $zipPath);
            }
        }
    }
    
    private function getCPanelInstructions() {
        return "INSTALLATION CPANEL - PageForge v{$this->version}
================================================

ÉTAPES D'INSTALLATION :

1. UPLOAD DES FICHIERS
   - Extraire le ZIP dans le dossier public_html
   - Vérifier que install.php est à la racine

2. LANCEMENT
   - Aller sur : votre-domaine.com/install.php
   - Suivre l'assistant 7 étapes

3. CONFIGURATION
   - Base de données MySQL automatique
   - Domaine configuré automatiquement
   - SSL détecté et configuré

4. FINALISATION
   - Supprimer install.php après installation
   - PageForge accessible à la racine

PRÉREQUIS :
- PHP 7.4 ou supérieur
- MySQL 5.7+ ou PostgreSQL
- SSL/HTTPS recommandé
- 100MB d'espace disque

SUPPORT :
Consulter README.md pour plus de détails.
";
    }
    
    private function getWindowsInstructions() {
        return "INSTALLATION WINDOWS - PageForge v{$this->version}
==================================================

INSTALLATION RAPIDE :

1. DOUBLE-CLIC
   - Exécuter start-installer.bat
   - Le navigateur s'ouvrira automatiquement

2. INTERFACE WEB
   - Suivre l'assistant d'installation
   - Configuration automatique Windows

3. ALTERNATIVE MANUELLE
   - Ouvrir terminal dans le dossier
   - Taper: php -S localhost:8000
   - Aller sur: http://localhost:8000/install.php

PRÉREQUIS :
- Windows 10/11
- PHP 7.4+ (télécharger sur php.net)
- Node.js 18+ (sera installé automatiquement)

APRÈS INSTALLATION :
- PageForge accessible sur http://localhost:5000
- Créer vos premiers projets
- Exporter en HTML/CSS/JS

PROBLÈMES COURANTS :
- Si PHP manque: installer depuis php.net
- Si port occupé: modifier dans .env
";
    }
    
    private function getLinuxInstructions() {
        return "INSTALLATION LINUX - PageForge v{$this->version}
===============================================

INSTALLATION RAPIDE :

1. TERMINAL
   ./start-installer.sh
   
2. NAVIGATEUR
   - Ouvre automatiquement l'installateur
   - Interface web interactive

3. ALTERNATIVE MANUELLE
   php -S localhost:8000
   # Aller sur: http://localhost:8000/install.php

PRÉREQUIS PAR DISTRIBUTION :

Ubuntu/Debian:
  sudo apt update
  sudo apt install php php-zip php-curl nodejs npm

CentOS/RHEL:
  sudo yum install php php-zip php-curl nodejs npm

Arch Linux:
  sudo pacman -S php php-zip php-curl nodejs npm

macOS (Homebrew):
  brew install php node

APRÈS INSTALLATION :
- PageForge sur http://localhost:5000
- Scripts disponibles dans le projet
- Base de données configurée

PERMISSIONS :
Si erreur de permissions:
  chmod +x start-installer.sh
  chmod 755 dossier-installation/
";
    }
    
    private function getVSCodeInstructions() {
        return "CONFIGURATION VS CODE - PageForge v{$this->version}
===================================================

DÉMARRAGE RAPIDE :

1. EXTRACTION
   - Extraire dans votre workspace
   - cd pageforge-dev

2. CONFIGURATION
   - Lancer: php -S localhost:8080
   - Aller sur: http://localhost:8080/setup.php
   - Suivre l'assistant 7 étapes

3. OUVERTURE VS CODE
   - code .
   - Accepter l'installation des extensions
   - Configuration automatiquement appliquée

FONCTIONNALITÉS CONFIGURÉES :

✓ Debug client/serveur (F5)
✓ Tasks automatisées (Ctrl+Shift+P > Tasks)
✓ Extensions recommandées installées
✓ Snippets PageForge personnalisés
✓ Formatting automatique (Prettier + ESLint)
✓ Support Tailwind CSS complet

COMMANDES DE DÉVELOPPEMENT :

npm run dev          # Client + Serveur
npm run dev:client   # React + Vite
npm run dev:server   # Express + TypeScript
npm run build        # Build production
npm run db:push      # Base de données

DEBUGGING :
- F5 : Debug serveur
- Breakpoints supportés
- Variables inspectables
- Console intégrée

PRÉREQUIS :
- VS Code installé
- Node.js 18+
- Git (recommandé)
- PostgreSQL (local)
";
    }
    
    private function showPackageSummary() {
        echo "📋 RÉSUMÉ DES PACKAGES GÉNÉRÉS\n";
        echo "=" . str_repeat("=", 35) . "\n\n";
        
        $packages = [
            'pageforge-cpanel-v' . $this->version . '.zip' => 'Hébergement cPanel',
            'pageforge-windows-v' . $this->version . '.zip' => 'Installation Windows',
            'pageforge-linux-v' . $this->version . '.tar.gz' => 'Installation Linux/macOS',
            'pageforge-vscode-v' . $this->version . '.zip' => 'Développement VS Code'
        ];
        
        foreach ($packages as $file => $desc) {
            $path = $this->packagesDir . '/' . $file;
            if (file_exists($path)) {
                $size = $this->formatBytes(filesize($path));
                echo "📦 {$file}\n";
                echo "   └─ {$desc} ({$size})\n\n";
            }
        }
        
        echo "🎯 UTILISATION :\n";
        echo "• Distribuer les packages selon les besoins\n";
        echo "• Chaque package est autonome et complet\n";
        echo "• Documentation incluse dans chaque package\n";
        echo "• Instructions d'installation simplifiées\n\n";
    }
    
    private function formatBytes($size, $precision = 2) {
        $base = log($size, 1024);
        $suffixes = ['B', 'KB', 'MB', 'GB'];
        return round(pow(1024, $base - floor($base)), $precision) . ' ' . $suffixes[floor($base)];
    }
}

// Exécution du générateur
if (php_sapi_name() === 'cli') {
    $generator = new PageForgePackageGenerator();
    $generator->generateAllPackages();
} else {
    echo "Ce script doit être exécuté en ligne de commande.\n";
    echo "Usage: php scripts/create-packages.php\n";
}
?>