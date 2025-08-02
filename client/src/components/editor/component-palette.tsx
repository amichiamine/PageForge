import React from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useEffect } from 'react';
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
  Code
} from 'lucide-react';

interface DraggableComponentProps {
  type: string;
  label: string;
  icon: React.ReactElement;
  color: string;
  description?: string;
  onDelete?: () => void;
  showDelete?: boolean;
  onDoubleClick?: (componentType: string) => void;
  compact?: boolean;
}

function DraggableComponent({ type, label, icon, color, description, onDelete, showDelete = false, onDoubleClick, compact = false }: DraggableComponentProps) {
  const [{ isDragging }, drag, preview] = useDrag({
    type: 'component',
    item: { type, componentType: type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Supprimer l'image de prévisualisation par défaut pour le tactile
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  const handleDoubleClick = () => {
    onDoubleClick?.(type);
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 10, 30]);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const element = e.currentTarget as HTMLElement;
    element.style.opacity = '0.9';
    element.style.transform = 'scale(1.02)';
    
    if ('vibrate' in navigator) {
      navigator.vibrate(15);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const element = e.currentTarget as HTMLElement;
    element.style.opacity = '1';
    element.style.transform = 'scale(1)';
  };

  const handleClick = (e: React.MouseEvent) => {
    // Prévenir le déclenchement du drag sur mobile
    if (window.innerWidth <= 768) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div
      ref={drag}
      className={`
        group relative flex flex-col items-center p-1.5 sm:p-2 rounded-md border border-gray-200 
        bg-white hover:bg-gray-50 hover:border-gray-300 cursor-grab active:cursor-grabbing
        transition-all duration-200 hover:scale-102 hover:shadow-sm
        ${isDragging ? 'opacity-50 scale-95' : ''}
        ${showDelete ? 'pr-6' : ''}
        touch-manipulation select-none
      `}
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        borderColor: color,
        minHeight: '40px',
        userSelect: 'none',
        touchAction: 'manipulation'
      }}
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      title={`${description || label} (Double-clic pour ajouter)`}
    >
      <div className={`text-${color} mb-0.5`} style={{ color }}>
        {React.cloneElement(icon, { size: 12 })}
      </div>
      <span className="text-xs font-medium text-gray-700 text-center leading-tight">
        {label}
      </span>
      {showDelete && onDelete && (
        <button
          onClick={onDelete}
          className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 size={10} />
        </button>
      )}
      
      {/* Indicateur pour double-clic sur tactile */}
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity sm:hidden" />
    </div>
  );
}

