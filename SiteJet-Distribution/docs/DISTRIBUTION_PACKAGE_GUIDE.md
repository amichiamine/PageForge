# 📦 Guide de Création de Package de Distribution SiteJet

## Manuel Complet pour Créer et Distribuer SiteJet

Ce guide explique comment créer un package de distribution professionnel de SiteJet pour d'autres utilisateurs.

---

## 🎯 Vue d'ensemble du Package de Distribution

Le package de distribution SiteJet comprend :
- **Application compilée** prête à déployer
- **Manuel d'installation** pas à pas
- **Scripts d'installation automatique**
- **Documentation complète**
- **Fichiers de configuration** exemple
- **Support multi-plateforme** (Windows, Linux, macOS)

---

## 📋 ÉTAPE 1 : Préparation de l'Application

### 1.1 Nettoyage du projet
1. Dans VS Code, ouvrez le terminal
2. Supprimez les fichiers de développement :
   ```bash
   # Windows
   rmdir /s node_modules
   del package-lock.json
   
   # Linux/macOS
   rm -rf node_modules
   rm package-lock.json
   ```

### 1.2 Vérification de la configuration
1. Vérifiez que ces fichiers sont à jour :
   - `package.json` - Dépendances correctes
   - `README.md` - Documentation de base
   - `.env.example` - Variables d'environnement exemple

### 1.3 Test complet de l'application
```bash
# Réinstallation propre
npm install

# Test de build
npm run build

# Test de démarrage
npm run dev
```

---

## 🏗 ÉTAPE 2 : Construction du Package

### 2.1 Création de la structure de distribution
```
SiteJet-Distribution/
├── app/                          # Application principale
│   ├── dist/                     # Fichiers compilés
│   ├── package.json              # Dépendances
│   ├── server/                   # Code serveur
│   └── client/                   # Code client
├── docs/                         # Documentation complète
│   ├── INSTALLATION_WINDOWS.md
│   ├── INSTALLATION_LINUX.md
│   ├── USER_MANUAL.md
│   └── TROUBLESHOOTING.md
├── scripts/                      # Scripts d'installation
│   ├── install-windows.bat
│   ├── install-linux.sh
│   └── install-macos.sh
├── config/                       # Fichiers de configuration
│   ├── .env.example
│   ├── nginx.conf.example
│   └── pm2.config.js
├── INSTALL.txt                   # Instructions rapides
├── LICENSE                       # Licence
└── README.md                     # Information principale
```

### 2.2 Script de création automatique de package

Créez `create-distribution.js` :

```javascript
#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

async function createDistribution() {
    console.log('🚀 Création du package de distribution SiteJet...\n');
    
    // 1. Nettoyage
    console.log('📁 Nettoyage des anciens fichiers...');
    await fs.remove('SiteJet-Distribution');
    
    // 2. Création de la structure
    console.log('🏗  Création de la structure...');
    const dirs = [
        'SiteJet-Distribution/app',
        'SiteJet-Distribution/docs',
        'SiteJet-Distribution/scripts',
        'SiteJet-Distribution/config',
        'SiteJet-Distribution/examples'
    ];
    
    for (const dir of dirs) {
        await fs.ensureDir(dir);
    }
    
    // 3. Build de production
    console.log('⚙️  Compilation de l\'application...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // 4. Copie des fichiers principaux
    console.log('📋 Copie des fichiers...');
    await fs.copy('dist', 'SiteJet-Distribution/app/dist');
    await fs.copy('server', 'SiteJet-Distribution/app/server');
    await fs.copy('shared', 'SiteJet-Distribution/app/shared');
    await fs.copy('package.json', 'SiteJet-Distribution/app/package.json');
    await fs.copy('docs', 'SiteJet-Distribution/docs');
    
    // 5. Création des scripts d'installation
    console.log('📜 Création des scripts...');
    await createInstallationScripts();
    
    // 6. Création des fichiers de configuration
    console.log('⚙️  Création des configurations...');
    await createConfigFiles();
    
    // 7. Création de la documentation
    console.log('📚 Génération de la documentation...');
    await createDocumentation();
    
    // 8. Package final
    console.log('📦 Création des archives...');
    await createArchives();
    
    console.log('\n✅ Package de distribution créé avec succès !');
    console.log('📁 Dossier : SiteJet-Distribution/');
    console.log('📦 Archives : SiteJet-Windows.zip, SiteJet-Linux.tar.gz');
}

async function createInstallationScripts() {
    // Script Windows
    const windowsScript = `@echo off
