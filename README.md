# 🚀 PageForge - Éditeur Visuel de Sites Web

**Version 2.0.0** | Éditeur professionnel avec 52 composants et système de templates avancé

## 📖 Table des Matières

1. [Qu'est-ce que PageForge ?](#quest-ce-que-pageforge-)
2. [Installation Rapide](#installation-rapide)
3. [Guide Débutant Pas à Pas](#guide-débutant-pas-à-pas)
4. [Structure du Projet](#structure-du-projet)
5. [Fonctionnalités](#fonctionnalités)
6. [Support et Documentation](#support-et-documentation)

## Qu'est-ce que PageForge ?

PageForge est un **éditeur visuel de sites web** moderne qui permet de créer des sites professionnels sans connaissances en programmation. Avec une interface intuitive de type "glisser-déposer", vous pouvez construire des sites complets en quelques minutes.

### ✨ Pourquoi choisir PageForge ?

- **52 composants prêts à l'emploi** : Boutons, formulaires, galeries, cartes, etc.
- **Interface moderne** : Design épuré et professionnel
- **Système de templates** : Modèles pré-conçus pour démarrer rapidement
- **Export multi-format** : HTML, CSS, JavaScript
- **Responsive automatique** : Sites adaptés aux mobiles et tablettes
- **Base de données intégrée** : Sauvegarde automatique de vos projets

## 🚀 Installation Rapide

### Option 1 : Hébergement cPanel (Recommandé)

**Pour les hébergements web traditionnels (OVH, Hostinger, etc.)**

1. **Téléchargez** le package cPanel depuis [Releases](../../releases)
2. **Extrayez** `pageforge-cpanel-v2.0.0.zip` dans votre hébergement
3. **Visitez** : `https://votre-domaine.com/install-cpanel.php`
4. **Suivez** l'assistant d'installation automatique
5. **Supprimez** le fichier d'installation après la fin

✅ **Compatible avec Node.js Selector** pour de meilleures performances

### Option 2 : Installation Locale (Windows/Mac/Linux)

**Pour utiliser PageForge sur votre ordinateur**

#### Windows
1. **Téléchargez** `pageforge-windows-v2.0.0.zip`
2. **Extrayez** dans un dossier
3. **Double-clic** sur `start-installer.bat`
4. **Suivez** les instructions à l'écran

#### Mac/Linux
```bash
# Télécharger et extraire
wget https://github.com/votre-repo/pageforge/releases/download/v2.0.0/pageforge-linux-v2.0.0.tar.gz
tar -xzf pageforge-linux-v2.0.0.tar.gz
cd pageforge-linux-v2.0.0

# Lancer l'installation
./start-installer.sh
```

### Option 3 : Développement avec VS Code

**Pour les développeurs qui veulent personnaliser PageForge**

```bash
# Cloner le projet
git clone https://github.com/votre-repo/pageforge.git
cd pageforge

# Configuration automatique
php build-scripts/setup-dev.php

# Ouvrir dans VS Code
code .
```

## 📚 Guide Débutant Pas à Pas

### Étape 1 : Première Connexion

1. **Ouvrez** votre navigateur web
2. **Allez** sur l'adresse de votre installation PageForge
3. **Vous verrez** l'écran d'accueil avec le logo PageForge
4. **Cliquez** sur "Créer un nouveau projet"

### Étape 2 : Choisir un Template

1. **Sélectionnez** un template qui vous plaît :
   - **Portfolio** : Pour présenter vos créations
   - **Business** : Site d'entreprise professionnel
   - **Blog** : Site de contenu et articles
   - **E-commerce** : Boutique en ligne basique
   - **Landing Page** : Page de présentation produit

2. **Cliquez** sur "Utiliser ce template"
3. **Donnez** un nom à votre projet (ex: "Mon Premier Site")
4. **Cliquez** sur "Créer le projet"

### Étape 3 : Interface de l'Éditeur

L'écran se divise en **3 zones principales** :

#### 🎨 Zone 1 : Palette de Composants (à gauche)
- **Navigation** : Menus, barres de navigation
- **Contenu** : Textes, images, vidéos
- **Formulaires** : Champs de saisie, boutons
- **Layout** : Colonnes, grilles, espacements
- **Commerce** : Boutons d'achat, cartes produits

#### 🖼️ Zone 2 : Aperçu Visuel (au centre)
- **Votre site** s'affiche en temps réel
- **Glissez** les composants depuis la palette
- **Cliquez** sur les éléments pour les modifier
- **Mode responsive** : Testez mobile/tablette

#### ⚙️ Zone 3 : Propriétés (à droite)
- **Textes** : Modifier le contenu
- **Couleurs** : Changer les couleurs
- **Tailles** : Ajuster les dimensions
- **Animations** : Ajouter des effets

### Étape 4 : Ajouter du Contenu

#### Ajouter un Titre
1. **Glissez** "Heading" depuis la palette
2. **Déposez-le** sur votre page
3. **Double-cliquez** pour modifier le texte
4. **Changez** la taille dans les propriétés

#### Ajouter une Image
1. **Glissez** "Image" depuis la palette
2. **Cliquez** sur "Choisir une image"
3. **Uploadez** votre photo
4. **Ajustez** la taille si nécessaire

#### Ajouter un Bouton
1. **Glissez** "Button" depuis la palette
2. **Modifiez** le texte du bouton
3. **Changez** la couleur dans les propriétés
4. **Ajoutez** un lien dans "URL de destination"

### Étape 5 : Organiser la Mise en Page

#### Utiliser les Colonnes
1. **Glissez** "Columns" depuis Layout
2. **Choisissez** le nombre de colonnes (2, 3, ou 4)
3. **Glissez** d'autres composants dans chaque colonne
4. **Ajustez** l'espacement si nécessaire

#### Ajouter des Sections
1. **Glissez** "Section" pour séparer le contenu
2. **Changez** la couleur de fond
3. **Ajustez** les marges intérieure et extérieure
4. **Glissez** des composants dans la section

### Étape 6 : Tester sur Mobile

1. **Cliquez** sur l'icône 📱 (Mode responsive)
2. **Vérifiez** que votre site s'affiche bien
3. **Ajustez** les tailles si nécessaire
4. **Testez** sur tablette avec l'icône 📱

### Étape 7 : Sauvegarder et Exporter

#### Sauvegarde Automatique
- PageForge **sauvegarde automatiquement** vos modifications
- **Aucune action** nécessaire de votre part

#### Exporter le Site
1. **Cliquez** sur "Exporter" en haut à droite
2. **Choisissez** le format :
   - **HTML complet** : Fichiers prêts pour hébergement
   - **Code source** : Pour développeurs
   - **Images** : Toutes les images utilisées
3. **Téléchargez** le fichier ZIP
4. **Extrayez** et uploadez sur votre hébergeur

## 🏗️ Structure du Projet

```
pageforge/
├── 📁 client/           # Interface utilisateur (React)
│   ├── src/
│   │   ├── components/  # Composants de l'éditeur
│   │   ├── pages/      # Pages de l'application
│   │   └── lib/        # Fonctions utilitaires
│   └── public/         # Fichiers statiques
│
├── 📁 server/          # Serveur backend (Node.js)
│   ├── index.ts        # Point d'entrée serveur
│   ├── routes.ts       # Routes API
│   └── storage.ts      # Gestion base de données
│
├── 📁 shared/          # Code partagé
│   └── schema.ts       # Schémas de données
│
├── 📁 build-scripts/   # Scripts d'installation
│   ├── install-cpanel.php     # Installation cPanel
│   ├── install-local.php      # Installation locale
│   ├── create-packages.py     # Générateur de packages
│   └── generate-packages.sh   # Script de build
│
├── 📁 docs/           # Documentation complète
│
└── 📄 README.md       # Ce fichier
```

## ✨ Fonctionnalités

### 🎨 Composants Disponibles (52 au total)

#### Navigation
- **Navbar** : Barre de navigation responsive
- **Breadcrumb** : Fil d'Ariane
- **Sidebar** : Menu latéral
- **Footer** : Pied de page personnalisable

#### Contenu
- **Heading** : Titres H1 à H6
- **Text** : Paragraphes de texte
- **Image** : Images avec légendes
- **Video** : Lecteurs vidéo
- **Icon** : Bibliothèque d'icônes
- **Divider** : Séparateurs visuels

#### Formulaires
- **Input** : Champs de saisie
- **Textarea** : Zones de texte
- **Select** : Listes déroulantes
- **Checkbox** : Cases à cocher
- **Radio** : Boutons radio
- **Button** : Boutons personnalisables

#### Layout
- **Container** : Conteneurs responsive
- **Grid** : Grilles flexibles
- **Columns** : Système de colonnes
- **Section** : Sections de page
- **Card** : Cartes de contenu
- **Modal** : Fenêtres modales

#### Commerce
- **Product Card** : Fiches produits
- **Price Table** : Tableaux de prix
- **Shopping Cart** : Panier d'achat
- **Payment Button** : Boutons de paiement

#### Avancé
- **Charts** : Graphiques et statistiques
- **Maps** : Cartes interactives
- **Calendar** : Calendriers
- **Timeline** : Lignes temporelles
- **Accordion** : Contenus pliables
- **Tabs** : Onglets de navigation

### 🛠️ Fonctionnalités Techniques

- **Drag & Drop** : Glisser-déposer intuitif
- **Responsive Design** : Adaptation automatique mobile/tablette
- **WYSIWYG** : Édition visuelle en temps réel
- **Undo/Redo** : Annuler/Refaire les actions
- **Auto-save** : Sauvegarde automatique
- **Templates** : Modèles pré-conçus
- **Export** : HTML/CSS/JS propre
- **Preview** : Aperçu temps réel
- **SEO Ready** : Optimisé pour le référencement

### 🌐 Compatibilité

#### Navigateurs Supportés
- **Chrome** 90+ ✅
- **Firefox** 88+ ✅
- **Safari** 14+ ✅
- **Edge** 90+ ✅

#### Environnements
- **Hébergements cPanel** (OVH, Hostinger, etc.)
- **Windows** 10/11
- **macOS** 10.15+
- **Linux** (Ubuntu, Debian, CentOS)
- **VS Code** pour développement

## 📞 Support et Documentation

### 📚 Documentation Complète

- **[Guide de Démarrage Rapide](docs/QUICK_START_GUIDE.md)** - Premier pas avec PageForge
- **[Manuel Utilisateur](docs/USER_MANUAL.md)** - Guide complet des fonctionnalités
- **[Guide d'Installation](docs/INSTALLATION_GUIDE.md)** - Installation détaillée
- **[Résolution de Problèmes](docs/TROUBLESHOOTING.md)** - Solutions aux problèmes courants
- **[Guide de Déploiement](docs/DEPLOYMENT_HOSTING_GUIDE.md)** - Mettre en ligne votre site

### 🆘 Aide et Support

#### Problèmes Courants

**Q : Mon site ne s'affiche pas après l'installation**
- Vérifiez que PHP 7.4+ est installé
- Assurez-vous que les permissions de fichiers sont correctes (755)
- Consultez les logs d'erreur de votre hébergeur

**Q : Je ne peux pas uploader d'images**
- Vérifiez l'espace disque disponible
- Augmentez la taille maximum d'upload PHP
- Vérifiez les permissions du dossier uploads/

**Q : L'éditeur est lent ou plante**
- Fermez les autres onglets du navigateur
- Videz le cache du navigateur
- Vérifiez votre connexion internet

**Q : Comment sauvegarder mes projets ?**
- PageForge sauvegarde automatiquement
- Exportez régulièrement vos projets en HTML
- Sauvegardez votre base de données via cPanel

#### Communauté et Ressources

- **GitHub Issues** : [Signaler un bug](../../issues)
- **Discussions** : [Forum communautaire](../../discussions)
- **Wiki** : [Base de connaissances](../../wiki)

### 🔄 Mises à Jour

PageForge se met à jour automatiquement. Les nouvelles versions apportent :
- Nouveaux composants
- Corrections de bugs
- Améliorations de performance
- Nouvelles fonctionnalités

Pour forcer une mise à jour manuelle, re-lancez l'installateur.

---

## 🎯 Prêt à Commencer ?

1. **Choisissez** votre méthode d'installation ci-dessus
2. **Suivez** le guide débutant pas à pas
3. **Créez** votre premier site en 10 minutes
4. **Consultez** la documentation pour aller plus loin

**PageForge - Créez des sites web comme un pro, sans coder ! 🚀**