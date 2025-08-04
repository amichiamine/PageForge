# 📖 Manuel d'Utilisation SiteForge

## Guide Complet pour Créer des Sites Web sans Code

SiteForge est un éditeur visuel intuitif qui vous permet de créer des sites web professionnels sans connaissances en programmation.

---

## 🚀 Premiers Pas

### Lancement de SiteForge
1. **Sur Windows** :
   - Double-cliquez sur l'icône SiteForge sur le bureau
   - OU ouvrez l'invite de commande, naviguez vers le dossier et tapez `npm run dev`

2. **Sur Linux/macOS** :
   - Ouvrez le terminal
   - Naviguez vers le dossier SiteForge : `cd ~/Projets/siteforge`
   - Tapez : `npm run dev`

3. **Accès à l'interface** :
   - Ouvrez votre navigateur web
   - Allez sur : http://localhost:3000
   - SiteForge s'ouvre automatiquement

### Interface Principale

L'interface SiteForge se compose de 4 zones principales :

#### 1. **Barre de Navigation** (en haut)
- **Logo SiteForge** : Retour à l'accueil
- **Nom du Projet** : Indique le projet en cours
- **Boutons d'Action** :
  - 💾 Sauvegarder
  - 👁 Prévisualiser
  - 📱 Mode Mobile/Tablette
  - ⚙️ Paramètres

#### 2. **Palette de Composants** (à gauche)
8 catégories de composants disponibles :
- **📐 Layout** : Conteneurs, sections, colonnes
- **📝 Texte** : Titres, paragraphes, listes
- **🖼 Média** : Images, vidéos, carousels
- **🔗 Interactifs** : Boutons, liens, modales
- **🏢 Business** : Témoignages, équipes, prix
- **🧭 Navigation** : Menus, breadcrumbs
- **📄 Contenu** : Articles, FAQ, tableaux
- **🛒 E-commerce** : Produits, panier, commandes

#### 3. **Zone d'Édition** (au centre)
- **Canvas** : Votre page en construction
- **Grille d'alignement** : Aide au positionnement
- **Règles** : Mesures précises
- **Indicateurs** : Composant sélectionné surligné

#### 4. **Panneau de Propriétés** (à droite)
- **Styles** : Couleurs, polices, tailles
- **Contenu** : Textes, images, liens
- **Position** : Placement et dimensions
- **Avancé** : CSS personnalisé

---

## 🏗 Création d'un Nouveau Projet

### Étape 1 : Démarrage
1. Cliquez sur **"Nouveau Projet"** sur la page d'accueil
2. Choisissez une option :
   - **Partir de zéro** : Page vierge
   - **Utiliser un template** : Design prêt à personnaliser
   - **Importer** : Depuis un fichier existant

### Étape 2 : Configuration du Projet
1. **Nom du projet** : Donnez un nom descriptif
2. **Type de site** :
   - 📄 Site une page (Landing Page)
   - 📚 Site multi-pages (Site complet)
   - 🛒 E-commerce (Boutique en ligne)
3. **Paramètres** :
   - Couleurs principales
   - Police de caractère
   - Langue du contenu

### Étape 3 : Sélection du Template (optionnel)
Templates disponibles :
- **🏢 Business Corporate** : Site d'entreprise
- **🛍 E-commerce Modern** : Boutique en ligne
- **👤 Portfolio Créatif** : Portfolio personnel
- **📰 Blog Magazine** : Blog/magazine
- **📊 Dashboard Analytics** : Tableau de bord
- **📞 Page Contact** : Page de contact

---

## ✨ Utilisation des Composants

### Ajout d'un Composant
1. **Sélection** :
   - Cliquez sur une catégorie dans la palette
   - Les composants de cette catégorie s'affichent

2. **Ajout par glisser-déposer** :
   - Maintenez le clic sur un composant
   - Glissez vers la zone d'édition
   - Relâchez à l'endroit souhaité

3. **Ajout par double-clic** :
   - Double-cliquez sur un composant
   - Il s'ajoute automatiquement en bas de page

### Composants Populaires

#### **Conteneur** 📐
- **Usage** : Structure de base, grouper d'autres éléments
- **Propriétés** : Largeur, hauteur, couleur de fond, bordures
- **Conseil** : Commencez toujours par un conteneur

#### **Titre** 📝
- **Usage** : Titres de sections, headers
- **Propriétés** : Taille (H1-H6), couleur, police, alignement
- **Conseil** : Utilisez H1 pour le titre principal, H2-H3 pour les sections

#### **Image** 🖼
- **Usage** : Photos, illustrations, logos
- **Propriétés** : Source, taille, bordures, filtres
- **Formats supportés** : JPG, PNG, SVG, WebP

#### **Bouton** 🔗
- **Usage** : Appels à l'action, navigation
- **Propriétés** : Texte, couleur, taille, lien de destination
- **Types** : Principal, secondaire, texte simple