echo ================================
echo Installation de SiteJet Windows
echo ================================

echo Verification de Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js n'est pas installe !
    echo Veuillez installer Node.js depuis https://nodejs.org
    pause
    exit /b 1
)

echo Installation des dependances...
cd app
npm install

echo Configuration de la base de donnees...
npm run db:push

echo Installation terminee !
echo Pour demarrer : npm run dev
pause
`;
    
    await fs.writeFile('SiteJet-Distribution/scripts/install-windows.bat', windowsScript);
    
    // Script Linux
    const linuxScript = `#!/bin/bash
echo "================================"
echo "Installation de SiteJet Linux"
echo "================================"

# Vérification de Node.js
if ! command -v node &> /dev/null; then
    echo "Node.js n'est pas installé !"
    echo "Installation de Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install nodejs -y
fi

echo "Installation des dépendances..."
cd app
npm install

echo "Configuration de la base de données..."
npm run db:push

echo "Installation terminée !"
echo "Pour démarrer : npm run dev"
`;
    
    await fs.writeFile('SiteJet-Distribution/scripts/install-linux.sh', linuxScript);
    await fs.chmod('SiteJet-Distribution/scripts/install-linux.sh', '755');
}

async function createConfigFiles() {
    // .env.example
    const envExample = `# Configuration SiteJet
DATABASE_URL=postgresql://username:password@localhost:5432/sitejet_db
NODE_ENV=production
PORT=3000

# Variables optionnelles
ADMIN_EMAIL=admin@example.com
APP_NAME=SiteJet
DEBUG=false
`;
    
    await fs.writeFile('SiteJet-Distribution/config/.env.example', envExample);
    
    // Configuration Nginx
    const nginxConfig = `server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}`;
    
    await fs.writeFile('SiteJet-Distribution/config/nginx.conf.example', nginxConfig);
}

async function createDocumentation() {
    const mainReadme = `# SiteJet - Éditeur Visuel de Sites Web

## 🎯 Qu'est-ce que SiteJet ?

SiteJet est un éditeur visuel puissant pour créer des sites web sans code. Il offre :
- Interface drag & drop intuitive
- 52+ composants prêts à utiliser
- Système responsive automatique
- Export multi-format
- Templates professionnels

## 🚀 Installation Rapide

### Windows
1. Double-cliquez sur \`scripts/install-windows.bat\`
2. Suivez les instructions à l'écran
3. Lancez avec \`npm run dev\`

### Linux
1. Exécutez \`./scripts/install-linux.sh\`
2. Suivez les instructions à l'écran
3. Lancez avec \`npm run dev\`

## 📚 Documentation Complète

- \`docs/INSTALLATION_WINDOWS.md\` - Guide Windows détaillé
- \`docs/INSTALLATION_LINUX.md\` - Guide Linux détaillé
- \`docs/USER_MANUAL.md\` - Manuel d'utilisation
- \`docs/TROUBLESHOOTING.md\` - Résolution de problèmes

## 🆘 Support

- Email : support@sitejet.com
- GitHub : https://github.com/votre-nom/sitejet
- Documentation : https://docs.sitejet.com

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.
`;
    
    await fs.writeFile('SiteJet-Distribution/README.md', mainReadme);
    
    const quickInstall = `INSTALLATION RAPIDE SITEJET
============================

PRÉREQUIS :
- Node.js 18+ (https://nodejs.org)
- 4 Go RAM minimum
- 2 Go espace disque

WINDOWS :
1. Double-clic sur scripts/install-windows.bat
2. Attendre la fin de l'installation
3. Aller dans le dossier app/
4. Taper : npm run dev
5. Ouvrir http://localhost:3000

LINUX :
1. Ouvrir un terminal
2. Taper : ./scripts/install-linux.sh
3. Attendre la fin de l'installation
4. Aller dans le dossier app/
5. Taper : npm run dev
6. Ouvrir http://localhost:3000

AIDE :
- Consulter docs/ pour plus de détails
- Email : support@sitejet.com
`;
    
    await fs.writeFile('SiteJet-Distribution/INSTALL.txt', quickInstall);
}

