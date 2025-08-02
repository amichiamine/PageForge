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
}

function DraggableComponent({ type, label, icon, color, description, onDelete, showDelete = false, onDoubleClick }: DraggableComponentProps) {
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
      { type: 'modal', label: 'Modal', icon: <Square />, color: '#6366f1', description: 'Fenêtre modale' },
      { type: 'dropdown', label: 'Menu', icon: <Menu />, color: '#059669', description: 'Menu déroulant' },
    ]
  },
  {
    name: "Business",
    icon: <TrendingUp size={12} />,
    components: [
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

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-2 space-y-2">
        {componentCategories.map((category) => (
          <div key={category.name} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleCategory(category.name)}
              className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-2">
                {category.icon}
                <span className="text-sm font-medium text-gray-700">{category.name}</span>
              </div>
              <span className="text-xs text-gray-500">
                {expandedCategory === category.name ? '−' : '+'}
              </span>
            </button>
            
            {expandedCategory === category.name && (
              <div className="p-1.5 bg-white">
                <div className="grid grid-cols-2 gap-1.5">
                  {category.components.map((component) => (
                    <DraggableComponent
                      key={component.type}
                      type={component.type}
                      label={component.label}
                      icon={component.icon}
                      color={component.color}
                      description={component.description}
                      onDoubleClick={onComponentDoubleClick}
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