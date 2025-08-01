import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useDrag } from "react-dnd";
import { Search, Plus, X, Grid3X3, Smartphone, Monitor } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ComponentType {
  type: string;
  name: string;
  category: string;
  icon: string;
  description?: string;
}

const enhancedComponentTypes: ComponentType[] = [
  { type: 'heading', name: 'Titre', category: 'Text', icon: '📝', description: 'Titre principal H1-H6' },
  { type: 'paragraph', name: 'Paragraphe', category: 'Text', icon: '📄', description: 'Texte de contenu' },
  { type: 'button', name: 'Bouton', category: 'Interactive', icon: '🔘', description: 'Bouton d\'action CTA' },
  { type: 'image', name: 'Image', category: 'Media', icon: '🖼️', description: 'Image responsive' },
  { type: 'container', name: 'Container', category: 'Layout', icon: '📦', description: 'Conteneur flexible' },
  { type: 'card', name: 'Carte', category: 'Layout', icon: '🗃️', description: 'Carte de contenu' },
  { type: 'list', name: 'Liste', category: 'Content', icon: '📋', description: 'Liste ordonnée/non-ordonnée' },
  { type: 'input', name: 'Champ', category: 'Interactive', icon: '✏️', description: 'Champ de saisie' },
  { type: 'form', name: 'Formulaire', category: 'Interactive', icon: '📝', description: 'Formulaire complet' },
  { type: 'navigation', name: 'Navigation', category: 'Layout', icon: '🧭', description: 'Menu de navigation' },
  { type: 'section', name: 'Section', category: 'Layout', icon: '📄', description: 'Section de contenu' },
  { type: 'hero', name: 'Hero', category: 'Layout', icon: '🎯', description: 'Section d\'en-tête' },
  { type: 'footer', name: 'Footer', category: 'Layout', icon: '📄', description: 'Pied de page' },
  { type: 'gallery', name: 'Galerie', category: 'Media', icon: '🖼️', description: 'Galerie d\'images' },
  { type: 'video', name: 'Vidéo', category: 'Media', icon: '🎥', description: 'Lecteur vidéo' },
  { type: 'map', name: 'Carte', category: 'Interactive', icon: '🗺️', description: 'Carte interactive' },
  { type: 'testimonial', name: 'Témoignage', category: 'Content', icon: '💬', description: 'Témoignage client' },
  { type: 'pricing', name: 'Tarifs', category: 'Content', icon: '💰', description: 'Tableau de prix' },
  { type: 'team', name: 'Équipe', category: 'Content', icon: '👥', description: 'Présentation équipe' },
  { type: 'contact', name: 'Contact', category: 'Interactive', icon: '📞', description: 'Formulaire de contact' }
];

const categories = [
  { id: 'all', name: 'Tous', color: 'bg-gray-100', count: enhancedComponentTypes.length },
  { id: 'Text', name: 'Texte', color: 'bg-blue-100', count: enhancedComponentTypes.filter(c => c.category === 'Text').length },
  { id: 'Layout', name: 'Layout', color: 'bg-green-100', count: enhancedComponentTypes.filter(c => c.category === 'Layout').length },
  { id: 'Interactive', name: 'Interactif', color: 'bg-purple-100', count: enhancedComponentTypes.filter(c => c.category === 'Interactive').length },
  { id: 'Media', name: 'Média', color: 'bg-orange-100', count: enhancedComponentTypes.filter(c => c.category === 'Media').length },
  { id: 'Content', name: 'Contenu', color: 'bg-yellow-100', count: enhancedComponentTypes.filter(c => c.category === 'Content').length }
];

interface TouchDraggableComponentProps {
  component: ComponentType;
  onDoubleClick: () => void;
  onTouchAdd?: () => void;
  isMobile: boolean;
}

