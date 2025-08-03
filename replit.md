# SiteForge - Visual Website Builder

## Overview
SiteForge is a full-stack visual website builder, offering a drag-and-drop interface for website creation with templates, visual editing, and export functionality. It aims to provide a comprehensive solution for both standalone projects and seamless integration with VS Code, empowering users to design and deploy professional-grade websites efficiently.

## User Preferences
- Preferred communication style: Simple, everyday language
- Interface language: French
- Technical approach: Problem-solving with persistence and deep debugging
- Component architecture: Unified components with sub-elements managed via componentData only, no separate children in elements section

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with CSS variables
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter
- **Drag & Drop**: react-dnd
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon Database
- **Schema Validation**: Zod

### Key Components
- **Visual Editor System**: Component palette, visual canvas with live preview, specialized properties panels for each component type, and a template system.
- **Project Management**: Support for standalone, VS Code integration, and existing project imports. Includes a template engine, multi-format export (HTML, CSS, JS), and multi-page management.
- **Database Schema**: Structured for users, projects, templates, and pages.
- **Navigation System**: Collapsible sidebar with logo-based toggle functionality using direct props instead of React Context for reliable state management.
- **Unified Component Architecture**: All 52 components across 8 categories have specialized configuration panels. Complex components (carousel, navbar, footer, card, form, chart, video, grid, sidebar, header, list, accordion) are created empty and their sub-elements are managed exclusively via componentData in the configuration section.
- **Component-Specific Configuration**: Each component type has dedicated configuration options (e.g., carousel with image management and text positioning, navbar with menu items and branding, accordion with Q&A management).
- **Conditional CSS/JS Generation System**: Styles and scripts are only included when specific components are present in the project, analyzing project structure to eliminate code bloat.
- **Minimalist Editor Interface**: Optimized layout for maximum editing space with an ultra-compact header, miniaturized buttons, and all panels closed by default.

### Data Flow
- **Project Creation**: Template selection initiates project creation and redirects to the editor.
- **Visual Editing**: Drag-and-drop components, update properties, and see real-time previews.
- **Content Management**: WYSIWYG editing, component tree manipulation, style adjustments, and auto-save.
- **Export Process**: Project validation, code generation, file packaging, and download/deployment.
- **Preview System Unification**: The preview system uses generated files directly from the export process, ensuring consistency between preview and export.

### Deployment Strategy
- **Development**: Local Vite dev server with HMR; PostgreSQL via Neon Database.
- **Production**: Static frontend files served from Express; compiled TypeScript backend bundle; production PostgreSQL with Drizzle migrations.
- **Configuration**: Drizzle Kit for schema management; separate build scripts; TypeScript path mapping.

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form
- **UI Components**: Radix UI primitives, Lucide React icons
- **Development Tools**: Vite, TypeScript, ESBuild
- **Database**: Drizzle ORM, Neon Database serverless driver

### Development & Production Tools
- **CSS Processing**: Tailwind CSS, PostCSS, Autoprefixer
- **Code Quality**: TypeScript strict mode, ESLint
- **Date Handling**: date-fns
- **Utilities**: clsx, nanoid

### Replit Integration
- **Development**: Replit-specific Vite plugins
- **Runtime**: Replit development banner injection

## Component Enhancement Progress (Systematic 52/52)

### Completed Components (6/52)
- ✅ **Container Component Enhancement**: Professional upgrade following verif-component protocol
  - Protocol compliance: Container inserted empty, all configuration via componentData section only
  - Presets intelligents: 8 types (Page, Section, Card, Hero, Sidebar, Modal, Widget, Custom) avec configuration automatique
  - Contraintes enfants: Limitation et validation du contenu avec messages d'aide contextuels
  - Intégration grille: Support grid CSS avec colonnes/lignes automatiques et gaps configurables
  - Configuration responsive: Settings spécifiques mobile/tablet/desktop avec breakpoints adaptatifs
  - Date: 2 janvier 2025

- ✅ **Divider Component Advanced Enhancement**: Complete upgrade following verif-component protocol
  - Protocol compliance: Divider inserted empty, all configuration via componentData section only
  - Styles décoratifs: 6 variants (Ligne, Pointillé, Vague, Zigzag, Double, Gradient) avec personnalisation avancée
  - Intégration texte: Support texte centré, gauche, droite avec styles typographiques
  - Presets templates: 8 configurations (Simple, Décoratif, Texte, Section, Moderne, Vintage, Minimal, Créatif)
  - Options styling: Épaisseur, couleurs, ombres, espacements avec unités flexibles
  - Effets visuels: Ombre, lueur, gradient avec animations (fadeIn, slideIn, pulse, draw)
  - Preview temps réel: Aperçu immédiat dans le panel de configuration
  - Configuration responsive: Adaptations mobile/tablet/desktop automatiques
  - Date: 3 janvier 2025

