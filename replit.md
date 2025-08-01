# PageForge - Visual Website Builder

## Overview
This is a full-stack visual website builder application called PageForge, built with React, Express.js, and PostgreSQL. It provides a drag-and-drop interface for creating websites with templates, visual editing capabilities, and export functionality. The application supports both standalone projects and VS Code integration.

**Status:** Production-ready ✅ (Last updated: July 30, 2025)
- All core functionalities operational
- Console errors resolved
- Accessibility warnings fixed
- TypeScript schema errors corrected
- Export system completely refactored and optimized

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Drag & Drop**: react-dnd with HTML5 backend for visual editor
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js with middleware for JSON parsing and logging
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Schema Validation**: Zod for request/response validation
- **Development**: tsx for TypeScript execution

### Key Components

#### Visual Editor System
- **Component Palette**: Draggable UI components organized by categories
- **Visual Canvas**: Drop zone with live preview and component selection
- **Properties Panel**: Real-time component styling and attribute editing
- **Template System**: Pre-built page templates with reusable components

#### Project Management
- **Project Types**: Standalone, VS Code integration, existing project import
- **Template Engine**: Built-in templates with custom template creation
- **Export System**: Multi-format export (HTML, CSS, JS) with optimization options
- **Page Management**: Multi-page support with routing configuration

#### Database Schema
- **Users**: Authentication and user management
- **Projects**: Project metadata, settings, and content storage
- **Templates**: Template definitions with categorization and tagging
- **Pages**: Individual page content within projects

## Data Flow

1. **Project Creation**: User selects template → Project created with initial structure → Redirected to visual editor
2. **Visual Editing**: Component drag from palette → Drop on canvas → Properties updated → Real-time preview
3. **Content Management**: WYSIWYG editing → Component tree manipulation → Style adjustments → Auto-save
4. **Export Process**: Project validation → Code generation → File packaging → Download/deployment

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form
- **UI Components**: Radix UI primitives, Lucide React icons
- **Development Tools**: Vite, TypeScript, ESBuild for production builds
- **Database**: Drizzle ORM, Neon Database serverless driver

### Development & Production Tools
- **CSS Processing**: Tailwind CSS, PostCSS, Autoprefixer
- **Code Quality**: TypeScript strict mode, ESLint configuration
- **Date Handling**: date-fns with French locale support
- **Utilities**: clsx for conditional classes, nanoid for ID generation

### Replit Integration
- **Development**: Replit-specific Vite plugins for error overlay and cartographer
- **Runtime**: Replit development banner injection

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with HMR and middleware mode
- **Database**: PostgreSQL via Neon Database with connection pooling
- **Environment Variables**: DATABASE_URL for database connection
- **Build Process**: Concurrent frontend (Vite) and backend (ESBuild) compilation

### Production Setup
- **Frontend**: Static files served from Express after Vite build
- **Backend**: Compiled TypeScript bundle with external dependencies
- **Database**: Production PostgreSQL with Drizzle migrations
- **Deployment**: Single Node.js process serving both frontend and API

### Configuration Management
- **Database Migrations**: Drizzle Kit for schema management
- **Build Scripts**: Separate dev/build/start scripts for different environments
- **Path Resolution**: TypeScript path mapping for clean imports
- **Asset Handling**: Vite-managed assets with proper resolution

## Recent Changes (August 1, 2025)

### Complete Visual Editor Implementation ✅
- **Full Drag-and-Drop Editor**: Created complete visual editor with advanced drag-and-drop functionality
- **Three-Panel Layout**: Component palette (left), visual canvas (center), properties panel (right)
- **Real-time Component Manipulation**: Add, move, select, and modify components visually
- **Advanced Component System**: 10 component types with visual rendering and positioning
- **Visual Feedback**: Component selection handles, drop zones, grid background
- **Property Editing**: Real-time content, position, and style modification
- **TypeScript Compliance**: Zero compilation errors with full type safety
- **Collaborative Features**: WebSocket integration for real-time collaboration

### Visual Editing Features ✅
- **Drag-and-Drop Components**: Visual component placement with mouse/touch support
- **Component Positioning**: Precise X/Y positioning with visual feedback
- **Selection System**: Click-to-select with visual handles and highlighting
- **Live Preview**: Real-time component rendering in the canvas
- **Property Panel**: Content editing, positioning, and styling controls
- **Multi-backend Support**: HTML5 and touch backends for desktop/mobile compatibility
- **Auto-save**: Automatic project saving to database with optimistic updates