function TouchDraggableComponent({ component, onDoubleClick, onTouchAdd, isMobile }: TouchDraggableComponentProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: { type: component.type, componentType: component.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [touchStart, setTouchStart] = useState(0);
  const [isPressed, setIsPressed] = useState(false);

  const handleTouchStart = () => {
    setTouchStart(Date.now());
    setIsPressed(true);
  };

  const handleTouchEnd = () => {
    const touchEnd = Date.now();
    const touchDuration = touchEnd - touchStart;
    
    // Si appui court (< 200ms), considérer comme un tap pour ajouter
    if (touchDuration < 200 && onTouchAdd) {
      onTouchAdd();
    }
    
    setIsPressed(false);
  };

  return (
    <Card 
      ref={!isMobile ? drag : undefined}
      className={`group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-95 ${
        isDragging ? 'opacity-50 scale-95' : ''
      } ${isPressed ? 'scale-95 bg-blue-50' : ''} ${
        isMobile ? 'border-2 hover:border-blue-300' : ''
      }`}
      onDoubleClick={onDoubleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'manipulation' }}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <div className="text-2xl flex-shrink-0 transition-transform group-hover:scale-110">
            {component.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight text-gray-900">
              {component.name}
            </h3>
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
              {component.description}
            </p>
            <Badge variant="outline" className="mt-2 text-xs">
              {component.category}
            </Badge>
          </div>
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 opacity-70 group-hover:opacity-100 transition-opacity bg-blue-100 hover:bg-blue-200"
              onClick={(e) => {
                e.stopPropagation();
                onTouchAdd?.();
              }}
            >
              <Plus className="w-4 h-4 text-blue-600" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface EnhancedTouchPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onComponentAdd: (type: string) => void;
  className?: string;
}

export default function EnhancedTouchPalette({ 
  isOpen, 
  onClose, 
  onComponentAdd, 
  className = '' 
}: EnhancedTouchPaletteProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const isMobile = useIsMobile();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search on open
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Filtrer les composants
  const filteredComponents = enhancedComponentTypes.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleComponentAdd = (componentType: string) => {
    onComponentAdd(componentType);
    if (isMobile) {
      onClose(); // Fermer automatiquement sur mobile
    }
  };

  const handleQuickAdd = (componentType: string) => {
    handleComponentAdd(componentType);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 ${className}`}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col">
        {/* Header optimisé */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Grid3X3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Palette de composants</h2>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                {isMobile ? (
                  <>
                    <Smartphone className="w-4 h-4" />
                    Appuyez pour ajouter • {filteredComponents.length} composants
                  </>
                ) : (
                  <>
                    <Monitor className="w-4 h-4" />
                    Glissez-déposez • {filteredComponents.length} composants
                  </>
                )}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Filtres optimisés */}
        <div className="p-4 border-b space-y-4 bg-gray-50/50">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              ref={searchInputRef}
              placeholder="Rechercher par nom, description ou catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Catégories avec compteurs */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`text-xs transition-all hover:scale-105 ${
                  selectedCategory === category.id 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'hover:bg-gray-100'
                }`}
              >
                {category.name}
                <Badge 
                  variant={selectedCategory === category.id ? "secondary" : "outline"} 
                  className="ml-2 text-xs"
                >
                  {selectedCategory === 'all' ? category.count : 
                   enhancedComponentTypes.filter(c => c.category === category.id).length}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Liste des composants avec grid responsive */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredComponents.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Aucun composant trouvé</h3>
              <p className="text-gray-600 mb-4">
                Essayez de modifier votre recherche ou changer de catégorie
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredComponents.map((component) => (
                <TouchDraggableComponent
                  key={component.type}
                  component={component}
                  onDoubleClick={() => handleComponentAdd(component.type)}
                  onTouchAdd={() => handleQuickAdd(component.type)}
                  isMobile={isMobile}
                />
              ))}
            </div>
          )}
        </div>

        {/* Instructions contextuelles */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="font-medium">
                {isMobile ? 
                  'Appuyez sur un composant ou utilisez le bouton + pour l\'ajouter' :
                  'Double-cliquez ou glissez-déposez pour ajouter un composant'
                }
              </span>
            </div>
            <Badge variant="outline" className="text-xs">
              ESC pour fermer
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}