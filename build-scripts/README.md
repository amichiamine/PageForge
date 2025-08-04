# 🚀 PageForge - Scripts de Construction

Ce dossier contient tous les scripts nécessaires pour l'installation et la génération de packages PageForge.

## 📁 Structure

```
build-scripts/
├── install-cpanel.php      # Installateur cPanel avec Node.js Selector
├── install-local.php       # Installateur local universel (Windows/Linux/macOS)
├── create-packages.py      # Générateur de packages Python (principal)
├── generate-packages.sh    # Script shell unifié de génération
└── README.md              # Cette documentation
```

## 🚀 Utilisation Rapide

### Génération de tous les packages

```bash
# Linux/macOS
./build-scripts/generate-packages.sh

# Windows (Git Bash/WSL)
bash build-scripts/generate-packages.sh

# Python direct
python3 build-scripts/create-packages.py
```

### Installation cPanel

1. Uploader `install-cpanel.php` + package sur votre hébergement
2. Visiter : `https://votre-domaine.com/install-cpanel.php`
3. Suivre l'assistant d'installation en 7 étapes

### Installation locale

```bash
# Interface web
php -S localhost:8000 build-scripts/install-local.php

# Ligne de commande
php build-scripts/install-local.php
```

## 📦 Packages Générés

- **pageforge-cpanel-v2.0.0.zip** : Hébergement cPanel avec Node.js Selector
- **pageforge-windows-v2.0.0.zip** : Installation Windows avec scripts batch
- **pageforge-linux-v2.0.0.tar.gz** : Installation Linux/macOS avec scripts shell
- **pageforge-vscode-v2.0.0.zip** : Environnement de développement VS Code

## 🔧 Prérequis

### Pour la génération de packages
- Python 3.6+
- PHP 7.4+ (optionnel)
- Node.js 16+ (optionnel)

### Pour l'installation cPanel
- Hébergement cPanel actif
- PHP 7.4+ avec extensions : PDO, JSON, cURL, ZIP
- Base de données MySQL/PostgreSQL
- Node.js Selector (optionnel mais recommandé)

### Pour l'installation locale
- PHP 7.4+ avec SQLite
- Node.js 16+ (recommandé)

## 🛠️ Développement

Les scripts sont conçus pour être modulaires et maintenables :

- **install-cpanel.php** : Installation interactive avec interface moderne
- **install-local.php** : Installation universelle CLI/Web
- **create-packages.py** : Générateur principal avec filtrage intelligent
- **generate-packages.sh** : Wrapper shell avec vérifications et checksums

## 📚 Documentation

Chaque package généré inclut :
- README.md spécifique à la plateforme
- Guide d'installation détaillé
- Instructions de dépannage
- Fichier d'information du package

## 🔐 Sécurité

- Les installateurs se suppriment automatiquement après installation
- Validation des prérequis avant installation
- Configuration sécurisée par défaut
- Exclusion automatique des fichiers sensibles

## 🆘 Support

Pour des questions spécifiques :
1. Consultez la documentation dans chaque package
2. Vérifiez les logs d'installation
3. Référez-vous aux guides de dépannage inclus