const componentCategories = [
  {
    name: "Layout",
    icon: <Layout size={12} />,
    components: [
      { type: 'container', label: 'Container', icon: <Square />, color: '#6366f1', description: 'Conteneur de base' },
      { type: 'section', label: 'Section', icon: <Layout />, color: '#8b5cf6', description: 'Section de page' },
      { type: 'header', label: 'Header', icon: <Layers />, color: '#06b6d4', description: 'En-tête de page' },
      { type: 'footer', label: 'Footer', icon: <Layers />, color: '#84cc16', description: 'Pied de page' },
      { type: 'sidebar', label: 'Sidebar', icon: <Square />, color: '#f59e0b', description: 'Panneau latéral' },
      { type: 'navbar', label: 'Navbar', icon: <Navigation />, color: '#3b82f6', description: 'Barre de navigation' },
      { type: 'hero', label: 'Hero', icon: <Star />, color: '#7c3aed', description: 'Section hero d\'accueil' },
      { type: 'banner', label: 'Bannière', icon: <Square />, color: '#f59e0b', description: 'Bannière d\'information' },
      { type: 'alert', label: 'Alerte', icon: <Square />, color: '#dc2626', description: 'Message d\'alerte' },
      { type: 'divider', label: 'Séparateur', icon: <Square />, color: '#6b7280', description: 'Ligne de séparation' },
      { type: 'spacer', label: 'Espace', icon: <Square />, color: '#9ca3af', description: 'Espace flexible' },
      { type: 'grid', label: 'Grid', icon: <Grid />, color: '#8b5cf6', description: 'Grille flexible' },
      { type: 'flexbox', label: 'Flexbox', icon: <Square />, color: '#06b6d4', description: 'Container flexible' },
    ]
  },
  {
    name: "Texte",
    icon: <Type size={12} />,
    components: [
      { type: 'heading', label: 'Titre', icon: <Type />, color: '#dc2626', description: 'Titre (H1-H6)' },
      { type: 'paragraph', label: 'Paragraphe', icon: <FileText />, color: '#059669', description: 'Texte de paragraphe' },
      { type: 'list', label: 'Liste', icon: <Menu />, color: '#d97706', description: 'Liste à puces ou numérotée' },
      { type: 'quote', label: 'Citation', icon: <Type />, color: '#7c3aed', description: 'Citation ou témoignage' },
      { type: 'code', label: 'Code', icon: <Code />, color: '#374151', description: 'Bloc de code' },
      { type: 'table', label: 'Tableau', icon: <Grid />, color: '#059669', description: 'Tableau de données' },
    ]
  },
  {
    name: "Média",
    icon: <Image size={12} />,
    components: [
      { type: 'image', label: 'Image', icon: <Image />, color: '#7c3aed', description: 'Image ou photo' },
      { type: 'video', label: 'Vidéo', icon: <Video />, color: '#be185d', description: 'Lecteur vidéo' },
      { type: 'audio', label: 'Audio', icon: <Music />, color: '#0891b2', description: 'Lecteur audio' },
      { type: 'gallery', label: 'Galerie', icon: <Image />, color: '#ec4899', description: 'Galerie d\'images' },
      { type: 'carousel', label: 'Carrousel', icon: <Image />, color: '#f59e0b', description: 'Carrousel d\'images' },
      { type: 'icon', label: 'Icône', icon: <Star />, color: '#8b5cf6', description: 'Icône décorative' },
      { type: 'badge', label: 'Badge', icon: <Square />, color: '#3b82f6', description: 'Badge d\'étiquetage' },
      { type: 'tooltip', label: 'Info-bulle', icon: <Square />, color: '#6b7280', description: 'Bulle d\'information' },
    ]
  },
  {
    name: "Interactif",
    icon: <MousePointer size={12} />,
    components: [
      { type: 'button', label: 'Bouton', icon: <MousePointer />, color: '#ea580c', description: 'Bouton cliquable' },
      { type: 'link', label: 'Lien', icon: <ExternalLink />, color: '#0d9488', description: 'Lien hypertexte' },
      { type: 'form', label: 'Formulaire', icon: <Mail />, color: '#7c2d12', description: 'Formulaire de contact' },
      { type: 'input', label: 'Champ', icon: <Edit />, color: '#374151', description: 'Champ de saisie' },
      { type: 'textarea', label: 'Zone Texte', icon: <Edit />, color: '#6b7280', description: 'Zone de texte multiligne' },
      { type: 'modal', label: 'Modal', icon: <Square />, color: '#6366f1', description: 'Fenêtre modale' },
      { type: 'dropdown', label: 'Menu', icon: <Menu />, color: '#059669', description: 'Menu déroulant' },
      { type: 'slider', label: 'Curseur', icon: <MousePointer />, color: '#8b5cf6', description: 'Curseur de valeur' },
      { type: 'toggle', label: 'Bascule', icon: <Square />, color: '#10b981', description: 'Bouton bascule' },
      { type: 'rating', label: 'Notation', icon: <Star />, color: '#f59e0b', description: 'Système de notation' },
    ]
  },
  {
    name: "Business",
    icon: <TrendingUp size={12} />,
    components: [
      { type: 'card', label: 'Carte', icon: <Square />, color: '#3b82f6', description: 'Carte de contenu' },
      { type: 'chart', label: 'Graphique', icon: <TrendingUp />, color: '#6366f1', description: 'Graphique statistique' },
      { type: 'progress', label: 'Progression', icon: <TrendingUp />, color: '#10b981', description: 'Barre de progression' },
      { type: 'stepper', label: 'Étapes', icon: <Navigation />, color: '#8b5cf6', description: 'Étapes de processus' },
      { type: 'pricing', label: 'Tarifs', icon: <Star />, color: '#059669', description: 'Tableau des prix' },
      { type: 'testimonial', label: 'Témoignage', icon: <Heart />, color: '#dc2626', description: 'Avis client' },
      { type: 'team', label: 'Équipe', icon: <Users />, color: '#2563eb', description: 'Présentation équipe' },
      { type: 'stats', label: 'Statistics', icon: <TrendingUp />, color: '#8b5cf6', description: 'Statistiques' },
      { type: 'features', label: 'Features', icon: <CheckCircle />, color: '#10b981', description: 'Liste d\'avantages' },
      { type: 'cta', label: 'CTA', icon: <Zap />, color: '#f59e0b', description: 'Call-to-action' },
    ]
  },
  {
    name: "Navigation",
    icon: <Navigation size={12} />,
    components: [
      { type: 'menu', label: 'Menu', icon: <Menu />, color: '#374151', description: 'Menu de navigation' },
      { type: 'breadcrumb', label: 'Breadcrumb', icon: <Navigation />, color: '#6b7280', description: 'Fil d\'Ariane' },
      { type: 'pagination', label: 'Pagination', icon: <MoreHorizontal />, color: '#059669', description: 'Navigation pages' },
      { type: 'tabs', label: 'Onglets', icon: <Folder />, color: '#3b82f6', description: 'Système d\'onglets' },
      { type: 'accordion', label: 'Accordéon', icon: <Plus />, color: '#8b5cf6', description: 'Contenu repliable' },
      { type: 'search', label: 'Recherche', icon: <Search />, color: '#6366f1', description: 'Barre de recherche' },
    ]
  },
  {
    name: "Contenu",
    icon: <FileText size={12} />,
    components: [
      { type: 'calendar', label: 'Calendrier', icon: <Calendar />, color: '#16a34a', description: 'Calendrier d\'événements' },
      { type: 'contact', label: 'Contact', icon: <Phone />, color: '#2563eb', description: 'Informations de contact' },
      { type: 'map', label: 'Carte', icon: <MapPin />, color: '#dc2626', description: 'Carte interactive' },
      { type: 'social', label: 'Social', icon: <Heart />, color: '#1da1f2', description: 'Réseaux sociaux' },
      { type: 'faq', label: 'FAQ', icon: <HelpCircle />, color: '#059669', description: 'Questions fréquentes' },
      { type: 'blog', label: 'Blog', icon: <FileText />, color: '#7c3aed', description: 'Article de blog' },
    ]
  },
  {
    name: "E-commerce",
    icon: <ShoppingCart size={12} />,
    components: [
      { type: 'product', label: 'Produit', icon: <Package />, color: '#ea580c', description: 'Fiche produit' },
      { type: 'cart', label: 'Panier', icon: <ShoppingCart />, color: '#16a34a', description: 'Panier d\'achat' },
      { type: 'checkout', label: 'Commande', icon: <CreditCard />, color: '#dc2626', description: 'Processus commande' },
      { type: 'reviews', label: 'Avis', icon: <Star />, color: '#f59e0b', description: 'Avis produits' },
      { type: 'wishlist', label: 'Favoris', icon: <Heart />, color: '#ec4899', description: 'Liste de souhaits' },
      { type: 'filters', label: 'Filtres', icon: <Filter />, color: '#6366f1', description: 'Filtres de produits' },
    ]
  }
];

