# 📦 GUIDE DE DISTRIBUTION - PACKAGES PAGEFORGE v2.0.0

## Vue d'Ensemble

Cette collection contient tous les packages de déploiement PageForge pour différents environnements et cas d'usage.

## 📁 Packages Disponibles

### 🌐 pageforge-cpanel-v2.0.0.zip (262 KB)
**Pour hébergement web cPanel**
- **Contenu** : Installateur web + projet complet
- **Utilisation** : Hébergement partagé, VPS avec cPanel
- **Installation** : Interface web sans ligne de commande
- **Fichiers** : install.php + documentation complète

**Instructions :**
1. Extraire le ZIP dans public_html
2. Aller sur votre-domaine.com/install.php
3. Suivre l'assistant 7 étapes
4. PageForge prêt à utiliser

### 💻 pageforge-windows-v2.0.0.zip (264 KB)
**Pour installation locale Windows**
- **Contenu** : Installateur PHP + scripts Windows
- **Utilisation** : Windows 10/11, développement local
- **Installation** : Double-clic sur start-installer.bat
- **Fichiers** : install.php + start-installer.bat

**Instructions :**
1. Extraire le ZIP dans un dossier
2. Double-cliquer sur start-installer.bat
3. Interface web s'ouvre automatiquement
4. Configuration Windows automatique

### 🐧 pageforge-linux-v2.0.0.tar.gz (222 KB)
**Pour installation locale Linux/macOS**
- **Contenu** : Installateur PHP + scripts shell
- **Utilisation** : Linux (toutes distributions), macOS
- **Installation** : ./start-installer.sh
- **Fichiers** : install.php + start-installer.sh

**Instructions :**
1. Extraire : tar -xzf pageforge-linux-v2.0.0.tar.gz
2. Exécuter : ./start-installer.sh
3. Interface web interactive
4. Compatible toutes distributions

### 🛠️ pageforge-vscode-v2.0.0.zip (315 KB)
**Pour développement VS Code**
- **Contenu** : Configurateur développement + templates
- **Utilisation** : Développement professionnel
- **Installation** : setup.php + configuration VS Code
- **Fichiers** : setup.php + configurations VS Code

**Instructions :**
1. Extraire dans workspace de développement
2. Lancer : php -S localhost:8080
3. Aller sur localhost:8080/setup.php
4. Ouvrir avec code .

## 🎯 Guide de Sélection

### Pour Hébergement Web
```
Hébergement partagé → pageforge-cpanel-v2.0.0.zip
VPS avec cPanel    → pageforge-cpanel-v2.0.0.zip
Serveur dédié      → pageforge-linux-v2.0.0.tar.gz
```

### Pour Usage Local
```
Windows utilisateur  → pageforge-windows-v2.0.0.zip
Linux/macOS         → pageforge-linux-v2.0.0.tar.gz
Développement       → pageforge-vscode-v2.0.0.zip
```

### Pour Développement
```
Développeur         → pageforge-vscode-v2.0.0.zip
Contribution code   → pageforge-vscode-v2.0.0.zip
Debug/Test          → pageforge-vscode-v2.0.0.zip
```

## 🔧 Prérequis par Package

