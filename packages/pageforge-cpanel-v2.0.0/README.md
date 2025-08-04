# 🚀 GUIDE D'INSTALLATION CPANEL - PageForge

## Installation Interactive Automatisée

### 📋 Prérequis
- Hébergement cPanel avec PHP 7.4+
- Base de données PostgreSQL disponible
- Extensions PHP : PDO, PostgreSQL, JSON, cURL, ZIP
- 50 MB d'espace disque minimum

### 📦 Étape 1 : Préparation des Fichiers

1. **Créer l'archive de build :**
   ```bash
   # Sur votre machine locale (avec PageForge)
   npm run build
   zip -r pageforge-files.zip dist/ server/ package.json .env.example
   ```

2. **Uploader les fichiers via cPanel File Manager :**
   - `install-interactive.php` (ce script d'installation)
   - `pageforge-files.zip` (l'archive de build)

### 🚀 Étape 2 : Lancement de l'Installation

1. **Accéder à l'installateur :**
   ```
   https://votre-domaine.com/install-interactive.php
   ```

2. **Suivre l'assistant interactif :**
   - ✅ Vérification système automatique
   - 📁 Détection des fichiers uploadés
   - 🗄️ Configuration base de données PostgreSQL
   - ⚙️ Paramètres de l'application
   - 📦 Installation automatique
   - ✅ Finalisation et nettoyage

### 🔧 Étape 3 : Configuration Base de Données

**Dans cPanel :**
1. Créer une base de données PostgreSQL
2. Créer un utilisateur et l'assigner à la base
3. Noter les informations de connexion

**Dans l'installateur :**
- Host : `localhost` (généralement)
- Port : `5432`
- Nom de la base : Votre base créée
- Utilisateur : Votre utilisateur créé
- Mot de passe : Le mot de passe défini

### ⚙️ Fonctionnalités de l'Installateur

#### Interface Interactive
- **Design moderne** avec progression visuelle
- **Vérification automatique** des prérequis système
- **Test de connexion** base de données en temps réel
- **Extraction automatique** des fichiers
- **Configuration automatique** des variables d'environnement

#### Sécurité
- **Validation complète** des données saisies
- **Tests de compatibilité** système
- **Suppression automatique** du script après installation
- **Configuration sécurisée** des permissions fichiers

#### Logs et Débogage
- **Journal d'installation** détaillé
- **Messages d'erreur** précis et utiles
- **Tests de validation** à chaque étape
- **Interface AJAX** responsive

### 📁 Structure Après Installation

```
votre-site/
├── dist/                 # Frontend build
├── server/              # Backend Node.js
├── .env                 # Configuration (généré)
├── .htaccess           # Config Apache (généré)
├── package.json        # Dépendances
└── docs/               # Documentation
```

### 🔒 Sécurité Post-Installation

1. **Supprimer** le fichier `install-interactive.php`
2. **Vérifier** les permissions fichiers
3. **Tester** l'accès à PageForge
4. **Sauvegarder** la configuration

### 🚨 Résolution de Problèmes

#### Erreur Extension PostgreSQL
```bash
# Dans cPanel > PHP Selector > Extensions
# Activer : pdo_pgsql
```

#### Erreur Permissions
```bash
# Permissions recommandées :
# Dossiers : 755
# Fichiers : 644
# .env : 600 (sécurisé)
```

#### Erreur Mémoire PHP
```bash
# Dans .htaccess ou php.ini :
memory_limit = 128M
max_execution_time = 300
```

### 📞 Support

Si vous rencontrez des problèmes :

1. **Consultez les logs** générés par l'installateur
2. **Vérifiez** la configuration de votre hébergement
3. **Contactez** le support de votre hébergeur pour PostgreSQL
4. **Vérifiez** que tous les prérequis sont satisfaits

### ✅ Validation de l'Installation

Après installation réussie :

1. **Accès à PageForge** : `https://votre-domaine.com/`
2. **Interface** : Éditeur visuel chargé
3. **Base de données** : Connexion fonctionnelle
4. **Composants** : 52 composants disponibles
5. **Templates** : Système de templates opérationnel

**🎉 PageForge est maintenant installé et prêt à l'emploi !**