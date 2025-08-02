# 📦 SiteJet - Package de Distribution

## Vue d'Ensemble

Ce package contient l'éditeur visuel SiteJet complet, prêt à installer et utiliser. Il inclut l'application compilée, la documentation complète, et des scripts d'installation automatique pour Windows, Linux et macOS.

## 🚀 Installation Rapide

### Windows
```cmd
# Installation simple et rapide
scripts\install-windows.bat

# OU contournement PowerShell (si politique restrictive)
scripts\run-powershell.bat

# OU PowerShell direct (si autorisé)
powershell -ExecutionPolicy Bypass -File "scripts\Install-SiteJet.ps1"
```

### Linux/macOS
```bash
# Installation automatique
./scripts/package-installer.sh

# OU installation manuelle
cd app/
npm install
npm run dev
```

## 📋 Contenu du Package

### Structure
```
SiteJet-Distribution/
├── app/                    # Application SiteJet complète
│   ├── dist/              # Build de production
│   ├── client/            # Interface utilisateur React
│   ├── server/            # Serveur Express/Node.js
│   ├── shared/            # Types et schémas partagés
│   └── package.json       # Dépendances et scripts
├── docs/                   # Documentation complète
│   ├── INSTALLATION_GUIDE_WINDOWS.md
│   ├── INSTALLATION_GUIDE_LINUX.md
│   ├── USER_MANUAL.md
│   └── TROUBLESHOOTING.md
├── scripts/               # Scripts d'installation
│   ├── package-installer.bat  # Windows automatique
│   ├── package-installer.sh   # Linux/macOS automatique
│   ├── install-simple.bat     # Windows simple
│   └── install-minimal.bat    # Windows minimal
├── config/                # Fichiers de configuration
│   ├── .env.example
│   ├── nginx.conf.example
│   └── pm2.config.js
└── README.md              # Ce fichier
```

### Taille du Package
- **Application complète** : ~1.2 MB
- **Documentation** : ~150 KB
- **Scripts et config** : ~50 KB
- **Archive totale** : ~400-500 KB compressé

## 🎯 Types d'Installation

### 1. Installation Windows Simple
- **Script** : `install-windows.bat` (Windows)
- **Fonctionnalités** :
  - Aucune restriction PowerShell
  - Compatible VMware/environnements virtuels
  - Installation robuste en 5 étapes
  - Configuration automatique
  - Démarrage optionnel

### 2. Installation PowerShell (si autorisée)
- **Scripts** : `Install-SiteJet.ps1`, `Quick-Install.ps1`, `Test-SiteJet.ps1`
- **Lancement** : `run-powershell.bat` (contourne les restrictions)
- **Fonctionnalités** :
  - Interface moderne avec couleurs
  - Diagnostic complet disponible
  - Gestion d'erreurs avancée

### 3. Installation Manuelle (universelle)
- **Méthode** : Commandes directes sans scripts
- **Avantages** : Fonctionne toujours, contrôle total

### Installation Manuelle (toujours fonctionnelle)
```cmd
# Windows Command Prompt (depuis la racine du projet)
npm install
copy config\.env.example .env 2>nul || echo DATABASE_URL=sqlite:./database.db > .env
npm run db:push
npm run dev
```

```bash
# Linux/macOS
cd app/
npm install
cp ../config/.env.example .env
npm run db:push
npm run dev
```

## 🔧 Prérequis Système

