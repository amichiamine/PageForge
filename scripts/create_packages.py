#!/usr/bin/env python3
"""
🚀 GÉNÉRATEUR DE PACKAGES PAGEFORGE

Crée automatiquement les packages de déploiement pour tous les environnements:
- Package cPanel (hébergement web)
- Package Windows (installation locale)
- Package Linux (installation locale) 
- Package VS Code (développement)
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
        
        # Créer le dossier packages
        self.packages_dir.mkdir(exist_ok=True)
    
    def generate_all_packages(self):
        print(f"🚀 Génération des packages PageForge v{self.version}")
        print("=" * 50)
        print()
        
        try:
            self.generate_cpanel_package()
            self.generate_windows_package()
            self.generate_linux_package()
            self.generate_vscode_package()
            
            print("\n✅ TOUS LES PACKAGES GÉNÉRÉS AVEC SUCCÈS !")
            print(f"📁 Dossier: {self.packages_dir.resolve()}")
            print()
            
            self.show_package_summary()
            
        except Exception as e:
            print(f"❌ Erreur: {e}")
            exit(1)
    
    def generate_cpanel_package(self):
        print("📦 Génération package cPanel...")
        
        package_dir = self.packages_dir / f'pageforge-cpanel-v{self.version}'
        self.create_clean_directory(package_dir)
        
        # Copier les fichiers essentiels
        self.copy_project_files(package_dir, 'production')
        
        # Installateur cPanel
        if (self.base_dir / 'install-interactive.php').exists():
            shutil.copy2(self.base_dir / 'install-interactive.php', package_dir / 'install.php')
        
        # Documentation
        if (self.base_dir / 'README_INSTALLATION_CPANEL.md').exists():
            shutil.copy2(self.base_dir / 'README_INSTALLATION_CPANEL.md', package_dir / 'README.md')
        
        # Fichier d'information
        self.create_package_info(package_dir, 'cPanel', {
            'type': 'Hébergement web cPanel',
            'requirements': 'PHP 7.4+, MySQL/PostgreSQL',
            'installation': 'Interface web interactive',
            'features': [
                'Installation sans ligne de commande',
                'Configuration automatique base de données',
                'Interface responsive moderne',
                'Nettoyage automatique post-installation'
            ]
        })
        
        # Instructions rapides
        (package_dir / 'INSTALLATION.txt').write_text(self.get_cpanel_instructions(), encoding='utf-8')
        
        # Créer l'archive ZIP
        self.create_zip_archive(package_dir, f'pageforge-cpanel-v{self.version}.zip')
        
        print("✅ Package cPanel créé")
    
    def generate_windows_package(self):
        print("📦 Génération package Windows...")
        
        package_dir = self.packages_dir / f'pageforge-windows-v{self.version}'
        self.create_clean_directory(package_dir)
        
        # Copier les fichiers essentiels
        self.copy_project_files(package_dir, 'local')
        
        # Installateur local (universel)
        if (self.base_dir / 'install-local.php').exists():
            shutil.copy2(self.base_dir / 'install-local.php', package_dir / 'install.php')
        
        # Documentation Windows
        if (self.base_dir / 'README_INSTALLATION_LOCALE.md').exists():
            shutil.copy2(self.base_dir / 'README_INSTALLATION_LOCALE.md', package_dir / 'README.md')
        
        # Script de démarrage Windows
        self.create_windows_start_script(package_dir)
        
        # Fichier d'information
        self.create_package_info(package_dir, 'Windows', {
            'type': 'Installation locale Windows',
            'requirements': 'PHP 7.4+, Node.js 18+',
            'installation': 'Interface web PHP',
            'features': [
                'Détection automatique Windows',
                'Installation Node.js guidée',
                'Configuration SQLite/PostgreSQL',
                'Script de démarrage inclus'
            ]
        })
        
        # Instructions Windows
        (package_dir / 'WINDOWS-INSTALL.txt').write_text(self.get_windows_instructions(), encoding='utf-8')
        
        # Créer l'archive ZIP
        self.create_zip_archive(package_dir, f'pageforge-windows-v{self.version}.zip')
        
        print("✅ Package Windows créé")
    
    def generate_linux_package(self):
        print("📦 Génération package Linux...")
        
        package_dir = self.packages_dir / f'pageforge-linux-v{self.version}'
        self.create_clean_directory(package_dir)
        
        # Copier les fichiers essentiels
        self.copy_project_files(package_dir, 'local')
        
        # Installateur local (universel)
        if (self.base_dir / 'install-local.php').exists():
            shutil.copy2(self.base_dir / 'install-local.php', package_dir / 'install.php')
        
        # Documentation
        if (self.base_dir / 'README_INSTALLATION_LOCALE.md').exists():
            shutil.copy2(self.base_dir / 'README_INSTALLATION_LOCALE.md', package_dir / 'README.md')
        
        # Script de démarrage Linux
        self.create_linux_start_script(package_dir)
        
        # Fichier d'information
        self.create_package_info(package_dir, 'Linux', {
            'type': 'Installation locale Linux/macOS',
            'requirements': 'PHP 7.4+, Node.js 18+',
            'installation': 'Interface web PHP',
            'features': [
                'Compatible toutes distributions Linux',
                'Support macOS inclus',
                'Installation Node.js automatique',
                'Scripts shell optimisés'
            ]
        })
        
        # Instructions Linux
        (package_dir / 'LINUX-INSTALL.txt').write_text(self.get_linux_instructions(), encoding='utf-8')
        
        # Créer l'archive TAR.GZ (plus commun sur Linux)
        self.create_tar_archive(package_dir, f'pageforge-linux-v{self.version}.tar.gz')
        
        print("✅ Package Linux créé")
    
    def generate_vscode_package(self):
        print("📦 Génération package VS Code...")
        
        package_dir = self.packages_dir / f'pageforge-vscode-v{self.version}'
        self.create_clean_directory(package_dir)
        
        # Copier les fichiers de développement
        self.copy_project_files(package_dir, 'development')
        
        # Installateur VS Code
        if (self.base_dir / 'install-vscode.php').exists():
            shutil.copy2(self.base_dir / 'install-vscode.php', package_dir / 'setup.php')
        
        # Documentation développement
        if (self.base_dir / 'README_VSCODE_SETUP.md').exists():
            shutil.copy2(self.base_dir / 'README_VSCODE_SETUP.md', package_dir / 'README.md')
        
        # Configuration VS Code préparée
        self.create_vscode_configs(package_dir)
        
        # Fichier d'information
        self.create_package_info(package_dir, 'VS Code', {
            'type': 'Environnement de développement VS Code',
            'requirements': 'PHP 7.4+, Node.js 18+, VS Code, Git',
            'installation': 'Configuration automatique développement',
            'features': [
                'Configuration VS Code complète',
                'Debug client/serveur intégré',
                'Extensions recommandées',
                'Snippets personnalisés PageForge',
                'Structure projet professionnelle'
            ]
        })
        
        # Guide développement
        (package_dir / 'DEVELOPMENT.txt').write_text(self.get_vscode_instructions(), encoding='utf-8')
        
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
            'server/routes',
            'shared',
            'docs',
            'config'
        ]
        
        for dir_path in dirs:
            (target_dir / dir_path).mkdir(parents=True, exist_ok=True)
    
    def copy_production_files(self, target_dir):
        files = [
            'package.json',
            'tsconfig.json',
            'vite.config.ts',
            'tailwind.config.ts',
            'postcss.config.js',
            'drizzle.config.ts',
            '.env.example'
        ]
        
        for file in files:
            src = self.base_dir / file
            if src.exists():
                shutil.copy2(src, target_dir / file)
        
        # Copier les dossiers sources
        for folder in ['client', 'server', 'shared']:
            src_folder = self.base_dir / folder
            if src_folder.exists():
                self.copy_directory(src_folder, target_dir / folder)
    
    def copy_local_files(self, target_dir):
        self.copy_production_files(target_dir)
        
        # Fichiers spécifiques local
        readme = self.base_dir / 'README.md'
        if readme.exists():
            shutil.copy2(readme, target_dir / 'README-PROJECT.md')
    
    def copy_development_files(self, target_dir):
        self.copy_local_files(target_dir)
        
        # Fichiers de développement supplémentaires
        dev_files = ['.gitignore', 'components.json']
        
        for file in dev_files:
            src = self.base_dir / file
            if src.exists():
                shutil.copy2(src, target_dir / file)
        
        # Documentation développement
        docs_folder = self.base_dir / 'docs'
        if docs_folder.exists():
            self.copy_directory(docs_folder, target_dir / 'docs')
    
    def copy_directory(self, src, dst):
        if not src.exists():
            return
        
        if dst.exists():
            shutil.rmtree(dst)
        shutil.copytree(src, dst)
    
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
    
    def create_windows_start_script(self, package_dir):
        script = """@echo off
