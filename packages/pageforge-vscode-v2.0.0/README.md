# 💻 GUIDE CONFIGURATION VS CODE - PageForge

## Installation PHP Interactive pour Développement

### 🎯 Objectif
Configurer automatiquement un environnement de développement PageForge optimisé pour VS Code avec toutes les configurations professionnelles.

### 📋 Prérequis
- **PHP 7.4+** (pour l'installateur)
- **Node.js 18+** (sera vérifié automatiquement)
- **VS Code** (recommandé)
- **Git** (optionnel mais recommandé)
- **PostgreSQL** (pour la base de données)

### 🚀 Installation Rapide

#### Étape 1 : Préparation
```bash
# Si vous avez les sources PageForge
mkdir pageforge-setup
cd pageforge-setup

# Copier l'installateur
cp /path/to/install-vscode.php .
```

#### Étape 2 : Lancement
```bash
# Démarrer le serveur PHP
php -S localhost:8080

# Ouvrir dans le navigateur
open http://localhost:8080/install-vscode.php
```

#### Étape 3 : Configuration Guidée
Suivre l'assistant web 7 étapes :
1. **💻 Accueil** - Présentation configuration
2. **🔧 Environnement** - Vérification outils développement
3. **📁 Projet** - Structure projet et fichiers
4. **⚙️ VS Code** - Configuration IDE optimisée
5. **🗄️ Base données** - Configuration PostgreSQL/Drizzle
6. **🧩 Extensions** - Liste extensions recommandées
7. **✅ Prêt** - Projet configuré pour développement

### 🎨 Interface de Configuration

#### Design VS Code Theme
- **Couleurs** : Thème sombre VS Code (bleu #007acc)
- **Interface** : Style éditeur avec terminal intégré
- **Animations** : Transitions fluides et professionnelles
- **Responsive** : Compatible mobile pour configuration nomade

#### Fonctionnalités Avancées
- **Détection automatique** des outils installés
- **Configuration intelligente** selon l'OS détecté
- **Génération automatique** de tous les fichiers config
- **Validation** en temps réel des prérequis

### ⚙️ Configurations Générées

#### Structure Projet Complète
```
pageforge-dev/
├── .vscode/                    # Configuration VS Code
│   ├── settings.json           # Paramètres optimisés
│   ├── launch.json             # Debug client/serveur
│   ├── tasks.json              # Tâches automatisées
│   ├── extensions.json         # Extensions auto-install
│   └── snippets/               # Snippets PageForge
├── client/                     # Frontend React+Vite
├── server/                     # Backend Express+TypeScript
├── shared/                     # Code partagé
├── docs/                       # Documentation développement
├── package.json                # Scripts et dépendances
├── .env.development            # Variables environnement
└── README.md                   # Guide projet
```

#### VS Code Settings.json
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "typescript",
    "typescriptreact": "typescriptreact"
  }
}
```

#### Launch.json (Debug)
```json
{
  "configurations": [
    {
      "name": "Debug Server",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/server/index.ts",
      "runtimeArgs": ["-r", "tsx/cjs"]
    },
    {
      "name": "Debug Client", 
      "type": "chrome",
      "url": "http://localhost:3000"
    }
  ]
}
```

#### Tasks.json (Automatisation)
```json
{
  "tasks": [
    {
      "label": "Start Development",
      "command": "npm run dev",
      "group": "build"
    },
    {
      "label": "Database Push",
      "command": "npm run db:push"
    }
  ]
}
```

### 🧩 Extensions Automatiques

#### Extensions Essentielles
- **TypeScript Importer** - Support TypeScript avancé
- **Tailwind CSS IntelliSense** - Autocomplétion Tailwind
- **Prettier** - Formatage automatique
- **ESLint** - Linting JavaScript/TypeScript
- **Auto Rename Tag** - Renommage balises HTML/JSX
- **JSON Tools** - Support JSON avancé

#### Installation Automatique
Le fichier `.vscode/extensions.json` généré permet l'installation automatique de toutes les extensions lors de l'ouverture du projet dans VS Code.

### 🗄️ Configuration Base de Données

#### Drizzle ORM Setup
```typescript
// drizzle.config.ts généré
export default {
  schema: './shared/schema.ts',
  out: './migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

#### Schema TypeScript
```typescript
// shared/schema.ts généré
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  userId: uuid('user_id').references(() => users.id),
  data: json('data'),
});
```

### 🛠️ Scripts de Développement

#### Package.json Généré
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:client": "cd client && vite",
    "dev:server": "cd server && tsx watch index.ts",
    "build": "npm run build:client && npm run build:server",
    "db:push": "drizzle-kit push:pg",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write ."
  }
}
```

#### Script de Démarrage (start-dev.sh)
```bash
#!/bin/bash
echo "🚀 Démarrage PageForge Development"

# Vérifications automatiques
if [ ! -d "node_modules" ]; then
    npm install
fi

# Lancement développement
npm run dev
```

### 🔧 Utilisation Post-Configuration

#### Ouverture dans VS Code
```bash
cd pageforge-dev
code .

# VS Code proposera automatiquement :
# - Installation des extensions recommandées
# - Configuration du workspace
# - Activation du debugger
```

#### Commandes de Développement
```bash
# Démarrage complet (client + serveur)
npm run dev

# Client seulement (React + Vite)
npm run dev:client

# Serveur seulement (Express + TypeScript)
npm run dev:server

# Base de données
npm run db:push      # Appliquer schéma
npm run db:generate  # Générer migrations
```

#### Debug dans VS Code
1. **F5** - Démarrer debug serveur
2. **Ctrl+Shift+D** - Panneau debug
3. **Breakpoints** - Clic gauche dans la marge
4. **Variables** - Inspection en temps réel
5. **Console** - Évaluation expressions

### 📚 Documentation Générée

#### README.md Projet
Guide complet d'utilisation du projet avec :
- Instructions d'installation
- Commandes de développement
- URLs d'accès (client/serveur)
- Configuration VS Code

#### DEVELOPMENT.md
Documentation développeur détaillée :
- Architecture du projet
- Workflow de développement
- Bonnes pratiques
- Guide debugging
- Processus de déploiement

### 🎯 Avantages de Cette Configuration

#### Productivité
- **Setup en 5 minutes** via interface web
- **Hot reload** automatique client/serveur
- **Debug intégré** avec breakpoints
- **Snippets personnalisés** PageForge

#### Qualité Code
- **Linting automatique** ESLint + Prettier
- **TypeScript strict** avec auto-imports
- **Validation Tailwind** avec IntelliSense
- **Tests intégrés** dans VS Code

#### Collaboration
- **Configuration partagée** via .vscode/
- **Extensions standardisées** pour l'équipe
- **Scripts uniformes** sur tous les environnements
- **Documentation complète** pour nouveaux développeurs

### 🔄 Mise à Jour Configuration

Pour mettre à jour la configuration :
1. Re-lancer l'installateur VS Code
2. Choisir "Remplacer configuration existante"
3. Nouvelles fonctionnalités seront ajoutées automatiquement

**🎉 Environnement de développement professionnel prêt en quelques clics !**