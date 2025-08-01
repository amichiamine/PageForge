import { 
  Type, 
  Square, 
  Image, 
  MousePointer, 
  Layers, 
  Layout,
  FileText,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Star,
  Heart,
  ShoppingCart,
  Video,
  Music,
  Download,
  Upload,
  Search,
  Menu,
  User,
  Lock,
  Trash2,
  Grid,
  Package,
  Users,
  TrendingUp,
  CheckCircle,
  Zap,
  Navigation,
  MoreHorizontal,
  Folder,
  Plus,
  HelpCircle,
  Edit,
  CreditCard,
  Filter,
  ExternalLink,
  Code,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Wifi,
  Battery,
  Signal,
  MessageCircle,
  Bell,
  Settings,
  Home,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  X,
  Check,
  AlertCircle,
  Info,
  Clock,
  Archive,
  Bookmark,
  Share,
  RefreshCw,
  RotateCcw,
  Save,
  Copy,
  Clipboard,
  Eye,
  EyeOff,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Target,
  Award,
  Gift,
  Truck,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Printer,
  Camera,
  Headphones,
  Mic,
  Shield,
  Key,
  Database,
  Server,
  Cloud,
  Wifi as WifiIcon,
  Link,
  Unlink,
  Maximize,
  Minimize,
  RotateCw,
  ZoomIn,
  ZoomOut,
  PanelLeft,
  PanelRight,
  Sidebar,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  Hash,
  Quote,
  Code2,
  Terminal,
  Cpu,
  HardDrive,
  MemoryStick,
  Radio,
  Bluetooth,
  Usb,
  Power,
  Lightbulb,
  Sun,
  Moon,
  CloudRain,
  CloudSnow,
  Thermometer,
  Wind,
  Compass,
  Map,
  Route,
  Car,
  Bus,
  Train,
  Plane,
  Ship
} from 'lucide-react';

export interface ComponentDefinition {
  type: string;
  label: string;
  icon: any;
  color: string;
  category: string;
  description: string;
  isPremium?: boolean;
  isNew?: boolean;
  defaultAttributes?: Record<string, any>;
  defaultStyles?: Record<string, any>;
  cssProperties?: string[];
}

export const componentCategories = [
  { id: 'basic', name: 'Basique', icon: Square },
  { id: 'layout', name: 'Mise en page', icon: Layout },
  { id: 'content', name: 'Contenu', icon: FileText },
  { id: 'media', name: 'Médias', icon: Image },
  { id: 'forms', name: 'Formulaires', icon: Edit },
  { id: 'navigation', name: 'Navigation', icon: Navigation },
  { id: 'ecommerce', name: 'E-commerce', icon: ShoppingCart },
  { id: 'social', name: 'Social', icon: Users },
  { id: 'charts', name: 'Graphiques', icon: TrendingUp },
  { id: 'premium', name: 'Premium', icon: Zap },
  { id: 'advanced', name: 'Avancé', icon: Settings },
  { id: 'widgets', name: 'Widgets', icon: Grid }
];