async function createArchives() {
    const archiver = require('archiver');
    
    // Archive Windows (ZIP)
    const outputZip = fs.createWriteStream('SiteJet-Windows.zip');
    const archiveZip = archiver('zip', { zlib: { level: 9 } });
    
    outputZip.on('close', () => {
        console.log(`📦 SiteJet-Windows.zip créé (${archiveZip.pointer()} bytes)`);
    });
    
    archiveZip.pipe(outputZip);
    archiveZip.directory('SiteJet-Distribution/', false);
    await archiveZip.finalize();
    
    // Archive Linux (TAR.GZ)
    execSync('tar -czf SiteJet-Linux.tar.gz SiteJet-Distribution/', { stdio: 'inherit' });
    console.log('📦 SiteJet-Linux.tar.gz créé');
}

// Lancement du script
if (require.main === module) {
    createDistribution().catch(console.error);
}

module.exports = { createDistribution };
```

### 2.3 Exécution du script de création
```bash
# Installation des dépendances nécessaires
npm install fs-extra archiver --save-dev

# Exécution du script
node create-distribution.js
```

---

## 📚 ÉTAPE 3 : Documentation du Package

### 3.1 Manuel d'utilisation utilisateur final

Créez `docs/USER_MANUAL.md` :

```markdown
# 📖 Manuel d'Utilisation SiteJet

## Premiers Pas

### Lancement de SiteJet
1. Ouvrez votre terminal/invite de commande
2. Naviguez vers le dossier SiteJet
3. Tapez : `npm run dev`
4. Ouvrez votre navigateur sur http://localhost:3000

### Interface Principale
- **Palette de Composants** : Faites glisser les éléments
- **Zone d'Édition** : Déposez et modifiez vos composants
- **Panneau de Propriétés** : Personnalisez l'apparence
- **Menu Projet** : Sauvegarde et export

## Création d'un Projet

### Nouveau Projet
1. Cliquez "Nouveau Projet"
2. Choisissez un template ou partez de zéro
3. Donnez un nom à votre projet
4. Cliquez "Créer"

### Ajout de Composants
1. Dans la palette, sélectionnez une catégorie
2. Glissez un composant vers la zone d'édition
3. Le composant s'adapte automatiquement

### Personnalisation
1. Cliquez sur un composant pour le sélectionner
2. Le panneau de propriétés s'ouvre
3. Modifiez couleurs, textes, tailles
4. Les changements sont instantanés

## Export et Déploiement

### Export HTML/CSS
1. Menu "Projet" → "Exporter"
2. Choisissez le format (HTML/CSS/JS)
3. Cliquez "Télécharger"
4. Votre site est prêt à déployer

### Déploiement Web
1. Uploadez les fichiers exportés
2. Configurez votre serveur web
3. Votre site est en ligne !
```

### 3.2 Guide de dépannage

Créez `docs/TROUBLESHOOTING.md` avec les solutions aux problèmes courants.

---

## 🔧 ÉTAPE 4 : Scripts d'Installation Automatique

### 4.1 Installateur Windows avancé

```batch
@echo off
setlocal EnableDelayedExpansion

echo ========================================
echo     INSTALLATEUR SITEJET WINDOWS
echo ========================================
echo.

:: Vérification des privilèges administrateur
net session >nul 2>&1
if %errorLevel% == 0 (
    echo [OK] Privilèges administrateur détectés
) else (
    echo [ERREUR] Privilèges administrateur requis
    echo Clic droit sur ce fichier et "Exécuter en tant qu'administrateur"
    pause
    exit /b 1
)

:: Vérification de Node.js
echo Vérification de Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [INSTALL] Node.js manquant, téléchargement...
    powershell -Command "& {Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi' -OutFile 'nodejs-installer.msi'}"
    echo Installation de Node.js...
    msiexec /i nodejs-installer.msi /quiet
    del nodejs-installer.msi
    echo Node.js installé !
) else (
    echo [OK] Node.js trouvé
)

