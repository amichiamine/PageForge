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
  Trash2
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
        minHeight: '45px',
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
        {React.cloneElement(icon, { size: 14 })}
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
    icon: <Layout size={16} />,
    components: [
      { type: 'container', label: 'Container', icon: <Square />, color: '#6366f1', description: 'Conteneur de base' },
      { type: 'section', label: 'Section', icon: <Layout />, color: '#8b5cf6', description: 'Section de page' },
      { type: 'header', label: 'Header', icon: <Layers />, color: '#06b6d4', description: 'En-tête de page' },
      { type: 'footer', label: 'Footer', icon: <Layers />, color: '#84cc16', description: 'Pied de page' },
    ]
  },
  {
    name: "Texte",
    icon: <Type size={16} />,
    components: [
      { type: 'heading', label: 'Titre', icon: <Type />, color: '#dc2626', description: 'Titre (H1-H6)' },
      { type: 'paragraph', label: 'Paragraphe', icon: <FileText />, color: '#059669', description: 'Texte de paragraphe' },
      { type: 'list', label: 'Liste', icon: <Menu />, color: '#d97706', description: 'Liste à puces ou numérotée' },
    ]
  },
  {
    name: "Média",
    icon: <Image size={16} />,
    components: [
      { type: 'image', label: 'Image', icon: <Image />, color: '#7c3aed', description: 'Image ou photo' },
      { type: 'video', label: 'Vidéo', icon: <Video />, color: '#be185d', description: 'Lecteur vidéo' },
      { type: 'audio', label: 'Audio', icon: <Music />, color: '#0891b2', description: 'Lecteur audio' },
    ]
  },
  {
    name: "Interactif",
    icon: <MousePointer size={16} />,
    components: [
      { type: 'button', label: 'Bouton', icon: <MousePointer />, color: '#ea580c', description: 'Bouton cliquable' },
      { type: 'link', label: 'Lien', icon: <Download />, color: '#0d9488', description: 'Lien hypertexte' },
      { type: 'form', label: 'Formulaire', icon: <Upload />, color: '#7c2d12', description: 'Formulaire de contact' },
    ]
  },
  {
    name: "Contenu",
    icon: <Star size={16} />,
    components: [
      { type: 'calendar', label: 'Calendrier', icon: <Calendar />, color: '#16a34a', description: 'Calendrier d\'événements' },
      { type: 'contact', label: 'Contact', icon: <Mail />, color: '#2563eb', description: 'Informations de contact' },
      { type: 'testimonial', label: 'Témoignage', icon: <Heart />, color: '#dc2626', description: 'Avis client' },
      { type: 'pricing', label: 'Tarifs', icon: <ShoppingCart />, color: '#059669', description: 'Tableau des prix' },
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