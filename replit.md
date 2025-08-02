# PageForge - Visual Website Builder

## Overview
PageForge is a full-stack visual website builder, offering a drag-and-drop interface for website creation with templates, visual editing, and export functionality. It aims to provide a comprehensive solution for both standalone projects and seamless integration with VS Code, empowering users to design and deploy professional-grade websites efficiently.

## User Preferences
Preferred communication style: Simple, everyday language.

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
- **Visual Editor System**: Component palette, visual canvas with live preview, properties panel for real-time editing, and a template system.
- **Project Management**: Support for standalone, VS Code integration, and existing project imports. Includes a template engine, multi-format export (HTML, CSS, JS), and multi-page management.
- **Database Schema**: Structured for users, projects, templates, and pages.

### Data Flow
- **Project Creation**: Template selection initiates project creation and redirects to the editor.
- **Visual Editing**: Drag-and-drop components, update properties, and see real-time previews.
- **Content Management**: WYSIWYG editing, component tree manipulation, style adjustments, and auto-save.
- **Export Process**: Project validation, code generation, file packaging, and download/deployment.

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