### Bug Fixes and Project Creation ✅
- **TypeScript Errors Fixed**: Resolved all TypeScript compilation errors in enhanced-properties-panel.tsx
- **Project Creation Refactored**: Complete overhaul of create-project-modal.tsx with proper type safety
- **Multi-step UI**: Implemented intuitive multi-step project creation (Type → Template → Details)
- **API Integration Fixed**: Corrected form data handling and API request structure
- **Template System**: Enhanced template selection with featured templates and empty project option
- **Validation**: Proper form validation with real-time feedback and error handling
- **Error Handling**: Comprehensive error messages and loading states

### Technical Improvements ✅
- Fixed component property access (props/style → attributes/styles)
- Corrected mutation function signatures and response handling
- Enhanced form handling with proper TypeScript types
- Improved API error reporting with detailed status codes
- Added proper template content integration

## Recent Changes (August 1, 2025)

### Mobile-First Editor Optimization ✅
- **Touch-Optimized Drag & Drop**: Enhanced FreeDragComponent with constrained movement within container bounds
- **Compact Responsive Layout**: Reduced sidebar widths (left: 28px, right: 32px) for tablet/smartphone optimization
- **Page-Level Properties**: Added dedicated "Page" tab in properties panel with background ColorPicker (solid/gradient/image)
- **Header Control Integration**: Moved panel toggle controls from floating buttons to header burger-menu style
- **Advanced Color Management**: Integrated enhanced ColorPicker throughout interface with 3 background types
- **Mobile UI Controls**: Smart header-based panel visibility controls for mobile devices

### Enhanced Component Editor ✅
- **Page Background Control**: Full page styling with ColorPicker supporting solid colors, gradients, and image backgrounds
- **Tabbed Properties Panel**: Component/Page tabs for organized property management
- **Optimized Touch Interaction**: Improved component selection and movement with touch constraints
- **Compact Interface Elements**: Reduced icon sizes and optimized spacing for mobile screens
- **Smart Panel Management**: Context-aware panel visibility based on device type and user interaction

### Previous Implementation - Collaborative Editing ✅
- **Real-time Collaboration System**: Complete WebSocket-based collaborative editing with operational transforms
- **Multi-user Support**: Real-time synchronization for multiple users editing the same project
- **User Presence Indicators**: Live cursors, component selection highlighting, and user awareness
- **Conflict Resolution**: Smart component locking and operational transform conflict resolution
- **Collaboration UI**: Dedicated panels showing active users, connection status, and collaborative features
- **Performance Optimized**: Throttled cursor updates and efficient WebSocket communication

### Collaborative Features ✅
- **Live User Cursors**: Real-time mouse cursor tracking across all connected users
- **Component Highlighting**: Visual indicators when other users are editing components
- **User Management**: Connection status, user colors, and activity tracking
- **Smart Locking**: Automatic component locking during editing to prevent conflicts
- **Reconnection Logic**: Automatic reconnection with exponential backoff for reliability
- **Mobile Support**: Touch-optimized collaborative editing for tablets and smartphones

### Previous Changes (July 31, 2025)

### Bug Fixes and Code Quality ✅
- **TypeScript Errors Fixed**: Resolved all major TypeScript compilation errors
- **Schema Improvements**: Added missing `meta` field to `PageContent` interface
- **Drag & Drop Configuration**: Fixed `MultiBackend` configuration for react-dnd
- **Component Props**: Corrected props in `ErrorNotification` and `VisualEditor`
- **Code Cleanup**: Removed debug console.log statements for production readiness
- **Typo Fixes**: Corrected variable name typos in storage export functions

### Technical Debt Reduction ✅
- Improved null safety checks in visual editor component updates
- Better error handling in component rendering
- Cleaned up unused imports and dead code
- Standardized error message formatting

## Previous Changes (July 30, 2025)

### Export System Refactoring ✅
- **Enhanced Error Handling**: Export functions now provide detailed, user-friendly error messages in French
- **SEO Optimization**: Added comprehensive SEO meta tags including Open Graph and Twitter Cards with keywords support
- **Code Structure**: Refactored long methods into smaller, maintainable helper functions
- **Naming Conventions**: Standardized method names (createPage → createNewPage)
- **Performance**: Added cache-busting for CSS/JS files with version parameters
- **Security**: Implemented proper HTML escaping for all user content
- **Responsive Design**: Enhanced responsive CSS generation
- **Component Interactivity**: Added smart JavaScript generation based on detected components

### Technical Improvements ✅
- Fixed generateHTML script tag closure bug
- Enhanced export options with minification support
- Improved project content validation before export
- Added utility functions for carousel and modal components
- Better file name sanitization

The application follows a modern full-stack architecture with clear separation of concerns, type safety throughout, and optimized development experience with hot reloading and comprehensive tooling.