export const componentDefinitions: ComponentDefinition[] = [
  // Basic Components
  {
    type: 'text',
    label: 'Texte',
    icon: Type,
    color: '#3b82f6',
    category: 'basic',
    description: 'Élément de texte simple',
    cssProperties: ['color', 'font-size', 'font-weight', 'font-family', 'text-align', 'line-height', 'letter-spacing', 'text-decoration', 'text-transform', 'text-shadow'],
    defaultAttributes: { className: 'text-base' },
    defaultStyles: { fontSize: '16px', color: '#333333' }
  },
  {
    type: 'heading',
    label: 'Titre',
    icon: Type,
    color: '#1e40af',
    category: 'basic',
    description: 'Titre principal ou secondaire',
    cssProperties: ['color', 'font-size', 'font-weight', 'font-family', 'text-align', 'line-height', 'margin', 'padding'],
    defaultAttributes: { className: 'text-2xl font-bold' },
    defaultStyles: { fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }
  },
  {
    type: 'paragraph',
    label: 'Paragraphe',
    icon: FileText,
    color: '#6b7280',
    category: 'basic',
    description: 'Paragraphe de texte',
    cssProperties: ['color', 'font-size', 'font-family', 'text-align', 'line-height', 'margin', 'padding', 'text-indent'],
    defaultAttributes: { className: 'text-gray-700' },
    defaultStyles: { fontSize: '14px', lineHeight: '1.6', color: '#374151' }
  },
  {
    type: 'button',
    label: 'Bouton',
    icon: MousePointer,
    color: '#10b981',
    category: 'basic',
    description: 'Bouton interactif',
    cssProperties: ['background-color', 'color', 'border', 'border-radius', 'padding', 'font-size', 'font-weight', 'cursor', 'transition', 'box-shadow', 'hover:background-color'],
    defaultAttributes: { className: 'px-4 py-2 bg-blue-500 text-white rounded' },
    defaultStyles: { backgroundColor: '#3b82f6', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer' }
  },
  {
    type: 'link',
    label: 'Lien',
    icon: ExternalLink,
    color: '#0ea5e9',
    category: 'basic',
    description: 'Lien hypertexte',
    cssProperties: ['color', 'text-decoration', 'font-weight', 'hover:color', 'hover:text-decoration'],
    defaultAttributes: { href: '#', className: 'text-blue-600 hover:underline' },
    defaultStyles: { color: '#2563eb', textDecoration: 'none' }
  },
  {
    type: 'image',
    label: 'Image',
    icon: Image,
    color: '#f59e0b',
    category: 'basic',
    description: 'Image ou photo',
    cssProperties: ['width', 'height', 'object-fit', 'object-position', 'border-radius', 'box-shadow', 'filter', 'opacity'],
    defaultAttributes: { src: 'https://via.placeholder.com/300x200', alt: 'Image', className: 'rounded' },
    defaultStyles: { width: '300px', height: '200px', borderRadius: '8px' }
  },

  // Layout Components
  {
    type: 'container',
    label: 'Conteneur',
    icon: Square,
    color: '#8b5cf6',
    category: 'layout',
    description: 'Conteneur de mise en page',
    cssProperties: ['width', 'height', 'max-width', 'margin', 'padding', 'background-color', 'border', 'border-radius', 'box-shadow', 'display', 'flex-direction', 'justify-content', 'align-items'],
    defaultAttributes: { className: 'p-4 bg-gray-100 rounded' },
    defaultStyles: { padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px', minHeight: '100px' }
  },
  {
    type: 'section',
    label: 'Section',
    icon: Layout,
    color: '#7c3aed',
    category: 'layout',
    description: 'Section de contenu',
    cssProperties: ['padding', 'margin', 'background-color', 'border', 'width', 'height', 'display'],
    defaultAttributes: { className: 'py-8' },
    defaultStyles: { padding: '32px 0', width: '100%' }
  },
  {
    type: 'flexbox',
    label: 'Flexbox',
    icon: Layers,
    color: '#06b6d4',
    category: 'layout',
    description: 'Conteneur flexible',
    cssProperties: ['display', 'flex-direction', 'justify-content', 'align-items', 'flex-wrap', 'gap', 'padding', 'margin'],
    defaultAttributes: { className: 'flex gap-4' },
    defaultStyles: { display: 'flex', gap: '16px', padding: '16px' }
  },
  {
    type: 'grid',
    label: 'Grille',
    icon: Grid,
    color: '#0891b2',
    category: 'layout',
    description: 'Mise en page en grille',
    cssProperties: ['display', 'grid-template-columns', 'grid-template-rows', 'gap', 'grid-gap', 'padding', 'margin'],
    defaultAttributes: { className: 'grid grid-cols-2 gap-4' },
    defaultStyles: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', padding: '16px' }
  },
  {
    type: 'card',
    label: 'Carte',
    icon: Package,
    color: '#ec4899',
    category: 'layout',
    description: 'Carte de contenu',
    cssProperties: ['background-color', 'border', 'border-radius', 'box-shadow', 'padding', 'margin', 'width', 'height'],
    defaultAttributes: { className: 'bg-white p-6 rounded-lg shadow-md' },
    defaultStyles: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }
  },

  // Content Components
  {
    type: 'list',
    label: 'Liste',
    icon: List,
    color: '#84cc16',
    category: 'content',
    description: 'Liste d\'éléments',
    cssProperties: ['list-style-type', 'padding', 'margin', 'line-height'],
    defaultAttributes: { className: 'list-disc pl-4' },
    defaultStyles: { listStyleType: 'disc', paddingLeft: '16px' }
  },
  {
    type: 'table',
    label: 'Tableau',
    icon: Grid,
    color: '#6366f1',
    category: 'content',
    description: 'Tableau de données',
    cssProperties: ['width', 'border-collapse', 'border', 'background-color'],
    defaultAttributes: { className: 'table-auto w-full border-collapse' },
    defaultStyles: { width: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb' }
  },
  {
    type: 'blockquote',
    label: 'Citation',
    icon: Quote,
    color: '#f59e0b',
    category: 'content',
    description: 'Citation ou témoignage',
    cssProperties: ['border-left', 'padding-left', 'font-style', 'color', 'background-color'],
    defaultAttributes: { className: 'border-l-4 border-blue-500 pl-4 italic' },
    defaultStyles: { borderLeft: '4px solid #3b82f6', paddingLeft: '16px', fontStyle: 'italic', color: '#6b7280' }
  },
  {
    type: 'code',
    label: 'Code',
    icon: Code2,
    color: '#1f2937',
    category: 'content',
    description: 'Bloc de code',
    cssProperties: ['background-color', 'color', 'font-family', 'padding', 'border-radius', 'border', 'font-size'],
    defaultAttributes: { className: 'bg-gray-100 p-4 rounded font-mono' },
    defaultStyles: { backgroundColor: '#f3f4f6', padding: '16px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '14px' }
  },

  // Media Components
  {
    type: 'video',
    label: 'Vidéo',
    icon: Video,
    color: '#dc2626',
    category: 'media',
    description: 'Lecteur vidéo',
    cssProperties: ['width', 'height', 'border-radius', 'box-shadow'],
    defaultAttributes: { controls: true, className: 'w-full rounded' },
    defaultStyles: { width: '100%', height: '300px', borderRadius: '8px' }
  },
  {
    type: 'audio',
    label: 'Audio',
    icon: Music,
    color: '#9333ea',
    category: 'media',
    description: 'Lecteur audio',
    cssProperties: ['width', 'height'],
    defaultAttributes: { controls: true, className: 'w-full' },
    defaultStyles: { width: '100%' }
  },
  {
    type: 'gallery',
    label: 'Galerie',
    icon: Image,
    color: '#059669',
    category: 'media',
    description: 'Galerie d\'images',
    isPremium: true,
    cssProperties: ['display', 'grid-template-columns', 'gap', 'padding'],
    defaultAttributes: { className: 'grid grid-cols-3 gap-2' },
    defaultStyles: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }
  },
  {
    type: 'carousel',
    label: 'Carrousel',
    icon: SkipForward,
    color: '#0284c7',
    category: 'media',
    description: 'Carrousel d\'images',
    isPremium: true,
    cssProperties: ['width', 'height', 'overflow', 'border-radius'],
    defaultAttributes: { className: 'relative overflow-hidden rounded-lg' },
    defaultStyles: { width: '100%', height: '400px', overflow: 'hidden', borderRadius: '12px' }
  },

  // Form Components
  {
    type: 'input',
    label: 'Champ de saisie',
    icon: Edit,
    color: '#0d9488',
    category: 'forms',
    description: 'Champ de texte',
    cssProperties: ['width', 'height', 'padding', 'border', 'border-radius', 'background-color', 'color', 'font-size'],
    defaultAttributes: { type: 'text', placeholder: 'Tapez ici...', className: 'p-2 border rounded' },
    defaultStyles: { width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }
  },
  {
    type: 'textarea',
    label: 'Zone de texte',
    icon: FileText,
    color: '#0891b2',
    category: 'forms',
    description: 'Zone de texte multi-lignes',
    cssProperties: ['width', 'height', 'padding', 'border', 'border-radius', 'resize', 'background-color'],
    defaultAttributes: { placeholder: 'Votre message...', className: 'p-2 border rounded' },
    defaultStyles: { width: '100%', height: '120px', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', resize: 'vertical' }
  },
  {
    type: 'select',
    label: 'Liste déroulante',
    icon: ChevronDown,
    color: '#7c2d12',
    category: 'forms',
    description: 'Menu déroulant',
    cssProperties: ['width', 'height', 'padding', 'border', 'border-radius', 'background-color'],
    defaultAttributes: { className: 'p-2 border rounded' },
    defaultStyles: { width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }
  },
  {
    type: 'checkbox',
    label: 'Case à cocher',
    icon: CheckCircle,
    color: '#15803d',
    category: 'forms',
    description: 'Case à cocher',
    cssProperties: ['width', 'height', 'margin', 'accent-color'],
    defaultAttributes: { type: 'checkbox', className: 'mr-2' },
    defaultStyles: { width: '16px', height: '16px', marginRight: '8px' }
  },
  {
    type: 'radio',
    label: 'Bouton radio',
    icon: Radio,
    color: '#c2410c',
    category: 'forms',
    description: 'Bouton radio',
    cssProperties: ['width', 'height', 'margin', 'accent-color'],
    defaultAttributes: { type: 'radio', className: 'mr-2' },
    defaultStyles: { width: '16px', height: '16px', marginRight: '8px' }
  },
  {
    type: 'form',
    label: 'Formulaire',
    icon: Edit,
    color: '#1d4ed8',
    category: 'forms',
    description: 'Conteneur de formulaire',
    cssProperties: ['padding', 'margin', 'background-color', 'border', 'border-radius'],
    defaultAttributes: { className: 'p-6 bg-white rounded-lg shadow' },
    defaultStyles: { padding: '24px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }
  },

  // Navigation Components
  {
    type: 'navbar',
    label: 'Barre de navigation',
    icon: Menu,
    color: '#1e293b',
    category: 'navigation',
    description: 'Navigation principale',
    cssProperties: ['background-color', 'padding', 'border-bottom', 'position', 'top', 'z-index', 'width'],
    defaultAttributes: { className: 'bg-white shadow-sm p-4' },
    defaultStyles: { backgroundColor: 'white', padding: '16px', borderBottom: '1px solid #e5e7eb', width: '100%' }
  },
  {
    type: 'menu',
    label: 'Menu',
    icon: Navigation,
    color: '#374151',
    category: 'navigation',
    description: 'Menu de navigation',
    cssProperties: ['display', 'flex-direction', 'gap', 'padding', 'background-color'],
    defaultAttributes: { className: 'flex gap-4' },
    defaultStyles: { display: 'flex', gap: '16px', padding: '8px' }
  },
  {
    type: 'breadcrumb',
    label: 'Fil d\'Ariane',
    icon: ArrowRight,
    color: '#6b7280',
    category: 'navigation',
    description: 'Navigation hiérarchique',
    cssProperties: ['display', 'align-items', 'gap', 'color'],
    defaultAttributes: { className: 'flex items-center gap-2 text-sm' },
    defaultStyles: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }
  },
  {
    type: 'pagination',
    label: 'Pagination',
    icon: MoreHorizontal,
    color: '#4338ca',
    category: 'navigation',
    description: 'Navigation par pages',
    cssProperties: ['display', 'gap', 'padding', 'justify-content'],
    defaultAttributes: { className: 'flex justify-center gap-2' },
    defaultStyles: { display: 'flex', justifyContent: 'center', gap: '8px', padding: '16px' }
  },

  // E-commerce Components
  {
    type: 'product-card',
    label: 'Carte produit',
    icon: ShoppingCart,
    color: '#dc2626',
    category: 'ecommerce',
    description: 'Carte de produit',
    isPremium: true,
    cssProperties: ['background-color', 'border', 'border-radius', 'padding', 'box-shadow', 'transition'],
    defaultAttributes: { className: 'bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow' },
    defaultStyles: { backgroundColor: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }
  },
  {
    type: 'price',
    label: 'Prix',
    icon: CreditCard,
    color: '#059669',
    category: 'ecommerce',
    description: 'Affichage de prix',
    cssProperties: ['font-size', 'font-weight', 'color', 'text-decoration'],
    defaultAttributes: { className: 'text-2xl font-bold text-green-600' },
    defaultStyles: { fontSize: '24px', fontWeight: 'bold', color: '#059669' }
  },
  {
    type: 'cart-button',
    label: 'Bouton panier',
    icon: ShoppingCart,
    color: '#ea580c',
    category: 'ecommerce',
    description: 'Bouton d\'ajout au panier',
    cssProperties: ['background-color', 'color', 'padding', 'border-radius', 'border', 'cursor', 'transition'],
    defaultAttributes: { className: 'bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600' },
    defaultStyles: { backgroundColor: '#ea580c', color: 'white', padding: '8px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer' }
  },
  {
    type: 'rating',
    label: 'Évaluation',
    icon: Star,
    color: '#facc15',
    category: 'ecommerce',
    description: 'Système d\'étoiles',
    cssProperties: ['color', 'font-size', 'display', 'gap'],
    defaultAttributes: { className: 'flex items-center gap-1 text-yellow-400' },
    defaultStyles: { display: 'flex', alignItems: 'center', gap: '4px', color: '#facc15', fontSize: '18px' }
  },

  // Social Components
  {
    type: 'profile-card',
    label: 'Carte profil',
    icon: User,
    color: '#7c3aed',
    category: 'social',
    description: 'Carte de profil utilisateur',
    isPremium: true,
    cssProperties: ['background-color', 'border-radius', 'padding', 'text-align', 'box-shadow'],
    defaultAttributes: { className: 'bg-white p-6 rounded-lg shadow text-center' },
    defaultStyles: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }
  },
  {
    type: 'social-share',
    label: 'Partage social',
    icon: Share,
    color: '#2563eb',
    category: 'social',
    description: 'Boutons de partage',
    cssProperties: ['display', 'gap', 'justify-content'],
    defaultAttributes: { className: 'flex justify-center gap-2' },
    defaultStyles: { display: 'flex', justifyContent: 'center', gap: '8px' }
  },
  {
    type: 'comments',
    label: 'Commentaires',
    icon: MessageCircle,
    color: '#0891b2',
    category: 'social',
    description: 'Section commentaires',
    isPremium: true,
    cssProperties: ['padding', 'border', 'border-radius', 'background-color'],
    defaultAttributes: { className: 'p-4 bg-gray-50 rounded-lg' },
    defaultStyles: { padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }
  },

  // Chart Components
  {
    type: 'chart-bar',
    label: 'Graphique barres',
    icon: TrendingUp,
    color: '#059669',
    category: 'charts',
    description: 'Graphique en barres',
    isPremium: true,
    cssProperties: ['width', 'height', 'background-color', 'border-radius'],
    defaultAttributes: { className: 'w-full h-64 bg-white rounded-lg shadow' },
    defaultStyles: { width: '100%', height: '256px', backgroundColor: 'white', borderRadius: '8px' }
  },
  {
    type: 'chart-line',
    label: 'Graphique ligne',
    icon: TrendingUp,
    color: '#0284c7',
    category: 'charts',
    description: 'Graphique en courbes',
    isPremium: true,
    cssProperties: ['width', 'height', 'background-color', 'border-radius'],
    defaultAttributes: { className: 'w-full h-64 bg-white rounded-lg shadow' },
    defaultStyles: { width: '100%', height: '256px', backgroundColor: 'white', borderRadius: '8px' }
  },
  {
    type: 'chart-pie',
    label: 'Graphique secteurs',
    icon: Target,
    color: '#dc2626',
    category: 'charts',
    description: 'Graphique circulaire',
    isPremium: true,
    cssProperties: ['width', 'height', 'background-color', 'border-radius'],
    defaultAttributes: { className: 'w-64 h-64 bg-white rounded-lg shadow mx-auto' },
    defaultStyles: { width: '256px', height: '256px', backgroundColor: 'white', borderRadius: '8px', margin: '0 auto' }
  },

  // Premium Components
  {
    type: 'modal',
    label: 'Fenêtre modale',
    icon: Monitor,
    color: '#1e40af',
    category: 'premium',
    description: 'Fenêtre pop-up',
    isPremium: true,
    cssProperties: ['position', 'top', 'left', 'transform', 'background-color', 'border-radius', 'box-shadow', 'z-index'],
    defaultAttributes: { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center' },
    defaultStyles: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', borderRadius: '12px', zIndex: '1000' }
  },
  {
    type: 'accordion',
    label: 'Accordéon',
    icon: ChevronDown,
    color: '#7c2d12',
    category: 'premium',
    description: 'Contenu pliable',
    isPremium: true,
    cssProperties: ['border', 'border-radius', 'background-color'],
    defaultAttributes: { className: 'border rounded-lg overflow-hidden' },
    defaultStyles: { border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }
  },
  {
    type: 'tabs',
    label: 'Onglets',
    icon: Folder,
    color: '#0f766e',
    category: 'premium',
    description: 'Navigation par onglets',
    isPremium: true,
    cssProperties: ['display', 'border-bottom', 'background-color'],
    defaultAttributes: { className: 'border-b bg-white' },
    defaultStyles: { display: 'flex', borderBottom: '1px solid #e5e7eb', backgroundColor: 'white' }
  },
  {
    type: 'dropdown',
    label: 'Menu déroulant',
    icon: ChevronDown,
    color: '#a21caf',
    category: 'premium',
    description: 'Menu contextuel',
    isPremium: true,
    cssProperties: ['position', 'background-color', 'border', 'border-radius', 'box-shadow', 'z-index'],
    defaultAttributes: { className: 'absolute bg-white border rounded-lg shadow-lg' },
    defaultStyles: { position: 'absolute', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', zIndex: '10' }
  },

  // Advanced Components
  {
    type: 'timeline',
    label: 'Chronologie',
    icon: Clock,
    color: '#0f766e',
    category: 'advanced',
    description: 'Timeline d\'événements',
    isPremium: true,
    cssProperties: ['position', 'border-left', 'padding-left', 'margin-left'],
    defaultAttributes: { className: 'relative border-l-2 border-blue-500 pl-8 ml-4' },
    defaultStyles: { position: 'relative', borderLeft: '2px solid #3b82f6', paddingLeft: '32px', marginLeft: '16px' }
  },
  {
    type: 'progress',
    label: 'Barre de progression',
    icon: TrendingUp,
    color: '#059669',
    category: 'advanced',
    description: 'Indicateur de progression',
    cssProperties: ['width', 'height', 'background-color', 'border-radius', 'overflow'],
    defaultAttributes: { className: 'w-full h-2 bg-gray-200 rounded-full overflow-hidden' },
    defaultStyles: { width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden' }
  },
  {
    type: 'tooltip',
    label: 'Infobulle',
    icon: Info,
    color: '#374151',
    category: 'advanced',
    description: 'Texte d\'aide au survol',
    isPremium: true,
    cssProperties: ['position', 'background-color', 'color', 'padding', 'border-radius', 'font-size', 'z-index'],
    defaultAttributes: { className: 'absolute bg-gray-800 text-white px-2 py-1 rounded text-sm' },
    defaultStyles: { position: 'absolute', backgroundColor: '#1f2937', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', zIndex: '20' }
  },
  {
    type: 'badge',
    label: 'Badge',
    icon: Award,
    color: '#dc2626',
    category: 'advanced',
    description: 'Étiquette ou badge',
    cssProperties: ['background-color', 'color', 'padding', 'border-radius', 'font-size', 'font-weight'],
    defaultAttributes: { className: 'bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold' },
    defaultStyles: { backgroundColor: '#dc2626', color: 'white', padding: '2px 8px', borderRadius: '9999px', fontSize: '12px', fontWeight: '600' }
  },

  // Widget Components
  {
    type: 'weather',
    label: 'Météo',
    icon: CloudRain,
    color: '#0284c7',
    category: 'widgets',
    description: 'Widget météo',
    isPremium: true,
    isNew: true,
    cssProperties: ['background-color', 'padding', 'border-radius', 'text-align'],
    defaultAttributes: { className: 'bg-blue-100 p-4 rounded-lg text-center' },
    defaultStyles: { backgroundColor: '#dbeafe', padding: '16px', borderRadius: '8px', textAlign: 'center' }
  },
  {
    type: 'clock',
    label: 'Horloge',
    icon: Clock,
    color: '#1f2937',
    category: 'widgets',
    description: 'Horloge numérique',
    isPremium: true,
    cssProperties: ['font-size', 'font-weight', 'text-align', 'color', 'background-color', 'padding', 'border-radius'],
    defaultAttributes: { className: 'text-4xl font-bold text-center p-4 bg-gray-100 rounded' },
    defaultStyles: { fontSize: '36px', fontWeight: 'bold', textAlign: 'center', padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px' }
  },
  {
    type: 'counter',
    label: 'Compteur',
    icon: Hash,
    color: '#7c3aed',
    category: 'widgets',
    description: 'Compteur animé',
    isPremium: true,
    cssProperties: ['font-size', 'font-weight', 'color', 'text-align'],
    defaultAttributes: { className: 'text-6xl font-bold text-purple-600 text-center' },
    defaultStyles: { fontSize: '48px', fontWeight: 'bold', color: '#7c3aed', textAlign: 'center' }
  },
  {
    type: 'map',
    label: 'Carte',
    icon: Map,
    color: '#059669',
    category: 'widgets',
    description: 'Carte interactive',
    isPremium: true,
    cssProperties: ['width', 'height', 'border-radius', 'border'],
    defaultAttributes: { className: 'w-full h-64 rounded-lg border' },
    defaultStyles: { width: '100%', height: '256px', borderRadius: '8px', border: '1px solid #e5e7eb' }
  }
];

// Propriétés CSS communes disponibles pour tous les composants
export const commonCSSProperties = [
  // Layout
  'display', 'position', 'top', 'right', 'bottom', 'left', 'z-index',
  'float', 'clear', 'overflow', 'overflow-x', 'overflow-y', 'visibility',
  
  // Box Model
  'width', 'height', 'max-width', 'max-height', 'min-width', 'min-height',
  'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'border', 'border-width', 'border-style', 'border-color', 'border-radius',
  'border-top', 'border-right', 'border-bottom', 'border-left',
  'box-sizing', 'box-shadow', 'outline',
  
  // Background
  'background', 'background-color', 'background-image', 'background-repeat',
  'background-position', 'background-size', 'background-attachment',
  'background-origin', 'background-clip',
  
  // Typography
  'color', 'font-family', 'font-size', 'font-weight', 'font-style',
  'text-align', 'text-decoration', 'text-transform', 'text-indent',
  'text-shadow', 'line-height', 'letter-spacing', 'word-spacing',
  'white-space', 'word-wrap', 'word-break',
  
  // Flexbox
  'flex-direction', 'flex-wrap', 'flex-flow', 'justify-content', 'align-items',
  'align-content', 'flex', 'flex-grow', 'flex-shrink', 'flex-basis', 'align-self',
  'order', 'gap', 'row-gap', 'column-gap',
  
  // Grid
  'grid-template-columns', 'grid-template-rows', 'grid-template-areas',
  'grid-column', 'grid-row', 'grid-area', 'grid-gap', 'grid-column-gap', 'grid-row-gap',
  
  // Transform & Animation
  'transform', 'transform-origin', 'transition', 'animation',
  'animation-name', 'animation-duration', 'animation-timing-function',
  'animation-delay', 'animation-iteration-count', 'animation-direction',
  
  // Others
  'opacity', 'cursor', 'filter', 'backdrop-filter', 'clip-path',
  'object-fit', 'object-position', 'resize', 'user-select',
  
  // Responsive
  'aspect-ratio', 'container', 'container-type', 'container-name'
];

export function getComponentDefinition(type: string): ComponentDefinition | undefined {
  return componentDefinitions.find(def => def.type === type);
}

export function getComponentsByCategory(category: string): ComponentDefinition[] {
  return componentDefinitions.filter(def => def.category === category);
}

export function getAllCSSPropertiesForComponent(type: string): string[] {
  const definition = getComponentDefinition(type);
  const specificProperties = definition?.cssProperties || [];
  const allProperties = [...specificProperties, ...commonCSSProperties];
  return Array.from(new Set(allProperties));
}