#### **Formulaire** 📝
- **Usage** : Contact, inscription, enquêtes
- **Champs disponibles** : Texte, email, téléphone, message
- **Validation** : Automatique selon le type de champ

---

## 🎨 Personnalisation et Styles

### Sélection d'un Élément
1. **Clic simple** : Sélectionne le composant
2. **Double-clic** : Mode édition du contenu
3. **Clic droit** : Menu contextuel (copier, supprimer, etc.)

### Panneau de Propriétés

#### **Onglet Contenu**
- **Texte** : Modifiez directement le contenu
- **Images** : Changez la source ou uploadez
- **Liens** : Définissez les destinations

#### **Onglet Styles**
- **Couleurs** :
  - Cliquez sur le carré de couleur
  - Utilisez le sélecteur ou tapez un code hexadécimal
  - Sauvegardez vos couleurs favorites

- **Typographie** :
  - Police : 20+ polices Google Fonts disponibles
  - Taille : Slider ou valeur précise
  - Style : Gras, italique, souligné

- **Espacement** :
  - Margin : Espace autour de l'élément
  - Padding : Espace à l'intérieur de l'élément
  - Utilisez les valeurs liées ou indépendantes

#### **Onglet Position**
- **Dimensions** : Largeur et hauteur
- **Position** : Coordonnées X,Y précises
- **Alignement** : Gauche, centre, droite
- **Z-index** : Ordre de superposition

### Système Responsive Automatique
SiteForge adapte automatiquement votre design :
- **Desktop** (1200px+) : Design principal
- **Tablette** (768px-1199px) : Adaptation automatique
- **Mobile** (moins de 768px) : Version optimisée

Pour prévisualiser :
1. Cliquez sur l'icône appareil en haut
2. Choisissez : Desktop, Tablette, ou Mobile
3. Vérifiez l'affichage et ajustez si nécessaire

---

## 📄 Gestion des Pages

### Création d'une Nouvelle Page
1. **Menu Pages** (icône pages en haut)
2. **"Ajouter une page"**
3. **Configuration** :
   - Nom de la page
   - URL (slug)
   - Template de départ

### Navigation entre Pages
1. **Menu Navigation** dans la palette
2. **Ajoutez un menu** de navigation
3. **Configuration automatique** : Les pages s'ajoutent automatiquement
4. **Personnalisation** : Modifiez l'apparence du menu

### Pages Spéciales
- **Page d'accueil** : Première page visible
- **Page 404** : En cas d'erreur de navigation
- **Page de contact** : Formulaire et informations
- **Mentions légales** : Obligatoires selon la législation

---

## 🔧 Fonctionnalités Avancées

### Templates et Réutilisation
1. **Sauvegarde de sections** :
   - Sélectionnez plusieurs composants
   - Clic droit → "Sauvegarder comme template"
   - Réutilisez dans d'autres projets

2. **Bibliothèque de composants** :
   - Créez vos propres composants
   - Partagez avec d'autres utilisateurs

### Intégrations
- **Formulaires** : Connexion automatique avec services email
- **Analytics** : Google Analytics, Facebook Pixel
- **SEO** : Optimisation automatique pour les moteurs de recherche
- **Réseaux sociaux** : Boutons de partage intégrés

### Mode Collaboration
- **Partage de projet** : Invitez d'autres utilisateurs
- **Commentaires** : Laissez des notes sur les éléments
- **Historique** : Consultez et restaurez les versions précédentes

---

## 📱 Optimisation Mobile

### Test Mobile Automatique
1. **Bascule d'affichage** : Icône mobile en haut
2. **Vérification** : Tous les éléments sont-ils visibles ?
3. **Navigation** : Le menu est-il accessible ?
4. **Formulaires** : Sont-ils utilisables au doigt ?

### Ajustements Mobile
- **Taille des textes** : Automatiquement agrandis
- **Boutons** : Taille minimum 44px pour le toucher
- **Images** : Compression automatique
- **Menus** : Transformation en menu burger

---

## 💾 Sauvegarde et Export

### Sauvegarde Automatique
- **Sauvegarde** : Toutes les 30 secondes
- **Historique** : 30 dernières versions conservées
- **Récupération** : Menu "Historique" pour restaurer

### Export de votre Site

#### **Export HTML/CSS** (Recommandé)
1. **Menu Projet** → **Exporter**
2. **Type** : HTML/CSS/JS
3. **Options** :
   - Minification du code
   - Optimisation des images
   - Inclusion des polices
4. **Téléchargement** : Fichier ZIP prêt à déployer

#### **Export PDF**
- Pour présentation ou validation
- Capture de toutes les pages
- Qualité haute résolution

#### **Export Images**
- Screenshots de chaque page
- Formats : PNG, JPG
- Différentes résolutions

---

## 🌐 Publication en Ligne

### Option 1 : Hébergement Automatique SiteForge
1. **Compte SiteForge Pro** requis
2. **Un clic** pour publier
3. **URL fournie** : votresite.siteforge.com
4. **Domaine personnalisé** possible

