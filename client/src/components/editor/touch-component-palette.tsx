import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useDrag } from "react-dnd";
import { Search, Plus, X } from "lucide-react";

interface ComponentType {
  type: string;
  name: string;
  category: string;
  icon: string;
  description?: string;
}

const componentTypes: ComponentType[] = [
  { type: 'heading', name: 'Titre', category: 'Text', icon: '📝', description: 'Titre principal ou secondaire' },
  { type: 'paragraph', name: 'Paragraphe', category: 'Text', icon: '📄', description: 'Texte de contenu' },
  { type: 'button', name: 'Bouton', category: 'Interactive', icon: '🔘', description: 'Bouton d\'action' },
  { type: 'image', name: 'Image', category: 'Media', icon: '🖼️', description: 'Image ou photo' },
  { type: 'container', name: 'Container', category: 'Layout', icon: '📦', description: 'Conteneur pour organiser' },
  { type: 'card', name: 'Carte', category: 'Layout', icon: '🗃️', description: 'Carte de contenu' },
  { type: 'list', name: 'Liste', category: 'Content', icon: '📋', description: 'Liste d\'éléments' },
  { type: 'input', name: 'Champ de saisie', category: 'Interactive', icon: '✏️', description: 'Champ de texte' },
  { type: 'form', name: 'Formulaire', category: 'Interactive', icon: '📝', description: 'Formulaire complet' },
  { type: 'navigation', name: 'Navigation', category: 'Layout', icon: '🧭', description: 'Menu de navigation' },
  { type: 'section', name: 'Section', category: 'Layout', icon: '📄', description: 'Section de page' },
  { type: 'hero', name: 'Section Hero', category: 'Layout', icon: '🎯', description: 'Section d\'en-tête' },
  { type: 'footer', name: 'Pied de page', category: 'Layout', icon: '📄', description: 'Pied de page' },
  { type: 'gallery', name: 'Galerie', category: 'Media', icon: '🖼️', description: 'Galerie d\'images' },
  { type: 'video', name: 'Vidéo', category: 'Media', icon: '🎥', description: 'Lecteur vidéo' },
  { type: 'map', name: 'Carte', category: 'Interactive', icon: '🗺️', description: 'Carte interactive' }
];

const categories = [
  { id: 'all', name: 'Tous', color: 'bg-gray-100' },
  { id: 'Text', name: 'Texte', color: 'bg-blue-100' },
  { id: 'Layout', name: 'Mise en page', color: 'bg-green-100' },
  { id: 'Interactive', name: 'Interactif', color: 'bg-purple-100' },
  { id: 'Media', name: 'Média', color: 'bg-orange-100' },
  { id: 'Content', name: 'Contenu', color: 'bg-yellow-100' }
];

interface TouchComponentPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onComponentAdd: (type: string) => void;
  className?: string;
}

interface DraggableComponentProps {
  component: ComponentType;
  onDoubleClick: () => void;
  isMobile: boolean;
}

function DraggableComponent({ component, onDoubleClick, isMobile }: DraggableComponentProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: { type: component.type, componentType: component.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <Card 
      ref={drag}
      className={`group cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 ${
        isDragging ? 'opacity-50 scale-95' : ''
      } ${isMobile ? 'active:scale-95 active:bg-blue-50' : ''}`}
      onDoubleClick={onDoubleClick}
      style={{ touchAction: 'manipulation' }}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <div className="text-2xl flex-shrink-0">{component.icon}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm leading-tight">{component.name}</h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
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
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onDoubleClick();
              }}
            >
              <Plus className="w-3 h-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function TouchComponentPalette({ 
  isOpen, 
  onClose, 
  onComponentAdd, 
  className = '' 
}: TouchComponentPaletteProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isMobile, setIsMobile] = useState(false);

  // Détecter si on est sur mobile
  useState(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  });

  // Filtrer les composants
  const filteredComponents = componentTypes.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleComponentDoubleClick = (componentType: string) => {
    onComponentAdd(componentType);
    if (isMobile) {
      onClose(); // Fermer la palette sur mobile après ajout
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 ${className}`}>
      <div className="bg-white rounded-t-xl sm:rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">Palette de composants</h2>
            <p className="text-sm text-muted-foreground">
              {isMobile ? 'Appuyez deux fois ou utilisez le bouton + pour ajouter' : 'Glissez-déposez ou double-cliquez pour ajouter'}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Filtres */}
        <div className="p-4 border-b space-y-4">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un composant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Catégories */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="text-xs"
              >
                {category.name}
                {selectedCategory === 'all' && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {category.id === 'all' ? componentTypes.length : 
                     componentTypes.filter(c => c.category === category.id).length}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Liste des composants */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredComponents.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-lg font-medium">Aucun composant trouvé</p>
              <p className="text-muted-foreground">Essayez de modifier votre recherche</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredComponents.map((component) => (
                <DraggableComponent
                  key={component.type}
                  component={component}
                  onDoubleClick={() => handleComponentDoubleClick(component.type)}
                  isMobile={isMobile}
                />
              ))}
            </div>
          )}
        </div>

        {/* Instructions pour mobile */}
        {isMobile && (
          <div className="p-4 bg-muted/30 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Appuyez deux fois sur un composant pour l'ajouter à votre page</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}