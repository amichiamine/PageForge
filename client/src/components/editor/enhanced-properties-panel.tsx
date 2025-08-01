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
  RotateCcw,
  Smartphone,
  Tablet,
  Monitor
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
  shortName: string; // Nom court pour mobile
  icon: any;
  properties: string[];
}

const propertyGroups: PropertyGroup[] = [
  {
    id: 'content',
    name: 'Contenu',
    shortName: 'Contenu',
    icon: Type,
    properties: ['text', 'placeholder', 'alt', 'src', 'href', 'title', 'value']
  },
  {
    id: 'layout',
    name: 'Disposition',
    shortName: 'Layout',
    icon: Layout,
    properties: ['display', 'position', 'top', 'right', 'bottom', 'left', 'z-index', 'float', 'clear', 'overflow', 'visibility']
  },
  {
    id: 'boxModel',
    name: 'Modèle de boîte',
    shortName: 'Tailles',
    icon: Box,
    properties: ['width', 'height', 'max-width', 'max-height', 'min-width', 'min-height', 'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left']
  },
  {
    id: 'typography',
    name: 'Typographie',
    shortName: 'Typo',
    icon: Type,
    properties: ['font-family', 'font-size', 'font-weight', 'font-style', 'text-align', 'text-decoration', 'text-transform', 'line-height', 'letter-spacing', 'word-spacing', 'color']
  },
  {
    id: 'background',
    name: 'Arrière-plan',
    shortName: 'Fond',
    icon: Palette,
    properties: ['background-color', 'background-image', 'background-size', 'background-position', 'background-repeat', 'background-attachment', 'opacity']
  },
  {
    id: 'border',
    name: 'Bordures & Ombres',
    shortName: 'Bordures',
    icon: Settings,
    properties: ['border', 'border-width', 'border-style', 'border-color', 'border-radius', 'border-top', 'border-right', 'border-bottom', 'border-left', 'box-shadow', 'outline']
  },
  {
    id: 'animation',
    name: 'Animations & Effets',
    shortName: 'Effets',
    icon: Zap,
    properties: ['transition', 'transform', 'animation', 'filter', 'cursor', 'pointer-events']
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
    new Set(['content', 'layout', 'boxModel'])
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
    
    const isStyleProperty = commonCSSProperties.includes(propertyName);
    const updatedComponent = { ...component };
    
    if (isStyleProperty) {
      updatedComponent.styles = { ...updatedComponent.styles, [propertyName]: value };
    } else {
      updatedComponent.attributes = { ...updatedComponent.attributes, [propertyName]: value };
    }
    
    onComponentUpdate(updatedComponent);
  };

  const resetProperty = (propertyName: string) => {
    updateProperty(propertyName, '');
  };

  const handleComponentDelete = () => {
    if (component?.id) {
      onComponentDelete(component.id);
      onComponentSelect(null);
    }
  };

  const availableProperties = useMemo(() => {
    if (!component) return [];
    return getAllCSSPropertiesForComponent(component.type);
  }, [component]);

  const filteredGroups = useMemo(() => {
    if (!searchTerm) return propertyGroups;
    
    return propertyGroups.map(group => ({
      ...group,
      properties: group.properties.filter(prop => 
        prop.toLowerCase().includes(searchTerm.toLowerCase()) &&
        availableProperties.includes(prop)
      )
    })).filter(group => group.properties.length > 0);
  }, [searchTerm, availableProperties]);

  if (!component) {
    return (
      <div className={`h-full flex items-center justify-center bg-theme-surface border-l border-theme-border ${className}`}>
        <div className="text-center spacing-responsive">
          <Settings className="w-8 h-8 sm:w-12 sm:h-12 text-theme-text-secondary mx-auto mb-2 sm:mb-4" />
          <h3 className="text-responsive-base font-medium text-theme-text mb-1 sm:mb-2">
            Aucun composant sélectionné
          </h3>
          <p className="text-responsive-sm text-theme-text-secondary">
            Sélectionnez un composant pour modifier ses propriétés
          </p>
        </div>
      </div>
    );
  }

  const componentDef = getComponentDefinition(component.type);

  return (
    <div className={`h-full flex flex-col bg-theme-surface border-l border-theme-border ${className}`}>
      {/* En-tête avec informations du composant */}
      <div className="panel-header-compact border-b border-theme-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {componentDef?.icon && (
              <componentDef.icon className="w-4 h-4 flex-shrink-0" style={{ color: componentDef.color }} />
            )}
            <div className="min-w-0 flex-1">
              <h3 className="compact-title text-theme-text truncate">
                {componentDef?.label || component.type}
              </h3>
              <p className="text-xs text-theme-text-secondary truncate">
                ID: {component.id}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {/* Toggle visibility */}}
              className="h-6 w-6 p-0 touch-friendly-compact"
              title="Masquer/Afficher"
            >
              <Eye className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleComponentDelete}
              className="h-6 w-6 p-0 touch-friendly-compact text-red-600 hover:text-red-700"
              title="Supprimer"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Sélecteur de breakpoint responsive */}
      {!isCompactMode && (
        <div className="p-2 border-b border-theme-border">
          <div className="flex gap-1">
            {responsiveBreakpoints.map(breakpoint => {
              const Icon = breakpoint.icon;
              return (
                <Button
                  key={breakpoint.id}
                  variant={selectedBreakpoint === breakpoint.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedBreakpoint(breakpoint.id)}
                  className="flex-1 h-7 text-xs touch-friendly-compact"
                  title={`${breakpoint.name} (${breakpoint.width})`}
                >
                  <Icon className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">{breakpoint.name}</span>
                  <span className="sm:hidden">{breakpoint.name.charAt(0)}</span>
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Barre de recherche */}
      <div className="p-2 border-b border-theme-border">
        <div className="relative">
          <Search className="absolute left-2 top-2 w-3 h-3 text-theme-text-secondary" />
          <Input
            placeholder="Rechercher une propriété..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-7 h-7 text-xs bg-theme-background border-theme-border input-responsive"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm('')}
              className="absolute right-1 top-1 h-5 w-5 p-0 hover:bg-theme-surface touch-friendly-compact"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Propriétés organisées par groupes */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-2">
          {filteredGroups.map(group => {
            if (group.properties.length === 0) return null;
            
            const Icon = group.icon;
            const isExpanded = expandedGroups.has(group.id);
            const groupName = isCompactMode ? group.shortName : group.name;

            return (
              <div key={group.id} className="space-y-1">
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="flex items-center gap-2 w-full text-left p-1 rounded hover:bg-theme-background transition-colors touch-friendly-compact"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3 h-3 text-theme-text-secondary" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-theme-text-secondary" />
                  )}
                  <Icon className="w-3 h-3 text-theme-primary" />
                  <span className="text-xs font-medium text-theme-text">{groupName}</span>
                  <Badge variant="secondary" className="h-4 text-xs px-1">
                    {group.properties.filter(prop => availableProperties.includes(prop)).length}
                  </Badge>
                </button>

                {isExpanded && (
                  <div className="space-y-2 pl-2">
                    {group.properties
                      .filter(prop => availableProperties.includes(prop))
                      .map(propertyName => (
                        <PropertyField
                          key={propertyName}
                          propertyName={propertyName}
                          value={getPropertyValue(propertyName)}
                          onChange={(value) => updateProperty(propertyName, value)}
                          onReset={() => resetProperty(propertyName)}
                          isCompact={isCompactMode}
                        />
                      ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="p-2 border-t border-theme-border">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs touch-friendly-compact"
            onClick={() => {/* Copy component */}}
          >
            <Copy className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Dupliquer</span>
            <span className="sm:hidden">Copy</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs touch-friendly-compact"
            onClick={() => {/* Reset all styles */}}
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Réinitialiser</span>
            <span className="sm:hidden">Reset</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

interface PropertyFieldProps {
  propertyName: string;
  value: any;
  onChange: (value: any) => void;
  onReset: () => void;
  isCompact: boolean;
}

function PropertyField({ propertyName, value, onChange, onReset, isCompact }: PropertyFieldProps) {
  const renderInput = () => {
    // Propriétés de couleur
    if (propertyName.includes('color') || propertyName === 'background-color') {
      return (
        <div className="flex gap-1">
          <Input
            type="color"
            value={value || '#000000'}
            onChange={(e) => onChange(e.target.value)}
            className="w-8 h-6 p-0 border rounded input-responsive"
          />
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#000000"
            className="flex-1 h-6 text-xs input-responsive"
          />
        </div>
      );
    }

    // Propriétés numériques avec slider
    if (['opacity', 'z-index', 'font-weight'].includes(propertyName)) {
      const max = propertyName === 'opacity' ? 1 : propertyName === 'z-index' ? 1000 : 900;
      const step = propertyName === 'opacity' ? 0.1 : 1;
      
      return (
        <div className="space-y-1">
          <div className="flex gap-1">
            <Slider
              value={[parseFloat(value) || 0]}
              onValueChange={(values) => onChange(values[0].toString())}
              max={max}
              step={step}
              className="flex-1"
            />
            <Input
              type="number"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="w-16 h-6 text-xs input-responsive"
              step={step}
              min="0"
              max={max}
            />
          </div>
        </div>
      );
    }

    // Sélecteur pour certaines propriétés
    if (['display', 'position', 'text-align', 'font-weight'].includes(propertyName)) {
      const options = {
        'display': ['block', 'inline', 'flex', 'grid', 'none'],
        'position': ['static', 'relative', 'absolute', 'fixed', 'sticky'],
        'text-align': ['left', 'center', 'right', 'justify'],
        'font-weight': ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900']
      };

      return (
        <Select value={value || ''} onValueChange={onChange}>
          <SelectTrigger className="h-6 text-xs">
            <SelectValue placeholder="Sélectionner..." />
          </SelectTrigger>
          <SelectContent>
            {options[propertyName as keyof typeof options]?.map(option => (
              <SelectItem key={option} value={option} className="text-xs">
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    // Textarea pour les propriétés longues
    if (['text', 'content'].includes(propertyName)) {
      return (
        <Textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Entrez le texte..."
          className="min-h-16 text-xs resize-none"
          rows={3}
        />
      );
    }

    // Input par défaut
    return (
      <Input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Valeur..."
        className="h-6 text-xs input-responsive"
      />
    );
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-theme-text truncate flex-1">
          {isCompact ? propertyName.split('-').pop() : propertyName}
        </Label>
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-4 w-4 p-0 text-theme-text-secondary hover:text-theme-text touch-friendly-compact"
            title="Réinitialiser"
          >
            <X className="w-2 h-2" />
          </Button>
        )}
      </div>
      {renderInput()}
    </div>
  );
}