:: Installation de SiteJet
echo.
echo Installation de SiteJet...
cd app
echo Installation des dépendances...
npm install

echo Configuration de la base de données...
copy ..\config\.env.example .env
npm run db:push

echo.
echo ========================================
echo      INSTALLATION TERMINÉE !
echo ========================================
echo.
echo Pour démarrer SiteJet :
echo 1. Ouvrez une invite de commande
echo 2. Naviguez vers le dossier app\
echo 3. Tapez : npm run dev
echo 4. Ouvrez http://localhost:3000
echo.
pause
```

### 4.2 Installateur Linux/macOS avancé

```bash
#!/bin/bash

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================"
echo -e "     INSTALLATEUR SITEJET LINUX"
echo -e "========================================${NC}"
echo

# Détection de l'OS
OS="$(uname -s)"
case "${OS}" in
    Linux*)     MACHINE=Linux;;
    Darwin*)    MACHINE=macOS;;
    *)          MACHINE="UNKNOWN:${OS}"
esac

echo -e "${GREEN}[INFO]${NC} Système détecté : $MACHINE"

# Fonction d'installation Node.js pour Linux
install_nodejs_linux() {
    echo -e "${YELLOW}[INSTALL]${NC} Installation de Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install nodejs -y
}

# Fonction d'installation Node.js pour macOS
install_nodejs_macos() {
    echo -e "${YELLOW}[INSTALL]${NC} Installation de Node.js..."
    if command -v brew &> /dev/null; then
        brew install node
    else
        echo -e "${RED}[ERREUR]${NC} Homebrew requis sur macOS"
        echo "Installez Homebrew : /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
}

# Vérification de Node.js
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}[INSTALL]${NC} Node.js non trouvé"
    case $MACHINE in
        Linux)
            install_nodejs_linux
            ;;
        macOS)
            install_nodejs_macos
            ;;
        *)
            echo -e "${RED}[ERREUR]${NC} OS non supporté : $MACHINE"
            exit 1
            ;;
    esac
else
    echo -e "${GREEN}[OK]${NC} Node.js trouvé : $(node --version)"
fi

# Installation de SiteJet
echo
echo -e "${BLUE}Installation de SiteJet...${NC}"
cd app

echo -e "${YELLOW}[INSTALL]${NC} Installation des dépendances..."
npm install

echo -e "${YELLOW}[CONFIG]${NC} Configuration de la base de données..."
cp ../config/.env.example .env
npm run db:push

echo
echo -e "${GREEN}========================================"
echo -e "      INSTALLATION TERMINÉE !"
echo -e "========================================${NC}"
echo
echo -e "${BLUE}Pour démarrer SiteJet :${NC}"
echo "1. cd app/"
echo "2. npm run dev"
echo "3. Ouvrir http://localhost:3000"
echo
```

---

## 📦 ÉTAPE 5 : Finalisation et Test

### 5.1 Test complet du package
1. Extrayez l'archive sur une machine propre
2. Exécutez l'installateur
3. Vérifiez que SiteJet démarre correctement
4. Testez toutes les fonctionnalités principales

### 5.2 Validation de la documentation
- [ ] Instructions d'installation claires
- [ ] Prérequis système spécifiés
- [ ] Exemples d'utilisation inclus
- [ ] Guide de dépannage complet
- [ ] Informations de contact/support

### 5.3 Vérification des fichiers
- [ ] Tous les fichiers nécessaires inclus
- [ ] Permissions correctes sur les scripts
- [ ] Variables d'environnement configurées
- [ ] Documentation à jour

---

## 🚀 ÉTAPE 6 : Distribution

### 6.1 Plateformes de distribution
- **GitHub Releases** : Pour la distribution open source
- **Site web dédié** : Pour la distribution commerciale
- **Package managers** : npm, apt, brew

### 6.2 Versioning
- Utilisez la sémantique de version (ex: 1.0.0)
- Maintenez un changelog
- Taguez les releases sur Git

### 6.3 Support utilisateur
- Créez un système de tickets
- Préparez une FAQ
- Organisez la documentation par niveaux

Ce guide vous permet de créer un package de distribution professionnel de SiteJet, prêt à être utilisé par d'autres développeurs et utilisateurs finaux.