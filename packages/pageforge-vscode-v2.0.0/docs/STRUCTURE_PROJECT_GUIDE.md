# 📁 Guide de Structure du Projet SiteJet

## Structure Actuelle du Projet

SiteJet utilise une architecture moderne où tous les composants sont organisés à la racine du projet :

```
SiteJet/
├── package.json              # Configuration principale Node.js
├── package-lock.json         # Verrouillage des dépendances
├── tsconfig.json             # Configuration TypeScript
├── vite.config.ts            # Configuration Vite (build/dev)
├── tailwind.config.ts        # Configuration Tailwind CSS
├── postcss.config.js         # Configuration PostCSS
├── drizzle.config.ts         # Configuration base de données
├── components.json           # Configuration composants UI
├── replit.md                 # Documentation du projet
├── .env                      # Variables d'environnement (local)
├── server/                   # Backend Express.js
│   ├── index.ts              # Point d'entrée serveur
│   ├── routes.ts             # Routes API
│   ├── storage.ts            # Interface stockage
│   └── vite.ts               # Intégration Vite
├── client/                   # Frontend React
│   ├── index.html            # Template HTML
│   └── src/                  # Code source React
├── shared/                   # Code partagé frontend/backend
│   └── schema.ts             # Schémas de données Drizzle
├── scripts/                  # Scripts d'installation et outils
│   ├── install-windows.bat   # Installation Windows batch
│   ├── Install-SiteJet.ps1   # Installation PowerShell complète
│   ├── Quick-Install.ps1     # Installation PowerShell rapide
│   ├── Test-SiteJet.ps1      # Test et diagnostic PowerShell
│   ├── run-powershell.bat    # Lanceur PowerShell
│   ├── create-distribution.js # Création package Node.js
│   ├── Create-Distribution.ps1 # Création package PowerShell
│   └── validate-components.js # Validation composants
├── docs/                     # Documentation complète
│   ├── README_DISTRIBUTION.md
│   ├── INSTALLATION_GUIDE_WINDOWS.md
│   ├── INSTALLATION_GUIDE_LINUX.md
│   ├── USER_MANUAL.md
│   ├── TROUBLESHOOTING.md
│   ├── DEPLOYMENT_HOSTING_GUIDE.md
│   ├── DISTRIBUTION_PACKAGE_GUIDE.md
│   ├── QUICK_START_GUIDE.md
│   └── COMPONENT_VALIDATION_SYSTEM.md
├── config/                   # Fichiers de configuration
│   └── .env.example          # Template variables d'environnement
├── dist/                     # Build de production (généré)
│   ├── index.js              # Serveur compilé
│   └── public/               # Assets statiques
└── node_modules/             # Dépendances (généré)
```

## Différences avec les Architectures Classiques

### ❌ Structure Traditionnelle (Non Utilisée)
```
Project/
└── app/                      # Tout dans un sous-dossier
    ├── package.json
    ├── server/
    ├── client/
    └── ...
```

### ✅ Structure SiteJet (Actuelle)
```
Project/                      # Tout à la racine
├── package.json              # Configuration directe
├── server/                   # Modules organisés
├── client/
└── ...
```

## Avantages de cette Structure

### 1. **Simplicité de Développement**
- Tous les fichiers de configuration à la racine
- Pas de navigation complexe dans des sous-dossiers
- Commandes npm directes depuis la racine

### 2. **Intégration Moderne**
- Compatible avec Vite et les outils modernes
- Build unifié frontend/backend
- Hot reload efficace

### 3. **Déploiement Simplifié**
- Un seul `package.json` à gérer
- Build de production dans `dist/`
- Configuration centralisée

## Scripts d'Installation Adaptés

Tous les scripts d'installation ont été mis à jour pour cette structure :

### Windows
- `install-windows.bat` - Installation batch robuste
- `Install-SiteJet.ps1` - Installation PowerShell complète
- `Quick-Install.ps1` - Installation PowerShell rapide

### Multiplateforme
- `create-distribution.js` - Création package Node.js
- `Create-Distribution.ps1` - Création package PowerShell

## Commandes de Base

### Installation
```cmd
# Depuis la racine du projet
npm install
cp config/.env.example .env
npm run db:push
npm run dev
```

### Développement
```cmd
npm run dev          # Démarrage développement
npm run build        # Build production
npm run start        # Démarrage production
npm run check        # Vérification TypeScript
npm run db:push      # Migration base de données
```

### Création Package Distribution
```cmd
# Node.js
node scripts/create-distribution.js

# PowerShell (Windows)
.\scripts\Create-Distribution.ps1
```

## Package de Distribution

Le système de distribution crée une structure dédiée :

```
SiteJet-Distribution/
├── app/                      # Copie du projet complet
│   ├── package.json          # Configuration
│   ├── server/               # Backend
│   ├── client/               # Frontend  
│   ├── shared/               # Code partagé
│   ├── dist/                 # Build production
│   └── ...                   # Autres fichiers
├── docs/                     # Documentation
├── scripts/                  # Scripts installation
├── config/                   # Configuration
└── README.md                 # Guide installation
```

## Migration depuis Ancienne Structure

Si vous aviez une structure avec dossier `app/`, voici la migration :

```cmd
# Ancienne structure
app/package.json      →  package.json
app/server/           →  server/
app/client/           →  client/
app/.env              →  .env

# Scripts mis à jour automatiquement
scripts/*.ps1         # Cherchent maintenant ../package.json
scripts/*.bat         # Cherchent maintenant ../package.json
```

## Validation de Structure

Utilisez le script de test pour vérifier la structure :

```powershell
# PowerShell
.\scripts\Test-SiteJet.ps1

# Vérifie :
# - package.json à la racine
# - Dossiers server/, client/, shared/
# - Node.js et npm installés
# - Configuration .env
```

---

Cette structure moderne permet un développement plus efficace et une distribution simplifiée de SiteJet.