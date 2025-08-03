# PageForge & MagBuilder - Dual Website Builders

## PageForge (Éditeur Principal)
Éditeur visuel de sites web avec interface 3-panneaux et 52 composants.

## MagBuilder (Nouvel Éditeur)
Éditeur professionnel inspiré de SiteJet avec interface 4-zones et fonctionnalités premium.

## Overview
Ce projet contient deux éditeurs web complémentaires :

**PageForge** : Éditeur visuel principal avec interface 3-panneaux, 52 composants organisés, système de templates et export multi-format.

**MagBuilder** : Nouvel éditeur professionnel inspiré de SiteJet avec interface 4-zones, CMS Collections intégré, éditeurs de code HTML/CSS/JS, système de collaboration multi-utilisateurs et fonctionnalités premium avancées. Développé comme fork intelligent de PageForge pour maximiser la réutilisation de code.

## User Preferences
- Preferred communication style: Simple, everyday language
- Interface language: French
- Technical approach: Problem-solving with persistence and deep debugging
- Component architecture: Unified components with sub-elements managed via componentData only, no separate children in elements section
- Systematic component enhancement approach: Apply learned debugging methods across all 52 components

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
- **Visual Editor System**: Includes a component palette, live preview canvas, specialized properties panels for each component type, and a template system.
- **Project Management**: Supports standalone projects, VS Code integration, and importing existing projects. Features a template engine, multi-format export (HTML, CSS, JS), and multi-page management.
- **Database Schema**: Structured for users, projects, templates, pages, and deployments with full CRUD operations.
- **Navigation System**: Collapsible sidebar with logo-based toggle, using direct props for state management.
- **Unified Component Architecture**: All components across categories use specialized configuration panels, with complex components managing sub-elements exclusively via `componentData`.
- **Component-Specific Configuration**: Each component type has dedicated configuration options (e.g., carousel image management, navbar menu items).
- **Conditional CSS/JS Generation System**: Styles and scripts are included only when relevant components are present, minimizing code bloat.
- **Minimalist Editor Interface**: Optimized layout for maximum editing space with a compact header, miniaturized buttons, and panels closed by default.
- **Preset System Enhancement**: All Typography and Link component presets now use unified applyPreset() function instead of multiple updateProperty() calls for better performance and consistency.
- **Grid Drag & Drop Integration**: Grid components fully support drag & drop with automatic child positioning using data-component-id detection and proper CSS grid layout.
- **Complete Deployment System**: Real-time deployment with database integration, supporting multiple platforms (PageForge.app, Netlify, Vercel, custom domains) with status tracking and deployment history.
- **Updated Documentation**: User guide completely updated to reflect current 52-component architecture and new deployment capabilities.
- **Code Optimization (August 2025)**: Complete project cleanup removing backup files, unused imports, duplicate providers, and development console.log statements while preserving intentional debugging tools.
- **MagBuilder Development (August 2025)**: Nouveau éditeur professionnel inspiré de SiteJet en cours de développement. Fork intelligent de PageForge avec interface 4-zones, CMS Collections, éditeurs de code intégrés et collaboration multi-utilisateurs.
- **Production Optimization (August 2025)**: Projet nettoyé et optimisé pour déploiement VS Code et hébergement web externe via cPanel. Configuration production complète avec guides de déploiement.
- **PHP Installation Automation (August 2025)**: Suite complète d'installateurs PHP interactifs pour tous les environnements - cPanel hébergement (install-interactive.php), installation locale universelle (install-local.php), et configuration VS Code développement (install-vscode.php). Interfaces web modernes sans ligne de commande.

### Data Flow
- **Project Creation**: Template selection leads to project creation and editor redirection.
- **Visual Editing**: Drag-and-drop components, property updates, and real-time previews.
- **Content Management**: WYSIWYG editing, component tree manipulation, style adjustments, and auto-save.
- **Export Process**: Project validation, code generation, file packaging, and download/deployment.
- **Preview System Unification**: Previews utilize generated files from the export process for consistency.

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