### Option 2 : Hébergement Personnel
1. **Exportez** votre site en HTML/CSS
2. **Uploadez** les fichiers via FTP ou interface hébergeur
3. **Configurez** votre nom de domaine
4. **Testez** le site en ligne

### Option 3 : Services Cloud
- **Netlify** : Glissez-déposez votre ZIP
- **Vercel** : Connexion GitHub automatique
- **Firebase** : Hébergement Google

---

## 🔍 SEO et Référencement

### Optimisation Automatique
SiteForge optimise automatiquement :
- **Balises meta** : Titre et description
- **URLs propres** : Sans caractères spéciaux
- **Sitemap** : Génération automatique
- **Schema.org** : Données structurées

### Optimisation Manuelle
1. **Titre de page** :
   - Unique pour chaque page
   - 50-60 caractères maximum
   - Incluez vos mots-clés principaux

2. **Meta description** :
   - 150-160 caractères
   - Description attractive
   - Incitation à cliquer

3. **Images** :
   - Texte alternatif (alt text)
   - Noms de fichiers descriptifs
   - Compression automatique

### Suivi des Performances
- **Google Analytics** : Intégration en un clic
- **Search Console** : Vérification automatique
- **PageSpeed** : Optimisation automatique

---

## 🛡 Sécurité et Maintenance

### Sécurité Intégrée
- **HTTPS** : Obligatoire sur tous les sites
- **Sauvegarde** : Automatique et chiffrée
- **Mises à jour** : Automatiques et transparentes

### Maintenance
- **Vérifications** : Liens cassés détectés automatiquement
- **Optimisation** : Images compressées automatiquement
- **Mises à jour** : Notification des nouvelles fonctionnalités

---

## 🆘 Résolution de Problèmes

### Problèmes Courants

#### **Le site ne se charge pas**
1. Vérifiez votre connexion internet
2. Rafraîchissez la page (Ctrl+F5)
3. Videz le cache du navigateur
4. Redémarrez SiteForge

#### **Composant qui ne s'affiche pas correctement**
1. Cliquez sur le composant
2. Vérifiez les dimensions dans le panneau propriétés
3. Utilisez "Reset" pour revenir aux valeurs par défaut

#### **Problème de sauvegarde**
1. Vérifiez l'espace disque disponible
2. Sauvegardez manuellement (Ctrl+S)
3. Exportez votre projet en cas de problème

#### **Site différent en ligne vs prévisualisation**
1. Videz le cache de votre navigateur
2. Attendez quelques minutes pour la propagation
3. Vérifiez la version exportée

### Support et Aide

#### **Documentation**
- **Wiki complet** : docs.siteforge.com
- **Tutoriels vidéo** : youtube.com/siteforge
- **Blog** : Articles et conseils

#### **Communauté**
- **Forum** : forum.siteforge.com
- **Discord** : Chat en temps réel
- **Facebook** : Groupe d'utilisateurs

#### **Contact Direct**
- **Email** : support@siteforge.com
- **Chat** : Disponible dans l'application
- **Téléphone** : Uniquement pour comptes Pro

---

## 🎓 Conseils et Bonnes Pratiques

### Design
1. **Simplicité** : Moins c'est plus
2. **Cohérence** : Utilisez un système de couleurs
3. **Hiérarchie** : Organisez l'information clairement
4. **Espacement** : Aérez votre design

### Contenu
1. **Clarté** : Soyez concis et précis
2. **Structure** : Utilisez des titres et sous-titres
3. **Appels à l'action** : Guidez vos visiteurs
4. **Images** : Utilisez des visuels de qualité

### Performance
1. **Images optimisées** : SiteForge s'en charge automatiquement
2. **Pages rapides** : Évitez la surcharge de composants
3. **Mobile-first** : Pensez d'abord mobile
4. **Test régulier** : Vérifiez sur différents appareils

### SEO
1. **Contenu unique** : Évitez la duplication
2. **Mots-clés naturels** : Intégrez-les naturellement
3. **Liens internes** : Connectez vos pages
4. **Mise à jour régulière** : Actualisez votre contenu

---

## 📈 Aller Plus Loin

### Fonctionnalités Pro
- **Domaine personnalisé** : votre-site.com
- **E-commerce avancé** : Paiements, stocks, commandes
- **Analytics avancés** : Rapports détaillés
- **Support prioritaire** : Réponse en 2h maximum

### Formation Avancée
- **Webinaires** : Sessions de formation en direct
- **Certification** : Devenez expert SiteForge
- **Partenariat** : Programme pour agences

### API et Intégrations
- **API REST** : Intégrez avec vos outils
- **Webhooks** : Automatisations avancées
- **Plugins** : Étendez les fonctionnalités

---

Félicitations ! Vous maîtrisez maintenant SiteForge. Créez des sites web exceptionnels sans une ligne de code !