### Tous les Packages
- **PHP 7.4+** (pour l'installateur)
- **Node.js 18+** (installé automatiquement si manquant)
- **500 MB** d'espace disque libre

### Package cPanel
- **MySQL 5.7+** ou PostgreSQL
- **Hébergement web** avec support PHP
- **Domaine configuré**

### Packages Windows/Linux
- **Permissions** d'écriture dans le dossier
- **Accès réseau** pour téléchargements

### Package VS Code
- **VS Code** installé
- **Git** (recommandé)
- **PostgreSQL** pour développement

## 📋 Contenu Détaillé

### Structure Commune
```
package-xxx/
├── install.php ou setup.php    # Installateur principal
├── README.md                   # Documentation
├── PACKAGE-INFO.md            # Informations package
├── client/                    # Frontend React
├── server/                    # Backend Express
├── shared/                    # Code partagé
├── docs/                      # Documentation
└── config/                    # Configurations
```

### Fichiers Spécifiques

**Package cPanel :**
- `INSTALLATION.txt` - Instructions rapides
- Configuration SSL automatique
- Scripts de déploiement optimisés

**Package Windows :**
- `start-installer.bat` - Script de démarrage
- `WINDOWS-INSTALL.txt` - Guide Windows
- Détection automatique environnement

**Package Linux :**
- `start-installer.sh` - Script shell
- `LINUX-INSTALL.txt` - Guide distributions
- Support macOS inclus

**Package VS Code :**
- `.vscode-template/` - Configurations prêtes
- `DEVELOPMENT.txt` - Guide développement
- Snippets personnalisés PageForge

## 🚀 Installation Type par Type

### 🌐 Installation cPanel (Production)
```bash
# 1. Upload via File Manager
# 2. Extraire pageforge-cpanel-v2.0.0.zip
# 3. Navigateur : votre-domaine.com/install.php
# 4. Configuration automatique BDD
# 5. Suppression auto install.php
```

### 💻 Installation Windows (Local)
```cmd
# 1. Extraire pageforge-windows-v2.0.0.zip
# 2. Double-clic start-installer.bat
# 3. Navigateur s'ouvre automatiquement
# 4. Configuration Windows guidée
# 5. PageForge sur localhost:5000
```

### 🐧 Installation Linux (Local)
```bash
# 1. Extraire le TAR.GZ
tar -xzf pageforge-linux-v2.0.0.tar.gz
cd pageforge-linux-v2.0.0

# 2. Lancer l'installateur
./start-installer.sh

# 3. Interface web s'ouvre
# 4. Configuration distribution automatique
```

### 🛠️ Configuration VS Code (Développement)
```bash
# 1. Extraire dans workspace
unzip pageforge-vscode-v2.0.0.zip
cd pageforge-vscode-v2.0.0

# 2. Lancer le configurateur
php -S localhost:8080

# 3. Navigateur : localhost:8080/setup.php
# 4. Configuration VS Code complète

# 5. Ouvrir dans VS Code
code .
```

## 📊 Comparaison des Packages

| Package | Taille | Installation | Complexité | Usage |
|---------|--------|--------------|------------|--------|
| **cPanel** | 262 KB | Interface web | Facile | Production |
| **Windows** | 264 KB | Double-clic | Très facile | Local |
| **Linux** | 222 KB | Script shell | Facile | Local |
| **VS Code** | 315 KB | Configuration | Modérée | Développement |

## 🔒 Sécurité et Bonnes Pratiques

### Après Installation
1. **Supprimer les installateurs** (fait automatiquement)
2. **Configurer HTTPS** (cPanel automatique)
3. **Vérifier les permissions** fichiers
4. **Sauvegarder la configuration**

### Variables d'Environnement
```env
# Production (cPanel)
NODE_ENV=production
DATABASE_URL=mysql://...

# Local (Windows/Linux)  
NODE_ENV=development
DATABASE_URL=sqlite:./pageforge.db

# Développement (VS Code)
NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/pageforge_dev
```

## 📞 Support et Dépannage

### Problèmes Courants

**PHP non trouvé :**
```bash
# Windows
Installer depuis php.net

# Linux
sudo apt install php php-zip php-curl  # Ubuntu/Debian
sudo yum install php php-zip php-curl  # CentOS/RHEL
```

**Node.js manquant :**
- Sera installé automatiquement via les installateurs
- Ou manuellement depuis nodejs.org

**Permissions insuffisantes :**
```bash
# Linux/macOS
chmod +x start-installer.sh
chmod 755 dossier-projet/
```

### Logs et Debug
- Chaque installateur génère des logs détaillés
- Fichiers de log : `installation-xxx.log`
- Console navigateur pour erreurs web

## 🎉 Résumé

**4 packages prêts à distribuer :**
- ✅ Hébergement web (cPanel)
- ✅ Installation Windows
- ✅ Installation Linux/macOS  
- ✅ Développement VS Code

**Chaque package inclut :**
- Installation sans ligne de commande
- Documentation complète
- Configuration automatique
- Scripts optimisés par plateforme

**PageForge v2.0.0 prêt pour distribution universelle !**