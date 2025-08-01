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
  RotateCcw
} from 'lucide-react';
import type { ComponentDefinition, Project } from '@shared/schema';
import { 
  getComponentDefinition, 
  getAllCSSPropertiesForComponent, 
  commonCSSProperties 
} from '@/lib/component-definitions';

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
  icon: any;
  properties: string[];
}

const propertyGroups: PropertyGroup[] = [
  {
    id: 'layout',
    name: 'Disposition',
    icon: Layout,
    properties: ['display', 'position', 'top', 'right', 'bottom', 'left', 'z-index', 'float', 'clear', 'overflow', 'visibility']
  },
  {
    id: 'boxModel',
    name: 'Modèle de boîte',
    icon: Box,
    properties: ['width', 'height', 'max-width', 'max-height', 'min-width', 'min-height', 'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left']
  },
  {
    id: 'border',
    name: 'Bordures & Ombres',
    icon: Settings,
    properties: ['border', 'border-width', 'border-style', 'border-color', 'border-radius', 'border-top', 'border-right', 'border-bottom', 'border-left', 'box-shadow', 'outline']
  },
  {
    id: 'background',
    name: 'Arrière-plan',
    icon: Palette,
    properties: ['background', 'background-color', 'background-image', 'background-repeat', 'background-position', 'background-size', 'background-attachment']
  },
  {
    id: 'typography',
    name: 'Typographie',
    icon: Type,
    properties: ['color', 'font-family', 'font-size', 'font-weight', 'font-style', 'text-align', 'text-decoration', 'text-transform', 'line-height', 'letter-spacing', 'word-spacing']
  },
  {
    id: 'flexbox',
    name: 'Flexbox',
    icon: Layout,
    properties: ['flex-direction', 'flex-wrap', 'justify-content', 'align-items', 'align-content', 'flex', 'flex-grow', 'flex-shrink', 'flex-basis', 'align-self', 'order', 'gap']
  },
  {
    id: 'grid',
    name: 'Grid',
    icon: Layout,
    properties: ['grid-template-columns', 'grid-template-rows', 'grid-template-areas', 'grid-column', 'grid-row', 'grid-area', 'grid-gap']
  },
  {
    id: 'transform',
    name: 'Transformations',
    icon: Zap,
    properties: ['transform', 'transform-origin', 'transition', 'animation', 'opacity', 'filter', 'backdrop-filter']
  }
];

// Propriétés avec des valeurs prédéfinies
const propertyPresets: Record<string, string[]> = {
  'display': ['none', 'block', 'inline', 'inline-block', 'flex', 'grid', 'table', 'table-cell'],
  'position': ['static', 'relative', 'absolute', 'fixed', 'sticky'],
  'text-align': ['left', 'center', 'right', 'justify'],
  'font-weight': ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  'font-style': ['normal', 'italic', 'oblique'],
  'text-decoration': ['none', 'underline', 'overline', 'line-through'],
  'text-transform': ['none', 'uppercase', 'lowercase', 'capitalize'],
  'flex-direction': ['row', 'column', 'row-reverse', 'column-reverse'],
  'flex-wrap': ['nowrap', 'wrap', 'wrap-reverse'],
  'justify-content': ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
  'align-items': ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'],
  'align-content': ['stretch', 'flex-start', 'flex-end', 'center', 'space-between', 'space-around'],
  'overflow': ['visible', 'hidden', 'scroll', 'auto'],
  'cursor': ['auto', 'pointer', 'grab', 'text', 'move', 'not-allowed', 'help'],
  'border-style': ['none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset']
};

// Propriétés numériques avec sliders
const numericProperties = [
  'font-size', 'line-height', 'letter-spacing', 'word-spacing', 'border-width', 
  'border-radius', 'opacity', 'z-index', 'flex-grow', 'flex-shrink', 'order'
];

