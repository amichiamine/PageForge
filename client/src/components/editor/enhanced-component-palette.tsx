import React, { useState, useMemo } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useEffect } from 'react';
import { 
  Search, 
  Star, 
  Filter,
  Grid,
  List,
  Crown,
  Sparkles,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  componentDefinitions, 
  componentCategories, 
  getComponentsByCategory,
  type ComponentDefinition 
} from '@/lib/component-definitions';

interface EnhancedComponentPaletteProps {
  onDoubleClick?: (componentType: string) => void;
  className?: string;
}

interface DraggableComponentProps {
  component: ComponentDefinition;
  onDoubleClick?: (componentType: string) => void;
  viewMode: 'grid' | 'list';
}

function DraggableComponent({ component, onDoubleClick, viewMode }: DraggableComponentProps) {
  const [{ isDragging }, drag, preview] = useDrag({
    type: 'component',
    item: { type: component.type, componentType: component.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  const handleDoubleClick = () => {
    onDoubleClick?.(component.type);
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 10, 30]);
    }
  };

  const IconComponent = component.icon;

  if (viewMode === 'list') {
    return (
      <div
        ref={drag}
        className={`
          group flex items-center p-2 rounded-md border border-gray-200 bg-white hover:bg-gray-50 
          hover:border-gray-300 cursor-grab active:cursor-grabbing transition-all duration-200 
          hover:shadow-sm ${isDragging ? 'opacity-50 scale-95' : ''}
        `}
        style={{ opacity: isDragging ? 0.5 : 1, borderLeftColor: component.color, borderLeftWidth: '3px' }}
        onDoubleClick={handleDoubleClick}
        title={`${component.description} (Double-clic pour ajouter)`}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <IconComponent className="component-icon-small flex-shrink-0" style={{ color: component.color }} />
          <span className="text-xs font-medium text-gray-700 truncate">{component.label}</span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {component.isPremium && (
            <Crown className="w-3 h-3 text-yellow-500" />
          )}
          {component.isNew && (
            <Sparkles className="w-3 h-3 text-blue-500" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={drag}
      className={`
        group relative flex flex-col items-center p-2 rounded-md border border-gray-200 
        bg-white hover:bg-gray-50 hover:border-gray-300 cursor-grab active:cursor-grabbing
        transition-all duration-200 hover:scale-102 hover:shadow-sm
        ${isDragging ? 'opacity-50 scale-95' : ''}
      `}
      style={{ opacity: isDragging ? 0.5 : 1, borderColor: component.color }}
      onDoubleClick={handleDoubleClick}
      title={`${component.description} (Double-clic pour ajouter)`}
    >
      <div className="flex items-center justify-center w-8 h-8 mb-1">
        <IconComponent className="component-icon-small" style={{ color: component.color }} />
      </div>
      <span className="text-xs font-medium text-gray-700 text-center leading-tight">
        {component.label}
      </span>
      
      {/* Badges pour premium et nouveau */}
      {(component.isPremium || component.isNew) && (
        <div className="absolute -top-1 -right-1 flex gap-1">
          {component.isPremium && (
            <Crown className="w-3 h-3 text-yellow-500 bg-white rounded-full p-0.5" />
          )}
          {component.isNew && (
            <Sparkles className="w-3 h-3 text-blue-500 bg-white rounded-full p-0.5" />
          )}
        </div>
      )}
    </div>
  );
}

export default function EnhancedComponentPalette({ onDoubleClick, className }: EnhancedComponentPaletteProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['basic', 'layout', 'content'])
  );

  const filteredComponents = useMemo(() => {
    let filtered = componentDefinitions;

    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(component =>
        component.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        component.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        component.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrer par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(component => component.category === selectedCategory);
    }

    // Filtrer par premium
    if (showPremiumOnly) {
      filtered = filtered.filter(component => component.isPremium);
    }

    return filtered;
  }, [searchTerm, selectedCategory, showPremiumOnly]);

  const groupedComponents = useMemo(() => {
    const groups: Record<string, ComponentDefinition[]> = {};
    
    filteredComponents.forEach(component => {
      if (!groups[component.category]) {
        groups[component.category] = [];
      }
      groups[component.category].push(component);
    });

    return groups;
  }, [filteredComponents]);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const totalComponents = componentDefinitions.length;
  const premiumComponents = componentDefinitions.filter(c => c.isPremium).length;
  const newComponents = componentDefinitions.filter(c => c.isNew).length;

  return (
    <div className={`h-full flex flex-col bg-theme-surface ${className}`}>
      {/* En-tête compact */}
      <div className="panel-header-compact">
        <h3 className="compact-title text-theme-text">Composants</h3>
        <div className="flex items-center gap-1 text-xs text-theme-text-secondary mt-1">
          <span>{totalComponents} total</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Crown className="w-3 h-3 text-yellow-500" />
            {premiumComponents}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-500" />
            {newComponents}
          </span>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="p-2 space-y-2 border-b border-theme-border">
        <div className="relative">
          <Search className="absolute left-2 top-2 w-3 h-3 text-theme-text-secondary" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-7 h-7 text-xs bg-theme-background border-theme-border"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm('')}
              className="absolute right-1 top-1 h-5 w-5 p-0 hover:bg-theme-surface"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Sélecteur de catégorie */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 h-7 text-xs border border-theme-border rounded px-2 bg-theme-background text-theme-text"
          >
            <option value="all">Toutes catégories</option>
            {componentCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Boutons d'affichage */}
          <div className="flex border border-theme-border rounded overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-7 w-7 p-0"
            >
              <Grid className="w-3 h-3" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-7 w-7 p-0"
            >
              <List className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Filtre Premium */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs text-theme-text cursor-pointer">
            <input
              type="checkbox"
              checked={showPremiumOnly}
              onChange={(e) => setShowPremiumOnly(e.target.checked)}
              className="w-3 h-3"
            />
            <Crown className="w-3 h-3 text-yellow-500" />
            Premium uniquement
          </label>
        </div>
      </div>

      {/* Liste des composants */}
      <div className="flex-1 overflow-y-auto">
        {selectedCategory === 'all' ? (
          // Affichage par catégories
          <div className="p-2 space-y-3">
            {componentCategories.map(category => {
              const categoryComponents = groupedComponents[category.id] || [];
              if (categoryComponents.length === 0) return null;

              const CategoryIcon = category.icon;
              const isExpanded = expandedCategories.has(category.id);

              return (
                <div key={category.id} className="space-y-2">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="flex items-center gap-2 w-full text-left p-1 rounded hover:bg-theme-background transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-3 h-3 text-theme-text-secondary" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-theme-text-secondary" />
                    )}
                    <CategoryIcon className="w-3 h-3 text-theme-primary" />
                    <span className="text-xs font-medium text-theme-text">{category.name}</span>
                    <Badge variant="secondary" className="h-4 text-xs px-1">
                      {categoryComponents.length}
                    </Badge>
                  </button>

                  {isExpanded && (
                    <div className={`
                      ${viewMode === 'grid' 
                        ? 'grid grid-cols-3 gap-1.5' 
                        : 'space-y-1'
                      }
                    `}>
                      {categoryComponents.map(component => (
                        <DraggableComponent
                          key={component.type}
                          component={component}
                          onDoubleClick={onDoubleClick}
                          viewMode={viewMode}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // Affichage d'une catégorie spécifique
          <div className="p-2">
            <div className={`
              ${viewMode === 'grid' 
                ? 'grid grid-cols-3 gap-1.5' 
                : 'space-y-1'
              }
            `}>
              {filteredComponents.map(component => (
                <DraggableComponent
                  key={component.type}
                  component={component}
                  onDoubleClick={onDoubleClick}
                  viewMode={viewMode}
                />
              ))}
            </div>
          </div>
        )}

        {filteredComponents.length === 0 && (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <Filter className="w-8 h-8 text-theme-text-secondary mb-2" />
            <p className="text-sm text-theme-text-secondary">Aucun composant trouvé</p>
            <p className="text-xs text-theme-text-secondary mt-1">
              Essayez de modifier vos filtres
            </p>
          </div>
        )}
      </div>

      {/* Pied de page avec statistiques */}
      <div className="p-2 border-t border-theme-border bg-theme-background">
        <div className="text-xs text-theme-text-secondary text-center">
          {filteredComponents.length} composant{filteredComponents.length > 1 ? 's' : ''} affiché{filteredComponents.length > 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}