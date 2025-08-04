# UI Components Library - SiteForge

## 📊 Composants disponibles (42 composants)

### 🎯 **Composants Core (Actuellement utilisés - 20 composants)**
- `alert` - Messages d'alerte et notifications
- `badge` - Badges et étiquettes
- `button` - Boutons de toutes tailles
- `card` - Cartes et conteneurs
- `checkbox` - Cases à cocher
- `dialog` - Modales et dialogues
- `error-notification` - Notifications d'erreur
- `floating-button` - Boutons flottants pour mobile
- `form` - Composants de formulaire
- `input` - Champs de saisie
- `label` - Étiquettes de formulaire
- `select` - Sélecteurs dropdown
- `separator` - Séparateurs visuels
- `skeleton` - États de chargement
- `switch` - Interrupteurs on/off
- `tabs` - Onglets et navigation
- `textarea` - Zones de texte multilignes
- `toast` - Messages temporaires
- `toaster` - Gestionnaire de toasts
- `toggle` - Boutons de basculement
- `tooltip` - Info-bulles

### 🚀 **Composants Avancés (Prêts à utiliser - 22 composants)**

#### **Navigation & Structure (6 composants)**
- `accordion` - FAQ et contenu pliable
- `breadcrumb` - Navigation hiérarchique
- `dropdown-menu` - Menus déroulants
- `navigation-menu` - Navigation principale
- `pagination` - Navigation de pages
- `sidebar` - Barres latérales

#### **Media & Visualisation (4 composants)**
- `avatar` - Photos de profil et équipes
- `carousel` - Galeries et slideshows (embla-carousel)
- `chart` - Graphiques et analytics (recharts)
- `progress` - Barres de progression

#### **Éditeur & UX (6 composants)**
- `context-menu` - Menu clic-droit pour éditeur
- `drawer` - Panels coulissants mobiles
- `popover` - Pop-ups contextuels
- `resizable` - Panels redimensionnables
- `scroll-area` - Zones de défilement
- `sheet` - Panels latéraux

#### **Formulaires Avancés (4 composants)**
- `calendar` - Sélecteur de dates
- `radio-group` - Boutons radio groupés
- `slider` - Curseurs de valeurs
- `toggle-group` - Groupes de toggles

#### **Data & Tables (2 composants)**
- `table` - Tableaux de données
- `calendar` - Calendrier et événements

## 🎨 **Utilisation dans SiteForge**

### **Templates Business**
- `accordion` pour FAQ
- `avatar` pour équipes
- `chart` pour analytics  
- `table` pour données

### **Templates Portfolio** 
- `carousel` pour galeries
- `breadcrumb` pour navigation
- `progress` pour skills

### **Éditeur Visual**
- `context-menu` pour édition
- `popover` pour propriétés
- `resizable` pour panels
- `toggle-group` pour alignement

### **Sites Multi-Pages**
- `navigation-menu` pour header
- `pagination` pour blogs
- `sidebar` pour dashboards

## 📋 **Composants supprimés (optimisation)**
Les composants suivants ont été supprimés car redondants ou peu utiles :
- ❌ `alert-dialog` (redondant avec `dialog`)
- ❌ `aspect-ratio` (CSS natif suffisant)
- ❌ `collapsible` (redondant avec `accordion`)
- ❌ `command` (trop spécialisé)
- ❌ `hover-card` (redondant avec `tooltip`)
- ❌ `input-otp` (cas d'usage spécifique)
- ❌ `menubar` (style desktop obsolète)

## 🔧 **Import et utilisation**

```tsx
// Composants core
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog } from "@/components/ui/dialog"

// Composants avancés
import { Carousel } from "@/components/ui/carousel"
import { Chart } from "@/components/ui/chart" 
import { Accordion } from "@/components/ui/accordion"
```

## 📈 **Bénéfices de l'optimisation**
- **42 composants** au lieu de 49 (-7 composants)
- **Bundle plus léger** (~30KB économisés)
- **Maintenance simplifiée** (moins de redondances)
- **Focus sur l'essentiel** (composants utiles pour SiteForge)
- **Toutes les fonctionnalités conservées**