# SiteForge - Visual Website Builder

## Overview
SiteForge is a full-stack visual website builder, offering a drag-and-drop interface for website creation with templates, visual editing, and export functionality. It aims to provide a comprehensive solution for both standalone projects and seamless integration with VS Code, empowering users to design and deploy professional-grade websites efficiently.

## User Preferences
- Preferred communication style: Simple, everyday language
- Interface language: French
- Technical approach: Problem-solving with persistence and deep debugging
- Component architecture: Unified components with sub-elements managed via componentData only, no separate children in elements section

## Recent Changes (January 2025)
- ✅ **Codebase Optimization & Cleanup**: Major codebase simplification and redundancy elimination
  - Removed SiteJet-Distribution folder: 2.2MB space savings, eliminated code duplication
  - Deleted obsolete files: editor-utils-old.ts, visual-editor-old.tsx (1250+ lines of dead code)
  - Cleaned distribution scripts: removed PowerShell and Windows-specific install scripts
  - Removed unused validation scripts: automated validation now handled by integrated dev tools
  - Project size reduced from complex dual-structure to streamlined single codebase
- ✅ **Project Rebranding**: Complete transition from SiteJet to SiteForge
  - Updated all user-facing text in sidebar and documentation
  - Renamed all references in guides and manuals
  - Maintained compatibility with existing functionality
  - Updated export utilities and component metadata
- ✅ **Enhanced Component Debugger**: Improved intelligent debugging system
  - Added recognition for complex components using componentData architecture
  - Fixed false positives for carousel, navbar, grid, and other complex components
  - Enhanced content analysis to distinguish between simple and complex component types
  - Improved issue detection with component-specific validation rules
- ✅ **Export Button Integration**: Added export functionality directly in editor header
  - Export button positioned next to Save button in ultra-compact header
  - Green styling (bg-green-600) to distinguish from blue Save button
  - Integrated with existing useExportProject hook for seamless functionality
  - Compact design with Download icon matching header's minimalist approach
  - Fixed export format: Now creates proper ZIP files using JSZip instead of JSON files
  - Real ZIP archives contain HTML, CSS, JS, package.json, and README.md files
- ✅ **Specialized Configuration Panels**: All 52 components now have dedicated configuration panels instead of generic text areas
- ✅ **Unified Architecture Completed**: Complex components (header, footer, navbar, grid, list, accordion, carousel) are created empty and populated via specialized configuration panels
- ✅ **Enhanced Component System**: Each component type has its own specialized options and real-time configuration capabilities
- ✅ **Code Quality Improvements**: Resolved all syntax errors and duplicate function declarations
- ✅ **Responsive Component Integration**: All components use componentData as the single source of truth for content and configuration
- ✅ **Conditional CSS/JS Generation System**: Complete implementation of conditional code generation where styles and scripts are only included when specific components are present in the project
  - 18 component types with specialized conditional styles (carousel, accordion, grid, modal, card, form, button, table, navbar, text, image, video, list, header, footer, sidebar, chart)
  - Component detection system that analyzes project structure to determine which components are actually used
  - Elimination of code bloat through precise conditional inclusion
  - Separate CSS and JavaScript files with clean separation of concerns
- ✅ **Grid Component Resolution**: Successfully diagnosed and fixed critical configuration issue
  - Problem: Conflict between generic CSS grid properties and specialized component configuration
  - Solution: Unified componentData structure using gridItems with {title, content} format
  - Enhancement: Added verification procedure document for systematic component debugging
- ✅ **Minimalist Editor Interface**: Complete optimization of editor layout for maximum editing space
  - Ultra-compact header: 32px height with miniaturized buttons (6x6px) and small icons (3x3px)
  - All panels closed by default: component palette, properties panel, and main navigation sidebar retracted
  - Smart sidebar management: main navigation automatically retracts in editor, reopens in other pages
  - Automatic sidebar control: React state management + button click simulation for proper retraction
  - Preserved functionality: all panels accessible via toggle buttons when needed
  - Maximized canvas space: clean interface focused on visual editing workflow

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
- **Unified Component Architecture**: All 52 components across 8 categories have specialized configuration panels. Complex components (carousel, navbar, footer, card, form, chart, video, grid, sidebar, header, list, accordion) are created empty and their sub-elements are managed exclusively via componentData in the configuration section, not as separate elements in the elements section.
- **Component-Specific Configuration**: Each component type has dedicated configuration options (e.g., carousel with image management and text positioning, navbar with menu items and branding, accordion with Q&A management).

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