export default function EnhancedPropertiesPanel({
  component,
  onComponentUpdate,
  project,
  onComponentSelect,
  onComponentDelete,
  className
}: EnhancedPropertiesPanelProps) {
  const [localComponent, setLocalComponent] = useState<ComponentDefinition | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(['layout', 'boxModel', 'typography'])
  );
  const [activeTab, setActiveTab] = useState<'properties' | 'attributes' | 'advanced'>('properties');

  useEffect(() => {
    if (component) {
      setLocalComponent(component);
    } else {
      setLocalComponent(null);
    }
  }, [component]);

  const componentDefinition = useMemo(() => {
    return localComponent ? getComponentDefinition(localComponent.type) : null;
  }, [localComponent]);

  const availableProperties = useMemo(() => {
    if (!localComponent) return [];
    return getAllCSSPropertiesForComponent(localComponent.type);
  }, [localComponent]);

  const filteredProperties = useMemo(() => {
    if (!searchTerm) return availableProperties;
    return availableProperties.filter(prop =>
      prop.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableProperties, searchTerm]);

  const updateProperty = (path: string, value: any) => {
    if (!localComponent) return;

    const updatedComponent = { ...localComponent };

    if (path.startsWith('styles.')) {
      const styleProp = path.replace('styles.', '');
      updatedComponent.styles = {
        ...updatedComponent.styles,
        [styleProp]: value
      };
    } else if (path.startsWith('attributes.')) {
      const attrProp = path.replace('attributes.', '');
      updatedComponent.attributes = {
        ...updatedComponent.attributes,
        [attrProp]: value
      };
    } else {
      (updatedComponent as any)[path] = value;
    }

    setLocalComponent(updatedComponent);
    onComponentUpdate(updatedComponent);
  };

  const resetProperty = (property: string) => {
    if (!localComponent) return;
    const updatedComponent = { ...localComponent };
    if (updatedComponent.styles) {
      delete updatedComponent.styles[property];
    }
    setLocalComponent(updatedComponent);
    onComponentUpdate(updatedComponent);
  };

  const duplicateComponent = () => {
    if (!localComponent) return;

    const duplicated = {
      ...localComponent,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      styles: {
        ...localComponent.styles,
        left: `${parseInt(localComponent.styles?.left?.replace('px', '') || '0') + 20}px`,
        top: `${parseInt(localComponent.styles?.top?.replace('px', '') || '0') + 20}px`
      }
    };

    onComponentUpdate(duplicated);
  };

  const toggleVisibility = () => {
    if (!localComponent) return;
    const currentDisplay = localComponent.styles?.display || 'block';
    const newDisplay = currentDisplay === 'none' ? 'block' : 'none';
    updateProperty('styles.display', newDisplay);
  };

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const renderPropertyInput = (property: string) => {
    const currentValue = localComponent?.styles?.[property] || '';
    const presets = propertyPresets[property];
    const isNumeric = numericProperties.includes(property);

    if (presets) {
      return (
        <Select value={currentValue} onValueChange={(value) => updateProperty(`styles.${property}`, value)}>
          <SelectTrigger className="h-7 text-xs">
            <SelectValue placeholder="Valeur" />
          </SelectTrigger>
          <SelectContent>
            {presets.map(preset => (
              <SelectItem key={preset} value={preset}>
                {preset}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (property === 'color' || property === 'background-color' || property.includes('color')) {
      return (
        <div className="flex items-center gap-1">
          <input
            type="color"
            value={currentValue || '#000000'}
            onChange={(e) => updateProperty(`styles.${property}`, e.target.value)}
            className="w-6 h-6 rounded border border-theme-border cursor-pointer"
          />
          <Input
            value={currentValue}
            onChange={(e) => updateProperty(`styles.${property}`, e.target.value)}
            placeholder="#000000"
            className="h-7 text-xs flex-1"
          />
        </div>
      );
    }

    if (isNumeric) {
      const numValue = parseFloat(currentValue) || 0;
      const maxValue = property === 'opacity' ? 1 : property === 'z-index' ? 999 : 100;
      
      return (
        <div className="flex items-center gap-2">
          <Slider
            value={[numValue]}
            onValueChange={([value]) => updateProperty(`styles.${property}`, value.toString())}
            max={maxValue}
            step={property === 'opacity' ? 0.1 : 1}
            className="flex-1"
          />
          <Input
            value={currentValue}
            onChange={(e) => updateProperty(`styles.${property}`, e.target.value)}
            className="w-16 h-7 text-xs"
            placeholder="0"
          />
        </div>
      );
    }

    return (
      <Input
        value={currentValue}
        onChange={(e) => updateProperty(`styles.${property}`, e.target.value)}
        placeholder="Valeur"
        className="h-7 text-xs"
      />
    );
  };

  const getAllComponents = (components: ComponentDefinition[]): ComponentDefinition[] => {
    const allComponents: ComponentDefinition[] = [];
    const traverse = (comps: ComponentDefinition[]) => {
      comps.forEach(comp => {
        allComponents.push(comp);
        if (comp.children && comp.children.length > 0) {
          traverse(comp.children);
        }
      });
    };
    traverse(components);
    return allComponents;
  };

  const allComponents = project?.content?.pages?.[0]?.content?.structure ? 
    getAllComponents(project.content.pages[0].content.structure) : [];

  if (!localComponent) {
    return (
      <div className={`h-full overflow-y-auto bg-theme-surface ${className}`}>
        <div className="panel-header-compact">
          <h3 className="compact-title text-theme-text">Propriétés</h3>
          <p className="text-xs text-theme-text-secondary">Sélectionnez un composant</p>
        </div>

        <div className="p-3 space-y-3">
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-theme-text">Composants sur la page ({allComponents.length})</h4>
            {allComponents.length > 0 ? (
              <div className="space-y-1">
                {allComponents.map((comp) => (
                  <div
                    key={comp.id}
                    onClick={() => onComponentSelect(comp)}
                    className="flex items-center justify-between p-2 rounded-md border border-theme-border bg-theme-background hover:bg-theme-surface cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getComponentDefinition(comp.type)?.color || '#6b7280' }} />
                      <span className="text-xs font-medium text-theme-text truncate">
                        {getComponentDefinition(comp.type)?.label || comp.type}
                      </span>
                    </div>
                    <Badge variant="outline" className="h-4 text-xs px-1">
                      {comp.type}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-theme-text-secondary text-center py-4">
                Aucun composant sur la page
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col bg-theme-surface ${className}`}>
      {/* En-tête avec informations du composant */}
      <div className="panel-header-compact">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: componentDefinition?.color || '#6b7280' }} />
            <h3 className="compact-title text-theme-text truncate">
              {componentDefinition?.label || localComponent.type}
            </h3>
          </div>
          <div className="flex items-center gap-1">
            {componentDefinition?.isPremium && (
              <Badge variant="outline" className="h-4 text-xs px-1">Premium</Badge>
            )}
          </div>
        </div>
        <p className="text-xs text-theme-text-secondary mt-1">{componentDefinition?.description}</p>
      </div>

      {/* Actions rapides */}
      <div className="p-2 border-b border-theme-border">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={duplicateComponent}
            className="h-6 px-2 text-xs"
          >
            <Copy className="w-3 h-3 mr-1" />
            Dupliquer
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleVisibility}
            className="h-6 px-2 text-xs"
          >
            {localComponent.styles?.display === 'none' ? (
              <>
                <EyeOff className="w-3 h-3 mr-1" />
                Masqué
              </>
            ) : (
              <>
                <Eye className="w-3 h-3 mr-1" />
                Visible
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onComponentDelete(localComponent.id)}
            className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex border-b border-theme-border">
        <button
          onClick={() => setActiveTab('properties')}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
            activeTab === 'properties' 
              ? 'text-theme-primary border-b-2 border-theme-primary bg-theme-background' 
              : 'text-theme-text-secondary hover:text-theme-text'
          }`}
        >
          Styles CSS
        </button>
        <button
          onClick={() => setActiveTab('attributes')}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
            activeTab === 'attributes' 
              ? 'text-theme-primary border-b-2 border-theme-primary bg-theme-background' 
              : 'text-theme-text-secondary hover:text-theme-text'
          }`}
        >
          Attributs
        </button>
        <button
          onClick={() => setActiveTab('advanced')}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
            activeTab === 'advanced' 
              ? 'text-theme-primary border-b-2 border-theme-primary bg-theme-background' 
              : 'text-theme-text-secondary hover:text-theme-text'
          }`}
        >
          Avancé
        </button>
      </div>

      {/* Contenu des onglets */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'properties' && (
          <div className="p-2 space-y-3">
            {/* Barre de recherche */}
            <div className="relative">
              <Search className="absolute left-2 top-2 w-3 h-3 text-theme-text-secondary" />
              <Input
                placeholder="Rechercher une propriété..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 h-7 text-xs"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-1 top-1 h-5 w-5 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>

            {/* Groupes de propriétés */}
            {searchTerm ? (
              // Affichage filtré
              <div className="space-y-2">
                {filteredProperties.map(property => (
                  <div key={property} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-theme-text">{property}</Label>
                      {localComponent.styles?.[property] && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => resetProperty(property)}
                          className="h-4 w-4 p-0 text-theme-text-secondary hover:text-theme-text"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    {renderPropertyInput(property)}
                  </div>
                ))}
              </div>
            ) : (
              // Affichage par groupes
              <div className="space-y-2">
                {propertyGroups.map(group => {
                  const groupProperties = group.properties.filter(prop => availableProperties.includes(prop));
                  if (groupProperties.length === 0) return null;

                  const GroupIcon = group.icon;
                  const isExpanded = expandedGroups.has(group.id);

                  return (
                    <div key={group.id} className="space-y-1">
                      <button
                        onClick={() => toggleGroup(group.id)}
                        className="flex items-center gap-2 w-full text-left p-1 rounded hover:bg-theme-background transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-3 h-3 text-theme-text-secondary" />
                        ) : (
                          <ChevronRight className="w-3 h-3 text-theme-text-secondary" />
                        )}
                        <GroupIcon className="w-3 h-3 text-theme-primary" />
                        <span className="text-xs font-medium text-theme-text">{group.name}</span>
                        <Badge variant="secondary" className="h-4 text-xs px-1 ml-auto">
                          {groupProperties.length}
                        </Badge>
                      </button>

                      {isExpanded && (
                        <div className="space-y-2 pl-6">
                          {groupProperties.map(property => (
                            <div key={property} className="space-y-1">
                              <div className="flex items-center justify-between">
                                <Label className="text-xs text-theme-text">{property}</Label>
                                {localComponent.styles?.[property] && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => resetProperty(property)}
                                    className="h-4 w-4 p-0 text-theme-text-secondary hover:text-theme-text"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                              {renderPropertyInput(property)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'attributes' && (
          <div className="p-2 space-y-3">
            <div className="space-y-2">
              <Label className="text-xs text-theme-text">Contenu</Label>
              <Textarea
                value={localComponent.content || ''}
                onChange={(e) => updateProperty('content', e.target.value)}
                placeholder="Contenu du composant"
                className="h-20 text-xs resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-theme-text">Attributs personnalisés</Label>
              {Object.entries(localComponent.attributes || {}).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <Label className="text-xs text-theme-text">{key}</Label>
                  <Input
                    value={value as string}
                    onChange={(e) => updateProperty(`attributes.${key}`, e.target.value)}
                    className="h-7 text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="p-2 space-y-3">
            <div className="space-y-2">
              <Label className="text-xs text-theme-text">ID du composant</Label>
              <Input
                value={localComponent.id}
                disabled
                className="h-7 text-xs bg-theme-background"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-theme-text">Type</Label>
              <Input
                value={localComponent.type}
                disabled
                className="h-7 text-xs bg-theme-background"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-theme-text">Balise HTML</Label>
              <Input
                value={localComponent.tag || 'div'}
                onChange={(e) => updateProperty('tag', e.target.value)}
                className="h-7 text-xs"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}