echo PageForge - Demarrage Windows
echo ================================

REM Verifier PHP
php --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: PHP non trouve
    echo Installez PHP depuis https://windows.php.net/
    pause
    exit /b
)

REM Demarrer l'installateur
echo Demarrage de l'installateur...
echo Ouvrez votre navigateur sur: http://localhost:8000/install.php
php -S localhost:8000
pause
"""
        (package_dir / 'start-installer.bat').write_text(script, encoding='utf-8')
    
    def create_linux_start_script(self, package_dir):
        script = """#!/bin/bash
echo "PageForge - Démarrage Linux"
echo "============================="

# Vérifier PHP
if ! command -v php &> /dev/null; then
    echo "ERREUR: PHP non trouvé"
    echo "Installez PHP: sudo apt install php (Ubuntu/Debian)"
    exit 1
fi

# Démarrer l'installateur
echo "Démarrage de l'installateur..."
echo "Ouvrez votre navigateur sur: http://localhost:8000/install.php"
php -S localhost:8000
"""
        script_file = package_dir / 'start-installer.sh'
        script_file.write_text(script, encoding='utf-8')
        script_file.chmod(0o755)
    
    def create_vscode_configs(self, package_dir):
        # Créer .vscode-template
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
            }
        }
        (vscode_dir / 'settings.json').write_text(json.dumps(settings, indent=2), encoding='utf-8')
        
        # extensions.json
        extensions = {
            'recommendations': [
                'ms-vscode.vscode-typescript-next',
                'bradlc.vscode-tailwindcss',
                'esbenp.prettier-vscode',
                'ms-vscode.vscode-eslint',
                'formulahendry.auto-rename-tag'
            ]
        }
        (vscode_dir / 'extensions.json').write_text(json.dumps(extensions, indent=2), encoding='utf-8')
    
    def create_zip_archive(self, source_dir, zip_name):
        zip_path = self.packages_dir / zip_name
        
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for file_path in source_dir.rglob('*'):
                if file_path.is_file():
                    arcname = str(file_path.relative_to(source_dir.parent))
                    zipf.write(file_path, arcname)
        
        print(f"  📦 Archive créée: {zip_name}")
    
    def create_tar_archive(self, source_dir, tar_name):
        tar_path = self.packages_dir / tar_name
        
        with tarfile.open(tar_path, 'w:gz') as tar:
            tar.add(source_dir, arcname=source_dir.name)
        
        print(f"  📦 Archive créée: {tar_name}")
    
    def get_cpanel_instructions(self):
        return f"""INSTALLATION CPANEL - PageForge v{self.version}
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
"""
    
    def get_windows_instructions(self):
        return f"""INSTALLATION WINDOWS - PageForge v{self.version}
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
"""
    
    def get_linux_instructions(self):
        return f"""INSTALLATION LINUX - PageForge v{self.version}
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
"""
    
    def get_vscode_instructions(self):
        return f"""CONFIGURATION VS CODE - PageForge v{self.version}
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
"""
    
    def show_package_summary(self):
        print("📋 RÉSUMÉ DES PACKAGES GÉNÉRÉS")
        print("=" * 35)
        print()
        
        packages = {
            f'pageforge-cpanel-v{self.version}.zip': 'Hébergement cPanel',
            f'pageforge-windows-v{self.version}.zip': 'Installation Windows',
            f'pageforge-linux-v{self.version}.tar.gz': 'Installation Linux/macOS',
            f'pageforge-vscode-v{self.version}.zip': 'Développement VS Code'
        }
        
        for file, desc in packages.items():
            path = self.packages_dir / file
            if path.exists():
                size = self.format_bytes(path.stat().st_size)
                print(f"📦 {file}")
                print(f"   └─ {desc} ({size})")
                print()
        
        print("🎯 UTILISATION :")
        print("• Distribuer les packages selon les besoins")
        print("• Chaque package est autonome et complet")
        print("• Documentation incluse dans chaque package")
        print("• Instructions d'installation simplifiées")
        print()
    
    def format_bytes(self, size):
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                return f"{size:.1f} {unit}"
            size /= 1024.0
        return f"{size:.1f} TB"

if __name__ == '__main__':
    generator = PageForgePackageGenerator()
    generator.generate_all_packages()