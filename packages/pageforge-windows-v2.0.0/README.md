# 🏠 GUIDE D'INSTALLATION LOCALE - PageForge

## Installation Interactive PHP (Sans Ligne de Commande)

### 🎯 Vue d'Ensemble
Interface web interactive pour installer PageForge localement sur Windows, Linux ou macOS sans utiliser le terminal.

### 📋 Prérequis
- **PHP 7.4+** (déjà installé sur votre système)
- **500 MB** d'espace disque libre
- **Connexion internet** (pour téléchargement Node.js si nécessaire)
- **Navigateur moderne** (Chrome, Firefox, Safari, Edge)

### 📦 Préparation

1. **Télécharger PageForge :**
   ```bash
   # Si vous avez le projet source
   npm run build
   zip -r pageforge-files.zip dist/ server/ package.json .env.example docs/
   ```

2. **Préparer l'installation :**
   - Créer un dossier pour l'installation (ex: `pageforge-setup/`)
   - Placer `install-local.php` dans ce dossier
   - Placer `pageforge-files.zip` dans le même dossier

### 🚀 Installation

#### Étape 1 : Démarrer le Serveur PHP
```bash
# Dans le dossier contenant install-local.php
php -S localhost:8000
```

#### Étape 2 : Ouvrir l'Installateur
Ouvrir dans votre navigateur : **http://localhost:8000/install-local.php**

#### Étape 3 : Suivre l'Assistant
L'assistant vous guidera à travers 7 étapes :

1. **🏠 Accueil** - Présentation et prérequis
2. **🔧 Système** - Vérification compatibilité
3. **📦 Node.js** - Installation automatique si nécessaire
4. **📁 Fichiers** - Extraction du projet
5. **🗄️ Base de données** - Configuration (SQLite ou PostgreSQL)
6. **⚙️ Installation** - Installation dépendances NPM
7. **✅ Terminé** - Lancement de PageForge

### 🛠️ Fonctionnalités de l'Installateur

#### Interface Moderne
- **Design responsif** adapté mobile/desktop
- **Progression visuelle** avec étapes interactives
- **Animations fluides** et feedback utilisateur
- **Thème moderne** avec dégradés et effets visuels

#### Détection Automatique
- **OS Detection** : Windows, Linux, macOS
- **Vérifications système** : PHP, extensions, permissions
- **Node.js** : Détection version et installation guidée
- **Fichiers projet** : Scan et validation automatiques

#### Installation Intelligente
- **Configuration base de données** : SQLite (local) ou PostgreSQL
- **Installation NPM** : Dépendances installées automatiquement
- **Variables d'environnement** : Configuration .env automatique
- **Tests intégrés** : Validation du fonctionnement

### ⚙️ Options de Configuration

#### Base de Données
- **SQLite** (Recommandé pour local) : `sqlite:./pageforge.db`
- **PostgreSQL** : `postgresql://user:pass@localhost:5432/db`

#### Variables d'Environnement Générées
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=sqlite:./pageforge.db
APP_NAME="PageForge Local"
APP_URL="http://localhost:5000"
```

### 📁 Structure Après Installation

```
pageforge-setup/
├── install-local.php           # Installateur (à supprimer après)
├── pageforge-files.zip        # Archive source
└── pageforge-installation/    # Installation finale
    ├── dist/                   # Frontend build
    ├── server/                 # Backend Node.js
    ├── docs/                   # Documentation
    ├── .env                    # Configuration
    ├── package.json           # Dépendances
    └── node_modules/          # Modules NPM
```

### 🎮 Utilisation Post-Installation

#### Démarrage Manuel
```bash
cd pageforge-installation
npm run dev
```

#### Accès à PageForge
- **URL** : http://localhost:5000
- **Interface** : Éditeur visuel avec 52 composants
- **Fonctionnalités** : Création, édition, export de sites

#### Commandes Utiles
```bash
# Démarrage développement
npm run dev

# Build production
npm run build

# Tests
npm run check

# Arrêt du serveur
Ctrl+C (dans le terminal)
```

### 🔒 Sécurité

#### Après Installation
1. **Supprimer** `install-local.php` (automatique via interface)
2. **Vérifier** les permissions du dossier `.env`
3. **Firewall** : Port 5000 accessible uniquement en local

### 🚨 Résolution de Problèmes

#### Node.js Non Détecté
```bash
# Vérifier installation
node --version
npm --version

# Redémarrer l'installateur après installation
```

#### Erreur Permissions
```bash
# Linux/macOS
chmod 755 pageforge-installation/
chmod 644 pageforge-installation/.env

# Windows : Propriétés > Sécurité > Modifier
```

#### Port 5000 Occupé
Modifier le port dans `.env` :
```env
PORT=3000
```

#### Erreur NPM Install
```bash
# Nettoyer cache NPM
npm cache clean --force

# Installation manuelle
cd pageforge-installation
npm install
```

### 📊 Comparaison des Méthodes d'Installation

| Méthode | Facilité | Contrôle | OS Support |
|---------|----------|----------|------------|
| **PHP Interactive** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Windows, Linux, macOS |
| Script .bat | ⭐⭐⭐ | ⭐⭐⭐⭐ | Windows uniquement |
| Script .sh | ⭐⭐⭐ | ⭐⭐⭐⭐ | Linux, macOS |
| Installation manuelle | ⭐⭐ | ⭐⭐⭐⭐⭐ | Tous |

### 📞 Support

#### Logs d'Installation
- **Fichier** : `installation-local.log`
- **Contenu** : Détails complets de l'installation
- **Localisation** : Même dossier que l'installateur

#### Problèmes Courants
1. **PHP Extensions manquantes** : Installer php-zip, php-curl
2. **Node.js version** : Minimum v18 requis
3. **Espace disque** : 500MB minimum nécessaire
4. **Permissions** : Dossier en écriture requis

**🎉 PageForge sera prêt en quelques clics, sans ligne de commande !**