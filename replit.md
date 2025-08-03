# SiteForge - Visual Website Builder

## Overview
SiteForge is a full-stack visual website builder designed to streamline website creation. It offers a drag-and-drop interface, template system, visual editing capabilities, and multi-format export functionality. The project aims to provide a comprehensive solution for standalone web design and seamless integration with development environments like VS Code, enabling efficient creation and deployment of professional websites.

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
- **Visual Editor System**: Includes a component palette, live preview canvas, specialized properties panels for each component type, and a template system.
- **Project Management**: Supports standalone projects, VS Code integration, and importing existing projects. Features a template engine, multi-format export (HTML, CSS, JS), and multi-page management.
- **Database Schema**: Structured for users, projects, templates, and pages.
- **Navigation System**: Collapsible sidebar with logo-based toggle, using direct props for state management.
- **Unified Component Architecture**: All components across categories use specialized configuration panels, with complex components managing sub-elements exclusively via `componentData`.
- **Component-Specific Configuration**: Each component type has dedicated configuration options (e.g., carousel image management, navbar menu items).
- **Conditional CSS/JS Generation System**: Styles and scripts are included only when relevant components are present, minimizing code bloat.
- **Minimalist Editor Interface**: Optimized layout for maximum editing space with a compact header, miniaturized buttons, and panels closed by default.

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