import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Search,
  X,
  ChevronDown,
  ChevronRight,
  Palette,
  Type,
  Layout,
  Box,
  Settings,
  Zap,
  RotateCcw,
  Smartphone,
  Tablet,
  Monitor,
  Grid3X3,
  Move,
  Maximize,
  PaintBucket,
  Square,
  Sparkles,
  MousePointer
} from 'lucide-react';
import type { ComponentDefinition, Project } from '@shared/schema';
import { 
  massiveCSSProperties,
  massivePropertyGroups,
  getCSSPropertyDefinition,
  type CSSPropertyDefinition
} from '@/lib/massive-css-properties';

interface EnhancedPropertiesPanelProps {
  component: ComponentDefinition | null;
  onComponentUpdate: (component: ComponentDefinition) => void;
  project: Project;
  onComponentSelect: (component: ComponentDefinition | null) => void;
  onComponentDelete: (componentId: string) => void;
  className?: string;
}

interface PropertyGroup {
  id: string;
  name: string;
  shortName: string; // Nom court pour mobile
  icon: any;
  properties: string[];
}

// Groupes massifs de propriétés CSS avec icônes
const massivePropertyGroups: PropertyGroup[] = [
  {
    id: 'content',
    name: 'Contenu',
    shortName: 'Contenu',
    icon: Type,
    properties: ['text', 'placeholder', 'alt', 'src', 'href', 'title', 'value']
  },
  {
    id: 'layout',
    name: 'Layout & Position',
    shortName: 'Layout',
    icon: Layout,
    properties: cssPropertyGroups['Layout'] || []
  },
  {
    id: 'flexbox',
    name: 'Flexbox',
    shortName: 'Flex',
    icon: Move,
    properties: cssPropertyGroups['Flexbox'] || []
  },
  {
    id: 'grid',
    name: 'CSS Grid',
    shortName: 'Grid',
    icon: Grid3X3,
    properties: cssPropertyGroups['Grid'] || []
  },
  {
    id: 'dimensions',
    name: 'Dimensions',
    shortName: 'Tailles',
    icon: Maximize,
    properties: cssPropertyGroups['Dimensions'] || []
  },
  {
    id: 'spacing',
    name: 'Marges & Espacement',
    shortName: 'Espaces',
    icon: Box,
    properties: [...(cssPropertyGroups['Marges'] || []), ...(cssPropertyGroups['Espacement'] || [])]
  },
  {
    id: 'typography',
    name: 'Typographie',
    shortName: 'Typo',
    icon: Type,
    properties: cssPropertyGroups['Typographie'] || []
  },
  {
    id: 'colors',
    name: 'Couleurs',
    shortName: 'Couleurs',
    icon: Palette,
    properties: cssPropertyGroups['Couleurs'] || []
  },
  {
    id: 'background',
    name: 'Arrière-plan',
    shortName: 'Fond',
    icon: PaintBucket,
    properties: cssPropertyGroups['Arrière-plan'] || []
  },
  {
    id: 'borders',
    name: 'Bordures',
    shortName: 'Bordures',
    icon: Square,
    properties: cssPropertyGroups['Bordures'] || []
  },
  {
    id: 'effects',
    name: 'Effets & Ombres',
    shortName: 'Effets',
    icon: Sparkles,
    properties: cssPropertyGroups['Effets'] || []
  },
  {
    id: 'transforms',
    name: 'Transformations',
    shortName: 'Transform',
    icon: RotateCcw,
    properties: cssPropertyGroups['Transformations'] || []
  },
  {
    id: 'animations',
    name: 'Animations',
    shortName: 'Anim',
    icon: Zap,
    properties: cssPropertyGroups['Animations'] || []
  },
  {
    id: 'display',
    name: 'Affichage',
    shortName: 'Affichage',
    icon: Eye,
    properties: cssPropertyGroups['Affichage'] || []
  },
  {
    id: 'interaction',
    name: 'Interaction',
    shortName: 'Interact',
    icon: MousePointer,
    properties: cssPropertyGroups['Interaction'] || []
  },
  {
    id: 'table',
    name: 'Table',
    shortName: 'Table',
    icon: Settings,
    properties: cssPropertyGroups['Table'] || []
  },
  {
    id: 'list',
    name: 'Liste',
    shortName: 'Liste',
    icon: Settings,
    properties: cssPropertyGroups['Liste'] || []
  },
  {
    id: 'outline',
    name: 'Contour',
    shortName: 'Contour',
    icon: Settings,
    properties: cssPropertyGroups['Contour'] || []
  }
];