interface ComponentPaletteProps {
  onComponentDoubleClick?: (componentType: string) => void;
}

export default function ComponentPalette({ onComponentDoubleClick }: ComponentPaletteProps) {
  const [expandedCategory, setExpandedCategory] = React.useState<string | null>('Layout');
  const [containerWidth, setContainerWidth] = React.useState<number>(192);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Observer pour détecter les changements de largeur du conteneur
  React.useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  // Calcul adaptatif du nombre de colonnes basé sur la largeur
  const getGridColumns = () => {
    if (containerWidth < 200) return 1;
    if (containerWidth < 280) return 2;
    if (containerWidth < 360) return 3;
    return Math.floor(containerWidth / 120); // 120px par colonne minimum
  };

  const gridColumns = getGridColumns();

  return (
    <div ref={containerRef} className="h-full overflow-y-auto">
      <div className="p-2 space-y-2">
        {componentCategories.map((category) => (
          <div key={category.name} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleCategory(category.name)}
              className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-2 min-w-0">
                <div className="flex-shrink-0">
                  {category.icon}
                </div>
                <span 
                  className="text-sm font-medium text-gray-700 truncate" 
                  title={category.name}
                >
                  {containerWidth < 180 ? category.name.substring(0, 8) + '...' : category.name}
                </span>
              </div>
              <span className="text-xs text-gray-500 flex-shrink-0 ml-1">
                {expandedCategory === category.name ? '−' : '+'}
              </span>
            </button>
            
            {expandedCategory === category.name && (
              <div className="p-1.5 bg-white">
                <div 
                  className="grid gap-1.5"
                  style={{ 
                    gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` 
                  }}
                >
                  {category.components.map((component) => (
                    <DraggableComponent
                      key={component.type}
                      type={component.type}
                      label={component.label}
                      icon={component.icon}
                      color={component.color}
                      description={component.description}
                      onDoubleClick={onComponentDoubleClick}
                      compact={containerWidth < 240}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-2 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500 text-center leading-tight">
          Double-cliquez pour ajouter
        </p>
      </div>
    </div>
  );
}