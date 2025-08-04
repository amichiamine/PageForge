# PageForge v2.0.0 - Package VS Code

## Environnement de Développement VS Code

### 🚀 Configuration Automatique

```bash
# Extraire le package
unzip pageforge-vscode-v2.0.0.zip
cd pageforge-vscode-v2.0.0

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
pageforge-vscode-v2.0.0/
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