const responsiveBreakpoints = [
  { id: 'mobile', name: 'Mobile', icon: Smartphone, width: '320px-767px' },
  { id: 'tablet', name: 'Tablette', icon: Tablet, width: '768px-1023px' },
  { id: 'desktop', name: 'Bureau', icon: Monitor, width: '1024px+' }
];

export default function EnhancedPropertiesPanel({ 
  component, 
  onComponentUpdate, 
  project, 
  onComponentSelect, 
  onComponentDelete,
  className 
}: EnhancedPropertiesPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(['content', 'layout', 'dimensions'])
  );
  const [selectedBreakpoint, setSelectedBreakpoint] = useState('desktop');
  const [isCompactMode, setIsCompactMode] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsCompactMode(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const getPropertyValue = (propertyName: string) => {
    if (!component) return '';
    return component.attributes?.[propertyName] || component.styles?.[propertyName] || '';
  };

  const updateProperty = (propertyName: string, value: any) => {
    if (!component) return;
    
    // Déterminer si c'est une propriété CSS ou un attribut
    const cssProperty = getCSSPropertyDefinition(propertyName);
    const isStyleProperty = cssProperty !== null;
    const updatedComponent = { ...component };
    
    if (isStyleProperty) {
      updatedComponent.styles = { ...updatedComponent.styles, [propertyName]: value };
    } else {
      updatedComponent.attributes = { ...updatedComponent.attributes, [propertyName]: value };
    }
    
    onComponentUpdate(updatedComponent);
  };

  const resetProperty = (propertyName: string) => {
    const cssProperty = getCSSPropertyDefinition(propertyName);
    const defaultValue = cssProperty?.defaultValue || '';
    updateProperty(propertyName, defaultValue);
  };

  const handleComponentDelete = () => {
    if (component?.id) {
      onComponentDelete(component.id);
      onComponentSelect(null);
    }
  };

  const availableProperties = useMemo(() => {
    if (!component) return [];
    // Retourner toutes les propriétés CSS disponibles
    return Object.keys(massiveCSSProperties);
  }, [component]);

  const filteredGroups = useMemo(() => {
    if (!searchTerm) return massivePropertyGroups;
    
    const searchResults = searchTerm.toLowerCase();
    return massivePropertyGroups.map(group => ({
      ...group,
      properties: group.properties.filter(prop => {
        const cssProperty = getCSSPropertyDefinition(prop);
        return prop.toLowerCase().includes(searchResults) ||
               (cssProperty?.label && cssProperty.label.toLowerCase().includes(searchResults)) ||
               (cssProperty?.category && cssProperty.category.toLowerCase().includes(searchResults));
      })
    })).filter(group => group.properties.length > 0);
  }, [searchTerm]);

  if (!component) {
    return (
      <div className={`h-full flex items-center justify-center text-center p-4 ${className || ''}`}>
        <div>
          <Box className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-500">
            Sélectionnez un composant pour modifier ses propriétés
          </p>
        </div>
      </div>
    );
  }

  // Rendu du panneau de propriétés CSS massif
  const renderPropertyInput = (propertyName: string) => {
    const cssProperty = getCSSPropertyDefinition(propertyName);
    if (!cssProperty) return null;

    const currentValue = getPropertyValue(propertyName);

    switch (cssProperty.type) {
      case 'color':
        return (
          <div className="space-y-2">
            <Label className="text-xs font-medium">{cssProperty.label}</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={currentValue || cssProperty.defaultValue}
                onChange={(e) => updateProperty(propertyName, e.target.value)}
                className="w-12 h-8 p-1 rounded border"
              />
              <Input
                type="text"
                value={currentValue || cssProperty.defaultValue}
                onChange={(e) => updateProperty(propertyName, e.target.value)}
                placeholder={cssProperty.defaultValue?.toString()}
                className="flex-1 h-8 text-xs"
              />
            </div>
          </div>
        );

      case 'select':
        return (
          <div className="space-y-2">
            <Label className="text-xs font-medium">{cssProperty.label}</Label>
            <Select
              value={currentValue || cssProperty.defaultValue}
              onValueChange={(value) => updateProperty(propertyName, value)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder={cssProperty.defaultValue?.toString()} />
              </SelectTrigger>
              <SelectContent>
                {cssProperty.options?.map((option) => (
                  <SelectItem key={option} value={option} className="text-xs">
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'range':
        return (
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs font-medium">{cssProperty.label}</Label>
              <span className="text-xs text-gray-500">
                {currentValue || cssProperty.defaultValue}{cssProperty.unit}
              </span>
            </div>
            <Slider
              value={[parseFloat(currentValue) || cssProperty.defaultValue || 0]}
              onValueChange={([value]) => updateProperty(propertyName, value.toString())}
              min={cssProperty.min}
              max={cssProperty.max}
              step={cssProperty.step}
              className="w-full"
            />
          </div>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={currentValue === 'true' || currentValue === true}
              onCheckedChange={(checked) => updateProperty(propertyName, checked.toString())}
            />
            <Label className="text-xs font-medium">{cssProperty.label}</Label>
          </div>
        );

      default:
        return (
          <div className="space-y-2">
            <Label className="text-xs font-medium">{cssProperty.label}</Label>
            <div className="flex gap-2">
              <Input
                type={cssProperty.type === 'number' ? 'number' : 'text'}
                value={currentValue || ''}
                onChange={(e) => updateProperty(propertyName, e.target.value)}
                placeholder={cssProperty.defaultValue?.toString()}
                className="flex-1 h-8 text-xs"
                min={cssProperty.min}
                max={cssProperty.max}
                step={cssProperty.step}
              />
              {cssProperty.unit && (
                <span className="text-xs text-gray-500 self-center">{cssProperty.unit}</span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => resetProperty(propertyName)}
                className="h-8 w-8 p-0"
                title="Réinitialiser"
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`h-full flex flex-col bg-white border-l ${className || ''}`}>
      {/* En-tête avec informations du composant */}
      <div className="p-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {component.type}
              </h3>
              <p className="text-xs text-gray-500 truncate">
                ID: {component.id}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleComponentDelete}
              className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
              title="Supprimer"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Rechercher une propriété CSS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-8 text-xs"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm('')}
              className="absolute right-1 top-1 h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Liste des groupes de propriétés CSS */}
      <div className="flex-1 overflow-y-auto">
        {filteredGroups.map((group) => {
          const Icon = group.icon;
          const isExpanded = expandedGroups.has(group.id);
          
          if (group.properties.length === 0) return null;

          return (
            <div key={group.id} className="border-b">
              {/* En-tête du groupe */}
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">
                    {isCompactMode ? group.shortName : group.name}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {group.properties.length}
                  </Badge>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {/* Contenu du groupe */}
              {isExpanded && (
                <div className="px-3 pb-3 space-y-3">
                  {group.properties.map((propertyName) => (
                    <div key={propertyName}>
                      {renderPropertyInput(propertyName)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Message si aucune propriété trouvée */}
        {filteredGroups.every(group => group.properties.length === 0) && (
          <div className="p-6 text-center">
            <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              Aucune propriété trouvée pour "{searchTerm}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}