- ✅ **Spacer Component Advanced Enhancement**: Professional upgrade following verif-component protocol
  - Protocol compliance: Spacer inserted empty, all configuration via componentData section only
  - Presets intelligents: 6 types (Petit, Moyen, Grand, Section, Flexible, Horizontal) avec configuration automatique
  - Types d'espacement: Vertical, horizontal, section, page avec dimensions adaptées
  - Espacement flexible: Support flex-grow/flex-shrink pour adaptation dynamique
  - Visibilité contrôlée: Affichage séparé éditeur/export avec guides visuels
  - Contraintes avancées: Min/max height, responsive design mobile/tablet/desktop
  - Cas d'usage documentés: Guide intégré pour utilisation optimale selon contexte
  - Preview interactif: Aperçu temps réel avec dimensions dans le panel configuration
  - Architecture responsive: Settings automatiques selon type d'appareil
  - Date: 3 janvier 2025

- ✅ **Link Component Professional Enhancement**: Complete upgrade following verif-component protocol
  - Protocol compliance: Link inserted empty, all configuration via componentData section only
  - Presets spécialisés: 6 types (Externe, Interne, Email, Téléphone, Téléchargement, Social) avec configuration automatique
  - Styles avancés: 5 variants (classique, bouton, badge, carte, minimal) avec tailles multiples
  - États interactifs: Couleurs personnalisables (normal, hover, visited, active) avec transitions
  - Validation URL: Vérification automatique format et statut avec indicateurs visuels
  - Icônes intégrées: 6 types d'icônes avec positions configurables et tailles ajustables
  - Analytics UTM: Suivi des clics avec paramètres utm_source, utm_medium, utm_campaign, utm_content
  - Accessibilité complète: Aria-label, title tooltips, support lecteurs d'écran
  - Sécurité renforcée: Gestion rel attributes (noopener, noreferrer, nofollow, sponsored, ugc)
  - Preview temps réel: Aperçu interactif avec tous les styles et icônes dans le panel
  - Date: 3 janvier 2025

- ✅ **Icon Component Complete Enhancement**: Advanced upgrade following verif-component protocol
  - Protocol compliance: Icon inserted empty, all configuration via componentData section only
  - Presets thématiques: 6 types (Social, Navigation, Action, Status, E-commerce, Minimal) avec configuration automatique
  - Bibliothèques multiples: Support Lucide, Heroicons, Font Awesome, Emoji, SVG personnalisé avec suggestions
  - Tailles cohérentes: 7 niveaux (micro à géant) avec proportions responsives automatiques
  - Styles d'affichage: 5 variants (cercle, carré, arrondi, sans fond, badge) avec options modulaires
  - Couleurs interactives: Normal/hover pour icône, fond, bordure avec transitions fluides
  - Animations avancées: 6 types (pulse, bounce, rotate, shake, glow, scale) avec déclencheurs configurables
  - Badge intelligent: Affichage notifications avec 4 positions et couleurs personnalisées
  - Interactivité complète: Liens cliquables, tooltips, accessibilité aria-label/title
  - Preview temps réel: Aperçu interactif avec toutes options visuelles dans le panel
  - Date: 3 janvier 2025

- ✅ **Flexbox Component Professional Enhancement**: Advanced layout system following verif-component protocol
  - Protocol compliance: Flexbox inserted empty, all configuration via componentData section only
  - Presets de layout: 6 types (Navigation, Galerie, Dashboard, Sidebar, Header, Cartes) avec configuration automatique
  - Layout avancé: Direction, wrap, justify-content, align-items, align-content avec contrôles visuels intuitifs
  - Espacement intelligent: Gap, padding configurables avec unités flexibles (px, rem, %)
  - Options conteneur: Background, border, rounded, shadow avec activation modulaire
  - Contraintes flexibles: Min-height, max-width, overflow avec gestion responsive
  - Propriétés éléments: Flex grow/shrink/basis, align-self, order par défaut pour nouveaux éléments
  - Configuration responsive: Settings séparés mobile/tablet/desktop pour direction, gap, padding
  - Outils guides: Guides visuels, snap-to-grid, distribution automatique pour alignement précis
  - Accessibilité rôles: Group, navigation, main, region, list avec landmarks et aria-label
  - Preview interactif: Aperçu temps réel avec éléments démo dans le panel configuration
  - Date: 3 janvier 2025