### Minimum Requis
- **Node.js** 18.0+ (https://nodejs.org)
- **npm** 8.0+ (inclus avec Node.js)
- **RAM** 4 Go
- **Espace disque** 2 Go libres
- **Navigateur** moderne (Chrome 90+, Firefox 88+, Safari 14+)

### Recommandé
- **Node.js** 20.0+
- **RAM** 8 Go+
- **SSD** pour de meilleures performances
- **Connexion internet** pour les mises à jour

## 🌐 Après Installation

### Démarrage
```bash
cd app/
npm run dev
```

### Accès à l'Interface
- **URL locale** : http://localhost:3000
- **Interface d'édition** : Drag & drop visuel
- **Palette de composants** : 50+ éléments
- **Export** : HTML/CSS/JS optimisé

### Fonctionnalités Principales
- 🎨 **Éditeur visuel** avec drag & drop
- 📱 **Design responsive** automatique
- 🧩 **50+ composants** organisés par catégories
- 🎨 **Templates professionnels** prêts à utiliser
- 📤 **Export multi-format** (HTML, CSS, JS)
- 🔍 **SEO optimisé** automatiquement

## 📚 Documentation Disponible

### Guides d'Installation
- **`INSTALLATION_GUIDE_WINDOWS.md`** - Guide Windows détaillé (18 sections)
- **`INSTALLATION_GUIDE_LINUX.md`** - Guide Linux/Ubuntu complet (10 sections)
- **`QUICK_START_GUIDE.md`** - Démarrage rapide en 5 minutes

### Guides d'Utilisation
- **`USER_MANUAL.md`** - Manuel utilisateur complet (25+ sections)
- **`TROUBLESHOOTING.md`** - Résolution de problèmes courants

### Guides de Déploiement
- **`DEPLOYMENT_HOSTING_GUIDE.md`** - Déploiement sur tous hébergeurs
- **`DISTRIBUTION_PACKAGE_GUIDE.md`** - Création de packages

## 🚨 Résolution de Problèmes

### Installation qui se Bloque
1. **Utiliser install-simple.bat** pour Windows
2. **Vérifier la connexion internet** (npm registry)
3. **Vider le cache npm** : `npm cache clean --force`
4. **Consulter TROUBLESHOOTING.md** pour solutions détaillées

### Erreurs Courantes

#### "Node.js non reconnu"
- **Solution** : Redémarrer l'ordinateur après installation Node.js
- **Alternative** : Réinstaller Node.js en tant qu'administrateur

#### "VMware était inattendu" (Environnements VMware)
- **Problème** : VMware interfère avec les scripts batch Windows
- **Solution** : Utiliser le script simple `install-windows.bat`
- **Alternative** : Contourner avec `run-powershell.bat`

#### "Script PowerShell non signé" (Politique d'exécution)
- **Problème** : Windows bloque les scripts PowerShell non signés
- **Solution rapide** : Utiliser `install-windows.bat` (pas de restriction)
- **Solution PowerShell** : `powershell -ExecutionPolicy Bypass -File "scripts\Install-SiteJet.ps1"`
- **Solution permanente** : `Set-ExecutionPolicy RemoteSigned` (en tant qu'administrateur)

#### "npm install échoue"
- **Solution 1** : `npm cache clean --force`
- **Solution 2** : `npm install --legacy-peer-deps`
- **Solution 3** : Vérifier l'espace disque disponible

#### "Port 3000 already in use"
- **Solution** : Changer le port dans .env : `PORT=8000`
- **Alternative** : Tuer le processus : `netstat -ano | findstr :3000`

### Support
- **Documentation complète** : Dossier `docs/`
- **Scripts de diagnostic** : `install-debug.bat`
- **Tests système** : `test-installer-windows.bat`

## 🎉 Après Installation Réussie

### Vérification
1. **Serveur démarré** : Message "serving on port 3000"
2. **Interface accessible** : http://localhost:3000 se charge
3. **Composants disponibles** : Palette à gauche visible
4. **Drag & drop fonctionnel** : Composants se déplacent

### Premiers Pas
1. **Créer un nouveau projet** ou choisir un template
2. **Glisser-déposer des composants** depuis la palette
3. **Configurer les propriétés** dans le panneau de droite
4. **Tester le responsive** avec l'aperçu mobile
5. **Exporter le site** en HTML/CSS/JS

### Fonctionnalités Avancées
- **Multi-pages** : Gestion de sites complexes
- **Templates personnalisés** : Créer ses propres modèles
- **Export optimisé** : Code minifié et SEO-friendly
- **Déploiement** : Sur tous types d'hébergement

## 📝 Notes de Version

### Version Actuelle
- **Application** : SiteJet v2.0
- **Distribution** : Package v1.0
- **Compatibilité** : Node.js 18-22, Windows 10+, Linux Ubuntu 20+

### Nouveautés
- ✅ Scripts d'installation automatique multi-OS
- ✅ Documentation complète pour débutants
- ✅ 50+ composants avec validation automatique
- ✅ Export optimisé avec minification
- ✅ Support multi-hébergement complet

---

**🚀 SiteJet - L'éditeur visuel nouvelle génération pour créer des sites web sans programmation !**

*Pour toute question, consultez la documentation complète dans le dossier `docs/` ou le guide de dépannage `TROUBLESHOOTING.md`.*