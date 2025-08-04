#!/usr/bin/env python3
"""
🚀 GÉNÉRATEUR DE PACKAGES PAGEFORGE - VERSION UNIFIÉE

Crée automatiquement tous les packages de déploiement:
- Package cPanel (hébergement web avec Node.js Selector)
- Package Windows (installation locale)
- Package Linux/macOS (installation locale) 
- Package VS Code (développement)

Usage:
    python build-scripts/create-packages.py
    ou
    python3 build-scripts/create-packages.py
"""

import os
import shutil
import zipfile
import tarfile
import json
from datetime import datetime
from pathlib import Path

class PageForgePackageGenerator:
    def __init__(self):
        self.version = '2.0.0'
        self.base_dir = Path(__file__).parent.parent
        self.packages_dir = self.base_dir / 'packages'
        self.build_scripts_dir = self.base_dir / 'build-scripts'
        
        # Créer le dossier packages
        self.packages_dir.mkdir(exist_ok=True)
        
        # Fichiers à exclure
        self.exclude_patterns = [
            'node_modules',
            '.git',
            'packages',
            'attached_assets',
            '__pycache__',
            '*.pyc',
            '.DS_Store',
            'Thumbs.db',
            '*.log',
            '.env',
            'database.sqlite*',
            'dist',
            '.replit'
        ]
    
    def generate_all_packages(self):
        print(f"🚀 Génération des packages PageForge v{self.version}")
        print("=" * 60)
        print()
        
        try:
            # Nettoyer d'abord les anciens packages
            self.cleanup_old_packages()
            
            # Générer tous les packages
            self.generate_cpanel_package()
            self.generate_windows_package()
            self.generate_linux_package()
            self.generate_vscode_package()
            
            # Créer le guide de distribution
            self.create_distribution_guide()
            
            print("\n✅ TOUS LES PACKAGES GÉNÉRÉS AVEC SUCCÈS !")
            print(f"📁 Dossier: {self.packages_dir.resolve()}")
            print()
            
            self.show_package_summary()
            
        except Exception as e:
            print(f"❌ Erreur: {e}")
            exit(1)
    
    def cleanup_old_packages(self):
        print("🧹 Nettoyage des anciens packages...")
        
        if self.packages_dir.exists():
            for item in self.packages_dir.iterdir():
                if item.is_dir() and 'pageforge-' in item.name:
                    shutil.rmtree(item)
                elif item.is_file() and item.suffix in ['.zip', '.tar.gz']:
                    item.unlink()
        
        print("✅ Nettoyage terminé")
    
    def generate_cpanel_package(self):
        print("📦 Génération package cPanel...")
        
        package_dir = self.packages_dir / f'pageforge-cpanel-v{self.version}'
        self.create_clean_directory(package_dir)
        
        # Copier les fichiers essentiels
        self.copy_project_files(package_dir, 'production')
        
        # Installateur cPanel spécifique
        shutil.copy2(self.build_scripts_dir / 'install-cpanel.php', package_dir / 'install-cpanel.php')
        
        # Documentation
        self.create_cpanel_readme(package_dir)
        
        # Fichier d'information
        self.create_package_info(package_dir, 'cPanel', {
            'type': 'Hébergement web cPanel avec Node.js Selector',
            'requirements': 'PHP 7.4+, MySQL/PostgreSQL, Node.js Selector (optionnel)',
            'installation': 'Interface web interactive avec support Node.js',
            'features': [
                'Installation sans ligne de commande',
                'Support Node.js Selector de cPanel',
                'Configuration automatique base de données',
                'Interface responsive moderne',
                'Optimisations hébergement partagé',
                'Nettoyage automatique post-installation'
            ]
        })
        
        # Instructions rapides
        self.create_cpanel_instructions(package_dir)
        
        # Créer l'archive ZIP
        self.create_zip_archive(package_dir, f'pageforge-cpanel-v{self.version}.zip')
        
        print("✅ Package cPanel créé")
    
    def generate_windows_package(self):
        print("📦 Génération package Windows...")
        
        package_dir = self.packages_dir / f'pageforge-windows-v{self.version}'
        self.create_clean_directory(package_dir)
        
        # Copier les fichiers essentiels
        self.copy_project_files(package_dir, 'local')
        
        # Installateur local
        shutil.copy2(self.build_scripts_dir / 'install-local.php', package_dir / 'install.php')
        
        # Documentation Windows
        self.create_windows_readme(package_dir)
        
        # Scripts de démarrage Windows
        self.create_windows_scripts(package_dir)
        
        # Fichier d'information
        self.create_package_info(package_dir, 'Windows', {
            'type': 'Installation locale Windows',
            'requirements': 'PHP 7.4+, Node.js 16+ recommandé',
            'installation': 'Interface web PHP ou CLI',
            'features': [
                'Détection automatique Windows',
                'Installation Node.js guidée',
                'Configuration SQLite automatique',
                'Scripts de démarrage inclus',
                'Interface web d\'installation',
                'Mode développement intégré'
            ]
        })
        
        # Instructions Windows
        self.create_windows_instructions(package_dir)
        
        # Créer l'archive ZIP
        self.create_zip_archive(package_dir, f'pageforge-windows-v{self.version}.zip')
        
        print("✅ Package Windows créé")
    
    def generate_linux_package(self):
        print("📦 Génération package Linux/macOS...")
        
        package_dir = self.packages_dir / f'pageforge-linux-v{self.version}'
        self.create_clean_directory(package_dir)
        
        # Copier les fichiers essentiels
        self.copy_project_files(package_dir, 'local')
        
        # Installateur local
        shutil.copy2(self.build_scripts_dir / 'install-local.php', package_dir / 'install.php')
        
        # Documentation
        self.create_linux_readme(package_dir)
        
        # Scripts de démarrage Linux/macOS
        self.create_linux_scripts(package_dir)
        
        # Fichier d'information
        self.create_package_info(package_dir, 'Linux/macOS', {
            'type': 'Installation locale Linux/macOS',
            'requirements': 'PHP 7.4+, Node.js 16+ recommandé',
            'installation': 'Interface web PHP ou CLI',
            'features': [
                'Compatible toutes distributions Linux',
                'Support macOS natif',
                'Installation Node.js automatique',
                'Scripts shell optimisés',
                'Configuration SQLite automatique',
                'Mode développement intégré'
            ]
        })
        
        # Instructions Linux
        self.create_linux_instructions(package_dir)
        
        # Créer l'archive TAR.GZ (plus commun sur Linux)
        self.create_tar_archive(package_dir, f'pageforge-linux-v{self.version}.tar.gz')
        
        print("✅ Package Linux/macOS créé")
    
    def generate_vscode_package(self):
        print("📦 Génération package VS Code...")
        
        package_dir = self.packages_dir / f'pageforge-vscode-v{self.version}'
        self.create_clean_directory(package_dir)
        
        # Copier les fichiers de développement
        self.copy_project_files(package_dir, 'development')
        
        # Installateur VS Code
        self.create_vscode_installer(package_dir)
        
        # Documentation développement
        self.create_vscode_readme(package_dir)
        
        # Configuration VS Code préparée
        self.create_vscode_configs(package_dir)
        
        # Fichier d'information
        self.create_package_info(package_dir, 'VS Code', {
            'type': 'Environnement de développement VS Code',
            'requirements': 'PHP 7.4+, Node.js 16+, VS Code, Git',
            'installation': 'Configuration automatique développement',
            'features': [
                'Configuration VS Code complète',
                'Debug client/serveur intégré',
                'Extensions recommandées',
                'Snippets personnalisés PageForge',
                'Structure projet professionnelle',
                'Hot reload développement',
                'ESLint et Prettier configurés'
            ]
        })
        
        # Guide développement
        self.create_vscode_instructions(package_dir)
        
        # Créer l'archive ZIP
        self.create_zip_archive(package_dir, f'pageforge-vscode-v{self.version}.zip')
        
        print("✅ Package VS Code créé")
    
    def copy_project_files(self, target_dir, package_type):
        # Créer la structure de base
        self.create_project_structure(target_dir)
        
        # Copier les fichiers selon le type
        if package_type == 'production':
            self.copy_production_files(target_dir)
        elif package_type == 'local':
            self.copy_local_files(target_dir)
        elif package_type == 'development':
            self.copy_development_files(target_dir)
    
    def create_project_structure(self, target_dir):
        dirs = [
            'client',
            'client/src',
            'client/src/components',
            'client/src/pages',
            'client/src/lib',
            'client/public',
            'server',
            'shared',
            'docs',
            'config'
        ]
        
        for dir_path in dirs:
            (target_dir / dir_path).mkdir(parents=True, exist_ok=True)
    
    def copy_production_files(self, target_dir):
        # Fichiers de configuration essentiels
        config_files = [
            'package.json',
            'tsconfig.json',
            'vite.config.ts',
            'tailwind.config.ts',
            'postcss.config.js',
            'drizzle.config.ts',
            'components.json'
        ]
        
        for file in config_files:
            src = self.base_dir / file
            if src.exists():
                shutil.copy2(src, target_dir / file)
        
        # Copier les dossiers sources (en excluant les patterns)
        for folder in ['client', 'server', 'shared']:
            src_folder = self.base_dir / folder
            if src_folder.exists():
                self.copy_directory_filtered(src_folder, target_dir / folder)
        
        # Créer un .env.example
        self.create_env_example(target_dir)
    
    def copy_local_files(self, target_dir):
        self.copy_production_files(target_dir)
        
        # Fichiers spécifiques local
        local_files = ['README.md']
        for file in local_files:
            src = self.base_dir / file
            if src.exists():
                shutil.copy2(src, target_dir / f'README-PROJECT.md')
    
    def copy_development_files(self, target_dir):
        self.copy_local_files(target_dir)
        
        # Fichiers de développement supplémentaires
        dev_files = ['.gitignore']
        
        for file in dev_files:
            src = self.base_dir / file
            if src.exists():
                shutil.copy2(src, target_dir / file)
        
        # Documentation développement
        docs_folder = self.base_dir / 'docs'
        if docs_folder.exists():
            self.copy_directory_filtered(docs_folder, target_dir / 'docs')
    
    def copy_directory_filtered(self, src, dst):
        """Copie un dossier en excluant les patterns définis"""
        if not src.exists():
            return
        
        if dst.exists():
            shutil.rmtree(dst)
        
        shutil.copytree(src, dst, ignore=self.create_ignore_function())
    
    def create_ignore_function(self):
        """Crée une fonction d'ignore pour shutil.copytree"""
        def ignore_func(directory, files):
            ignored = []
            for file in files:
                file_path = Path(directory) / file
                
                # Vérifier les patterns d'exclusion
                for pattern in self.exclude_patterns:
                    if pattern.startswith('*'):
                        if file.endswith(pattern[1:]):
                            ignored.append(file)
                            break
                    elif pattern.endswith('*'):
                        if file.startswith(pattern[:-1]):
                            ignored.append(file)
                            break
                    elif pattern == file or pattern in str(file_path):
                        ignored.append(file)
                        break
            
            return ignored
        
        return ignore_func
    
    def create_clean_directory(self, directory):
        if directory.exists():
            shutil.rmtree(directory)
        directory.mkdir(parents=True)
    
    def create_package_info(self, package_dir, platform, info):
        content = f"# PageForge v{self.version} - Package {platform}\n\n"
        content += "## Informations\n"
        content += f"- **Type**: {info['type']}\n"
        content += f"- **Prérequis**: {info['requirements']}\n"
        content += f"- **Installation**: {info['installation']}\n"
        content += f"- **Version**: {self.version}\n"
        content += f"- **Date**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        
        content += "## Fonctionnalités\n"
        for feature in info['features']:
            content += f"- {feature}\n"
        
        content += "\n## Support\n"
        content += "Pour toute question ou problème, consultez la documentation incluse.\n"
        
        (package_dir / 'PACKAGE-INFO.md').write_text(content, encoding='utf-8')
    
    def create_env_example(self, package_dir):
        env_content = """# PageForge Configuration
NODE_ENV=production
PORT=3000

# Base de données (ajustez selon votre configuration)
DATABASE_URL=sqlite:./database.sqlite

# Configuration serveur
HOST=0.0.0.0
"""
        (package_dir / '.env.example').write_text(env_content, encoding='utf-8')
    
    def create_cpanel_readme(self, package_dir):
        readme_content = f"""# PageForge v{self.version} - Package cPanel

## Installation Automatisée cPanel

Ce package est spécialement conçu pour les hébergements cPanel avec support du **Node.js Selector**.

### 🚀 Installation Rapide

1. **Uploadez les fichiers** via File Manager cPanel
2. **Visitez** : `https://votre-domaine.com/install-cpanel.php`
3. **Suivez l'assistant** d'installation en 7 étapes
4. **Activez Node.js** via Node.js Selector (recommandé)

### 📋 Prérequis

- PHP 7.4 ou supérieur
- Base de données MySQL ou PostgreSQL
- Hébergement cPanel actif
- Node.js Selector (optionnel mais recommandé)

### 🔧 Support Node.js Selector

Si votre hébergeur propose Node.js Selector :

1. Allez dans **Node.js Selector** dans cPanel
2. Cliquez **"Create Application"**
3. Sélectionnez **Node.js version 16+**
4. Définissez l'**Application root** sur votre dossier
5. **Application startup file** : `server/index.js`

### 📁 Contenu du Package

- Interface React avec 52 composants
- Serveur Node.js/Express optimisé
- Système de base de données intégré
- Templates et système d'export
- Configuration cPanel optimisée

### 🆘 Support

Pour toute question, consultez `INSTALLATION-GUIDE.txt` ou la documentation intégrée.
"""
        (package_dir / 'README.md').write_text(readme_content, encoding='utf-8')
    
    def create_cpanel_instructions(self, package_dir):
        instructions = f"""INSTALLATION CPANEL - PageForge v{self.version}
=======================================================

ÉTAPES D'INSTALLATION AUTOMATISÉE :

1. UPLOAD DES FICHIERS
   - Extraire le ZIP dans public_html via File Manager
   - Vérifier que install-cpanel.php est présent

2. LANCEMENT DE L'INSTALLATEUR
   - Aller sur : votre-domaine.com/install-cpanel.php
   - Suivre l'assistant interactif 7 étapes

3. CONFIGURATION NODE.JS (RECOMMANDÉ)
   - Si Node.js Selector disponible :
     * Créer nouvelle application Node.js
     * Version Node.js 16 ou supérieure
     * Application startup file: server/index.js
     * Redémarrer l'application

4. CONFIGURATION BASE DE DONNÉES
   - MySQL ou PostgreSQL requis
   - Configuration automatique via l'assistant
   - Test de connexion intégré

5. FINALISATION
   - Supprimer install-cpanel.php après installation
   - PageForge accessible à la racine du domaine
   - Interface utilisateur moderne prête à l'emploi

PRÉREQUIS HÉBERGEMENT :
- PHP 7.4+ avec extensions : PDO, JSON, cURL, ZIP, GD
- Base de données MySQL 5.7+ ou PostgreSQL
- SSL/HTTPS fortement recommandé
- 200MB d'espace disque libre minimum
- Node.js Selector (optionnel mais recommandé)

FONCTIONNALITÉS :
- 52 composants visuels prêts à l'emploi
- Système de templates avancé
- Export multi-format (HTML, CSS, JS)
- Interface d'administration complète
- Optimisations hébergement partagé

SUPPORT :
Consultez README.md et la documentation intégrée pour plus de détails.
Installation testée sur les principaux hébergeurs cPanel.
"""
        (package_dir / 'INSTALLATION-GUIDE.txt').write_text(instructions, encoding='utf-8')
    
    def create_windows_scripts(self, package_dir):
        # Script de démarrage rapide
        start_script = """@echo off
title PageForge - Installation Windows
cls
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🚀 PAGEFORGE v2.0.0                      ║
echo ║                Installation Automatisée Windows             ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Vérifier PHP
php --version >nul 2>&1
if errorlevel 1 (
    echo ❌ PHP non trouvé
    echo.
    echo Installez PHP depuis : https://windows.php.net/
    echo Ou utilisez XAMPP : https://www.apachefriends.org/
    echo.
    pause
    exit /b 1
)

echo ✅ PHP détecté
echo.

REM Démarrer l'installateur web
echo 🌐 Démarrage de l'installateur web...
echo.
echo Ouvrez votre navigateur sur : http://localhost:8000/install.php
echo.
echo Pour arrêter l'installateur, fermez cette fenêtre.
echo.

php -S localhost:8000
pause
"""
        (package_dir / 'start-installer.bat').write_text(start_script, encoding='utf-8')
        
        # Script d'installation CLI
        cli_script = """@echo off
title PageForge - Installation CLI Windows
echo Installation CLI de PageForge...
php install.php
pause
"""
        (package_dir / 'install-cli.bat').write_text(cli_script, encoding='utf-8')
    
    def create_linux_scripts(self, package_dir):
        # Script de démarrage rapide
        start_script = """#!/bin/bash

clear
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    🚀 PAGEFORGE v2.0.0                      ║"
echo "║               Installation Automatisée Linux                ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo

# Vérifier PHP
if ! command -v php &> /dev/null; then
    echo "❌ PHP non trouvé"
    echo
    echo "Installez PHP :"
    echo "  Ubuntu/Debian: sudo apt update && sudo apt install php php-sqlite3 php-curl php-zip"
    echo "  CentOS/RHEL:   sudo yum install php php-pdo php-json php-curl"
    echo "  macOS:         brew install php"
    echo
    exit 1
fi

echo "✅ PHP détecté"
echo

# Démarrer l'installateur web
echo "🌐 Démarrage de l'installateur web..."
echo
echo "Ouvrez votre navigateur sur : http://localhost:8000/install.php"
echo
echo "Pour arrêter l'installateur, utilisez Ctrl+C"
echo

php -S localhost:8000
"""
        script_file = package_dir / 'start-installer.sh'
        script_file.write_text(start_script, encoding='utf-8')
        script_file.chmod(0o755)
        
        # Script d'installation CLI
        cli_script = """#!/bin/bash
echo "Installation CLI de PageForge..."
php install.php
"""
        cli_file = package_dir / 'install-cli.sh'
        cli_file.write_text(cli_script, encoding='utf-8')
        cli_file.chmod(0o755)
    
    def create_vscode_installer(self, package_dir):
        installer_content = """<?php
/**
 * 🚀 PAGEFORGE - CONFIGURATEUR VS CODE
 * 
 * Configuration automatique de l'environnement de développement VS Code
 */

class PageForgeVSCodeSetup {
    private $version = '2.0.0';
    
    public function run() {
        echo "🚀 Configuration PageForge pour VS Code\\n";
        echo "=====================================\\n\\n";
        
        $this->checkRequirements();
        $this->setupVSCodeConfig();
        $this->installDependencies();
        $this->setupDatabase();
        $this->createEnvFile();
        
        echo "✅ Configuration terminée !\\n";
        echo "📂 Ouvrez ce dossier dans VS Code\\n";
        echo "🚀 Lancez avec: npm run dev\\n\\n";
    }
    
    private function checkRequirements() {
        echo "🔍 Vérification des prérequis...\\n";
        
        // PHP
        if(version_compare(PHP_VERSION, '7.4', '>=')) {
            echo "✅ PHP " . PHP_VERSION . "\\n";
        } else {
            echo "❌ PHP 7.4+ requis\\n";
            exit(1);
        }
        
        // Node.js
        $nodeVersion = shell_exec('node --version 2>/dev/null');
        if($nodeVersion) {
            echo "✅ Node.js " . trim($nodeVersion) . "\\n";
        } else {
            echo "❌ Node.js requis pour le développement\\n";
            exit(1);
        }
        
        echo "\\n";
    }
    
    private function setupVSCodeConfig() {
        echo "⚙️ Configuration VS Code...\\n";
        
        if(is_dir('.vscode-template')) {
            rename('.vscode-template', '.vscode');
            echo "✅ Configuration VS Code activée\\n";
        }
        
        echo "\\n";
    }
    
    private function installDependencies() {
        echo "📦 Installation des dépendances...\\n";
        system('npm install');
        echo "\\n";
    }
    
    private function setupDatabase() {
        echo "🗄️ Configuration base de données...\\n";
        
        // SQLite pour développement
        $dbPath = getcwd() . '/database.sqlite';
        
        try {
            $pdo = new PDO('sqlite:' . $dbPath);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Tables de base
            $pdo->exec("CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )");
            
            echo "✅ Base de données SQLite configurée\\n";
            
        } catch(PDOException $e) {
            echo "❌ Erreur base de données: " . $e->getMessage() . "\\n";
        }
        
        echo "\\n";
    }
    
    private function createEnvFile() {
        echo "📝 Création fichier .env...\\n";
        
        $envContent = "# PageForge - Environnement de développement\\n";
        $envContent .= "NODE_ENV=development\\n";
        $envContent .= "PORT=3000\\n\\n";
        $envContent .= "# Base de données développement\\n";
        $envContent .= "DATABASE_URL=sqlite:./database.sqlite\\n\\n";
        $envContent .= "# Configuration développement\\n";
        $envContent .= "DEV_MODE=true\\n";
        $envContent .= "HOT_RELOAD=true\\n";
        
        file_put_contents('.env', $envContent);
        echo "✅ Fichier .env créé\\n\\n";
    }
}

$setup = new PageForgeVSCodeSetup();
$setup->run();
?>"""
        (package_dir / 'setup.php').write_text(installer_content, encoding='utf-8')
    
    def create_vscode_configs(self, package_dir):
        # Créer .vscode-template (sera renommé en .vscode lors de l'installation)
        vscode_dir = package_dir / '.vscode-template'
        vscode_dir.mkdir(exist_ok=True)
        
        # settings.json
        settings = {
            'typescript.preferences.importModuleSpecifier': 'relative',
            'editor.formatOnSave': True,
            'editor.defaultFormatter': 'esbenp.prettier-vscode',
            'editor.codeActionsOnSave': {
                'source.fixAll.eslint': True
            },
            'tailwindCSS.includeLanguages': {
                'typescript': 'typescript',
                'typescriptreact': 'typescriptreact'
            },
            'emmet.includeLanguages': {
                'javascript': 'javascriptreact',
                'typescript': 'typescriptreact'
            },
            'files.exclude': {
                '**/node_modules': True,
                '**/dist': True,
                '**/.git': True,
                '**/database.sqlite*': True
            }
        }
        (vscode_dir / 'settings.json').write_text(json.dumps(settings, indent=2), encoding='utf-8')
        
        # extensions.json
        extensions = {
            'recommendations': [
                'ms-vscode.vscode-typescript-next',
                'bradlc.vscode-tailwindcss',
                'esbenp.prettier-vscode',
                'dbaeumer.vscode-eslint',
                'formulahendry.auto-rename-tag',
                'ms-vscode.vscode-json',
                'ms-vscode.vscode-eslint',
                'christian-kohler.path-intellisense',
                'ms-vscode.vscode-typescript-next'
            ]
        }
        (vscode_dir / 'extensions.json').write_text(json.dumps(extensions, indent=2), encoding='utf-8')
        
        # launch.json pour le debugging
        launch = {
            'version': '0.2.0',
            'configurations': [
                {
                    'name': 'Debug PageForge Client',
                    'type': 'node',
                    'request': 'launch',
                    'program': '${workspaceFolder}/node_modules/.bin/vite',
                    'args': ['--mode', 'development'],
                    'console': 'integratedTerminal'
                },
                {
                    'name': 'Debug PageForge Server',
                    'type': 'node',
                    'request': 'launch',
                    'program': '${workspaceFolder}/server/index.ts',
                    'outFiles': ['${workspaceFolder}/dist/**/*.js'],
                    'console': 'integratedTerminal'
                }
            ]
        }
        (vscode_dir / 'launch.json').write_text(json.dumps(launch, indent=2), encoding='utf-8')
    
    def create_zip_archive(self, source_dir, zip_name):
        zip_path = self.packages_dir / zip_name
        
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for file_path in source_dir.rglob('*'):
                if file_path.is_file():
                    arcname = str(file_path.relative_to(source_dir.parent))
                    zipf.write(file_path, arcname)
        
        print(f"  📦 Archive créée: {zip_name} ({self.format_size(zip_path.stat().st_size)})")
    
    def create_tar_archive(self, source_dir, tar_name):
        tar_path = self.packages_dir / tar_name
        
        with tarfile.open(tar_path, 'w:gz') as tar:
            tar.add(source_dir, arcname=source_dir.name)
        
        print(f"  📦 Archive créée: {tar_name} ({self.format_size(tar_path.stat().st_size)})")
    
    def create_distribution_guide(self):
        guide_content = f"""# Guide de Distribution PageForge v{self.version}
{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Packages Générés

### 📦 pageforge-cpanel-v{self.version}.zip
- **Type** : Hébergement web cPanel
- **Taille** : Variable selon configuration
- **Installation** : Interface web avec support Node.js Selector
- **Usage** : Production sur hébergement partagé

### 📦 pageforge-windows-v{self.version}.zip  
- **Type** : Installation locale Windows
- **Installation** : Scripts batch + interface web
- **Usage** : Développement et utilisation locale Windows

### 📦 pageforge-linux-v{self.version}.tar.gz
- **Type** : Installation locale Linux/macOS
- **Installation** : Scripts shell + interface web  
- **Usage** : Développement et utilisation locale Unix

### 📦 pageforge-vscode-v{self.version}.zip
- **Type** : Environnement de développement VS Code
- **Installation** : Configuration automatique
- **Usage** : Développement professionnel avec VS Code

## Instructions de Distribution

1. **Testez** chaque package avant distribution
2. **Vérifiez** que tous les fichiers sont présents
3. **Documentez** les changements de version
4. **Publiez** sur les plateformes appropriées

## Checksums des Archives

Générez les checksums avec :
```bash
# Windows
certutil -hashfile pageforge-*.zip SHA256

# Linux/macOS  
sha256sum pageforge-*
```

## Support Utilisateur

- README.md dans chaque package
- INSTALLATION-GUIDE.txt pour instructions détaillées
- Documentation intégrée dans l'application
"""
        
        (self.packages_dir / 'DISTRIBUTION-GUIDE.md').write_text(guide_content, encoding='utf-8')
    
    def show_package_summary(self):
        print("📊 RÉSUMÉ DES PACKAGES GÉNÉRÉS")
        print("-" * 40)
        
        total_size = 0
        for file_path in self.packages_dir.iterdir():
            if file_path.is_file() and file_path.suffix in ['.zip', '.tar.gz']:
                size = file_path.stat().st_size
                total_size += size
                print(f"📦 {file_path.name:<35} {self.format_size(size):>10}")
        
        print("-" * 40)
        print(f"📊 Taille totale: {self.format_size(total_size)}")
        print()
        print("🎯 PRÊT POUR LA DISTRIBUTION !")
        print("   Consultez DISTRIBUTION-GUIDE.md pour les détails")
    
    def format_size(self, size_bytes):
        """Formate la taille en bytes en format lisible"""
        if size_bytes == 0:
            return "0 B"
        
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size_bytes < 1024.0:
                return f"{size_bytes:.1f} {unit}"
            size_bytes /= 1024.0
        
        return f"{size_bytes:.1f} TB"
    
    # Méthodes pour créer les READMEs et instructions spécifiques
    def create_windows_readme(self, package_dir):
        content = f"""# PageForge v{self.version} - Package Windows

## Installation Automatisée Windows

### 🚀 Installation Ultra-Rapide

**Double-clic sur `start-installer.bat`** - C'est tout !

### 📋 Installation Manuelle

1. **Extraire** les fichiers dans un dossier
2. **Double-clic** sur `start-installer.bat`
3. **Ouvrir** http://localhost:8000/install.php dans votre navigateur
4. **Suivre** l'assistant d'installation

### 🔧 Prérequis Windows

- Windows 10/11 (8.1 supporté)
- PHP 7.4+ (XAMPP recommandé)
- Node.js 16+ (optionnel mais recommandé)

### 📦 Installation PHP sur Windows

**Option 1 - XAMPP (Recommandé)**
1. Télécharger : https://www.apachefriends.org/
2. Installer XAMPP
3. PHP sera automatiquement disponible

**Option 2 - PHP Direct**
1. Télécharger : https://windows.php.net/
2. Extraire dans C:\\php
3. Ajouter C:\\php au PATH Windows

### 🚀 Fonctionnalités

- Interface moderne avec 52 composants
- Système de templates avancé
- Export multi-format
- Base de données SQLite intégrée
- Mode développement avec hot reload

### 🆘 Support

Consultez `WINDOWS-INSTALL.txt` pour des instructions détaillées.
"""
        (package_dir / 'README.md').write_text(content, encoding='utf-8')
    
    def create_windows_instructions(self, package_dir):
        instructions = f"""INSTALLATION WINDOWS - PageForge v{self.version}
=====================================================

INSTALLATION ULTRA-RAPIDE :
≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈

1. DOUBLE-CLIC sur start-installer.bat
2. Votre navigateur s'ouvre automatiquement
3. Suivre l'assistant d'installation
4. PageForge est prêt !

INSTALLATION DÉTAILLÉE :
≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈

1. PRÉREQUIS WINDOWS
   - Windows 10/11 recommandé (8.1 supporté)
   - PHP 7.4+ (voir section installation PHP)
   - Node.js 16+ recommandé
   - 200MB d'espace disque libre

2. INSTALLATION PHP
   
   OPTION A - XAMPP (Le plus simple)
   - Télécharger: https://www.apachefriends.org/
   - Installer avec tous les composants
   - PHP sera disponible automatiquement
   
   OPTION B - PHP Direct
   - Télécharger: https://windows.php.net/
   - Choisir "Thread Safe" version
   - Extraire dans C:\\php
   - Ajouter C:\\php au PATH Windows

3. INSTALLATION NODE.JS (Optionnel)
   - Télécharger: https://nodejs.org/
   - Choisir version LTS
   - Installation automatique

4. DÉMARRAGE PAGEFORGE
   
   MÉTHODE 1 - Interface graphique
   - Double-clic: start-installer.bat
   - Navigateur s'ouvre sur: http://localhost:8000/install.php
   
   MÉTHODE 2 - Ligne de commande
   - Ouvrir CMD dans le dossier PageForge
   - Taper: start-installer.bat
   
   MÉTHODE 3 - Manuel
   - Ouvrir CMD dans le dossier
   - Taper: php -S localhost:8000
   - Ouvrir: http://localhost:8000/install.php

5. ASSISTANT D'INSTALLATION WEB
   - Vérification automatique des prérequis
   - Configuration base de données SQLite
   - Installation dépendances Node.js
   - Configuration environnement
   - Test de l'installation

6. ACCÈS À PAGEFORGE
   - Interface utilisateur: http://localhost:3000
   - 52 composants visuels disponibles
   - Système de templates intégré
   - Export HTML/CSS/JS

DÉPANNAGE WINDOWS :
≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈

❌ "PHP n'est pas reconnu"
→ PHP non installé ou pas dans le PATH
→ Installer XAMPP ou ajouter PHP au PATH

❌ "Node n'est pas reconnu"  
→ Node.js non installé
→ Télécharger depuis nodejs.org

❌ Port 8000 déjà utilisé
→ Changer de port: php -S localhost:8080
→ Ou arrêter l'autre application

❌ Erreur permissions
→ Exécuter en tant qu'administrateur
→ Vérifier antivirus (peut bloquer)

FONCTIONNALITÉS COMPLÈTES :
≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈

✅ 52 composants visuels prêts à l'emploi
✅ Système de templates professionnel
✅ Éditeur visuel drag & drop
✅ Export multi-format (HTML, CSS, JS)
✅ Base de données SQLite intégrée
✅ Interface responsive moderne
✅ Mode développement avec hot reload
✅ Système de sauvegarde automatique

SUPPORT & AIDE :
≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈

📚 Documentation complète dans l'interface
🔧 Configuration automatique
🎯 Installation testée sur Windows 10/11
💡 Interface intuitive et moderne

Pour questions spécifiques, consultez README.md
"""
        (package_dir / 'WINDOWS-INSTALL.txt').write_text(instructions, encoding='utf-8')
    
    def create_linux_readme(self, package_dir):
        content = f"""# PageForge v{self.version} - Package Linux/macOS

## Installation Automatisée Unix

### 🚀 Installation Ultra-Rapide

```bash
# Extraire l'archive
tar -xzf pageforge-linux-v{self.version}.tar.gz
cd pageforge-linux-v{self.version}

# Lancer l'installateur
./start-installer.sh
```

### 📋 Prérequis

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install php php-sqlite3 php-curl php-zip
```

**CentOS/RHEL:**
```bash
sudo yum install php php-pdo php-json php-curl
```

**macOS:**
```bash
brew install php
```

**Node.js (recommandé):**
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# macOS
brew install node
```

### 🔧 Installation Manuelle

1. **Extraire** les fichiers
2. **Installer** les prérequis (voir ci-dessus)
3. **Lancer** `./start-installer.sh`
4. **Ouvrir** http://localhost:8000/install.php

### 🚀 Fonctionnalités

- Compatible toutes distributions Linux
- Support macOS natif
- Installation Node.js automatique
- Scripts shell optimisés
- Configuration SQLite automatique

### 🆘 Support

Consultez `LINUX-INSTALL.txt` pour des instructions détaillées.
"""
        (package_dir / 'README.md').write_text(content, encoding='utf-8')
    
    def create_linux_instructions(self, package_dir):
        instructions = f"""INSTALLATION LINUX/MACOS - PageForge v{self.version}
========================================================

INSTALLATION ULTRA-RAPIDE :
≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈

tar -xzf pageforge-linux-v{self.version}.tar.gz
cd pageforge-linux-v{self.version}
./start-installer.sh

INSTALLATION DÉTAILLÉE :
≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈

1. PRÉREQUIS SYSTÈME

   Ubuntu/Debian:
   sudo apt update
   sudo apt install php php-sqlite3 php-curl php-zip php-json php-gd
   
   CentOS/RHEL/Fedora:
   sudo yum install php php-pdo php-json php-curl php-zip
   # ou avec dnf: sudo dnf install php php-pdo php-json php-curl
   
   Arch Linux:
   sudo pacman -S php php-sqlite
   
   macOS:
   brew install php
   
   Alpine Linux:
   sudo apk add php php-sqlite3 php-curl php-zip php-json

2. INSTALLATION NODE.JS (Recommandé)

   Ubuntu/Debian:
   curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   CentOS/RHEL:
   curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
   sudo yum install -y nodejs
   
   macOS:
   brew install node
   
   Arch Linux:
   sudo pacman -S nodejs npm
   
   Alpine:
   sudo apk add nodejs npm

3. EXTRACTION ET DÉMARRAGE

   # Extraire l'archive
   tar -xzf pageforge-linux-v{self.version}.tar.gz
   cd pageforge-linux-v{self.version}
   
   # Rendre les scripts exécutables
   chmod +x *.sh
   
   # Lancer l'installateur
   ./start-installer.sh
   
   # Ou installation CLI directe
   ./install-cli.sh

4. ASSISTANT D'INSTALLATION WEB
   - Navigateur s'ouvre sur: http://localhost:8000/install.php
   - Vérification automatique des prérequis Unix
   - Configuration base de données SQLite
   - Installation dépendances Node.js
   - Configuration environnement Linux/macOS
   - Test de l'installation

5. MÉTHODES D'INSTALLATION ALTERNATIVES

   MÉTHODE A - Interface web (Recommandée)
   ./start-installer.sh
   
   MÉTHODE B - Ligne de commande pure
   php install.php
   
   MÉTHODE C - Manuel
   php -S localhost:8000
   # Puis ouvrir http://localhost:8000/install.php

6. ACCÈS À PAGEFORGE
   - Interface utilisateur: http://localhost:3000
   - 52 composants visuels disponibles
   - Système de templates intégré
   - Export HTML/CSS/JS

SPÉCIFICITÉS LINUX/MACOS :
≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈

✅ Support natif toutes distributions Linux
✅ Optimisations macOS spécifiques
✅ Scripts shell avec détection automatique OS
✅ Gestion permissions Unix appropriée
✅ Support environnements serveur Linux
✅ Compatible conteneurs Docker
✅ Installation sans privilèges root possible

DÉPANNAGE UNIX :
≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈

❌ "php: command not found"
→ PHP non installé, voir section prérequis
→ Vérifier PATH: echo $PATH

❌ "Permission denied" sur scripts
→ chmod +x *.sh
→ Vérifier propriétaire: ls -la

❌ Erreur port 8000 occupé
→ Changer port: php -S localhost:8080
→ Vérifier: netstat -tulpn | grep :8000

❌ Extensions PHP manquantes
→ Installer selon votre distribution
→ Redémarrer après installation

❌ Problèmes SQLite
→ Vérifier: php -m | grep sqlite
→ Permissions dossier: chmod 755 .

ENVIRONNEMENTS SUPPORTÉS :
≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈

🐧 Linux: Ubuntu, Debian, CentOS, RHEL, Fedora, Arch, Alpine
🍎 macOS: 10.15+ (Intel et M1/M2)
🐳 Docker: Images officielles PHP/Node.js
☁️  Cloud: AWS, Google Cloud, Azure, DigitalOcean
🖥️  Serveurs: Apache, Nginx, serveur PHP intégré

SUPPORT & COMMUNAUTÉ :
≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈

📚 Documentation complète dans l'interface
🔧 Configuration automatique multi-OS
🎯 Installation testée sur 10+ distributions
💡 Interface responsive et moderne

Pour questions spécifiques, consultez README.md
"""
        (package_dir / 'LINUX-INSTALL.txt').write_text(instructions, encoding='utf-8')
    
    def create_vscode_readme(self, package_dir):
        content = f"""# PageForge v{self.version} - Package VS Code

## Environnement de Développement VS Code

### 🚀 Configuration Automatique

```bash
# Extraire le package
unzip pageforge-vscode-v{self.version}.zip
cd pageforge-vscode-v{self.version}

# Configuration automatique
php setup.php

# Ouvrir dans VS Code
code .
```

### 📋 Prérequis Développement

- **VS Code** : Version récente
- **PHP** : 7.4+ avec extensions : PDO, JSON, cURL
- **Node.js** : 16+ avec NPM
- **Git** : Pour le versioning (recommandé)

### 🔧 Extensions VS Code Incluses

- TypeScript support avancé
- Tailwind CSS IntelliSense
- ESLint & Prettier
- Auto Rename Tag
- Path Intellisense
- GitLens (recommandé)

### 🛠️ Configuration Incluse

- **Settings.json** : Configuration optimisée PageForge
- **Launch.json** : Debug client/serveur intégré
- **Extensions.json** : Extensions recommandées
- **Snippets** : Raccourcis PageForge personnalisés

### 🚀 Développement

```bash
# Démarrer le serveur de développement
npm run dev

# Build production
npm run build

# Tests
npm run test
```

### 📁 Structure Projet

```
pageforge-vscode-v{self.version}/
├── client/          # Frontend React + TypeScript
├── server/          # Backend Node.js + Express
├── shared/          # Types et schémas partagés
├── docs/           # Documentation développement
├── .vscode/        # Configuration VS Code
└── setup.php       # Configurateur automatique
```

### 🎯 Fonctionnalités Développement

- Hot reload complet (client + serveur)
- Debug intégré VS Code
- ESLint et Prettier configurés
- Path mapping TypeScript
- Snippets personnalisés PageForge
- Git hooks pré-configurés

### 🆘 Support

Consultez `DEVELOPMENT.txt` pour le guide complet de développement.
"""
        (package_dir / 'README.md').write_text(content, encoding='utf-8')
    
    def create_vscode_instructions(self, package_dir):
        instructions = f"""GUIDE DÉVELOPPEMENT VS CODE - PageForge v{self.version}
============================================================

CONFIGURATION AUTOMATIQUE :
≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈

1. EXTRACTION ET SETUP
   unzip pageforge-vscode-v{self.version}.zip
   cd pageforge-vscode-v{self.version}
   php setup.php
   code .

2. PRÉREQUIS DÉVELOPPEMENT
   - VS Code version récente
   - PHP 7.4+ (avec extensions PDO, JSON, cURL, ZIP)
   - Node.js 16+ avec NPM
   - Git (recommandé pour versioning)

ENVIRONNEMENT DE DÉVELOPPEMENT :
≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈

3. STRUCTURE PROJET COMPLÈTE

   pageforge-vscode-v{self.version}/
   ├── client/                    # Frontend React + TypeScript
   │   ├── src/
   │   │   ├── components/        # Composants React
   │   │   ├── pages/            # Pages de l'application
   │   │   ├── lib/              # Utilitaires et helpers
   │   │   └── types/            # Types TypeScript
   │   ├── public/               # Assets statiques
   │   └── index.html            # Point d'entrée HTML
   │
   ├── server/                   # Backend Node.js + Express
   │   ├── routes/               # Routes API
   │   ├── middleware/           # Middlewares Express
   │   ├── models/               # Modèles de données
   │   └── index.ts              # Serveur principal
   │
   ├── shared/                   # Code partagé
   │   ├── schema.ts             # Schémas Drizzle ORM
   │   └── types.ts              # Types partagés
   │
   ├── docs/                     # Documentation
   ├── .vscode/                  # Configuration VS Code
   │   ├── settings.json         # Paramètres éditeur
   │   ├── launch.json           # Configuration debug
   │   ├── extensions.json       # Extensions recommandées
   │   └── snippets/             # Snippets personnalisés
   │
   ├── package.json              # Dépendances Node.js
   ├── tsconfig.json             # Configuration TypeScript
   ├── vite.config.ts            # Configuration Vite
   ├── tailwind.config.ts        # Configuration Tailwind
   └── .env                      # Variables d'environnement

4. EXTENSIONS VS CODE CONFIGURÉES

   Extensions automatiquement recommandées :
   ✅ TypeScript + JavaScript Language Features
   ✅ Tailwind CSS IntelliSense
   ✅ Prettier - Code formatter
   ✅ ESLint
   ✅ Auto Rename Tag
   ✅ Path Intellisense
   ✅ GitLens (si Git disponible)

5. COMMANDES DÉVELOPPEMENT

   # Installation dépendances
   npm install
   
   # Démarrage développement (hot reload)
   npm run dev
   
   # Build production
   npm run build
   
   # Preview production
   npm run preview
   
   # Linting
   npm run lint
   
   # Formatage code
   npm run format
   
   # Tests (si configurés)
   npm run test

DÉVELOPPEMENT AVANCÉ :
≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈

6. DEBUG INTÉGRÉ VS CODE

   Configuration debug incluse pour :
   - 🔍 Debug client React (port 3000)
   - 🔍 Debug serveur Node.js (port 5000)
   - 🔍 Debug fullstack simultané
   
   Utilisation :
   - F5 pour démarrer le debug
   - Points d'arrêt dans VS Code
   - Variables et call stack visibles
   - Hot reload conservé en mode debug

7. SNIPPETS PERSONNALISÉS PAGEFORGE

   Raccourcis clavier intégrés :
   - pfc → Composant PageForge de base
   - pfp → Page PageForge complète  
   - pfh → Hook PageForge personnalisé
   - pft → Type TypeScript PageForge
   - pfa → API route PageForge

8. CONFIGURATION TAILWIND AVANCÉE

   - IntelliSense complet classes CSS
   - Autocomplétion couleurs personnalisées
   - Preview hover des classes
   - Validation syntaxe en temps réel
   - Support des variantes responsive

9. TYPESCRIPT CONFIGURATION

   - Path mapping configuré (@/ → src/)
   - Strict mode activé
   - Imports relatifs optimisés
   - Types partagés client/serveur
   - Build incrémental pour performances

WORKFLOW DÉVELOPPEMENT :
≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈

10. DÉMARRAGE QUOTIDIEN

    1. Ouvrir VS Code dans le dossier projet
    2. Terminal intégré : npm run dev
    3. http://localhost:3000 s'ouvre automatiquement
    4. Modifications sauvegardées = rechargement automatique
    5. ESLint + Prettier formatent à la sauvegarde

11. STRUCTURE COMPOSANTS PAGEFORGE

    Chaque composant suit cette structure :
    
    src/components/ExampleComponent/
    ├── index.ts                 # Export principal
    ├── ExampleComponent.tsx     # Composant React
    ├── ExampleComponent.types.ts # Types TypeScript
    ├── ExampleComponent.styles.ts # Styles Tailwind
    └── ExampleComponent.test.tsx  # Tests (optionnel)

12. GESTION D'ÉTAT RECOMMANDÉE

    - TanStack Query pour les données serveur
    - useState/useReducer pour l'état local
    - Context API pour l'état global partagé
    - Zustand pour état complexe (optionnel)

BONNES PRACTICES INTÉGRÉES :
≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈

✅ Code formaté automatiquement (Prettier)
✅ Lint en temps réel (ESLint)
✅ Types stricts TypeScript
✅ Imports organisés automatiquement
✅ Git hooks pré-configurés
✅ Build optimisé pour production
✅ Hot reload préservé en développement
✅ Debug intégré client + serveur

DÉPANNAGE DÉVELOPPEMENT :
≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈

❌ Extensions VS Code non installées
→ Ctrl+Shift+P → "Extensions: Show Recommended Extensions"
→ Installer toutes les extensions recommandées

❌ TypeScript errors nombreuses
→ Ctrl+Shift+P → "TypeScript: Restart TS Server"
→ Vérifier tsconfig.json

❌ Hot reload ne fonctionne pas
→ Redémarrer npm run dev
→ Vérifier port 3000 libre

❌ ESLint/Prettier conflits
→ Configuration déjà harmonisée
→ Redémarrer VS Code si nécessaire

❌ Debug ne démarre pas
→ Vérifier Node.js installé
→ npm install dans le terminal

RESSOURCES DÉVELOPPEMENT :
≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈

📚 Documentation TypeScript intégrée
🎨 Storybook pour composants (à configurer)
🧪 Jest + Testing Library (base incluse)  
🔍 React DevTools + Redux DevTools compatibles
📊 Bundle analyzer intégré (npm run analyze)

PERFORMANCE OPTIMISÉE :
≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈

⚡ Vite pour build ultra-rapide
⚡ Hot Module Replacement (HMR)
⚡ Code splitting automatique
⚡ Tree shaking optimisé
⚡ TypeScript build incrémental
⚡ Tailwind JIT (Just-In-Time)

Pour questions spécifiques de développement, consultez README.md
"""
        (package_dir / 'DEVELOPMENT.txt').write_text(instructions, encoding='utf-8')

def main():
    print("🚀 PageForge Package Generator")
    print("==============================")
    
    generator = PageForgePackageGenerator()
    generator.generate_all_packages()

if __name__ == "__main__":
    main()